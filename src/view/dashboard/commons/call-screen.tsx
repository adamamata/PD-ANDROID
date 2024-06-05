import { Call, CallAgent, DeviceManager, IncomingCall, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import {
    CallAdapter,
    CallAdapterLocator,
    CallAgentProvider,
    CallClientProvider,
    CallProvider,
    FluentThemeProvider,
    StatefulCallClient,
    createAzureCommunicationCallAdapterFromClient,
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { BroadcastTargetEnum, BroadcastTypeEnum, CallTypeEnum, RingtoneEnum, UserRoleEnum } from '../../../enums/enum';
import { auth_details, reset_Call_State, set_Incoming_Call, set_Show_Chat, set_Total_Credit, set_call_connected, set_chat_data } from '../../../reducer/auth';
import { CallConnectedResponseModel, CallConnectionModel } from '../../../models/communication-model';
import { callConnecting, endCall, getTotalCredit, missedCall, updateCallConnected, validateInsufficientCredit } from '../../../services/homeService';
import { outgoingRing, stopOutgoingRing } from '../../../functions/call-functions';
import { getValue, playRingTone } from '../../../functions/utilities';
import { LOCALSTORE } from '../../../constant/default';
import CallingComponents from './calling-component';
import { ChatThreadModel } from '../../../models/chat-model';
import StickyNotes from './sticky-notes';
import TopUpModal from '../user/topUpModal';

const createCallAdapterLocator = (locator: string): CallAdapterLocator => {
    return { groupId: locator };
};

const CallScreenRft: React.FC<any> = (props: any) => {
    const { direction, type, participantUserId } = useParams();
    const navigate = useNavigate();

    const authDetails = useSelector(auth_details);
    const userProfile = authDetails.user_profile;
    const accountData = authDetails.accountData;
    const [callConnected, setCallConnected] = useState<CallConnectionModel>();
    const [insufficientCreditsOnCall, setInsufficientCreditsOnCall] = useState<boolean>(false);
    const [hours, setHours] = useState<number | undefined>(undefined);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [timing, setiming] = useState<any>({
        hours: undefined,
        minutes: 0,
        seconds: 0,
    });
    const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

    const callType: CallTypeEnum = 
        type == 'video' ? CallTypeEnum.VideoCallTwoWay 
        : (type == 'video-one-way' ? CallTypeEnum.VideoCallOneWay 
        : CallTypeEnum.AudioCall);

    const [cameraToggle, setCameraToggle] = useState<boolean>(false);
    const callAgent: CallAgent = authDetails.callAgent;
    const callClient: StatefulCallClient = authDetails.callClient;
    const incomingCall: IncomingCall = authDetails?.incomingCall;

    const [outgoingCall, setOutgoingCall] = useState<Call>();
    const [wakeLock, setWakeLock] = useState<any>();
    const [isShowNote, setIsShowNote] = useState<boolean>(false);
    const [chatThread, setChatThread] = useState<ChatThreadModel>();
    const [deviceManager, setDeviceManager] = useState<DeviceManager>();
    const [selectedCamera, setSelectedCamera] = useState<VideoDeviceInfo>();
    const [cameras, setCameras] = useState<VideoDeviceInfo[]>();

    const locator = useMemo(() => createCallAdapterLocator(authDetails.threadId), [authDetails.threadId]);

    useEffect(() => {
        setCallConnected(authDetails.callConnected);
    }, [authDetails.callConnected]);

    useEffect(() => {
        setChatThread(authDetails?.chatData);
    }, [authDetails?.chatData]);

    useEffect(() => {
        createAzureCommunicationCallAdapterFromClient(callClient, callAgent, locator).then(async (adapter: CallAdapter) => {
            await initDeviceManager();
            if (direction == 'incoming-call') {
                acceptIncomingCall(adapter, callType);
            } else {
                startCall(adapter, callType);
            }
        });
    }, []);

    useEffect(() => {
        setCameraToggle(callType == CallTypeEnum.VideoCallTwoWay && authDetails?.toggleVideoCall);
    }, [authDetails?.toggleVideoCall])

    useEffect(() => {
        try {
        const anyNav: any = navigator
        if ("wakeLock" in navigator) {
            anyNav.wakeLock.request("screen").then((wl: any) => {
                setWakeLock(wl);
                console.log("Wake Lock is active");
            });  
        }
        } catch (err: any) {
        // The Wake Lock request has failed - usually system related, such as battery.
        console.log(`${err.name}, ${err.message}`);
        }
    }, []);
    
    const initDeviceManager = async () => {
        const dm = await callClient.getDeviceManager();
        const checkCamera = async () => {
            const c = await dm.getCameras();
            setHasMultipleCameras(c && c.length > 1);
        }
        if (callType == CallTypeEnum.VideoCallTwoWay || callType == CallTypeEnum.VideoCallOneWay) {
            dm.on("videoDevicesUpdated", checkCamera);  

            await checkCamera();
        }

        setDeviceManager(dm);
    }

    const updateCredit = () => {
        const { dispatch } = props;
        const userRole = localStorage.getItem(LOCALSTORE.role) as any;
        let userId;

        if (userRole == UserRoleEnum.ServiceProvider) 
            userId = accountData.id
        else   
            userId = userProfile.id

        if(userId || authDetails?.totalCredit?.accountId) {
            dispatch(getTotalCredit(userId ? userId : authDetails?.totalCredit?.accountId))
            .then((credit: any) => {
                dispatch(set_Total_Credit(credit?.data))
            })
        }
    };
        
    const subscribeToCall = (call: Call, callConnectedUser: CallConnectionModel) => {
        try {
            handleCallState(call, callConnectedUser);
        } catch (error) {
            console.error(error);
        }
    };

    const setTiming = () => {
        setSeconds(0);
        setMinutes(0);

        let hs: number | undefined = undefined, ms = 0, ss = 0;
        
        const timer = setInterval(() => {
            let s = getValue(setSeconds);
            
            if (s == 59) {
                setSeconds(p => {
                    p = 0;
                    ss = p;
                    return p;
                });
                let m = getValue(setMinutes);
                if(m == 59) {
                    setMinutes(p => {
                        p = 0;
                        ms = p;
                        return p;
                    });
                    setHours(p => {
                        p = p ? p + 1 : 0;
                        hs = p;
                        return p;
                    });
                } else {
                setMinutes(p => {
                    p = p + 1;
                    ms = p;
                    return p;
                });
                }
            } else {
                setSeconds(p => {
                    p = p + 1;
                    ss = p;
                    return p;
                });
            }

            setiming((v: any) => {
                v.hours = hs;
                v.minutes = ms;
                v.seconds = ss;
                return v;
            });
        }, 1000);

        return timer;
    }
    
    const validateSufficientPerMinute = (call: Call, callConnectedUser: CallConnectionModel) => {
        const { dispatch } = props;

        return setInterval(() => {
            if (call.state === "Connected") {
                const validateCallBody = {
                    callConnectionId: call.id,
                    callType,
                    callerUserId: callConnectedUser.callerUser?.id,
                    calleeUserId: callConnectedUser.calleeUser?.id,
                    callerComUserId: callConnectedUser.callerUser?.communication?.id, 
                    calleeComUserId: callConnectedUser.calleeUser?.communication?.id,
                };
                dispatch(validateInsufficientCredit(validateCallBody))
                .then(async (r: any) => {
                    updateCredit();
                    if (r.data.isSuccess) {
                    return;
                    }

                    if (r.data.message == "OutOfCredit") {
                        setInsufficientCreditsOnCall(false);
                        await call.hangUp({forEveryone : true});
                        toast.error("Your call has been disconnected since you do not have the minimum amount of credits needed. Please top up to continue.", {
                            theme: "colored",
                            autoClose: 3000,
                        });
                        return;
                    } 
                    
                    if (r.data.message == "NeedTopup") {
                        setInsufficientCreditsOnCall(true);
                        await playRingTone(RingtoneEnum.Topup);
                        return;
                    }
                }
                ).catch(async (err: any) => {
                    setInsufficientCreditsOnCall(false);
                    await call.hangUp({forEveryone : true});
                    toast.error("Your call has been disconnected since server internal server error.", {
                        theme: "colored",
                        autoClose: 3000,
                    });
                });;
            }
        }, 58000);
    };

    const handleCallState = (call: Call, callConnectedUser: CallConnectionModel) => {
        const { dispatch } = props;
        let timer: any;
        let validateInterval: any;
        let ringingInterval: any;
        
        // Subscribe to call's 'stateChanged' event for value changes.
        call.on("stateChanged", async () => {
            switch (call.state) {
                case "Ringing": 
                if (call.direction == "Outgoing") {
                    ringingInterval = await outgoingRing();
                }
                break;
                case "Connected":
                timer = setTiming();
                stopOutgoingRing(ringingInterval);

                if (call.direction == "Outgoing") {
                    dispatch(updateCallConnected(callConnectedUser.room?.id, call.id));
                    validateInterval = validateSufficientPerMinute(call, callConnectedUser);
                }
                break;
                case "Disconnected":
                stopOutgoingRing(ringingInterval);
                clearInterval(timer);
                clearInterval(validateInterval);

                if (call.direction == "Outgoing") {
                    if (call.callEndReason?.code === 0) {
                    await triggerEndCall(call.id, callConnectedUser);
                    } else {
                    await triggerMissedCall(call.id, callConnectedUser);
                    }
                } else {
                    await resetCall();
                }
                break;
            }
        });
    }

    const acceptIncomingCall = async (adapter: CallAdapter, callingType: CallTypeEnum) => {
        const { dispatch } = props;
        if (incomingCall && typeof incomingCall.accept == "function") {
            let callPromise: Promise<Call>;
            if (callingType == CallTypeEnum.VideoCallTwoWay && authDetails?.toggleVideoCall) {
                const cameras = await adapter.queryCameras();
                setSelectedCamera(cameras[0]);
                const localVideoStream = new LocalVideoStream(cameras[0]);

                callPromise = incomingCall.accept({videoOptions: {localVideoStreams: [localVideoStream]}}) 
            } else {
                callPromise = incomingCall.accept();
            }

            callPromise.then((call: Call) => {
                dispatch(set_Incoming_Call(undefined));
                setOutgoingCall(call);
                // Subscribe to the call's properties and events.
                subscribeToCall(call, authDetails.callConnected);
            });
        } 
    };
    
    const startCall = async (adapter: CallAdapter, callingType: CallTypeEnum) => {
        const { dispatch } = props;

        dispatch(callConnecting(participantUserId, callType))
        .then(async (res: any) => {
            if (!res.data.isSuccess || !adapter) {
            return;
            }
    
            const callConnectedData = new CallConnectedResponseModel(res?.data.data);
            
            if (!callConnectedData.callConnectedUser || !callConnectedData.callConnectedUser.calleeUser?.communication?.id) {
                return;
            }
            
            dispatch(set_chat_data(callConnectedData.callConnectedUser?.room));
            dispatch(set_call_connected(callConnectedData.callConnectedUser));

            const call = adapter.startCall([callConnectedData.callConnectedUser.calleeUser?.communication?.id])
            if (!call) return;

            if (callingType == CallTypeEnum.VideoCallTwoWay || callingType == CallTypeEnum.VideoCallOneWay && call.direction == "Outgoing") {
                const cameras = await adapter.queryCameras();
                setSelectedCamera(cameras[0]);
                const localVideoStream = new LocalVideoStream(cameras[0]);
                await call.startVideo(localVideoStream);
            }

            setOutgoingCall(call);
            // Subscribe to the call's properties and events.
            subscribeToCall(call, callConnectedData.callConnectedUser);
        })
        .catch(async (err: any) => {
            if (err.data.name == "InsufficientCredit") {
            setInsufficientCreditsOnCall(true);
            } else {
            toast.error(err.data.message || err.message, {
                theme: "colored",
                autoClose: 3000,
            });
            }
        });
    }

    async function triggerEndCall(callId: string, callConnectedUser: CallConnectionModel) {
        const { dispatch } = props;
        const endCallBody = {
            callType,
            callerUserId: callConnectedUser.callerUser?.id,
            calleeUserId: callConnectedUser.calleeUser?.id,
            callerComUserId: callConnectedUser.callerUser?.communication?.id, 
            calleeComUserId: callConnectedUser.calleeUser?.communication?.id,
            callConnectionId: callId,
        };
        await dispatch(endCall(endCallBody));
        await resetCall();
    };

    async function triggerMissedCall(callId: string, callConnectedUser: CallConnectionModel) {
        const { dispatch } = props;
        const missedCallBody = {
            callType,
            callerUserId: callConnectedUser.callerUser?.id,
            calleeUserId: callConnectedUser.calleeUser?.id,
            callerComUserId: callConnectedUser.callerUser?.communication?.id, 
            calleeComUserId: callConnectedUser.calleeUser?.communication?.id,
            callConnectionId: callId,
        };
        // call API to /missed-call endpoint
        dispatch(missedCall(missedCallBody)).then();
        // Refresh the chat
        await resetCall();
    };
    
    const resetCall = async () => {
        const { dispatch } = props;

        let wakeLock: any;
        setWakeLock((wl: any) => { wakeLock = wl; return wl; });
        await wakeLock?.release();

        dispatch(reset_Call_State(null));
        dispatch(set_Show_Chat(true));
        
        const userRole = localStorage.getItem(LOCALSTORE.role) as any;
        
        if (userRole == UserRoleEnum.ServiceProvider) {
        navigate(-1);
        } else {
        navigate("/user/chat");
        }
        
    };

    const onToggleShowNotes = () => {
        if (isShowNote) {
        setIsShowNote(false);
        }else {
        setIsShowNote(true);
        }
    }

    const onTopUpCallCancel = async () => {
        setInsufficientCreditsOnCall(false);
        const call: Call | undefined = getValue(setOutgoingCall);
        
        if (!!call) {
            if (call.hangUp !== undefined) {
                call.hangUp({forEveryone : true});
                return;
            }

            if (call.state == "Connecting") {
                await resetCall();
            }
        }
    };
        
    const handleTopUpSuccess = () => {
        setInsufficientCreditsOnCall(false);
    }

    const onShowNotes = (value: boolean) => {
        setIsShowNote(value);
    }

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            {outgoingCall && outgoingCall.state == "Connected" && chatThread && isShowNote 
                && <StickyNotes roomId={chatThread.id} userId={outgoingCall.direction == 'Outgoing' ? chatThread.myUserId : chatThread.participantUserId} onClosed={onToggleShowNotes}/>}
        
            {insufficientCreditsOnCall && (
                <TopUpModal
                    onCancel={onTopUpCallCancel}
                    onSuccess={handleTopUpSuccess}
                    amount=""
                    insufficientCredits={true}
                />
            )} 

            <FluentThemeProvider>
                {callClient && (
                <CallClientProvider callClient={callClient}>
                    {callAgent && (
                    <CallAgentProvider callAgent={callAgent}>
                        {outgoingCall && (
                            <CallProvider call={outgoingCall}>
                                <CallingComponents callConnected={callConnected}
                                                    callType={callType}
                                                    hasMultipleCameras={hasMultipleCameras}
                                                    cameraToggle={cameraToggle}
                                                    deviceManager={deviceManager}
                                                    timing={timing}
                                                    initialCamera={selectedCamera}
                                                    cameras={cameras}
                                                    onShowNotes={onShowNotes}/>
                            </CallProvider>
                        )}
                    </CallAgentProvider>
                    )}
                </CallClientProvider>
                )}
            </FluentThemeProvider>
        </div>
    );
};

export default connect()(CallScreenRft);
