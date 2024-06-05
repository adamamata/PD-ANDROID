import { CallTypeEnum } from "../enums/enum";

export class CallNotificationModel {
    SPId?: string;
    UserId?: string;
    CallType?: string;
}

export class EventSignalRModel<T> {
    broadcastType?: string;
    data?: T;
}

export class UserStatusSignalRModel
{
    id?: string;
    status?: string;
    isOnline?: boolean;
}