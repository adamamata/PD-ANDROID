import React, { useEffect, useCallback, useMemo, useState } from "react";
import voiceCall from "../../../assets/images/voiceCall.svg";
import videoCall from "../../../assets/images/videoCall.svg";
import {
  CallAdapter,
  CallComposite,
  useAzureCommunicationCallAdapter,
} from "@azure/communication-react";
import { createAutoRefreshingCredential } from "../../../services/MessageService";
import {
  CommunicationUserIdentifier,
  AzureCommunicationTokenCredential,
} from "@azure/communication-common";
import { sendChatMessage } from "../../../services/homeService";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Cprops {
  chatUser: any;
  callData: any;
}

const CallUser: React.FC<any> = (props: Cprops | any) => {
  const callData = props.callData;
  const [chatUser, setChat] = useState(props.chatUser);
  const navigate = useNavigate();
  const userid =
    Object.keys(chatUser).length === 0 ||
    chatUser === null ||
    chatUser === undefined
      ? ""
      : chatUser?.myId;
  const endpoint =
    Object.keys(chatUser).length === 0 ||
    chatUser === null ||
    chatUser === undefined
      ? ""
      : chatUser?.endpointUrl;
  const myDisplayName =
    Object.keys(chatUser).length === 0 ||
    chatUser === null ||
    chatUser === undefined
      ? ""
      : chatUser?.myUserName;
  const myAccessToken =
    Object.keys(chatUser).length === 0 ||
    chatUser === null ||
    chatUser === undefined
      ? ""
      : chatUser?.myAccessToken;
  const threadId =
    Object.keys(chatUser).length === 0 ||
    chatUser === null ||
    chatUser === undefined
      ? ""
      : chatUser?.threadId;
  const groupId =
    Object.keys(callData).length === 0 ||
    callData === null ||
    callData === undefined
      ? ""
      : callData?.groupId;

  const isTeamsMeetingLink = (link: string): boolean =>
    link.startsWith("https://teams.microsoft.com/l/meetup-join");

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(myAccessToken);
    } catch {
      console.error("Failed to construct token credential");
      return undefined;
    }
  }, [myAccessToken]);
  const locator = useMemo(
    () =>
      isTeamsMeetingLink(groupId)
        ? { meetingLink: groupId }
        : { groupId: groupId },
    [groupId]
  );

  const leaveCall = async (adapter: CallAdapter): Promise<void> => {
    await adapter.leaveCall().catch((e) => {
      console.error("Failed to leave call", e);
    });
  };

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: userid,
      displayName: myDisplayName, // Max 256 Characters
      credential,
      locator,
    },
    undefined,
    leaveCall
  );

  return <>{adapter ? <CallComposite adapter={adapter} /> : ""}</>;
};

export default connect()(CallUser);
	