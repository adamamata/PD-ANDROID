import React from "react";
import Loadable from "react-loadable";
import RctPageLoader from "../RctPageLoader";

export const AsyncLoginComponent = Loadable({
  loader: () => import("../../view/auth/login"),
  loading: () => <RctPageLoader />,
});

// export const AsyncChooseAccount = Loadable({
//   loader: () => import("../../user/auth/choose-account"),
//   loading: () => <RctPageLoader />,
// });

export const AsyncUserRegistration = Loadable({
  loader: () => import("../../view/auth/registration"),
  loading: () => <RctPageLoader />,
});

export const AsyncVerificationEmail = Loadable({
  loader: () => import("../../view/auth/emailVerification"),
  loading: () => <RctPageLoader />,
});

export const AsyncCommonCallScreen = Loadable({
  loader: () => import("../../view/dashboard/commons/call-screen"),
  loading: () => <RctPageLoader />,
});

export const AsyncConsultantHome = Loadable({
  loader: () => import("../../view/dashboard/consultant/home"),
  loading: () => <RctPageLoader />,
});

export const AsyncResetPassword = Loadable({
  loader: () => import("../../view/auth/resetPassword"),
  loading: () => <RctPageLoader />,
});

export const AsynClientViewProfile = Loadable({
  loader: () => import("../../view/dashboard/consultant/viewclientProfile"),
  loading: () => <RctPageLoader />,
});

export const AsyncNotFoundData = Loadable({
  loader: () => import("../../view/auth/4o4"),
  loading: () => <RctPageLoader />,
});

export const AsyncUserProfile = Loadable({
  loader: () => import("../../view/dashboard/user/userProfile"),
  loading: () => <RctPageLoader />,
});

export const AsyncUserProfileEdit = Loadable({
  loader: () => import("../../view/dashboard/user/userProfileEdit"),
  loading: () => <RctPageLoader />,
});

export const AsyncUserHome = Loadable({
  loader: () => import("../../view/dashboard/user/home"),
  loading: () => <RctPageLoader />,
});

// export const AsyncServiceUser = Loadable({
//   loader: () => import("../../view/dashboard/consultant/userMediaProfile"),
//   loading: () => <RctPageLoader />,
// })

export const ASyncSPViewProfile = Loadable({
  loader: () => import("../../view/dashboard/consultant/viewProfile"),
  loading: () => <RctPageLoader />,
})

export const ASyncSPViewEditProfile = Loadable({
  loader: () => import("../../view/dashboard/consultant/viewEditProfile"),
  loading: () => <RctPageLoader />,
})

export const ASyncSPChat = Loadable({
  loader: () => import("../../view/dashboard/consultant/consultchat"),
  loading: () => <RctPageLoader />,
})

export const AsyncInboxSP = Loadable({
  loader: () => import("../../view/dashboard/consultant/inbox"),
  loading: () => <RctPageLoader />,
})

export const ASyncUserChat = Loadable({
  loader: () => import("../../view/dashboard/user/chat"),
  loading: () => <RctPageLoader />,
})

export const ASyncUserChatData = Loadable({
  loader: () => import("../../view/dashboard/consultant/chatUser"),
  loading: () => <RctPageLoader />,
})

export const ASyncSPChatData = Loadable({
  loader: () => import("../../view/dashboard/user/chatSP"),
  loading: () => <RctPageLoader />,
})

export const AsyncInboxUser = Loadable({
  loader: () => import("../../view/dashboard/user/inbox"),
  loading: () => <RctPageLoader />,
})

export const AsyncSendMail = Loadable({
  loader: () => import("../../view/dashboard/user/mail"),
  loading: () => <RctPageLoader />,
})

export const AsyncSendMailSP = Loadable({
  loader: () => import("../../view/dashboard/consultant/mail"),
  loading: () => <RctPageLoader />,
})
export const AsyncPdAdvisor = Loadable({
  loader: () => import("../../view/auth/pdAdvisor"),
  loading: () => <RctPageLoader />,
})

export const AsyncPdCustomer = Loadable({
  loader: () => import("../../view/auth/pdCustomer"),
  loading: () => <RctPageLoader />,
})

export const AsyncSpImage = Loadable({
  loader: () => import("../../view/dashboard/consultant/spImage"),
  loading: () => <RctPageLoader />,
})

export const AsyncUserPayment = Loadable({
  loader: () => import("../../view/dashboard/user/userpayment"),
  loading: () => <RctPageLoader />,
})

export const AsyncSpAddProfile = Loadable({
  loader: () => import("../../view/dashboard/consultant/spaddProfile"),
  loading: () => <RctPageLoader />,
})

export const AsyncFavorites = Loadable({
  loader: () => import("../../view/dashboard/user/favorites"),
  loading: () => <RctPageLoader />,
}) 

export const AsyncThanksConsultant = Loadable({
  loader: () => import("../../view/dashboard/consultant/spThnaksPage"),
  loading: () => <RctPageLoader />,
}) 

export const AsyncThanksUser = Loadable({
  loader: () => import("../../view/dashboard/user/userThankYouPage"),
  loading: () => <RctPageLoader />,
}) 

export const AsyncTopUpUser = Loadable({
  loader: () => import("../../view/dashboard/user/userTopUp"),
  loading: () => <RctPageLoader />,
}) 

export const AsyncManageProfile = Loadable({
  loader: () => import("../../view/dashboard/consultant/manageProfile"),
  loading: () => <RctPageLoader />,
}) 
