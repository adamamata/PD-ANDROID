import React, { useEffect } from "react";
import HeaderHome from "../dashboard/commons/headerHome";
import Footer from "../../component/footer";
import heroImage from "../../assets/images/heroImage.png";

function Static2557() {
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
        <h1 className="font-[700] text-[48px] mt-1 text-white">2557</h1>
      </div>
      <div className="body-section">
        <div className={`min-h-screen`}>
          <div className="md:block antialiased min-h-screen text-[#000000] lg:px-[150px] md:px-[100px] sm:px-[50px] px-[30px] py-12 max-h-[60%] overflow-y-auto">
            <div className="font-bold">2557</div>
            <div className="pt-2 font-bold">
              18 U.S.C. §2257 Disclosure Statement:
            </div>
            <div className="pt-2">
              PD Consultants (“Company”) is not a producer as defined in 18
              U.S.C. §2257 of any of the content found on PhoneDarlings.com (the
              “Website”). Pursuant to 18 U.S.C. §2257(h)(2)(B)(v) and 47 U.S.C.
              230(c), Company reserves the right to delete content posted by
              users which it deems to be indecent, obscene, defamatory, or
              inconsistent with their policies and Terms of Service.
            </div>
            <div className="pt-2 ">
              Company requires all Users who access or use any area of the
              Website to be eighteen (18) years old or older. Further Company
              requires all Users who upload content to certify that they were 18
              years or older on the date the content was created and that they
              keep records if and as required by 18 U.S.C. §2257.
            </div>{" "}
            <div className="pt-2 ">
              Company acts as a technology service to allow Users to share
              information, messages, entertainment services, or other services
              among themselves. With respect to content, Company activities are
              limited to the transmission, storage, retrieval, hosting, and/or
              formatting of depictions posted by Users on areas of the Website
              under the User's control. Company does not evaluate, provide,
              produce, or control the content, information, or exchanges between
              Users, in any manner. Company does not itself provide any content,
              information, entertainment services, or other products or
              services, nor verify, guarantee, or make any representations
              regarding the identity or qualifications of any User. Company does
              not make editorial or managerial decisions concerning User
              content, sexually explicit or otherwise.
            </div>
            <div className="pt-2">
              By using the Website, Users are bound by the Terms of Service and
              agree to follow all applicable federal, state and local laws,
              regulations, and ordinances relating to obscene and indecent
              content, communications, and record-keeping obligations.
            </div>{" "}
            <div className="pt-2">
              Users are solely responsible for the content provided under their
              Account and for ensuring that they are in compliance with all
              applicable laws and regulations, including but not limited to
              providing certain record location information under Title 18
              U.S.C. §2257 and 28 C.F.R. §75, et seq., and corresponding
              regulations where applicable. Please direct all §2257 record
              requests directly to the respective User who has uploaded the
              Content.
            </div>
            <div className="pt-2">
              For assistance regarding the above, please contact
              contact@phonedarlings.com.
            </div>{" "}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Static2557;
