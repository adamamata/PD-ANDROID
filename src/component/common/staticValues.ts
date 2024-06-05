export enum serviceType {
    chat = "chat",
    audio = "audio",
    oneWayVideo = "oneWayVideo",
    twoWayVideo = "twoWayVideo",
    phone = "phone",
}

export const callSettingList = [
    { value: 'phone', lable: 'Phone Call', name: 'enablePhoneCall', instructionText: "This service will ring to the phone number you provide. Your number will not be shared with the customer." },
    { value: 'audio', lable: 'Audio Call (Online calling)', name: 'enableAudioCall', instructionText: 'This service is an online call that will ring to your browser.Ensure you are active on the browser to get notified.' },
    { value: 'oneWayVideo', lable: 'One-way Video Call (Block your video)', name: 'enableOneWayVideoCall', instructionText: 'This service is an online video call that will ring to your browser. Ensure you are active on the browser to get notified.' },
    { value: 'twoWayVideo', lable: 'Two-way Video Call (Show your video)', name: 'enableTwoWayVideoCall', instructionText: 'This service is an online video call that will ring to your browser. Ensure you are active on the browser to get notified.' }, ,
];

export const menuSettingList = [
    { value: serviceType.chat, lable: 'Chat', name: 'shortMessageUnitPrice', priceRange: "$0.25 - $9.99" },
    { value: serviceType.phone, lable: 'Phone Call', name: 'phoneCallUnitPrice', priceRange: "$0.50 - $50.00" },
    { value: serviceType.audio, lable: 'Audio Call', name: 'audioCallUnitPrice', priceRange: "$0.50 - $50.00" },
    { value: serviceType.oneWayVideo, lable: 'One-way Video', name: 'videoCallOneWayUnitPrice', priceRange: "$0.50 - $50.00" },
    { value: serviceType.twoWayVideo, lable: 'Two-way Video', name: 'videoCallTwoWayUnitPrice', priceRange: "$0.50 - $50.00" },
]


