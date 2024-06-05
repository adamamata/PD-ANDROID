import { UserRoleEnum } from "../enums/enum";
import { CommunicationModel } from "./communication-model";

export class PublicProfileResponseModel {
    id: string | undefined;
    accountId: string | undefined;
    role: UserRoleEnum | undefined;
    created: string | undefined;
    username: string | undefined;
    dialCode: string | undefined;
    phoneNumber: string | undefined;
    combinedPhoneNumber: string | undefined;
    profileImageUrl: string | undefined;
    description: string | undefined;
    age: number | undefined;
    credit: number | undefined;
    enableVoiceAndVideo: boolean | undefined;
    enablePhoneCall: boolean | undefined;
    enableAudioCall: boolean | undefined;
    enableOneWayVideoCall: boolean | undefined;
    enableTwoWayVideoCall: boolean | undefined;
    status: string | undefined;
    communication: CommunicationModel | undefined;
    fee: number | undefined;
    isOnline: boolean | undefined;
    categories: string[] | undefined;
    refCode: string | undefined;
    isAdminUser: boolean | undefined;
    stateDoNotDisturbAll: boolean | undefined;
    uniqueUsername: string | undefined;

    constructor (init?: Partial<PublicProfileResponseModel>) {
        if (init) {
            Object.assign(this, init);
        }
    }
  }