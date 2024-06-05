import { EndCallButton } from '@azure/communication-react';
import { DefaultButton, Persona, PersonaSize, Stack, DialogType } from '@fluentui/react';
import { CallEnd20Filled, Call20Filled } from '@fluentui/react-icons';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from "react-redux";
import { playRingTone } from '../../functions/utilities';
import { RingtoneEnum } from '../../enums/enum';

export type IncomingAudioCallProps = {
  /** Caller's Name */
  callerName?: string;
  /** Callee's Name */
  calleeName?: string;
  /** Alert Text. For example "incoming video call..." */
  alertText?: string;
  /** Caller's Avatar/Profile Image */
  avatar?: string;
  /** Current SP User's Profile */
  currentSPProfile: any;
  /** Provide a function that handles the call behavior when Accept Button is clicked */
  onClickAccept: (profile: any, toggleVideoCall?: boolean) => void;
  /** Provide a function that handles the call behavior when Reject Button is clicked */
  onClickReject: () => void;
};

const IncomingAudioCall = (props: IncomingAudioCallProps): JSX.Element => {
  const { callerName, calleeName, alertText, avatar, currentSPProfile, onClickAccept, onClickReject } = props;

  useEffect(() => {
    if (!callerName || !calleeName) return;
    const a = isMobile;
    playRingTone(RingtoneEnum.Incoming);
  }, [callerName, calleeName])

  return (
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
            <Stack className='h-[calc(100%/4)] flex flex-row items-center justify-around'>
              <DefaultButton
                  className="bg-[#A4262C] text-[#ffffff] rounded-full min-w-[75px] w-[75px] h-[75px]"
                  onClick={() => onClickReject()}
                  onRenderIcon={() => <CallEnd20Filled className='[&>svg]:w-[40px] [&>svg]:h-[40px]' />}
                />
                <DefaultButton
                  className="bg-[#107C10] text-[#ffffff] rounded-full min-w-[75px] w-[75px] h-[75px]"
                  onClick={() => onClickAccept(currentSPProfile)}
                  onRenderIcon={() => <Call20Filled className='[&>svg]:w-[35px] [&>svg]:h-[35px]' />}
                />
            </Stack>
          </Stack>
        )}
        {!isMobile && (
          <div className="relative font-['Montserrat'] w-11/12 md:w-[60%] xl:w-[40%] mx-auto max-w-3xl bg-white rounded px-10 py-8">
              <div className="flex justify-between">
              <div className="text-black text-center text-2xl font-bold 2xl:mt-1">
                <span>{alertText ?? 'Incoming call'} to {calleeName}</span>
                </div>
                <div className="flex justify-end text-xl font-bold text-black cursor-pointer">
                </div>
              </div>
            <Stack horizontal verticalAlign="center" className='mt-4 flex flex-wrap'>
              <Stack horizontalAlign="start" className="w-fit">
                <Persona
                  imageUrl={avatar}
                  text={callerName}
                  size={PersonaSize.size40}
                  hidePersonaDetails={true}
                  aria-label={callerName}
                />
              </Stack>

              <Stack grow={1} horizontalAlign="center" style={{ alignItems: 'flex-start', fontFamily: 'Segoe UI' }} className="pl-2">
                <Stack style={{ fontSize: '0.875rem' }}>
                  <b>{callerName ?? 'No display name'}</b>
                </Stack>
              </Stack>

              <Stack horizontal tokens={{ childrenGap: 10 }} className="py-2">
                <DefaultButton
                  className="bg-[#A4262C] text-[#323130]"
                  onClick={() => onClickReject()}
                  onRenderIcon={() => <CallEnd20Filled />}
                  text="Reject"
                />
                <DefaultButton
                  className="bg-[#107C10] text-[#323130]"
                  onClick={() => onClickAccept(currentSPProfile)}
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
  );
};

export default connect()(IncomingAudioCall);