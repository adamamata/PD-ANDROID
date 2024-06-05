import { Persona, PersonaSize, Stack } from '@fluentui/react';
import { isMobile } from 'react-device-detect';
import { connect, useSelector } from "react-redux";
import {
  FluentThemeProvider,
  OnRenderAvatarCallback,
  VideoGallery,
} from "@azure/communication-react";
import { useEffect } from 'react';
import { auth_details } from '../../reducer/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export type OutgoingCallProps = {
  callerUserId: string;
  calleeUserId: string;
  /** Callee's Name */
  calleeName?: string;
  /** Callee's Avatar/Profile Image */
  calleeImageUrl?: string;
  onClosed: () => void;
};

const OutgoingCall = (props: OutgoingCallProps): JSX.Element => {
  const profile = useSelector(auth_details);
  
  const { callerUserId, calleeUserId, calleeName, calleeImageUrl, onClosed } = props;

  useEffect(() => {
    setTimeout(() => {
      onClosed();
    }, 60000);
  }, [])
  
  const onRenderAvatar: OnRenderAvatarCallback = (userId, options, defaultOnRender): JSX.Element => {
    return (
      <Stack className={"w-full h-full flex items-center justify-center relative callee-tile"}>
        <Persona className={"call-animation"}
          imageUrl={calleeImageUrl}
          text={calleeName}
          hidePersonaDetails={false}          
          secondaryText={"Phone call connecting"}
          size={PersonaSize.size100} />
      </Stack>
    );
  };

  return (
    <>
      <div className={'fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl w-[300px] h-[300px] m-auto' + (isMobile ? ' bg-violet-500' : '')}>
        <div className="flex justify-end text-xl font-bold text-black cursor-pointer z-50 absolute top-3.5 right-3.5"
          onClick={() => { onClosed() }}>
          <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
        </div>
        {isMobile && (
          <FluentThemeProvider>
          <div className="absolute top-0 left-0 h-full w-full">
            <Stack className="bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 h-full">
              <div className="h-full w-full bg-[#ffffff80]">
                <div className={ 'relative w-full h-full flex items-center video-gallery '}>
                  {<VideoGallery
                  layout="floatingLocalVideo"
                  localParticipant={{
                    userId: (calleeUserId) as string,
                    displayName: calleeName,
                    isMuted: false,
                  }}
                  showMuteIndicator={true}
                  onRenderAvatar={onRenderAvatar}
                  />}
                </div>
              </div>
            </Stack>
          </div>
        </FluentThemeProvider>
        )}
        {!isMobile && (
          <FluentThemeProvider>
          <div className="absolute top-0 left-0 h-full w-full">
            <Stack className="bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 h-full">
              <div className="h-full w-full bg-[#ffffff80]">
                <div className={ 'relative w-full h-full flex items-center video-gallery '}>
                  {<VideoGallery
                  layout="floatingLocalVideo"
                  localParticipant={{
                    userId: calleeUserId,
                    displayName: calleeName,
                    isMuted: false,
                  }}
                  showMuteIndicator={true}
                  onRenderAvatar={onRenderAvatar}
                  />}
                </div>
              </div>
            </Stack>
          </div>
        </FluentThemeProvider>
        )}
      </div>
        <div className={ isMobile ? "bg-[#F8F3FD]-to-r from-[#061989]/90 to-[#7C688C]/90 fixed inset-0 z-40" : "opacity-50 fixed inset-0 z-40 bg-black"}></div>
    </>
  );
};

export default connect()(OutgoingCall);
