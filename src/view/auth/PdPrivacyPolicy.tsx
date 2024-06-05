import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderHome from "../dashboard/commons/headerHome";
import Footer from "../../component/footer";
import heroImage from "../../assets/images/heroImage.png";

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F8F3FD] min-h-screen">
      <HeaderHome />
      <div
        className={`p-16 pb-8 lg:mt-[-70px]`}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="font-[700] text-[48px] mt-1 text-white">
          Privacy Policy
        </h1>
      </div>
      <div className="body-section">
        <div className={`min-h-screen`}>
          <div className="md:block antialiased min-h-screen text-[#000000] lg:px-[150px] md:px-[100px] sm:px-[50px] px-[30px] py-12 max-h-[60%] overflow-y-auto">
            <div className="font-bold">PRIVACY POLICY </div>
            <div className="pt-2">
              We take user privacy seriously and want you to be informed of our
              practices and your rights. This Privacy Policy, which is
              incorporated into our Terms of Service, outlines the privacy
              practices of PD Consultants LLC (“Company,” “us,” “we,” or “our”)
              in connection with your (“you” or “your”) access to or use of our
              website, mobile app, and related services (collectively, the
              “Service”). By accessing or using our Service, you acknowledge
              that you have read, understood, and agree to be bound to our
              terms, including this Privacy Policy.
            </div>
            <div className="pt-2 font-bold">
              What does this Privacy Policy cover?{" "}
            </div>
            <div className="pt-2 ">
              This Privacy Policy outlines how we collect, use, and disclose
              information of users, both online and offline. Please also see our
              separate <a href="/legal/PP" className="underline">Terms of Service</a>,
              which incorporates by reference this Privacy Policy and which include definitions applicable to this
              Privacy Policy.
            </div>{" "}
            <div className="pt-2 ">
              Unless otherwise expressly stated, this Privacy Policy does not
              apply to any third-party practices, websites, or services, whether
              or not referenced in our Service. Each third party will have its
              own privacy practices and policies, which you should review before
              using.
            </div>
            <div className="pt-2 font-bold">
              How do we collect and use information?
            </div>
            <div className="pt-2">
              In order to provide our Service, we collect information about you
              that, alone or in combination with other information, can be used
              to identify you as an individual (“<span className="font-bold">personal information</span>”). What
              personal information we collect, and process depends on how and
              why you interact with us.
            </div>{" "}
            <div className="pt-2">
              Generally, Company collects personally identifying information
              when you provide it, such as when you create an Account or
              communicate directly with us. We also collect routine device and
              other data, and we use data to deliver advertisements that may be
              of interest to you.
            </div>
            <div className="pt-2">
              We collect personal information about you such as your name, email
              address, and photo when you create an Account. We also collect
              details about your transactions when you make a purchase through
              the Service. Like many companies, we also collect internet and
              device information, such as from cookies and other automated
              technologies, when you browse our website.
            </div>{" "}
            <div className="pt-2">
              We collect all of this information for our <span className="italic underline">business purposes</span>,
              namely, to provide and improve our website and Service. Part of
              this includes compliance with applicable laws, such as responding
              to legal requests, enforcing this Privacy Policy and our rights,
              and protecting others and our Service. We may also use information
              for short-term, transient use for interacting with you and to
              personalize your experience and communications. We use information
              for security purposes and to protect against harmful activity.
              Further, we may use information for debugging for functionality,
              auditing interactions, and internal research. Moreover, we may use
              information as otherwise instructed by you and with your consent.
            </div>{" "}
            <div className="pt-2">
              In addition, we collect information for <span className="italic underline">commercial purposes</span>,
              meaning to market our website and the Service. For example, we
              collect device and other data to better target advertisements and
              other content in an effort to create a more personally relevant
              experience.
            </div>
            <div className="pt-2">
              We use information for the same reasons that we collect it. For
              example, we use information for business purposes, such as running
              our website, as well as commercial purposes, such as advertising
              to you after you leave our website.
            </div>
            <div className="pt-2">
              More specifically, we collect the following information for the
              referenced purposes.
            </div>
            {/* <div>
              <table className="table-auto">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Examples of Data Collected </th>
                    <th>Collection Point </th>
                    <th>Purpose for Collection and Use </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Identifiers</td>
                    <td>
                      Contact Information, such as name, alias, address, phone
                      number, and email address. Account Information, such as
                      username, password, and profile picture. By providing a
                      profile picture, you agree that we may make it available
                      to other Users of the Service. Other Identifiers,
                      ID/passport, Federal Tax ID (Social Security number or
                      Employer Identification Number) to prepare Form 1099-K if
                      necessary and to help us verify your identity. Users who
                      are not United States taxpayers will not be asked for
                      their Federal Tax ID, though they may need to report
                      income to their local tax authority and may be required to
                      provide equivalent evidence of their identity. Actresses
                      and Clients are able to exchange messages, texts, and
                      video calls through the Service. If you use these
                      features, you acknowledge and agree that the User with
                      whom you choose to communicate with will have access to
                      messages and video of you. Furthermore, Company uses a
                      third-party service provider to enable the video and
                      message features, and you agree that Company will transfer
                      your IP address and profile ID to this service provider
                      strictly for the purpose of providing the service.
                    </td>
                    <td>
                      Contact Information, such as name, alias, address, phone
                      number, and email address. Account Information, such as
                      username, password, and profile picture. By providing a
                      profile picture, you agree that we may make it available
                      to other Users of the Service. Other Identifiers,
                      ID/passport, Federal Tax ID (Social Security number or
                      Employer Identification Number) to prepare Form 1099-K if
                      necessary and to help us verify your identity. Users who
                      are not United States taxpayers will not be asked for
                      their Federal Tax ID, though they may need to report
                      income to their local tax authority and may be required to
                      provide equivalent evidence of their identity. Actresses
                      and Clients are able to exchange messages, texts, and
                      video calls through the Service. If you use these
                      features, you acknowledge and agree that the User with
                      whom you choose to communicate with will have access to
                      messages and video of you. Furthermore, Company uses a
                      third-party service provider to enable the video and
                      message features, and you agree that Company will transfer
                      your IP address and profile ID to this service provider
                      strictly for the purpose of providing the service.
                    </td>
                  </tr>
                  <tr>
                    Contact Information, such as name, alias, address, phone
                    number, and email address. Account Information, such as
                    username, password, and profile picture. By providing a
                    profile picture, you agree that we may make it available to
                    other Users of the Service. Other Identifiers, ID/passport,
                    Federal Tax ID (Social Security number or Employer
                    Identification Number) to prepare Form 1099-K if necessary
                    and to help us verify your identity. Users who are not
                    United States taxpayers will not be asked for their Federal
                    Tax ID, though they may need to report income to their local
                    tax authority and may be required to provide equivalent
                    evidence of their identity. Actresses and Clients are able
                    to exchange messages, texts, and video calls through the
                    Service. If you use these features, you acknowledge and
                    agree that the User with whom you choose to communicate with
                    will have access to messages and video of you. Furthermore,
                    Company uses a third-party service provider to enable the
                    video and message features, and you agree that Company will
                    transfer your IP address and profile ID to this service
                    provider strictly for the purpose of providing the service.
                  </tr>
                  <tr>
                    <td>Witchy Woman</td>
                    <td>The Eagles</td>
                    <td>1972</td>
                  </tr>
                  <tr>
                    <td>Shining Star</td>
                    <td>Earth, Wind, and Fire</td>
                    <td>1975</td>
                  </tr>
                </tbody>
              </table>
            </div> */}


            <div className="relative overflow-x-auto mt-4">
              <table className="w-full text-sm text-left text-gray-500 border">
                <thead className="text-xs bg-white text-gray-700 uppercase">
                  <tr>
                    <th scope="col" className="bg-[#f3f3f3] px-6 py-3 border">
                      Category
                    </th>
                    <th scope="col" className="bg-[#f3f3f3] px-6 py-3 border">
                      Examples of Data Collected
                    </th>
                    <th scope="col" className="bg-[#f3f3f3] px-6 py-3 border">
                      Collection Point
                    </th>
                    <th scope="col" className="bg-[#f3f3f3] px-6 py-3 border">
                      Purpose for Collection and Use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className=" border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap italic align-baseline border">
                      Identifiers
                    </th>
                    <td className="px-6 py-4 align-baseline border">
                      <p className="font-bold">Contact Information,</p>
                      <p>such as name, alias, address, phone number, and email address.</p>
                      <p className="font-bold">Account Information,</p>
                      <p>such as username, password, and profile picture. By providing a profile picture, you agree that we may make it available to other users of the Service.</p>
                      <p className="font-bold">Other Identifiers,</p>
                      <p>ID/passport, Federal Tax ID (Social Security number or Employer Identification Number) to prepare Form 1099-K if necessary and to help us verify your identity. Users who are not United States taxpayers will not be asked for their Federal Tax ID, though they may need to report income to their local tax authority and may be required to provide equivalent evidence of their identity. </p>
                      <p className="mt-2">Actresses and Clients are able to exchange messages, texts, and video calls through the Service. If you use these features, you acknowledge and agree that the User with whom you choose to communicate with will have access to messages and video of you. Furthermore, Company uses a third-party service provider to enable the video and message features, and you agree that Company will transfer your IP address and profile ID to this service provider strictly for the purpose of providing the service.</p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect this information when you provide it, such as when create an Account, use the various message features on the Service, or load money on to your Account to communicate with Actresses.
                      </p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect and use data for all business purposes, such as providing and improving our website and Service, responding to communications, and for security and auditing purposes.
                      </p>
                    </td>
                  </tr>

                  <tr className=" border-b">
                    <th scope="row" className="px-6 py-4 italic font-medium text-gray-900 whitespace-nowrap align-baseline border">
                      Commercial Data
                    </th>
                    <td className="px-6 py-4 align-baseline border">
                      <p className="mt-2"><span className="font-bold">Transactions,</span> including your purchases made or purchasing tendencies.</p>

                      <p className="mt-2"><span className="font-bold">Financial,</span>such as such as bank name, bank account number, routing number, billing address, and credit or debit card number</p>

                      <p className="font-bold">See also California Civil Code Section 1798.80(e). </p>

                      <p className="mt-2"><span className="font-bold">Inferences,</span> such as creating a profile relating to consumer preferences and trends.</p>

                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect this information when you provide it, such as when you sign up to be an Actress or load money on to your Account.
                      </p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect and use data for all business purposes, such as providing and improving our website and Service, confirming age, responding to communications, and for security and auditing purposes.
                      </p>
                    </td>
                  </tr>

                  <tr className=" border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap align-baseline border italic">
                      Sensitive Data
                    </th>
                    <td className="px-6 py-4 align-baseline border">
                      <p><span className="font-bold">Protected Class,</span> such as your age, date of birth, and gender.</p>
                    </td>

                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect this information you provide it.
                      </p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect and use data for the business purposes outlined, such as to identify you and your Account and for security purposes.
                      </p>
                    </td>
                  </tr>

                  <tr className=" border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap align-baseline border italic">
                      Device Data
                    </th>
                    <td className="px-6 py-4 align-baseline border">
                      <p><span className="font-bold">Internet and Network Data,</span> isuch as browsing history, search history, and information regarding a consumer’s interaction with an internet website, application, or advertisement. See below for more information about cookies and other tracking technologies.
                      </p>

                      <p><span className="font-bold">Geolocation,</span> such as general location from an IP address.</p>

                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect this data automatically through cookies, our third-party service providers, and other automated technologies. For example, like many companies, we automatically gather information about your device, such as your IP address, browser type, and operating system. For more information on these practices, see below.
                      </p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect and use data for all business purposes, such as providing and improving our website and Service and for security and auditing purposes.
                      </p>

                      <p>
                        While this information taken together could be considered personal information, we do not use this information to personally identify you. We use this information in the aggregate to analyze trends, administer our Service, prevent fraud, understand how users interact with our Service, and gather demographic information to tailor our visitors’ experience on our Service, show them content that we think they might be interested in, and display the content according to their preferences. We do not share this information with third parties.
                      </p>
                    </td>
                  </tr>

                  <tr className=" border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap align-baseline border italic">
                      Other Personalized Data
                    </th>
                    <td className="px-6 py-4 align-baseline border">
                      <p><span className="font-bold">Other Information,</span>  such as communications to us or responses to surveys or promotional offers.
                      </p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We may collect this information if you provide it, such as if you send us a message, or participate in a survey or offer.
                      </p>
                    </td>
                    <td className="px-6 py-4 align-baseline border">
                      <p>
                        We collect and use data for business purposes, responding to your communications and providing and improving the Service.
                      </p>

                      <p>
                        The Service does not intend to collect any other personal data not outlined to you.
                      </p>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            <div className="pt-2 font-bold">
              When do we disclose information?
            </div>

            <div className="pt-2">
              As part of our business, we disclose information as follows and
              for the outlined purposes, which include business purposes to
              provide and improve the Service and comply with legal and
              contractual obligations, as well as commercial purposes, such as
              to market our business.
            </div>
            <ul className="ml-6">
              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">With Users.</span> Your information will be shared with Users when you
                voluntarily disclose it through your use of the Service. Please
                be careful with your information and make sure that the content
                you share is something you would be comfortable being publicly
                viewable. Remember, neither you nor we can have total control
                over what others do with your information once you share it.
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">Company Parties;</span> Merger or Sale. We may share information with
                affiliated companies that are related to us under a common
                ownership where they comply with this Privacy Policy. Such
                disclosure is for our business purposes, including to provide
                and improve our offers. Further, we may share information as
                part of a sale, merger, acquisition, or other change in control
                or entity status, either in whole or in part. We reserve the
                right to transfer or assign your information as part of any such
                transaction or investigation.
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">Service Providers and Contractors.</span> We share information with
                service providers that allows us to provide and improve the
                Service. Service providers only use your information for a
                contracted-business purpose. Such disclosure is for our business
                purposes, in particular to provide you with the Service. We may
                likewise share information with “contractors” that are not
                service providers but to whom we disclose information for a
                business purpose. Such disclosure is for business purposes of
                providing you with products and services that you have requested
                or considered.
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">Cookies/Device Data.</span> For more information about our use of
                cookies and other technologies, see further below. Such
                disclosure is for our business purposes, in particular to
                provide you with the Service, as well as commercial purposes,
                such as to market to consumers that may be interested in our
                Service or related offers. We may also contract with third-party
                advertising companies to serve ads on our behalf. These
                companies may use cookies or other measures to collect
                non-identifier information.
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">Legal Process and Protection.</span> We may disclose information as
                necessary to comply with our legal obligations, such as to
                respond to government requests, law enforcement inquiries, legal
                processes, subpoenas, and court orders. We may disclose
                information when we believe it is necessary to investigate,
                prevent, or respond to illegal, fraudulent, or injurious actions
                or security incidents that may cause harm to us, the Service, or
                others. We may also disclose information in good faith where
                necessary to investigate or enforce a violation of this Privacy
                Policy, our terms, or any legal rights.
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">To Protect our Users or Others.</span> Notwithstanding any other
                provision of this Privacy Policy or our Terms of Service, we
                reserve the right, but have no obligation, to disclose any
                information that you submit to the Service, if in our sole
                opinion, we suspect or have reason to suspect, that the
                information involves a party who may be the victim of abuse in
                any form. Abuse may include, without limitation, child abuse,
                spousal abuse, neglect, domestic violence, or human trafficking.
                Information may be disclosed to authorities that we, in our sole
                discretion, deem appropriate to handle such disclosure.
                Appropriate authorities may include, without limitation, law
                enforcement agencies, child protection agencies, or court
                officials. You hereby acknowledge and agree that we are
                permitted to make such disclosure.
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">To Trusted Third Parties.</span> We may share your information with
                third parties, but not in a manner that would reveal your
                identity. We may share your personal information, sometimes in
                conjunction with non-identifying information, with service
                providers that may be associated with us to perform functions on
                your behalf. For example, outsourced customer care agents or
                technology assistants may need access to your information to
                perform services for you. Your information will be treated as
                private and confidential by such service providers and not used
                for any other purpose than we authorize. We may also disclose information to third parties that could choose to provide unrelated goods or services or for cross-context advertising purposes. Such disclosure facilitates our Services as well as marketing/commercial purposes
              </li>

              <li className="mt-4" style={{ listStyleType: "disc" }}>
                <span className="font-bold italic">Consent.</span> We may disclose information as requested or consented
                to by you. Such disclosure may be for any business or commercial
                purpose as described to you.
              </li>
            </ul>
            <div className="pt-2 font-bold">
              How do we use cookies and similar technologies?
            </div>
            <div className="pt-2">
              “Cookies” are small strings of text or computer code stored locally
              on your devise that allow us to identify your browser and/or device
              as you browse the Internet. As with many companies, we may use
              cookies, pixels, gifs, web beacons, log files, and/or similar
              technologies to automatically collect certain information when you
              use the Service or interact with our digital media content, such as
              when you visit our website. This allows us to track individual
              users, determine when content is accessed, and customize user
              experiences. For example, unless you have opted out of cookies or
              changed your cookie settings in your internet browser, your browser
              automatically sends us certain device, browser, internet connection,
              and general geolocation information and certain internet activity
              information. For instance, we may collect your mobile device
              identifier or MAC address, ISP carrier information, date and time
              you access the Service, the pages you visit, and whether you click
              on ads. You can change your cookie settings in your internet browser
              and use settings on your device to manage your privacy controls. For
              more information and ways to opt out, see <a className="underline" href="https://www.allaboutcookies.org/">https://www.allaboutcookies.org/</a>, and learn how to disable these
              tools by opting-out of <a className="underline" href="https://optout.aboutads.info/?c=2&lang=EN">third-party cookies</a> and <a className="underline" href="https://youradchoices.com/appchoices">mobile device ID
                practices.</a>
            </div>
            <div className="pt-2">
              As part of our practices, we may use third-party advertising
              companies to display ads tailored to your individual interests based
              on your online activity and to provide ad-related services such as
              analytics and market research. Third parties, in turn, may use a
              cookie, web beacon, or other similar technology to collect
              information. To opt-out of cross-device linking, visit <a className="underline" href="https://optout.aboutads.info/?c=2&lang=EN">www.aboutads.info/choices</a> or perform a global opt-out on each
              browser and device.
            </div>{" "}
            <div className="pt-2">
              In particular, we may use Google cookies and tools, such as Google
              Analytics and in certain cases Google Maps, for analytics and
              advertising and to improve the user experience, and your information
              may be shared with Google; for more information, visit the <a className="underline" href="https://policies.google.com/technologies/cookies?hl=en-US">Google
                Cookie Policy</a>, <a className="underline" href="https://tools.google.com/dlpage/gaoptout">Google Analytics Opt-Out Browser Add-On</a>, or <a className="underline" href="https://myadcenter.google.com/?sasb=true">Ads
                  Settings</a>. We may also use Meta and other cookies for the purposes
              stated above, and your information from cookies may be shared with
              Meta; for more information visit the <a href="https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0" className="underline">Meta/Facebook Cookie Policy</a>.
            </div>
            <div className="pt-2">
              Please note that there are different types of cookies and related
              technologies, which may be placed by us or third parties,
              including essential cookies that are required to display and
              provide the Service; preference cookies that are used to store
              preferences and improve user experience; analytics cookies to
              determine how the Service is used and which often collect
              non-personalized information; and marketing cookies to deliver
              personalized and targeted advertisements that may be of interest
              to you and others and which are used for business purposes for
              advertising to those that visit the Service and commercial
              purposes for marketing to others.
            </div>
            <div className="pt-2 font-bold">
              Do we sell or share information?
            </div>
            <div className="pt-2">
              We do not sell personal information for any monetary
              consideration. However, under some privacy legislation our
              practices may constitute “selling” or “sharing” personal
              information, such as for business purposes (e.g., providing our
              Service) and commercial purposes (e.g., other marketing). To opt
              out of these practices, contact us as outlined below.
            </div>
            <div className="pt-2 font-bold">
              How do we protect and transfer information?
            </div>
            <div className="pt-2">
              Consistent with others in our industry, we take efforts to employ
              technical, administrative, and physical security measures for
              personal information, taking into account reasonable security
              procedures and accessible technology. However, no system can be
              completely secure; and we cannot promise, and you should not
              expect, that your personal information will always remain secure.
              Your provision of personal information is at your own risk. The
              safety and security of your information also depends on you. Take
              steps to safeguard your passwords and other data and notify us as
              soon as possible if you believe your account security has been
              breached.
            </div>
            <div className="pt-2">
              If you are visiting the Service from a location outside of the
              United States, your connection will be through and to servers
              located in the United States, and all information you provide will
              be processed and securely maintained in our web servers and
              internal systems located within the United States. By using the
              Service, <span className="font-bold">you authorize and specifically consent to the transfer of
                personal data to the United States</span> and its storage and use as
              specified in this Privacy Policy.
            </div>
            <div className="pt-2 font-bold">
              How long do we retain information?
            </div>
            <div className="pt-2">
              We retain personal information for the length of time necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              different retention period is requested by you or required or
              permitted by law. For example, we will retain your personal
              information for as long as it is needed to provide you with the
              Service or fulfill a legal or contractual obligation. We may also
              aggregate, deidentify, or anonymize personal information as
              applicable for use in analytics, such as to analyze trends over
              periods of time without specifically identifying you.
            </div>
            <div className="pt-2">
              We use the following criteria to determine how long we retain
              personal information: (a) our relationship with you, such as if
              there is an open contract or account or a pending transaction or
              request, (b) legal obligations to retain personal information for
              certain purposes, such as to maintain transaction records, and (c)
              other obligations or considerations relating to the retention of
              data, such as contract requirements, litigation holds,
              investigations, or statutes of limitation.
            </div>
            <div className="pt-2 font-bold">What are your privacy rights? </div>
            <div className="pt-2">
              We value consumer privacy rights and strive to provide flexibility
              with how your personal data is used and shared. If you want to
              make a privacy request or have any questions, please contact us
              through our Contact Us form or email contact@phonedarlings.com
              with your name and email address or other identifier used in
              connection with our Service so that we can verify your request. If
              an authorized agent is making a request on your behalf, the agent
              should provide its name and contact information, such as an email
              address, in addition to your information. There may be situations
              where we cannot grant your request, for example if you make a
              request and we cannot verify your identity, or if you request
              deletion of data but we have a legal obligation to keep your
              personal information. Where we deny your request in whole or in
              part, we will take steps to inform you of the denial and provide
              an explanation of our actions and the reasons for the denial.
            </div>{" "}
            <div className="pt-2">
              Applicable privacy laws have different requirements and depend
              upon various factors, such as where you live and how much revenue
              or data is at issue. Generally, we adhere to the following set of
              privacy rights to the extent applicable and subject to any
              limitations authorized by law.
            </div>
            <div>
              <ul className="ml-4 ">
                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Access.</span> You can access and obtain your data and ask us for certain information, including the categories of personal
                  information collected and used, the categories of the sources of
                  data, the business or commercial purposes for collecting,
                  selling, or sharing data, the categories of third parties to
                  whom data is disclosed, and the specific pieces of personal
                  information collected. You also have a similar right to data
                  portability.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Amend.</span> You can amend, correct, or rectify your data if it is inaccurate.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Delete.</span> You can have your data deleted subject to certain legal limitations.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Limit.</span> You can limit the processing of certain information, in particular any sensitive data.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Opt Out.</span> You have the right to opt-out of certain data practices. For example, you can unsubscribe from marketing communications by following the opt-out instructions in each message or by contacting us as outlined in this Privacy Policy (please note that we may still send non-marketing messages, and that consent to receiving marketing   communications is not a condition of using the Service). You may also opt out of the “sale” or “sharing” of your personal information to the extent applicable. Please email as at <a className="underline" href="mailto:contact@phonedarlings.com">contact@phonedarlings.com</a> for assistance. You may opt out of the use of automated decision-making technology if applicable.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Complaints.</span> You have the right to make certain complaints, including for privacy concerns. We value your feedback and seek the opportunity to work with you on any issues. You have the
                  right to no discrimination for asserting your privacy rights.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">Specific State Laws.</span> Several states have enacted privacy laws that may apply to you, depending on the circumstances. For example, the California Consumer Privacy Act (“CCPA”), updated
                  by the California Privacy Rights Act (“CPRA”), governs certain
                  California-related conduct. Under California’s “Shine the Light”
                  law, California residents may also request certain information
                  regarding disclosure of personal information to third parties
                  for their direct marketing purposes. Further, if you are a
                  California resident under the age of 18, California Business &
                  Professions Code Section 22581 permits you to request and obtain
                  removal of content you have publicly posted. Please note that
                  such a request does not ensure complete or comprehensive removal
                  of public content.
                </li>

                <li className="mt-4" style={{ listStyleType: "disc" }}>
                  <span className="font-bold italic">International and Other Laws.</span> Depending on where you live, you may have the right to access your own information that we hold; to ask that your information be corrected, updated, or erased; and the right to object to, or request that we restrict, certain processing of your information. Our legal basis for collecting and using your personal data is your consent, the fulfillment of our obligations pursuant to the contract created between you and us, or where the collection and use is in our legitimate interests and does not violate your data protection interests or fundamental rights. You may withdraw your consent to our collection and use of your personal data. Withdrawing your consent will not affect the lawfulness of any processing we conducted prior to your withdrawal, nor will it affect processing of your information used in reliance on lawful processing grounds other than consent. If certain other privacy laws apply to you that provide you with additional rights, please contact us to make a request. 
                </li>

              </ul>
            </div>
            <div className="pt-2 font-bold">
              Do we collect information about children?{" "}
            </div>
            <div className="pt-2">
              No, we do not knowingly collect any personal information about
              children under the age of 13. If we obtain actual knowledge that
              we have collected such information, we will delete it from our
              database. We have no such information to use or to disclose to
              third parties or to otherwise report, including under the
              Children’s Online Privacy Protection Act (“COPPA”). We do not have
              actual knowledge of selling or sharing the personal information of
              consumers under the age of 16.
            </div>{" "}
            <div className="pt-2 font-bold">
              How do we use or disclose sensitive information?{" "}
            </div>
            <div className="pt-2">
              We do not generally use or disclose sensitive information for
              purposes other than those specified in the CCPA, which provides
              for the following uses without additional disclosures where the
              information is reasonably necessary and proportionate to the use:
              (a) to perform certain services, such as verifying information or
              for analytics; (b) to verify or maintain the quality or safety of
              our Service; (c) to perform services or provide goods reasonably
              expected; (d) for short-term use where there is no disclosure or
              profiling; and (e) to resist malicious, fraudulent, or illegal
              actions or to ensure physical safety.
            </div>
            <div className="pt-2 font-bold">
              Do we offer financial incentives for your data?
            </div>
            <div className="pt-2">
              No, we do not offer incentives related to the collection,
              retention, or sharing of information that may be deemed a
              “financial incentive” or “price or service difference.”
            </div>
            <div className="pt-2 font-bold">
              Do we respond to Do Not Track (DNT) or GPC Signals?
            </div>
            <div className="pt-2">
              No, our Service does not currently respond to DNT requests. DNT is
              a feature that, when enabled, sends a signal to websites to
              request that your browsing is not tracked.
            </div>
            <div className="pt-2 font-bold">
              How do we update this Privacy Policy?
            </div>
            <div className="pt-2">
              We will update this Privacy Policy when our privacy practices
              change or as otherwise required or permitted by law. Each time you
              use the Service, the current version of this Privacy Policy will
              apply. Unless we receive your express consent, any revised Privacy
              Policy will apply only to information collected after the
              effective date of such revised Privacy Policy.
            </div>
            <div className="pt-2 font-bold">How can you contact us? </div>
            <div className="pt-2">
              Please contact us with any questions or concerns! We can be
              reached at:
            </div>
            <div className="pt-2">PD Consultants LLC</div>
            <div>522 W. Riverside Ave, Suite N</div>{" "}
            <div>Spokane, WA 99201</div>
            <div>Email: contact@phonedarlings.com</div>
            <div className="font-bold">Last Updated: May 30, 2023</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
