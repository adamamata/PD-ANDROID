import { CallTypeEnum } from "../enums/enum";
import { BaseModel } from "./base.model";
import { ChatThreadModel } from "./chat-model";
import { PublicProfileResponseModel } from "./user-public-profile";

export class CommunicationModel {
    id?: string;
    shortMessageUnitPrice?: number;
    audioCallUnitPrice?: number;
    videoCallUnitPrice?: number;
    videoCallOneWayUnitPrice?: number;
    callConnecting: CallConnectingModel | undefined;
}

export class CallConnectingModel {
    callType?: string;
    calleeUserId?: string;
}

export class CallConnectionModel extends BaseModel {
    room?: ChatThreadModel;
    callId?: string;
    callConnectionId?: string;
    callMediaRecognize?: string;
    start?: string | null;
    callType?: CallTypeEnum;
    callerUser: PublicProfileResponseModel | undefined;
    calleeUser: PublicProfileResponseModel | undefined;
  }

export class CallConnectedResponseModel
{
    constructor(init?: Partial<CallConnectedResponseModel>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    ascPhoneNumber?: string;
    callConnectedUser?: CallConnectionModel;
}

export class AcceptIncomingCallModel extends CallConnectedResponseModel
{
    constructor(init?: Partial<AcceptIncomingCallModel>) {
        super(init);
    }
}