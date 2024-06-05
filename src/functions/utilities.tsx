import { CommunicationUserIdentifier } from "@azure/communication-common";
import { ChatMessageReceivedEvent } from "@azure/communication-signaling";
import { ChatThreadModel } from "../models/chat-model";
import moment from "moment";
import { CallTypeEnum, RingtoneEnum } from "../enums/enum";


export function changeTitle(count: number) {
  var newTitle = 'Phone Darlings';
  var favicon = document.getElementById('favicon') as HTMLLinkElement;

  if (count> 0) {
    newTitle = `${newTitle} (${count})`;
    favicon.href = `${process.env.PUBLIC_URL}/phoneDarlingsFavIcon-baged.svg`;
  } else {
    favicon.href = `${process.env.PUBLIC_URL}/phoneDarlingsFavIcon.svg`;
  }

  document.title = newTitle;
}

export function playAudio(audioUrl: string) {
  var AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  var context = new AudioContext(); // Make it crossbrowser
  var source = context.createBufferSource();

  window.fetch(audioUrl)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => context.decodeAudioData(arrayBuffer,
     audioBuffer => {      
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
      }, error =>
      console.error(error)
  ));

  return source;
};

export async function stopRingTone(ringtone: RingtoneEnum) {
  try {
    const audio = document.getElementById(ringtone) as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
  } catch(e) {
    console.log(e);
  }
}
export async function playRingTone(ringtone: RingtoneEnum) {
  try {
    const audio = document.getElementById(ringtone) as HTMLAudioElement;
    audio.focus();
    audio.src = process.env.PUBLIC_URL + `/ringtones/${ringtone}.mp3`;
    audio.load();
    await audio.play();
  } catch(e) {
    console.log(e);
  }
}

export const updateNewMessageToChatList = (
    chatMessage: ChatMessageReceivedEvent,
    chatThreads: ChatThreadModel[], 
    threadId: string
    ) => {
      return chatThreads.map((chatThread: ChatThreadModel) => {
        if (chatThread.threadId == threadId) {
          
          const sender = chatMessage.sender as CommunicationUserIdentifier | undefined

          return {...chatThread, 
            unread: chatThread.unread ? chatThread.unread++ : 1,
            lastMessage: {
              created: moment(chatMessage.createdOn).toISOString(),
              message: chatMessage.message,
              sender: sender?.communicationUserId
            }
          }
        }

        return chatThread;
      });
}

export const getValue = (setter: any) => {
  var value: any;
  setter((v: any) => {
    value = v;
    return v;
  });

  return value;
}

export const handleValidationError = (message: string) => {
  const data = message.replaceAll('[', '').replaceAll(']', '').split(",");

  const errObj: any = {};

  for (let i = 1; i < data.length; i = 2*i + 1) {
    const fieldName = data[i-1];
    errObj[fieldName] = data[i].trim();
  }

  return errObj;
}

export const getCallType = (callType: string) => {
  return CallTypeEnum[(callType) as keyof typeof CallTypeEnum];
}