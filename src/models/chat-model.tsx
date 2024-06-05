export class ChatThreadModel {
  id: string | undefined;
  created: string | undefined;
  threadId: string | undefined;
  myUserId: string | undefined;
  myId: string | undefined;
  myAccessToken: string | undefined;
  myUserName: string | undefined;
  myDisplayName: string | undefined;
  myImageUrl: string | undefined;
  participantId: string | undefined;
  participantDisplayName: string | undefined;
  participantUserName: string | undefined;
  participantImageUrl: string | undefined;
  participantUserId: string | undefined;
  endpointUrl: string | undefined;
  lastMessage: LastMessageModel | undefined;
  unread: number | undefined;
}

export class LastMessageModel {
  constructor(init?: Partial<LastMessageModel>) {
    if (init) Object.assign(this, init);
  }
  message?: string;
  created?: string;
  sender?: string;
}