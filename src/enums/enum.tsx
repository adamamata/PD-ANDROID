export enum UserRoleEnum {
    Default = "Default",
    Admin = "Admin",
    ServiceProvider = "ServiceProvider",
    User = "User"
}

export enum CallTypeEnum {
    VideoCallTwoWay = 0,
    AudioCall = 1,
    VideoCallOneWay = 2,
    PhoneCall = 3,
}

export enum MediaStatusEnum {
    Default = 0,
    Sent = 1,
    Accepted = 2,
    Denied = 3
} 

export enum BroadcastTypeEnum
{
    NewInboxMessage = "NewInboxMessage",
    UserStatus = "UserStatus",
    FriendRequest = "FriendRequest",
    ExpiredToken = "ExpiredToken",

    CallConnecting = "CallConnecting",
    CallConnected = "CallConnected",
    CallDisconnecting = "CallDisconnecting",
    CallDisconnected = "CallDisconnected",

    CallMissed = "CallMissed",
    InsufficientCredit = "InsufficientCredit",
    LowCredit = "LowCredit",
    BlockedDuringCall = "BlockedDuringCall",
}

export enum BroadcastTargetEnum
{
    Notification = "notification",
    CallNotification = "callNotification",
}

export enum RingtoneEnum {
    Incoming = "incoming-tone",
    MessageIncoming = "message-tone",
    MessageTyping = "writing-a-text-message-tone",
    Topup = "topup-tone"
}