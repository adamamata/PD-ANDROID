import React, { useEffect, useState } from "react";

import { connect, useSelector } from "react-redux";
import { CallClient, DeviceManager, LocalVideoStream, VideoDeviceInfo, VideoStreamRenderer } from "@azure/communication-calling";
import { StreamMedia, VideoTile } from '@azure/communication-react';
import { DefaultPalette, mergeStyles, DefaultButton, Persona, PersonaSize, Stack } from '@fluentui/react';
import { CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
import { Call20Filled, CallEnd20Filled } from "@fluentui/react-icons";

import { IncomingAudioCallProps } from './incoming-audio-call';
import { displayLocalVideoStream, removeLocalVideoStream } from "../../functions/call-functions";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import { playRingTone } from "../../functions/utilities";
import { RingtoneEnum } from "../../enums/enum";

const palette = DefaultPalette;

const incomingCallModalContainerStyle = {
  borderRadius: '0.75rem'
};

const incomingCallModalLocalPreviewStyle = mergeStyles({
  height: '10rem',
  background: palette.neutralLighterAlt,
  margin: '1.5rem 0',
  borderRadius: '0.25rem',
  '& video': {
    borderRadius: '0.25rem'
  }
});

interface IncomingCallModalProps extends IncomingAudioCallProps {
  /** Text to the right of a Caller's Name */
  callerNameAlt?: string;
  /** A Caller's subtitle. Displayed right below the callers name */
  callerTitle?: string;
  /** Receiver's Name */
  localParticipantDisplayName?: string;
  /** If set to 'true', mirrors the local video preview of the receiver */
  localVideoInverted?: boolean;
}

const IncomingCallVideo: React.FC<any> = (props: IncomingCallModalProps) => {
  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
  const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream>();
  const [localVideoContainer, setLocalVideoContainer] = useState<HTMLElement | null>(null);
  const [videoStreamRenderer, setVideoStreamRenderer] = useState<VideoStreamRenderer>();
  const [videoToggle, setVideoToggle] = useState(false);
  const {
    alertText,
    avatar,
    callerName,
    calleeName,
    callerNameAlt,
    callerTitle,
    localParticipantDisplayName,
    localVideoInverted,
    currentSPProfile,
    onClickAccept,
    onClickReject,
  } = props;
  const palette = DefaultPalette;

  useEffect(() => {
    if (!callerName || !calleeName) return;
    
    playRingTone(RingtoneEnum.Incoming);
  }, [callerName, calleeName])
  
  useEffect(() => {
    try {
      const callClient = new CallClient();
      
      callClient.getDeviceManager().then(async (dm: DeviceManager) => {
        await dm.askDevicePermission({ video: true, audio: true });

        setDeviceManager(dm);
        const cameras = await dm.getCameras();
        
        if (cameras && cameras.length > 0) {
          setVideoToggle(true);
          await initVideo(cameras[0]);
        } else {
          setVideoToggle(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initVideo = async (camera: VideoDeviceInfo) => {
    const newLocalVideoStream = new LocalVideoStream(camera);
    const streamElement = document.createElement("div");

    streamElement.setAttribute("id", "incoming-local-video-stream");
    streamElement.setAttribute("style", "width: 100%; height: 100%");
    setLocalVideoContainer(streamElement);
    setLocalVideoStream(newLocalVideoStream);

    let localVideoStreamRenderer = await displayLocalVideoStream(newLocalVideoStream, streamElement);
    setVideoStreamRenderer(localVideoStreamRenderer);
  }

  const mediaGalleryLocalParticipant: JSX.Element = (
    <VideoTile
      renderElement={<StreamMedia videoStreamElement={localVideoContainer} />}
      displayName={localParticipantDisplayName}
      isMirrored={localVideoInverted}
    />
  );

  const onClickVideoToggle = async () => {

    if (videoToggle) {
      removeLocalVideoStream(videoStreamRenderer, localVideoContainer);
    } else {
      let dvm: DeviceManager | undefined;
      setDeviceManager(dm => {dvm = dm; return dm})
      if (dvm) {
        const cameras = (await dvm.getCameras());

        if (cameras && cameras.length > 0) {
          if (!localVideoStream) {
            initVideo(cameras[0]);
          }
          if (!!localVideoStream) {
            let localVideoStreamRenderer = await displayLocalVideoStream(localVideoStream, localVideoContainer);
            setVideoStreamRenderer(localVideoStreamRenderer);
          }
        } else {
          toast.error("No camera found on your system", { theme: "colored", autoClose: 3000 });  
          return;
        }
      } else {
        toast.error("Can not detect your device inputs", { theme: "colored", autoClose: 3000 });
        return;
      }
    }

    setVideoToggle(vToggle => !vToggle);
  }

  const acceptCall = () => {
    let vt: boolean = videoToggle;
    setVideoToggle(vToggle => {
      vt = vToggle;
      return vToggle;
    });
    if (vt) {
      removeLocalVideoStream(videoStreamRenderer, localVideoContainer);
    }
    
    onClickAccept(currentSPProfile, vt);
  }

  const rejectCall = () => {
    let vt: boolean = videoToggle;
    setVideoToggle(vToggle => {
      vt = vToggle;
      return vToggle;
    });
    if (vt) {
      removeLocalVideoStream(videoStreamRenderer, localVideoContainer);
    }

    onClickReject();
  }


  return (
    <>
      <div className="w-full">
        <div className={'fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl' + (isMobile ? ' w-full h-full bg-violet-500' : '')}>
        {isMobile && (
          <Stack verticalAlign='center' className='flex justify-center w-full h-full'>
            <Stack horizontalAlign='center' className='w-full flex justify-center mb-[30px] text-[#ffffff] text-[20px] font-bold'>
              <div>{alertText}</div>
            </Stack>
            <Stack horizontal horizontalAlign='center' className='h-[calc(100%/2)] w-full flex justify-center'>
            <Persona
                  className='flex-col'
                  imageUrl={avatar}
                  size={PersonaSize.size120}
                  hidePersonaDetails={false}
                  aria-label={callerName}
                  styles={ {details: 'items-center leading-8'} }
                  onRenderPrimaryText={() => <>
                    <div className='flex items-center max-w[200px] break-words text-[#ffffff]'>{callerName} is calling to</div>
                    <div className='flex items-center max-w[200px] break-words text-[#ffffff]'>{calleeName}</div>
                  </>}
                />
            </Stack>
            <Stack className='h-[calc(100%/3)] flex flex-row items-end justify-around'>
              <DefaultButton
                  className="bg-[#A4262C] text-[#ffffff] rounded-full min-w-[75px] w-[75px] h-[75px]"
                  onClick={() => onClickReject()}
                  onRenderIcon={() => <CallEnd20Filled/>}
                />
                <DefaultButton
                  className="[&>span>span]:w-[16px] [&>span>span]:h-[16px] bg-[#107C10] text-[#ffffff] rounded-full min-w-[75px] w-[75px] h-[75px]"
                  onClick={() => onClickAccept(currentSPProfile, videoToggle)}
                  onRenderIcon={() => <CallVideoIcon className="text-[#ffffff]" size="small"/> }
                />
            </Stack>
          </Stack>
        )}

        { !isMobile && (
          <div className="relative font-['Montserrat'] w-11/12 sm:w-[320px] md:w-[400px] mx-auto max-w-3xl bg-white rounded px-8 py-8">
            <div className="flex justify-between">
              <div className="text-black text-center text-xl font-bold 2xl:mt-1 mb-3">
                Incoming Video Call to {calleeName}
              </div>
            </div>
            <Stack verticalAlign="center">
              <Stack horizontal verticalAlign="center" style={{ marginBottom: '0.5rem' }}>
                <Stack horizontalAlign="start" style={{ marginRight: '0.5rem' }}>
                  <Persona
                    imageUrl={avatar}
                    text={callerName}
                    size={PersonaSize.size40}
                    hidePersonaDetails={true}
                    aria-label={callerName}
                  />
                </Stack>
                <Stack grow={1} horizontalAlign="center" style={{ alignItems: 'flex-start' }}>
                  <Stack style={{ fontSize: '0.875rem', color: palette.black, fontWeight: 'bold' }}>
                    <span>
                      {callerName ?? 'No display name'}
                      {callerNameAlt ? (
                        <span style={{ opacity: 0.5, marginLeft: '0.2rem' }}> &bull; {callerNameAlt}</span>
                      ) : null}
                    </span>
                  </Stack>
                  <Stack style={{ fontSize: '0.75rem', color: palette.neutralDark }}>
                    <span>{callerTitle ?? ''}</span>
                  </Stack>
                </Stack>
              </Stack>
              {videoToggle ? (
                <Stack className={incomingCallModalLocalPreviewStyle}>{mediaGalleryLocalParticipant}</Stack>
              ) : null}

              <Stack horizontal tokens={{ childrenGap: 10 }} className="py-2">
                <DefaultButton
                  className="[&>span>span]:w-[16px] [&>span>span]:h-[16px]"
                  style={{ background: palette.neutralLighterAlt, border: 'none' }}
                  onClick={() => onClickVideoToggle()}
                  onRenderIcon={() => (videoToggle ? <CallVideoIcon size="small" /> : <CallVideoOffIcon size="small" />)}
                />

                <DefaultButton
                  className="bg-[#A4262C] text-[#323130]"
                  onClick={rejectCall}
                  onRenderIcon={() => <CallEnd20Filled />}
                  text="Reject"
                />
                <DefaultButton
                  className="bg-[#107C10] text-[#323130]"
                  onClick={acceptCall}
                  onRenderIcon={() => <Call20Filled />}
                  text="Accept"
                />
              </Stack>
            </Stack>
          </div>
        )}
        </div>
        <div className={ isMobile ? "bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 fixed inset-0 z-40" : "opacity-50 fixed inset-0 z-40 bg-black"}></div>
      </div>
    </>
  );
};

export default connect()(IncomingCallVideo);
// export {}