import {
    usePropsFor,
    VideoGallery,
    ControlBar,
    CameraButton,
    MicrophoneButton,
    ScreenShareButton,
    EndCallButton,
    useCall,
    OnRenderAvatarCallback,
    VideoStreamOptions
} from '@azure/communication-react';
import { CallVideoIcon, CallVideoOffIcon, MicOffIcon, 
    MicIcon, CallEndIcon, CallControlPresentNewIcon, 
    CallControlStopPresentingNewIcon, GroupVideoCallGridIcon, 
    FluidIcon, FilesTxtIcon, FilesEmptyIcon, SwitchCameraIcon } from '@fluentui/react-northstar';
import { mergeStyles, Persona, PersonaSize, registerIcons, Stack } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { isDesktop, isMobile, isTablet } from 'react-device-detect';
import { CallConnectionModel } from '../../../models/communication-model';
import { CallTypeEnum } from '../../../enums/enum';
import { DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import { toast } from 'react-toastify';
import { getValue } from '../../../functions/utilities';
import { createLocalVideoStream } from '../../../functions/call-functions';
  
interface CallingTimingProps {
    hours: number,
    minutes: number,
    seconds: number,
}

interface CallingComponentsProps {
    callConnected?: CallConnectionModel,
    timing: CallingTimingProps,
    callType: CallTypeEnum,
    hasMultipleCameras: boolean,
    cameraToggle: boolean,
    deviceManager?: DeviceManager,
    initialCamera?: VideoDeviceInfo,
    cameras?: VideoDeviceInfo[],
    onShowNotes: (isShow: boolean) => void;
}

function CallingComponents(props: CallingComponentsProps): JSX.Element {
    registerIcons({
        icons: {
            SwitchCameraIcon: <SwitchCameraIcon />,
            MicIcon: <MicIcon />,
            MicOffIcon: <MicOffIcon />,
            CallVideoIcon: <CallVideoIcon />,
            CallVideoOffIcon: <CallVideoOffIcon />
        }
    });

    const { callType, callConnected, timing, hasMultipleCameras, deviceManager, initialCamera, cameraToggle, cameras } = props;
    
    const [layoutToggle, setLayoutToggle] = useState<boolean>(true);
    const [microphoneToggle, setMicrophoneToggle] = useState<boolean | undefined>(true);
    const [selectedCamera, setSelectedCamera] = useState<VideoDeviceInfo>();
    const [isShowNote, setIsShowNote] = useState<boolean>(false);
    const [localVideoViewOptions, setLocalVideoViewOptions] = useState<VideoStreamOptions>();
    const [remoteVideoViewOptions, setRemoteVideoViewOptions] = useState<VideoStreamOptions>();

    const videoGalleryProps = usePropsFor(VideoGallery);
    const cameraProps = usePropsFor(CameraButton);
    const microphoneProps = usePropsFor(MicrophoneButton);
    const screenShareProps = usePropsFor(ScreenShareButton);
    const endCallProps = usePropsFor(EndCallButton);
    const call = useCall();
    const activeState = ['Connected','LocalHold','RemoteHold'];
    const customStyles = {
        root: {
          backgroundColor: "lightgray",
          border: "solid black",
          borderRadius: "0.3rem",
          maxWidth: "fit-content",
        },
    };
    
    useEffect(() => {
        setSelectedCamera(props.initialCamera);
    }, [props.initialCamera]);

    useEffect(() => {
        setLocalVideoViewOptions({
            scalingMode: 'Crop',
            isMirrored: true
        });
        
        setRemoteVideoViewOptions({
            scalingMode: 'Crop',
            isMirrored: false
        });
    }, []);
    
    const onRenderAvatar: OnRenderAvatarCallback = (userId, options, defaultOnRender): JSX.Element => {
        if (!!callConnected) {
            switch (userId) {
                case callConnected.callerUser?.communication?.id:
                  return (
                    <Stack className="w-full h-full flex items-center justify-center">
                      {
                          call &&
                          <Persona 
                              imageUrl={ callConnected.callerUser?.profileImageUrl}
                              text={ callConnected?.callerUser?.username}
                              hidePersonaDetails={true}
                              size={activeState.includes(call.state) ? PersonaSize.size56 : PersonaSize.size100} />
                      }
                    </Stack>
                  );
                case callConnected.calleeUser?.communication?.id:
                  return (
                    <Stack className={"w-full h-full flex items-center justify-center relative callee-tile"}>
                      {
                          call &&
                          <Persona className={(call.state == "Connecting" || call.state == "Ringing") ? "call-animation" : ""}
                            imageUrl={callConnected?.calleeUser?.profileImageUrl}
                            text={callConnected?.calleeUser?.username}
                            hidePersonaDetails={call.direction == "Incoming" || (call.direction == "Outgoing" && (call.state != "Connecting" && call.state != "Ringing"))}
                            secondaryText={call.state }
                            size={PersonaSize.size100} />
                      }
                    </Stack>
                  );
                default:
                  return (options && defaultOnRender?.(options)) ?? <></>;
            }
        }
        
        return (options && defaultOnRender?.(options)) ?? <></>;
    };

    const onClickSwitchCamera = async () => {
        if (!deviceManager) {
          toast.error("Can not detect your device inputs", { theme: "colored", autoClose: 3000 });
          return;
        }
    
        if (call) {
            let lvStream = call.localVideoStreams?.find( (stream) => { return stream.mediaStreamType === 'Video'} );
            if (lvStream) {
                await call.stopVideo(lvStream);
        
                let camera = getValue(setSelectedCamera);
                const cameras = await deviceManager.getCameras();
                camera = cameras.filter(_ => _.id !== camera?.id)[0];
                setSelectedCamera(camera);
                lvStream = await createLocalVideoStream(deviceManager, camera);
                if (!lvStream) {
                    return;
                }

                await call.startVideo(lvStream);
            }
        }
    }

    const onToggleLayout = async() => {
        if (layoutToggle) {
          setLayoutToggle(false);
        }else {
          setLayoutToggle(true);
        }
    }

    const onToggleShowNotes = () => {
        if (isShowNote) {
            setIsShowNote(false);
            props.onShowNotes(false);
        }else {
            setIsShowNote(true);
            props.onShowNotes(true);
        }
    }

    return (
        <Stack className={mergeStyles({ height: '100%' })}>
            <Stack className="bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 h-full">
                <div className="h-full w-full bg-[#ffffff80]">
                    <div className={ 'relative w-full h-full flex items-center video-gallery ' + call?.direction.toLowerCase()}>
                        {
                            callConnected && (
                                <VideoGallery
                                    {...videoGalleryProps}
                                    layout={layoutToggle ? "floatingLocalVideo" : "default"}
                                    showMuteIndicator={true}
                                    showCameraSwitcherInLocalPreview={true}
                                    localVideoViewOptions={localVideoViewOptions}
                                    remoteVideoViewOptions={remoteVideoViewOptions}
                                    localVideoCameraCycleButtonProps={{
                                        cameras: cameras,
                                        selectedCamera: selectedCamera
                                    }}
                                    onRenderAvatar={onRenderAvatar}
                                />)
                        }
                    </div>
                </div>
                <Stack horizontal className="h-[100px] bg-[#ffffff80] justify-between">
                    <div className="flex w-[100px] mr-7 ml-7 items-center text-base md:text-lg lg:text-xl xl:text-2xl">
                        {call && activeState.includes(call.state) && !isMobile && timing && (
                            <div>
                                { timing.hours !== undefined ? (<span><span>{ timing.hours < 10 ? '0' + timing.hours : timing.hours }</span><span>:</span></span>) : ''}
                                <span>{ timing.minutes < 10 ? '0' + timing.minutes : timing.minutes }</span>
                                <span>:</span>
                                <span>{ timing.seconds < 10 ? '0' + timing.seconds : timing.seconds}</span>
                            </div>
                        )}
                    </div>

                    {call &&
                    call.state != "Disconnected" && call.state != "Disconnecting" 
                        ? (<div className="flex flex-col justify-center mb-[-5px]">
                            {activeState.includes(call.state) && isMobile && timing &&
                                (<div>
                                        { timing.hours !== undefined ? (<span><span>{ timing.hours < 10 ? '0' + timing.hours : timing.hours }</span><span>:</span></span>) : ''}
                                        <span>{ timing.minutes < 10 ? '0' + timing.minutes : timing.minutes }</span>
                                        <span>:</span>
                                        <span>{ timing.seconds < 10 ? '0' + timing.seconds : timing.seconds}</span>
                                </div>)
                            }
                            <ControlBar styles={customStyles} layout="floatingBottom">
                                {activeState.includes(call.state) && 
                                    microphoneProps && 
                                    <MicrophoneButton {...microphoneProps} 
                                        onRenderOnIcon={() => <MicIcon size="medium" />}
                                        onRenderOffIcon={() => <MicOffIcon size="medium" />}/>
                                }

                                {(callType == CallTypeEnum.VideoCallTwoWay || callType == CallTypeEnum.VideoCallOneWay && call.direction == "Outgoing") && activeState.includes(call.state) &&
                                    cameraProps && <CameraButton {...cameraProps}
                                        onRenderOnIcon={() => <CallVideoIcon size="medium" /> }
                                        onRenderOffIcon={() => <CallVideoOffIcon size="medium"/>}/>
                                }
                                {/* {cameraToggle && hasMultipleCameras && (callType == CallTypeEnum.VideoCallTwoWay || callType == CallTypeEnum.VideoCallOneWay && call.direction == "Outgoing") && activeState.includes(call.state) &&
                                    (<ScreenShareButton onClick={onClickSwitchCamera}
                                        strings={{
                                        tooltipOffContent: 'Switch Camera',
                                        tooltipOnContent: 'Switch Camera'
                                        }}
                                        onRenderIcon={() => <SwitchCameraIcon size="medium" /> } />) 
                                } */}
                                {activeState.includes(call.state) && isDesktop &&
                                    screenShareProps && <ScreenShareButton {...screenShareProps} 
                                        onRenderOnIcon={() => <CallControlStopPresentingNewIcon size="medium" /> }
                                        onRenderOffIcon={() => <CallControlPresentNewIcon size="medium"/>}
                                    />
                                }
                                
                                {activeState.includes(call.state) &&
                                    (<ScreenShareButton onClick={onToggleLayout} checked={layoutToggle}
                                    strings={{
                                        tooltipOffContent: 'Change layout',
                                        tooltipOnContent: 'Change layout'
                                    }}
                                    onRenderOnIcon={() => <FluidIcon size="medium" /> }
                                    onRenderOffIcon={() => <GroupVideoCallGridIcon size="medium"/>} />) 
                                }
                                
                                {activeState.includes(call.state) && 
                                    (<ScreenShareButton onClick={onToggleShowNotes} checked={isShowNote}
                                    strings={{
                                        tooltipOffContent: 'Show notes',
                                        tooltipOnContent: 'Hide notes'
                                    }}
                                    onRenderOnIcon={() => <FilesTxtIcon size="medium" />}
                                    onRenderOffIcon={() => <FilesEmptyIcon size="medium"/>} />) 
                                }

                                <EndCallButton className="bg-[#A42E43]" {...endCallProps} onRenderIcon={() => <CallEndIcon size="medium" />}/>
                            </ControlBar>
                        </div>)
                        : (<div></div>)
                    }              
                    <div className="w-[156px] items-center"></div>
                </Stack>
            </Stack>
        </Stack>
    );
  }
    
export default CallingComponents;