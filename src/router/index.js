import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AsyncLoginComponent,
  AsyncUserRegistration,
  AsyncResetPassword,
  AsyncNotFoundData,
  AsyncCommonCallScreen,
  AsyncConsultantHome,
  AsynClientViewProfile,
  AsyncUserProfileEdit,
  AsyncUserProfile,
  AsyncUserHome,
  // AsyncServiceUser,
  ASyncSPViewProfile,
  ASyncSPViewEditProfile,
  ASyncSPChat,
  ASyncUserChat,
  ASyncUserChatData,
  ASyncSPChatData,
  AsyncInboxUser,
  AsyncInboxSP,
  AsyncSendMail,
  AsyncSendMailSP,
  AsyncPdAdvisor,
  AsyncPdCustomer,
  AsyncUserPayment,
  AsyncSpImage,
  AsyncSpAddProfile,
  AsyncFavorites,
  AsyncThanksUser,
  AsyncThanksConsultant,
  AsyncTopUpUser,
  AsyncManageProfile,
  AsyncVerificationEmail,
} from "../component/AsyncComponent";
import { PrivateRoute } from "./private";
import ViewProfile from "../view/dashboard/user/userViewProfile";
import ViewRequest from "../view/dashboard/user/request";
import ConsultantViewRequest from "../view/dashboard/consultant/request";
import AzureCallAgent from "../component/call/call-agent";
import PdMain from "../view/auth/pdMain";
import PdTos from "../view/auth/pdTos";
import Static2557 from "../view/auth/2557"
import PdPrivacyPolicy from "../view/auth/PdPrivacyPolicy";
import About from "../view/auth/about";
import PdLanding from "../view/auth/pdStatic";
import LearnMore from "../view/auth/learnMore";
import RctPageLoader from "../component/RctPageLoader";
import { GetToken } from "../constant/default";
import PublicViewProfile from "../view/auth/publicSpDetails"

const RouteFile = () => {
  function delayForDemo(promise) {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    }).then(() => promise);
  }
  const PdMainPreview = lazy(() => delayForDemo(import('../view/auth/pdMain')));
  return (
    <>
      <AzureCallAgent />
      <Routes>
        <Route path='/' element={
          <Suspense fallback={<RctPageLoader />}>
            <PdMainPreview />
          </Suspense>
        } />
        <Route path='/landing' element={<PdLanding />} />
        <Route path="/:type/learn-more" element={<LearnMore />} />
        {/* <Route path="/pd/customers" element={<AsyncPdCustomer />} /> */}
        <Route path='/legal/TOS' element={<PdTos />} />
        <Route path='/legal/PP' element={<PdPrivacyPolicy />} />
        <Route path='/legal/2557' element={<Static2557 />} />
        <Route path='/legal/about' element={<About />} />
        <Route path='/login' element={<AsyncLoginComponent />} />
        <Route path='/:type/registration' element={<AsyncUserRegistration />} />
        <Route path='/verify-email/:token/:email' element={<AsyncVerificationEmail />} />


        <Route
          path='/reset-password/:token/:email'
          element={<AsyncResetPassword />}
        />
        <Route
          path='/user/TopUp'
          element={
            <AsyncTopUpUser />
          }
        />
        <Route
          path='/thankyouuser'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncThanksUser />
            </PrivateRoute>
          }
        />
        <Route
          path='/thankyouconsultant'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncThanksConsultant />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/:direction/:type/:participantUserId'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncCommonCallScreen />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/:direction/:type/:participantUserId'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncCommonCallScreen />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/home'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncConsultantHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/viewClientProfile/:id'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsynClientViewProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/request'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <ConsultantViewRequest />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/chat'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <ASyncSPChat />
            </PrivateRoute>
          }
        />{' '}
        <Route
          path='/consultant/userchat'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <ASyncUserChatData />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/profile'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <ASyncSPViewProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/editProfile'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <ASyncSPViewEditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/inbox'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncInboxSP />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/sendMail'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncSendMailSP />
            </PrivateRoute>
          }
        />
        <Route
          path='/consultant/sendMail/:id'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncSendMailSP />
            </PrivateRoute>
          }
        />
        <Route path='/consultant/uploadImage/:id' element={<AsyncSpImage />} />
        <Route
          path='/consultant/:id/addProfile'
            element={ <AsyncManageProfile registrationFlow={true} />}
        />
        <Route
          path='/user/profileEdit'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncUserProfileEdit />
            </PrivateRoute>
          }
        />
        <Route path='/user/addCard/:id' element={<AsyncUserPayment />} />
        <Route
          path='/user/profile'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncUserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/home'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncUserHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/profileDetails/:uniqueUsername'
          element={
            GetToken() ? (
              <PrivateRoute props={{ role: 'User' }}>
                <ViewProfile />
              </PrivateRoute>)
              : (
                <PublicViewProfile />
              )
          }
        />
        <Route
          path='/user/request'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <ViewRequest />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/chat'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <ASyncUserChat />
            </PrivateRoute>
          }
        />{' '}
        <Route
          path='/user/SPchat'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <ASyncSPChatData />
            </PrivateRoute>
          }
        />{' '}
        <Route
          path='/user/favorites'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncFavorites />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/inbox'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncInboxUser />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/sendMail'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncSendMail />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/sendMail/:id'
          element={
            <PrivateRoute props={{ role: 'User' }}>
              <AsyncSendMail />
            </PrivateRoute>
          }
        />
        <Route
          path='consultant/profile/manage'
          element={
            <PrivateRoute props={{ role: 'ServiceProvider' }}>
              <AsyncManageProfile />
            </PrivateRoute>
          }
        />

        <Route path='*' element={<AsyncNotFoundData />} />
      </Routes>
    </>
  );
};

export default RouteFile;
