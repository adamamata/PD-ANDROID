import React, { useEffect } from "react";
import HeaderHome from "../dashboard/commons/headerHome";
import Footer from "../../component/footer";
import heroImage from "../../assets/images/heroImage.png";

function About() {
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
        <h1 className="font-[700] text-[48px] mt-1 text-white">About</h1>
      </div>
      <div className="body-section">
        <div className={`min-h-screen`}>
          <div className="md:block antialiased min-h-screen text-[#000000] lg:px-[150px] md:px-[100px] sm:px-[50px] px-[30px] py-12 max-h-[60%] overflow-y-auto">
            <div className="font-bold">ABOUT US</div>
            <div className="pt-2">
              Welcome to Phone Darlings, your trusted partner in the world of
              adult phone connections. With over two decades of experience in
              the industry, we've heard the voices of countless phone actresses
              and understood their concerns about existing platforms. Their
              feedback has been the driving force behind the creation of Phone
              Darlings, a platform designed with the needs and complaints of our
              users at the forefront.
            </div>
            <div className="pt-2 ">
              In the past, phone actresses have been burdened by outdated
              technology that often resulted in unreliable connections. At Phone
              Darlings, we've made it our mission to change that. We've invested
              in cutting-edge technology to ensure that every call is as clear
              and reliable as possible, so you can focus on what truly matters -
              your conversations.
            </div>{" "}
            <div className="pt-2 ">
              We've also noticed that many platforms lack built-in video
              connection capabilities, a feature that we believe is crucial in
              today's digital age. That's why we've integrated audio, phone,
              one-way and two-way cam, as well as chat functionality directly
              into our platform. This way, you have a variety of ways to connect
              and communicate, all in one place.
            </div>
            <div className="pt-2">
              Moreover, we understand that the financial aspects of using these
              platforms can often be a source of frustration. Some platforms
              charge exorbitant fees, taking as much as 65% of your earnings,
              while others may charge a lower percentage but add on hidden fees
              such as connection charges and pay-for-placement charges. At Phone
              Darlings, we believe in transparency and fairness. We've
              structured our pricing to be competitive and straightforward, with
              no hidden fees or charges.
            </div>{" "}
            <div className="pt-2">
              At Phone Darlings, we're not just another platform - we're a
              community. We're committed to providing a space where phone
              actresses can connect, communicate, and thrive without the common
              hurdles found on other platforms. We're here to support you every
              step of the way, and we can't wait to see what you'll achieve with
              us.
            </div>
            <div className="pt-2">
              Welcome to Phone Darlings - where your voice truly matters
            </div>{" "}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
