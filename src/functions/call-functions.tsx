import { DeviceManager, LocalVideoStream, RemoteParticipant, RemoteVideoStream, VideoDeviceInfo, VideoStreamRenderer, VideoStreamRendererView } from "@azure/communication-calling";
import { VideoGalleryRemoteParticipant } from "@azure/communication-react";
import { toast } from "react-toastify";


/**
 * To render a LocalVideoStream, you need to create a new instance of VideoStreamRenderer, and then
 * create a new VideoStreamRendererView instance using the asynchronous createView() method.
 * You may then attach view.target to any UI element. 
 */
export const createLocalVideoStream = async (deviceManager: DeviceManager, camera: VideoDeviceInfo | null = null) => {
  if (!camera) {
    const cameras = await deviceManager.getCameras();
    if (cameras && cameras.length > 0) {
      camera = cameras[0];
    }
  }

  if (camera) {
      return new LocalVideoStream(camera);
  } else {
    toast.error('No camera device found on the system.', { theme: "colored", autoClose: 3000 });
    return undefined;
  }
}

// Display your local video stream preview in your UI
export const displayLocalVideoStream = async (localVideoStream: LocalVideoStream, localVideoContainer: HTMLElement | undefined | null) => {
  try {
      const localVideoStreamRenderer = new VideoStreamRenderer(localVideoStream);
      const view = await localVideoStreamRenderer.createView({scalingMode: "Crop"});
      
      if (localVideoContainer) {
        localVideoContainer.hidden = false;
        localVideoContainer.appendChild(view.target);
      }

      return localVideoStreamRenderer;
  } catch (error) {
      console.error(error);
  } 
}

// Remove your local video stream preview from your UI
export const removeLocalVideoStream = async(localVideoStreamRenderer: VideoStreamRenderer | undefined, localVideoContainer: HTMLElement | undefined | null) => {
    try {
        localVideoStreamRenderer?.dispose();
      
        if (localVideoContainer) {
          localVideoContainer.hidden = true;
        }
    } catch (error) {
        console.error(error);
    } 
}

export async function outgoingRing() {
  const audio = document.getElementById("outgoing-tone") as HTMLAudioElement;
  audio.src = process.env.PUBLIC_URL + '/ringtones/outgoing-tone.mp3';
  audio.focus();
  audio.load();
  await audio.play();
  let ringTime = 1;

  const interval = setInterval(() => {
    if (ringTime == 10) {
      clearInterval(interval);
      return;
    }

    audio.play();
    ringTime++;
  }, 6000);

  return interval;
}

export function stopOutgoingRing(ringingInterval: any) {
  const audio = document.getElementById("outgoing-tone") as HTMLAudioElement;
  clearInterval(ringingInterval);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.src ="";
  }
}

export function getCallDurationMessage(startTime: string, endTime: string) {
  let callDuration = '';
  const s = new Date(startTime);
  const e = new Date(endTime);
  
  let seconds = Math.floor((e.getTime() - s.getTime())/1000);
  let minutes = Math.floor(seconds/60);
  let hours = Math.floor(minutes/60);
  let days = Math.floor(hours/24);

  hours = hours-(days*24);
  minutes = minutes-(days*24*60)-(hours*60);
  seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

  if (hours > 0 && hours < 10) {
    callDuration += '0' + hours + 'h';
  }
  if (hours > 9 && hours <= 60) {
    callDuration += hours + 'h';
  }

  if (hours > 0 && minutes >= 0 || hours == 0 && minutes > 0) {
    if (minutes >= 0 && minutes < 10) {
      callDuration += ' 0' + minutes + 'm';
    }
    if (minutes > 9 && minutes <= 60) {
      callDuration += ' ' + minutes + 'm';
    }
  }

  if (seconds >= 0 && seconds < 10) {
    callDuration += ' 0' + seconds + 's';
  }
  if (seconds > 9 && seconds <= 60) {
    callDuration += ' ' + seconds + 's';
  }

  return callDuration;
}