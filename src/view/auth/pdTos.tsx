import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderHome from "../dashboard/commons/headerHome";
import Footer from "../../component/footer";
import heroImage from "../../assets/images/heroImage.png";

function TeamCondtion() {
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
          Terms of Service
        </h1>
      </div>
      <div className="body-section">
        <div className={`min-h-screen`}>
          <div className="md:block antialiased min-h-screen text-[#000000] px-[150px] py-12 max-h-[60%] overflow-y-automd:block antialiased min-h-screen text-[#000000] lg:px-[150px] md:px-[100px] sm:px-[50px] px-[30px] py-12 max-h-[60%] overflow-y-auto">
            <div className="font-bold">TERMS OF SERVICE </div>
            <div className="pt-2">
              Welcome to PhoneDarlings.com (the
              <span className="font-bold">"Website"</span>)! These Terms of
              Service (<span className="font-bold">"Terms"</span>), together
              with our &nbsp;
              <span>
                <a className="underline text-[#0000FF]" href="/legal/PP">
                  Privacy Policy
                </a>
              </span>
              , and all other terms and policies available and agreed to on the
              Platform, which are incorporated herein by reference, constitute a
              written contract (the "Agreement") between you and PD Consultants
              LLC (<span className="font-bold">"Company," "we," "our,"</span>{" "}
              or&nbsp;
              <span className="font-bold">"us"</span>) governing your use of the
              Website and any related websites, applications, platforms, or
              anywhere these Terms appear or are linked (collectively, the&nbsp;
              <span className="font-bold">"Platform"</span>). By accessing the
              Website, creating an account, or by utilizing the Platform you
              agree to be bound by the Agreement.
            </div>
            <div className="pt-2">
              By using the Platform, you represent that you are authorized to
              enter into and consent to this Agreement and that you are <span className="font-bold underline">at least 18 years old</span> or the age of majority in your location. All references to "you" or "your", as applicable, mean the person who
              accesses, uses, and/or participates in the Platform in any manner.
              If you use the Platform on behalf of an entity, you represent and
              warrant that you have the authority to bind that entity, your
              acceptance of the Terms will be deemed an acceptance by that
              entity, and "you" and "your" herein will refer to that entity, its
              directors, officers, employees, and agents.
            </div>
            <div className="pt-2 font-bold">
              These Terms contain provisions that require the use of arbitration
              on an individual basis to resolve disputes, rather than jury
              trials or class actions, and also limit the remedies available to
              you in the event of a dispute. See Section 14 for full details.
            </div>
            <div className="pt-3 font-bold">1. PRIVACY POLICY</div>
            <div className="pt-2 ">
              We take your privacy very seriously; as such, our&nbsp;
              <span>
                <a className="underline text-[#0000FF]" href="/legal/PP">
                  Privacy Policy
                </a>
              </span>
              &nbsp;is an important part of and incorporated by reference into
              this Agreement. The Privacy Policy explains how we collect
              information from you and how we use and share that information to
              provide our Platform.
            </div>
            <div className="pt-2 font-bold">2. KEY TERMS</div>
            <div className="pt-2">
              "Actress" means a User who uses, or is registered to use, the
              Platform to offer, provide, receive payment for, or facilitate the
              provision of services to Clients.
            </div>
            <div className="pt-2">
              "Actress Services" means any information, entertainment services,
              and other services you may receive from Actresses or their
              listings on the Platform.
            </div>
            <div className="pt-2">
              "Content" means written text, graphics, digital photographs,
              images, music, software, audio, video, information, or other
              materials, including but not limited to profile information,
              requests, message threads, reviews, and other information or
              materials available on or through the Platform whether uploaded by
              an Actress or Client.
            </div>
            <div className="pt-2">
              "Client" means a User who registers to use the Platform to
              communicate with Actresses, or otherwise uses the Platform in
              order to receive, pay for, or facilitate the receipt of services
              from an Actress, under the policies, terms and conditions below.
            </div>
            <div className="pt-2">
              "User" means a person or entity who completes Company's account
              registration process, agrees to these Terms, utilizes any services
              offered by or through the Platform, or a person or entity who
              submits or receives a request through Company, including but not
              limited to Actresses and Clients (also referred to as "you" or
              "your").
            </div>
            <div className="pt-2 font-bold">3. ABOUT THE WEBSITE</div>
            <div className="pt-2">
              The Platform is provided for entertainment purposes only. Company
              does not evaluate, provide, produce, or control Actress Services,
              Content, information, data, advertising, products, goods, or
              services posted or exchanged by Users through the Platform.
              Company does not itself provide any information, entertainment
              services or other products or services, nor verify, guarantee, or
              make any representations regarding the identity or qualifications
              of any User. Further, Company does not make editorial or
              managerial decisions concerning Content, sexually explicit or
              otherwise, except that Company reserves its right to act as
              specified in Section 512 of Title 17 and Section 230(c)(2)(A) of
              Title 47 of the United States Code and to determine at any time,
              in its sole discretion, whether and to what extent to do so.
            </div>
            <div className="pt-2">
              Company will not be held responsible for any Actress's failure to
              comply with laws or regulations concerning the content of listings
              or activity on the Platform. Instead, Company acts solely as a
              technology service that allows Users to share information,
              entertainment services, or other products or services among
              themselves. Although Company helps its Users connect with each
              other, it does not monitor the information exchanged, and, as a
              result, Company does not control, nor is responsible for, the
              accuracy, safety, quality, appropriateness, legality, or
              applicability of anything said or written by Users, including
              without limitation any information contained in Actress listings
              or made available through this Platform. The Platform is not
              intended for use as a payment service to exchange physical goods.
              Company is not responsible for use or exchange of any information,
              files or goods between Users. You are solely responsible for, and
              will exercise caution, discretion, common sense, and judgment in,
              using the Platform and Actress Services, in evaluating the
              qualifications of, and statements made by, Users, and in
              disclosing personal information to other Users.
            </div>
            <div className="pt-2">
              You agree that Company shall not be responsible or liable,
              directly or indirectly, for any loss or damage of any sort
              incurred as the result of any such dealings or as the result of
              the presence of such third parties or Actress on the Website
              and/or the Platform.
            </div>
            <div className="pt-2 font-bold">
              Under Section 230 of the Communications Decency Act and similar
              laws, Company is a platform service and not the publisher or
              speaker of any third-party content, including User profiles.
            </div>
            <div className="pt-2 font-bold">4. ELIGIBILITY</div>
            <div className="pt-2">
              To use our Platform, you must first create a User Account. You
              must be at least eighteen (18) years old to create an Account (as
              defined below) and use the Platform. You must provide a valid
              email address, a username, and a password. If you are signing up
              to use the Platform as an Actress, you must provide us with a copy
              of a valid government ID. By creating an Account and using the
              Platform, you represent and warrant that:
            </div>
            <div className="pt-2">
              <ul className="ml-6">
                <li style={{ listStyleType: "disc" }}>
                  You are at least eighteen (18) years of age.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  You can enter into and form a binding contract with Company.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  You are not located in a country that is subject to a U.S.
                  Government embargo, or that has been designated by the U.S.
                  Government as a "terrorist supporting" country. Such countries
                  include, without limitation, Belarus, Myanmar (Burma), Cuba,
                  Iran, Iraq, Russia, North Korea, Sudan, and Syria. In
                  addition, Company does not allow organizations, businesses, or
                  individuals on the Specially Designated Nationals list (SDN)
                  to use the Platform.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  You are not on any list of individuals prohibited from
                  conducting business with the United States.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  You are not prohibited by law from using our Platform.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  You have not previously been removed from our Platform by us
                  unless you have our express written permission to create a new
                  Account.
                </li>
                <li style={{ listStyleType: "disc" }}>
                  You will comply with this Agreement and all applicable local, state, national and international laws, rules, and regulations.
                </li>
              </ul>
            </div>
            <div className="pt-2">
              If at any time you cease to meet these requirements, you must
              immediately cease use of the Platform and delete your Account.
            </div>
            <div className="pt-2">
              You understand that the Website is an adult service, and you must
              have a legal right to access adult material and are voluntarily
              choosing to use the Platform. You further represent that you are
              not required to register as a sex offender with any government
              entity. Company does not conduct criminal background checks on or
              screenings of its Users but reserves the right to conduct any
              criminal background check or screening at any time. You shall not
              use the Actress Services, Content, or any other portion of this
              Platform in any manner which is illegal under the law applying to
              you, nor shall you request, offer, agree to, or engage in any
              activity involving child pornography, human trafficking, or
              unlawful prostitution.
            </div>
            <div className="pt-2">
              Using the Platform may be prohibited or restricted in certain
              countries. If you use the Platform outside of the United States,
              you are responsible for complying with the laws and regulations of
              the territory from which you access or use the Platform or Actress
              Services. You shall not use the Platform if you are located or
              reside in a country (i) in which use, or participation is
              prohibited by law, decree, regulation, treaty, or administrative
              act or (ii) is prohibited from entering into trade relations with
              the United States or its citizens.
            </div>
            <div className="pt-2 font-bold">5. LICENSE</div>
            <div className="pt-2">
              Subject to your compliance with this Agreement, Company grants you
              a non-exclusive, non-sublicensable, revocable, non-transferable
              limited license to access the Platform, and to use the Platform,
              in the manner intended by the Platform for your personal use. This
              license allows you to use the Platform, but it does not allow you
              to reproduce, duplicate, copy, modify, sell, or otherwise exploit
              any portion of the Platform without the prior express written
              consent of Company. All rights not expressly granted in this
              Agreement are reserved by Company. Without limitation, this
              Agreement grants you no rights to the intellectual property of
              Company or any other party, except as expressly stated in this
              Agreement. The license granted in this section is conditioned on
              your compliance with this Agreement. Your rights under this
              section will immediately terminate if, in the sole judgement of
              Company, you have breached any provision of this Agreement.
            </div>
            <div className="pt-2 font-bold">6.YOUR USE OF THE PLATFORM </div>
            <div className="pt-2 font-bold underline">Your Account </div>
            <div className="pt-2">
              To access and use certain parts of the Platform, you must create
              an account and profile (collectively, your&nbsp;
              <span className="font-bold">"Account"</span>). You
              represent and warrant that all information you provide in
              connection with your Account and your use of the Platform is
              current, complete, and accurate, and that you will update the
              information as necessary to keep it accurate. You further
              represent and warrant that you are not impersonating any person or
              entity through your Account, or misleading other Users as to your
              affiliation with any person or entity. You are responsible for
              maintaining the confidentiality of your Account credentials,
              including your username and password. You agree to notify Company
              immediately at contact@phonedarlings.com if you suspect any
              unauthorized use of your Account. We reserve the right, at any
              time and in our sole discretion, to: (a) refuse to grant you
              access to the Platform, (b) remove your profile from the Platform,
              (c) terminate your Account, or (d) suspend or terminate your right
              to use the Platform.
            </div>
            <div className="pt-2 font-bold underline">Actress Requirements</div>
            <div className="pt-2">
              As an Actress providing Actress Services you must create and
              maintain records, label your Content, and permit inspections as
              required by law (e.g. 18 U.S.C. §§ 2257, 2257A; 28 C.F.R. Part
              75), and you will not fail to provide the Platform with true and
              complete information in connection with your compliance, including
              information about the records custodian and maintenance address
              required on labels by law upon request (18 U.S.C. §§ 2257(e),
              2257A(e); 28 C.F.R. § 75.6).
            </div>
            <div className="pt-2 font-bold underline">
              Exchange of Information
            </div>
            <div className="pt-2">
              Our Platform allows you to freely communicate with Users,
              including via text/chatting, direct connect audio, video, and
              phone, and depends on Users keeping&nbsp;
              <span className="font-bold">"Private Information" </span>&nbsp;in
              strict confidence. "Private Information" includes any private or
              confidential information about Users of the Platform, whether
              yourself or a third party, including video communications, photos,
              unlisted contact information (e.g., phone numbers, email
              addresses, physical addresses), financial information, location
              information, login or other credentials, and other identifying or
              protected information. You should be careful of sharing any
              Private Information and should not share any Private Information
              that you do not want to be public.
            </div>
            <div className="pt-2 font-bold">
              <span className="underline">To facilitate open and comfortable communication between our
                Users</span>, <span className="underline">you agree that you will keep any Private Information
                  obtained</span>, <span className="underline">including any messages</span>, <span className="underline">texts</span>, <span className="underline">and video communications</span>,
              <span className="underline">strictly confidential</span>. Further, you should not share any details
              about any other Users, including related to their name and
              identity, or any user profile information, with any third party
              without the disclosing User’s express written consent.
            </div>
            <div className="pt-2">
              To ensure the best User experience, we ask that our users be
              respectful of each other’s privacy. You agree that your violation
              of these prohibitions will cause irreparably injury to our
              Platform and to the disclosing User(s).&nbsp;
              <span className="font-bold">
                If we receive complaints or determine, in our sole discretion,
                that you are disclosing other Users’ Private Information, we
                reserve the right to immediately terminate your Account, without
                limiting any other available remedies.
              </span>
            </div>
            <div className="pt-2 font-bold underline">Common Sense </div>
            <div className="pt-2">
              You agree to use common sense and assume all responsibility for
              your communications with other Users that are initiated through
              the Platform. As with any internet-based service that allows you
              to communicate with persons previously unknown to you, you should
              use caution in disclosing personal information about yourself,
              including your full name, address, details about your finances or
              family, photos, and so forth.
            </div>
            <div className="pt-2 font-bold underline">Your Content </div>
            <div className="pt-2">
              As a User, you will have the ability to post information, images,
              and photos to your Account profile; you will also have the ability
              to transmit messages, and communicate via SMS/text, phone calls,
              video calls, and email within the Platform. You agree that you are
              solely responsible for your Content and represent and warrant that
              all Content posted by you is current, complete, and accurate, and
              that you have not misstated or embellished any statement of fact
              therein. You are required to use common sense and are prohibited
              from posting any Content that infringes on the intellectual
              property rights of others, is illegal, obscene, threatening,
              defamatory, invades the privacy of others (e.g., doxing), contains
              a commercial solicitation or other form of "spam" messages, or
              otherwise violates our Prohibited Conduct section. You understand
              and agree that we may, but are not obligated to, monitor or review
              Content, but under no circumstances will Company be liable in any
              way for your Content. If you post inappropriate Content or
              otherwise violate the Prohibited Conduct section, we may, in our
              sole discretion, remove your Content or terminate your Account and
              access to the Platform. Under certain limited circumstances we
              may, in our sole and absolute discretion, report your Content to
              relevant legal authorities if we believe it violates any law.
            </div>
            <div className="pt-2">
              By posting and uploading Content, you expressly promise, assure,
              and warrant to Company that you have all legally required
              intellectual property rights (including any necessary copyright
              clearances, trademark licenses, and publicity and privacy
              releases) and maintain all records (as required by Sections
              2257/2257A of Title 18 of the US Code) necessary for you to post
              or sell all Content which you upload, advertise, place for sale,
              or otherwise market through the Platform; and you further warrant
              to Company (notwithstanding any limitation of warranty as to your
              ultimate purchasers) that any such Content is merchantable and
              lawful for you to sell to each of your ultimate purchasers.
              Further, you agree that none of the Content which you upload,
              advertise, place for sale, or otherwise market through the
              Platform will depict any children or will depict any adults who
              have not consented to the acts in which they are engaging or who
              have not consented to the dissemination of their images and
              likenesses in the form depicted. Upon request, you must provide to
              Company written consent for the public distribution and download
              of the Content from all parties depicted and a copy of a valid
              government issued identification of all models (as required by
              Sections 2257/2257A of Title 18 of the US Code).
            </div>
            <div className="pt-2 ml-4">
              <p className="underline py-2">License to Display Your Content</p>
              <span className="font-bold">
                You are always the owner of your Content;&nbsp;
              </span>
              however, we require the following license from you to display your
              Content on the Platform as expressly permitted by you.
              <br />
              You hereby grant Company an irrevocable, perpetual, non-exclusive,
              transferable, royalty-free, worldwide license (with the right to
              sublicense) to use, reproduce, modify, adapt, publish, perform,
              translate, create derivative works from, distribute and display
              your Content throughout the world in any media now existing or in
              the future created. Additionally, you grant Company the right to
              use your name, likeness, and image for any purpose, including
              commercial or advertising, on or in connection with Company or the
              promotion thereof.
              <br />
              You represent and warrant that you have all rights and permissions
              to grant the foregoing licenses.
              <p className="underline py-2">Indemnification </p>
              You are responsible for your Content and, as such, you agree to
              defend, indemnify, and hold harmless Company from and against any
              and all claims, actions, demands, causes of action, and other
              proceedings including but not limited to legal costs and
              attorneys’ fees, arising out of or relating to your Content.
            </div>
            <div className="pt-2 font-bold underline">Other Users’ Content</div>
            <div className="pt-2">
              Other Users will also share Content on our Platform. Other Users’
              Content belongs to the User who posted the Content and is stored
              on our servers and displayed at the direction of that User. You do
              not have any rights in relation to other Users’ Content. You may
              not copy other Users’ Content or use other Users’ Content for
              commercial purposes, to spam, to harass, or to make unlawful
              threats. We reserve the right to terminate your Account and access
              to the Platform if you misuse other Users’ Content.
            </div>
            <div className="pt-2 font-bold underline">
              DMCA Takedown Requests
            </div>
            <div className="pt-2">
              Company respects the intellectual property rights of others. We
              follow the notice and takedown procedures in the Digital
              Millennium Copyright Act{" "}
              <span className="font-bold">("DMCA")</span>. Additionally, we will
              terminate the accounts of repeat infringers in appropriate
              circumstances.
            </div>{" "}
            <div className="pt-2">
              If you believe Content located on or linked to the Platform
              violates your copyright, please immediately notify us by emailing
              us a DMCA takedown notice{" "}
              <span className="font-bold">("Infringement Notice")</span>,
              providing the information described below. If we act in response
              to an Infringement Notice, we will make a good faith attempt to
              contact the person or entity who made the Content available at the
              most recent email address they provided to us.
            </div>
            <div className="pt-2">
              Under the DMCA, you may be held liable for damages based on
              material misrepresentations in your Infringement Notice. You must
              also make a good-faith evaluation of whether the use of your
              content is a fair use; fair uses are not infringing. If you are
              not sure if Content located on or linked to by the Platform
              infringes your copyright, you should first contact an attorney.
            </div>
            <div className="pt-2">
              The DMCA requires that all Infringement Notices must include the
              following:
              <div className="ml-4">
                (a) a signature, electronic or physical, of the copyright owner
                or a person authorized to act on their behalf; <br />
                (b) an identification of the copyright claimed to have been
                infringed; <br />
                (c) a description of the nature and location of the material
                that you claim to infringe your copyright, in sufficient detail
                to permit Company to find and positively identify that material;
                <br />
                (d) your name, address, telephone number, and email address; and
                <br />
                (e) a statement by you: (i) that you believe in good faith that
                the use of the material that you claim to infringe your
                copyright is not authorized by law, or by the copyright owner or
                such owner's agent; and, (ii) under penalty of perjury, that all
                of the information contained in your Infringement Notice is
                accurate, and that you are either the copyright owner or a
                person authorized to act on their behalf.
              </div>
            </div>
            <div className="pt-2">
              Infringement Notices should be sent to contact@phonedarlings.com
              with the subject line "DMCA Notice." Company will respond to all
              DMCA-compliant Infringement Notices, including, as required or
              appropriate, by removing the offending material or disabling all
              links to the offending material.
            </div>
            <div className="pt-2 font-bold underline">Prohibited Conduct </div>
            <div className="pt-2">
              Company imposes certain restrictions on your use of the Platform.
              By using or accessing the Platform, you represent, warrant, and
              agree that you will not: <br />
              <div className="ml-4">
                <ul className="ml-6">
                  <li style={{ listStyleType: "lower-roman" }}>
                    provide any false, misleading, or inaccurate information,
                    transfer your Account, create an Account for anyone other
                    than yourself (unless you have been authorized to create an
                    Account on behalf of that person); 
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    do anything that could disable, overburden or impair the
                    proper working order of the Platform; 
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    attempt to probe, scan, or test the vulnerability of the
                    Platform, or any associated system or network, or breaching
                    security or authentication measures without proper
                    authorization;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    use any robot, spider, scraper or other automated means to
                    access the Platform;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    send spam or any other unauthorized advertisements or
                    solicitations through or using the Platform;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    harvest or otherwise collect or use information about users,
                    including addresses, phone numbers or email addresses;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    solicit private information (including social security
                    numbers, credit card numbers and passwords) from Users;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    intimidate, bully, stalk, assault, harass, mistreat or
                    defame any Users;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    post any Content that is considered hate speech, promotes or
                    suggests human trafficking, threatening, sexually explicit
                    or pornographic materials involving persons under the age of
                    18, incites violence, or contains graphic or gratuitous
                    violence;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    post any Content that promotes racism, bigotry, hatred or
                    physical harm of any kind against any group or individual;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    do anything that is illegal, infringing, fraudulent,
                    malicious or could expose us or Users to harm or liability;
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    create another Account if we have already terminated your
                    Account, unless you have Company’s prior permission; or
                  </li>
                  <li style={{ listStyleType: "lower-roman" }}>
                    attempt, encourage or facilitate any of the above.
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-2">
              Company reserves the right to investigate and/or terminate your
              Account without a refund of any purchases if you have violated
              this Agreement, misused the Platform or behaved in a way that we
              regard, in our sole discretion, as inappropriate or unlawful,
              including actions or communications that occur on or off the
              Platform.&nbsp;
              <span className="font-bold">
                We have a zero-tolerance policy regarding the posting of Content
                that depicts child pornography, incites violence, promotes or
                suggests human trafficking, or contains graphic and gratuitous
                violence. If we determine, in our sole discretion, that you have
                posted/shared Content that violates this section, we will
                immediately terminate your Account and if necessary, report your
                Content to the relevant legal authority.
              </span>
            </div>
            <div className="pt-2">
              To report violations of Prohibited Conduct to Company, you may
              contact us at contact@phonedarlings.com.
            </div>
            <div className="pt-2 font-bold">7.PROHIBITED CONTENT </div>
            <div className="pt-2">
              You agree that you shall not use the Platform to upload, post,
              transmit, display, perform, or distribute any Content,
              information, or materials that: (a) are libelous, defamatory,
              abusive, threatening, excessively violent, harassing, obscene,
              lewd, lascivious, or filthy; (b) constitute child pornography; (c)
              solicit personal information from or exploit in a sexual or
              violent manner anyone under the age of 18; (d) incite, encourage,
              or threaten physical harm against another; (e) promote or glorify
              racial intolerance, use hateful and/or racist terms, or signify
              hate toward any person or group of people; (f) glamorize the use
              of illegal substances and/or drugs; (g) advertise or otherwise
              solicit funds or constitute a solicitation for goods or services;
              (h) violate any provision of this Agreement or any other Company
              agreement or policy, including without limitation Company’s
              Privacy Policy; (i) disclose another’s personal, confidential, or
              proprietary information; (j) are false or fraudulent; (k) contains
              images or videos of individuals captured or posted without their
              consent; (l) promote self-destructive behavior (including without
              limitation eating disorders or suicide); (m) infringe on the
              copyright or other intellectual property, rights of publication,
              or other rights of a third party; or (n) are generally offensive,
              rude, mean-spirited, or in bad taste, as determined by Company in
              its sole discretion (collectively,&nbsp;
              <span className="font-bold">"Objectionable Content"</span>).
              Company disclaims any perceived, implied, or actual duty to
              monitor content made available through the Platform, and
              specifically disclaims any responsibility or liability for
              information provided on the Platform. Without limiting any of its
              other remedies, Company reserves the right to terminate your use
              of the Platform or your uploading, posting, transmission, display,
              performance, or distribution of Objectionable Content. Company, in
              its sole discretion, may delete any Objectionable Content from its
              servers. Company intends to cooperate fully with any law
              enforcement officials or agencies in the investigation of any
              violation of this Agreement or of any applicable laws.
            </div>
            <div className="pt-2 font-bold underline">
              Your Responsibility for Your Defamatory or Infringing Content
            </div>
            <div className="pt-2">
              You agree and understand that you may be held legally responsible
              for damages suffered by other Users or third parties as the result
              of your remarks, information, feedback, or other Content posted or
              made available through the Platform that is deemed defamatory,
              infringing of another’s intellectual property rights, or otherwise
              legally actionable. Under Section 230 of the Federal
              Communications Decency Act of 1996, Company is not legally
              responsible, nor can it be held liable for damages of any kind,
              arising out of or in connection to any defamatory or otherwise
              legally actionable remarks, information, feedback, or other
              content posted or made available through the Platform.
            </div>
            <div className="pt-2">
              To report violations of Objectional Content to Company, you may
              contact us at contact@phonedarlings.com.
            </div>
            <div className="pt-2 font-bold">
              8.OUR RIGHTS AND RESPONSIBILITIES
            </div>
            <p className="font-bold underline">
              Suspension and Termination of Accounts
            </p>
            <div className="pt-2">
              <div className="ml-4">
                <ul className="ml-2">
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We can, but we are not obligated to, moderate or review any
                    of your Content to verify compliance with the Terms of
                    Service and/or any applicable law.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    It is our policy to suspend access to any Content you post
                    on the Platform which we become aware may not comply with
                    the Terms of Service and/or any applicable law whilst we
                    investigate the suspected non-compliance or unlawfulness of
                    such Content. If we suspend access to any of your Content,
                    you may request a review of our decision to suspend access
                    to the relevant Content by contacting us at
                    contact@phonedarlings.com. Following our investigation of
                    the suspected non-compliance or unlawfulness of the relevant
                    Content, we may take any action we consider appropriate,
                    including to reinstate access to the Content or to
                    permanently remove or disable access to the relevant Content
                    without needing to obtain any consent from you and without
                    giving you prior notice. You agree that you will at your own
                    cost promptly provide to us all reasonable assistance
                    (including by providing us with copies of any information
                    which we request) in our investigation. We will not be
                    responsible for any loss suffered by you arising from the
                    suspension of access to your Content or any other steps
                    which we take in good faith to investigate any suspected
                    non-compliance or unlawfulness of your Content under this
                    section.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    If we suspend access to or delete any of your Content, we
                    are not obligated to give you prior notice of such removal
                    or suspension.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We reserve the right in our sole discretion to terminate
                    your agreement with us and your access to the Platform for
                    any reason. We can also suspend access to your Account or
                    terminate your agreement with us and your access to the
                    Platform immediately and without prior notice:
                    <ul className="ml-9">
                      <li
                        style={{
                          listStyleType: "lower-alpha"
                        }}
                      >
                        if we think that you have or may have seriously or
                        repeatedly breached any part of the Terms of Service, or
                        if you attempt or threaten to breach any part of the
                        Terms of Service in a way which has or could have
                        serious consequences for us or another User; or
                      </li>
                      <li
                        style={{
                          listStyleType: "lower-alpha"
                        }}
                      >
                        if you take any action that in our opinion has caused or
                        is reasonably likely to cause us to suffer a loss or
                        that otherwise harms the reputation of Company.
                      </li>
                    </ul>
                    If you are an Actress, and we suspend access to your Account
                    or terminate your agreement with us and your access to the
                    Platform, we can do so without prior notice. During any
                    period when access to your Account is suspended, we may
                    withhold all or any part of the Earnings due to you but not
                    yet paid out in accordance with Section 9.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    Upon termination of your Account, we may deal with your
                    Content in any appropriate manner in accordance with our
                    Privacy Policy (including by deleting it) and you will no
                    longer be entitled to access your Content. There is no
                    technical facility on the Platform for you to be able to
                    access your Content following termination of your Account.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We can investigate any suspected or alleged misuse, abuse,
                    or unlawful use of the Platform and cooperate with law
                    enforcement agencies in such investigation.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We can disclose any information or records in our possession
                    or control about your use of the Platform to law enforcement
                    agencies in connection with any law enforcement
                    investigation of any suspected or alleged illegal activity,
                    to protect our rights or legal interests, or in response to
                    legal process.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We can change the third-party payment providers used to
                    process payments on the Platform.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    Other than Content (which is owned by or licensed to Users),
                    all rights in and to the Platform and its entire contents,
                    features, databases, source code and functionality, are
                    owned by Company and/or our licensors. Such material is
                    protected by copyright, and may be protected by trademark,
                    trade secret, and other intellectual property laws.
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-2 font-bold underline">Our Responsibilities</div>
            <div className="pt-2">
              We will use reasonable care and skill in providing the Platform to
              you, but there are certain things which we are not responsible
              for, as follows:
              <div className="ml-4">
                <ul className="ml-6">
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We do not authorize or approve Content on the Platform, and
                    we do not monitor or record messages/calls between Users.
                    Views expressed by Users on the Platform do not necessarily
                    represent our views
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We do not grant you any rights in relation to Content that
                    does not belong to you. Any such rights may only be granted
                    to you by the User that the Content belongs to.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    Your Content may be viewed by individuals that recognize
                    your identity. We will not in any way be responsible to you
                    if you are identified from your Content. While we may, from
                    time to time and in our sole discretion, offer certain
                    geofencing or geolocation technology on the Platform, you
                    understand and agree that we do not guarantee the accuracy
                    or effectiveness of such technology, and you will have no
                    claim against us arising from your use of or reliance upon
                    any geofencing or geolocation technology.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    All Content is created, selected, and provided by Users and
                    not by us. We are not responsible for reviewing or
                    moderating Content, and we do not select or modify the
                    Content that is stored or transmitted via the Platform. We
                    are under no obligation to monitor Content or to detect
                    breaches of the Terms of Service.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We make no promises or guarantees of any kind that Actresses
                    will make a particular sum of money (or any money) from
                    their use of the Platform.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    The materials which we make accessible on the Platform for
                    Users are for general entertainment purposes only. We make
                    no promises or guarantees about the accuracy or otherwise of
                    such materials, or that Users will achieve any particular
                    result or outcome from using such materials.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We do not promise that the Platform is compatible with all
                    devices and operating systems. You are responsible for
                    configuring your information technology, device, and
                    computer programs to access Platform. You should use your
                    own virus protection software.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We are not responsible for the availability of the internet,
                    or any errors in your connections, device or other
                    equipment, or software that may occur in relation to your
                    use of the Platform.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    While we try to make sure that the Platform is secure and
                    free from bugs and viruses, we cannot promise that it will
                    be and have no control over the Content that is supplied by
                    Users.{" "}
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    We are not responsible for any lost, stolen, or compromised
                    User accounts, passwords, email accounts, or any resulting
                    unauthorized activities or resulting unauthorized payments
                    or withdrawals of funds.
                  </li>
                  <li style={{ listStyleType: "lower-alpha" }}>
                    You acknowledge that once your Content is posted on the
                    Platform, we cannot control and will not be responsible to
                    you for the use which other Users or third parties make of
                    such Content. You can delete your Account at any time, but
                    you acknowledge that deleting your Account will not of
                    itself prevent the circulation of any of your Content which
                    may have been recorded by other Users in breach of the Terms
                    of Service or by third parties prior to the deletion of your
                    Account.
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-2 font-bold">9. PAYMENTS </div>
            <p className="font-bold underline pt-2">Payments by Clients</p>
            <div className="pt-2">
              You agree to pay Company all fees associated with your use of the
              Platform (<span className="font-bold">"Client Fees"</span>), as
              indicated to you at the time you agree to such Client Fees (such
              as through the account registration or checkout process). All
              transmissions of payment information through the Platform are
              secured with Internet-standard TLS (also known as HTTPS)
              encryption. Company does not verify account information, process
              any payments or store your billing information itself; instead,
              these services are provided through the Platform by Company’s
              trusted Third Party&nbsp;
              <span className="font-bold">"Payment Processors,"</span> &nbsp;and
              you may be redirected to Third Party Websites (as defined below)
              and/or required to agree to separate Third Party terms in order to
              complete your payment transaction.
            </div>
            <div className="pt-2">
              <span className="font-bold underline">No Refunds.</span>&nbsp; Due
              to the nature of the Platform, unless otherwise indicated at your
              time of checkout or in this Agreement, or as otherwise required by
              law,&nbsp;
              <span className="font-bold">
                &nbsp;ALL SALES ARE FINAL AND THERE ARE NO REFUNDS.
              </span>
            </div>
            <div className="pt-2 font-bold underline">
              Fees, Earnings, and Payouts for Actresses
            </div>
            <div className="ml-4 pt-2">
              <ul className="ml-5">
                <li style={{ listStyleType: "lower-alpha" }}>
                  <span className="underline">Actress Fees and Earnings.</span>
                  &nbsp; Company charges a fee of twenty five percent (25%) of
                  all Client payments made to you (hereinafter the
                  <span className="font-bold">"Company Fee"</span>). The
                  remaining seventy five percent (75%) of the Client payment is
                  payable to you (hereinafter the&nbsp;
                  <span className="font-bold">"Earnings"</span>). The Company
                  Fee includes the costs of providing, maintaining, and
                  operating the Platform and storing your Content. The Company
                  Fee is deducted from the Client payment, and Earnings are paid
                  to you as described in the section below.
                </li>
                <li style={{ listStyleType: "lower-alpha" }}>
                  <span className="underline">Actress Payouts.</span>&nbsp;All Client payments will be received by a third-party payment provider approved by us. In order to receive a payout of your Earnings, you must have a minimum balance of $100 USD of accrued Earnings. The method of transfer of earnings from Company to you is at Companies sole discretion. Additionally, you will need to provide Company with certain banking information so that the transfer of Earnings can be completed. Once you start accruing Earnings, your Account will be updated within a reasonable time to reflect your Earnings. Company will pay out Earnings twice a month, on the first and sixteenth of each month.
                </li>
                <li style={{ listStyleType: "lower-alpha" }}>
                  <span className="underline">Taxes and Fees.</span>&nbsp; You will be responsible for paying all relevant taxes on your Earnings. Company will not be responsible for withholding any taxes from your Earnings.  <span className="underline">Payment of taxes on your Earnings is your responsibility.</span> Your bank may charge you currency conversion or transfer fees to receive your Earnings. We do not have control over currency exchange rates or charges imposed by your bank, and we are not responsible for paying any charges imposed by your bank.
                </li>
                <li style={{ listStyleType: "lower-alpha" }}>
                  <span className="underline">Withholding Earnings.</span>&nbsp;
                  We may withhold all or any part of your Earnings due to you
                  but not yet paid out:
                  <ul className="ml-8">
                    <li style={{ listStyleType: "lower-roman" }}>
                      if we think that you have or may have seriously or
                      repeatedly breached any part of these Terms of Service;
                    </li>
                    <li style={{ listStyleType: "lower-roman" }}>
                      if you attempt or threaten to breach any part of these
                      Terms of Service in a way which we think has or could have
                      serious consequences for us or another User;
                    </li>
                    <li style={{ listStyleType: "lower-roman" }}>
                      if we suspect that all or any part of the Earnings result
                      from unlawful or fraudulent activity, either by you or the
                      Client who made the Client payment resulting in the
                      Earnings,
                    </li>
                  </ul>
                  for as long as is necessary to investigate the actual,
                  threatened, or suspected breach by you or the suspected
                  unlawful activity (as applicable). If, following our
                  investigation, we conclude that you have violated any of the
                  above (i)-(iii), we may notify you that you have forfeited
                  your Earnings. We shall not have any responsibility to you if
                  we withhold or forfeit any of your Earnings where we have a
                  right to do so under these Terms of Service.
                </li>
              </ul>
            </div>
            <div className="pt-2 font-bold">10. ELECTRONIC COMMUNICATIONS </div>
            <div className="pt-2">
              <span className="underline font-bold">
                Consent to Receive Electronic Communications from Company.
              </span>
              &nbsp;Without limitation, by registering for the Platform and/or
              creating an Account and providing your name, email, postal or
              residential address, and/or phone number through our website, you
              hereby expressly consent to receive electronic and other
              communications from Company, over the short term and periodically,
              including email and push notifications regarding the Platform, new
              product offers, promotions, and other matters. You may opt out of
              receiving electronic communications at any time by (a) following
              the unsubscribe instructions contained in each communication; or
              (b) sending an email to contact@phonedarlings.com. Where required
              by law, we will provide you an additional, express opportunity to
              opt-in to receive messages.
            </div>
            <div className="pt-2">
              <span className="font-bold underline">
                Consent to Receive Electronic Communications from Users.
              </span>
              &nbsp;Without limitation, by registering for the Platform and
              providing your name, email, postal or residential address, and/or
              phone number through the Platform, you hereby consent to receive
              electronic communications, including email, push notifications,
              instant messages, video messages, and other personal messages from
              Actresses or Clients (depending on your role as a user of the
              Platform). For more information, see our Privacy Policy.
            </div>
            <div className="pt-2 font-bold">
              11.THIRD-PARTY CONTENT AND SERVICES
            </div>
            <div className="pt-2 font-bold underline">Third Party Content </div>
            <div className="pt-2">
              Opinions, advice, statements, or other information made available
              through the Platform by third parties (
              <span className="font-bold">"third party information"</span>),
              should not necessarily be relied upon. We do not guarantee the
              accuracy, completeness, or usefulness of any third-party
              information accessible on or through the Platform and will not be
              responsible for any loss or damage resulting from your reliance on
              third-party information.
            </div>
            <div className="pt-2">
              We are not responsible or liable for, and do not approve or
              endorse any third-party information, content, materials, websites,
              or applications made available on the Platform
              (collectively,&nbsp;
              <span className="font-bold">"third party materials"</span>).
              Without limiting the foregoing, we are not responsible for the
              content, accuracy, availability, offensiveness, opinions,
              reliability, privacy practices or other policies applicable to
              such third-party materials, and we cannot and do not guarantee
              that third party materials will comply with the restrictions,
              conditions, or obligations that we require. If you decide to use
              or access third party materials, you do so at your own risk, and
              you may be required to agree to terms of service, privacy and data
              gathering practices, and other policies applicable to such
              third-party materials. Please review all such terms and policies
              carefully.
            </div>
            <div className="pt-2 font-bold underline">Third Party Services</div>
            <div className="pt-2">
              The Platform may be linked with the services of third parties (
              <span className="font-bold">"Third Party Services"</span>). Your
              correspondence, business dealings, and transactions with Third
              Party Services are solely between you and said third parties. This
              includes, but is not limited to, your participation in promotions,
              special offers, or purchases made. Company does not have control
              over the content and performance of Third Party Services.
              Accordingly, you agree that Company shall not be held liable for
              any loss, damage, or injury that may occur as a result of such
              dealings. Company does not represent, warrant, or endorse any
              Third Party Services, or the accuracy, currency, content, fitness,
              lawfulness, or quality of the information, material, goods, or
              services available through Third Party Services.
            </div>
            <div className="pt-2 font-bold">12. INTELLECTUAL PROPERTY</div>
            <div className="pt-2">
              Phone Darlings, the Phone Darlings logo, our website domain(s),
              and all content and other materials available through the
              Platform, exclusive of your Content and the content of other
              Users, (collectively, the &nbsp;
              <span className="font-bold">"Company IP"</span>) are the
              trademarks, copyrights, and intellectual property of and owned by
              Company or its licensors and suppliers. Neither your use of the
              Platform nor this Agreement grant you any right, title, or
              interest in, or any license to reproduce or otherwise use, the
              Company IP. You agree that any goodwill in the Company IP
              generated as a result of your use of the Platform will inure to
              the benefit of Company, and you agree to assign, and do assign,
              all such goodwill to Company. You shall not at any time, nor shall
              you assist others to, challenge Company’s right, title, or
              interest in, or the validity of, the Company IP.
            </div>
            <div className="pt-2 font-bold">13.TERMINATION </div>
            <div className="pt-2">
              You may terminate this Agreement at any time. If you terminate
              this Agreement, you must delete your Account and may no longer
              access or use the Platform. If, after termination, you access the
              Platform or create a new Account, such action will constitute your
              consent to this Agreement and the Privacy Policy, and the prior
              termination will be deemed null and void.
            </div>
            <div className="pt-2">
              Company may, in its sole discretion, terminate your Account,
              delete your profile, delete your Content, and/or prohibit you from
              using or accessing the Platform at any time and without prior
              notice.
            </div>
            <div className="pt-2">
              All payment obligations outstanding at the time of termination and
              the provisions of this Agreement which, by their nature, should
              survive termination shall survive such termination, including
              sections entitled Dispute Resolution, Assumption of
              Risk/Indemnity, Intellectual Property, Disclaimers, Limitations,
              and General.
            </div>
            <div className="pt-2 font-bold">14. DISPUTE RESOLUTION</div>
            <div className="pt-2">
              This section governs any dispute between you and us, and how that
              dispute will be legally resolved, if necessary. Remember, these
              dispute resolution provisions only apply to disputes between
              Company and you, and not to disputes between you and any other
              User.
            </div>
            <div className="pt-2 font-bold underline">
              Governing Law and Venue
            </div>
            <div className="pt-2">
              This Agreement shall be governed by and construed in accordance
              with the laws of Washington without regard to its conflict of law
              principles. Subject to and without waiving the arbitration
              agreement below, the proper venue for any judicial action arising
              out of, relating to, or in connection with this Agreement will be
              the state and federal courts located in Seattle, Washington (a
              &nbsp;
              <span className="font-bold">
                "Court of Competent Jurisdiction"
              </span>
              ). You and Company stipulate to, and agree to waive any objection
              to, the personal jurisdiction and venue of such courts and submit
              to extraterritorial service of process.
            </div>
            <div className="pt-2 font-bold underline">Arbitration</div>
            <div className="pt-2">
              If you and Company cannot resolve a dispute or other claim through
              negotiations, the dispute or claim shall be finally and
              exclusively resolved by binding arbitration. This arbitration
              agreement is reciprocal, and any election to arbitrate by one
              party shall be final and binding on the other(s). The language in
              this Agreement shall be interpreted in accordance with its fair
              meaning and not strictly for or against either party. The Federal
              Arbitration Act governs the interpretation and enforcement of this
              agreement to arbitrate.
            </div>
            <div className="pt-2">
              The arbitration shall be commenced and conducted through JAMS
              (www.jamsadr.com) under the Streamlined Rules, as modified by this
              agreement to arbitrate. All remedies available to the parties
              under applicable federal, state, or local laws shall remain
              available in arbitration. The parties shall each participate in
              the selection of a neutral arbitrator pursuant to the Streamlined
              Rules. Unless you and Company agree otherwise in writing, the
              final arbitration hearing shall take place in person at the JAMS
              facility located in or nearest to your city of residence. If you
              initiate arbitration against Company, you will be required to pay
              an initial fee of $250 (unless you qualify for a waiver), and all
              other arbitration costs (including any remaining JAMS Case
              Management Fee and all professional fees for the arbitrator’s
              services) shall be paid as determined by the arbitrator. If
              Company initiates arbitration against you, Company shall pay all
              costs associated with the arbitration. If JAMS is unavailable to
              arbitrate a dispute or claim, you and Company agree to arbitrate
              using an alternative arbitral forum. Regardless of the outcome of
              the arbitration, you and Company will each pay your own attorneys’
              fees and costs unless an award of attorneys’ fees is available
              under applicable statute. The arbitrator’s award will consist of a
              written statement stating the disposition of each claim. The award
              will also provide a concise written statement of the essential
              findings and conclusions on which the award is based. The
              arbitrator must follow applicable law, and any award may be
              challenged if the arbitrator fails to do so. Either party may
              litigate to compel arbitration in a Court of Competent
              Jurisdiction, to stay proceedings pending arbitration, or to
              modify, confirm, vacate, or enter judgment on the award entered by
              the arbitrator.
            </div>
            <div className="pt-2 font-bold italic">
              You acknowledge that without this provision, you would have the
              right to sue in court with a jury trial.
            </div>
            <div className="font-bold underline">No Class Actions Allowed</div>
            <div className="pt-2">
              You and Company agree that any arbitration or other legal action
              shall be limited to the two of us as parties, and any joinder of
              other parties is not allowed. This means that &nbsp;
              <span className="font-bold">
                you cannot participate in any sort of representative proceeding
                against Company, including as a plaintiff or class member in any
                purported class action.
              </span>
            </div>
            <div className="pt-2 font-bold underline">Equitable Relief</div>
            <div className="pt-2">
              There are things an arbitrator cannot do, like order a party to
              act or stop doing something—this is known as "equitable relief."
              Either one of us can go to court and seek equitable relief,
              including by filing a motion to compel the other party to honor
              the arbitration agreement. However, you and we agree that the only
              courts where we will seek equitable relief—or file any legal
              proceeding outside of arbitration—are the state and federal courts
              in Seattle, Washington. This exception for equitable relief
              does&nbsp;
              <span className="font-bold underline">not</span>&nbsp;waive our
              Arbitration Agreement.
            </div>
            <div className="pt-2 font-bold">
              15.ASSUMPTION OF RISK; INDEMNITY BY YOU
            </div>
            <div className="pt-2">
              YOU KNOWINGLY AND EXPRESSLY AGREE THAT USE OF THE PLATFORM IS AT
              YOUR OWN RISK. YOU, ON BEHALF OF YOURSELF, YOUR PERSONAL
              REPRESENTATIVES, AND YOUR HEIRS, VOLUNTARILY AGREE TO RELEASE,
              WAIVE, DISCHARGE, HOLD HARMLESS, DEFEND AND INDEMNIFY COMPANY AND
              ITS OWNERS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES,
              CONSULTANTS, REPRESENTATIVES, SUBLICENSEES, SUCCESSORS, AND
              ASSIGNS FROM ANY AND ALL CLAIMS, ACTIONS, OR LOSSES FOR BODILY
              INJURY, PROPERTY DAMAGE, WRONGFUL DEATH, EMOTIONAL DISTRESS, LOSS
              OF PRIVACY, OR OTHER DAMAGES OR HARM, WHETHER TO YOU OR TO THIRD
              PARTIES, THAT MAY RESULT FROM YOUR USE OF THE PLATFORM. YOU ARE
              SOLELY RESPONSIBLE FOR YOUR COMMUNICATIONS AND INTERACTIONS WITH
              OTHER USERS. YOU UNDERSTAND THAT COMPANY DOES NOT CURRENTLY
              CONDUCT CRIMINAL OR OTHER BACKGROUND CHECKS ON ITS USERS. COMPANY
              DOES NOT INQUIRE INTO THE BACKGROUNDS OF ITS USERS OR ATTEMPT TO
              VERIFY THE STATEMENTS OF ITS USERS. COMPANY MAKES NO
              REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF ANY USERS.
            </div>
            <div className="pt-2">
              COMPANY DOES NOT ACCEPT RESPONSIBILITY FOR THE TRUTH OR ACCURACY
              OF ANY STATEMENT MADE OR POSTED BY THIRD PARTIES OR USERS OF THE
              PLATFORM. WE STRONGLY RECOMMEND THAT YOU TAKE APPROPRIATE
              SAFEGUARDS WHEN CORRESPONDING WITH ANY USER OR THIRD PARTIES. IN
              COMMUNICATING WITH USERS, YOU AGREE TO HOLD COMPANY AND ITS
              OWNERS, EMPLOYEES AND AGENTS HARMLESS FROM ALL COSTS, LIABILITIES,
              DAMAGES AND ATTORNEY FEES, RESULTING FROM OR CAUSED BY ANY
              CORRESPONDENCE WITH USERS.
            </div>
            <div className="pt-2">
              USERS THAT CHOOSE TO CREATE AN ACCOUNT ON THE PLATFORM ARE THE
              AUTHORS/PUBLISHERS OF THE INFORMATION CONTAINED IN THE PROFILE.
              COMPANY IS NOT CONSIDERED THE PUBLISHER OF PROFILE INFORMATION; WE
              SIMPLY PROVIDE THE SPACE FOR THE USER TO CREATE A PROFILE.
            </div>
            <div className="pt-2 bold">
              16 DISCLAIMERS, LIMITATION OF LIABILITY
            </div>
            <div className="pt-2 font-bold underline">
              Disclaimer of Warranties
            </div>
            <div className="pt-2">
              A warranty is a promise made by a business to a consumer or user
              about the business’s products or services. The law assumes a
              business has made certain warranties unless it disclaims them.
              When a business "disclaims" a warranty, it is the equivalent of
              saying "we are NOT making this promise to you."
            </div>{" "}
            <div className="pt-2">
              UNLESS WE EXPRESLY WARRANT SOMETHING IN THIS AGREEMENT, TO THE
              FULLEST EXTENT PERMITTED BY LAW, COMPANY, ON BEHALF OF ITSELF AND
              ITS LICENSORS AND SUPPLIERS, EXPRESSLY DISCLAIMS ANY AND ALL
              WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE PLATFORM, ARISING BY
              OPERATION OF LAW OR OTHERWISE, INCLUDING WITHOUT LIMITATION ANY
              AND ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT IN ADDITION TO ANY
              WARRANTIES ARISING FROM A COURSE OF DEALING, USAGE, OR TRADE
              PRACTICE. NEITHER COMPANY NOR ITS LICENSORS OR SUPPLIERS WARRANTS
              THAT THE PLATFORM WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS OR
              THAT THE OPERATION OF THE PLATFORM WILL BE UNINTERRUPTED OR
              ERROR-FREE OR THAT DEFECTS WILL BE CORRECTED. COMPANY DISCLAIMS
              ALL IMPLIED LIABILITY FOR DAMAGES ARISING OUT OF THE FURNISHING OF
              THE PLATFORM PURSUANT TO THIS AGREEMENT.
            </div>
            <div className="pt-2 font-bold underline">
              Limitation of Liability
            </div>
            <div className="pt-2">
              This section limits the types of claims you can bring against us.
              These limitations help us reduce the risks associated with
              providing the website and Platform – in fact, we could not provide
              them otherwise.
            </div>
            <div className="pt-2">
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL COMPANY
              OR ITS LICENSORS OR SUPPLIERS BE LIABLE TO YOU FOR ANY CLAIMS
              ARISING FROM YOUR USE OF THE PLATFORM, INCLUDING WITHOUT
              LIMITATION FOR SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL
              DAMAGES, LOST PROFITS, LOST EARNINGS, LOST DATA OR CONFIDENTIAL OR
              OTHER INFORMATION, LOSS OF PRIVACY, COSTS OF PROCUREMENT OF
              SUBSTITUTE GOODS OR SERVICES, FAILURE TO MEET ANY DUTY INCLUDING
              WITHOUT LIMITATION OF GOOD FAITH OR OF REASONABLE CARE,
              NEGLIGENCE, OR OTHERWISE, REGARDLESS OF THE FORESEEABILITY OF
              THOSE DAMAGES. THIS LIMITATION SHALL APPLY REGARDLESS OF WHETHER
              THE DAMAGES ARISE OUT OF BREACH OF CONTRACT, TORT, OR ANY OTHER
              LEGAL THEORY OR FORM OF ACTION. YOU AGREE THAT THIS LIMITATION OF
              LIABILITY REPRESENTS A REASONABLE ALLOCATION OF RISK AND IS A
              FUNDAMENTAL ELEMENT OF THE BASIS OF THE BARGAIN BETWEEN COMPANY
              AND YOU. THE PLATFORM WOULD NOT BE PROVIDED WITHOUT SUCH
              LIMITATIONS.
              <br />
              THE TOTAL AGGREGATE AMOUNT THAT COMPANY, ITS LICENSORS, OR
              SUPPLIERS MAY BE LIABLE TO YOU FOR ANY DAMAGES, LOSSES, CLAIMS OR
              CAUSES OF ACTION ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR
              USE OF THE PLATFORM SHALL NOT EXCEED THE AMOUNT PAID BY YOU, IF
              ANY, TO COMPANY DURING THE TWELVE (12) MONTHS IMMEDIATELY
              PRECEDING THE DATE THE ACTION OR CLAIM OCCURRED, OR $100,
              WHICHEVER IS GREATER.
            </div>
            <div className="pt-2 font-bold underline">
              Application of Disclaimers
            </div>
            <div className="pt-2">
              Some states do not allow limitations on implied warranties or the
              exclusion or limitation of certain damages. If these laws apply to
              you, some or all of the above disclaimers, exclusions or
              limitations may not apply to you, and you might have additional
              rights. Company’s licensors and suppliers are intended third-party
              beneficiaries of these disclaimers, waivers, and limitations. No
              advice or information, whether oral or written, obtained by you
              through the Service or otherwise shall alter any of the
              disclaimers or limitations stated in this section.
            </div>
            <div className="pt-2 font-bold">17.GENERAL </div>
            <div className="pt-2">
              <span className="underline">Entire Agreement.</span> This
              Agreement constitutes the entire agreement between Company and you
              concerning your use of the Platform.
            </div>
            <div className="pt-2">
              <span className="underline">Partial Invalidity.</span> Should any
              part of this Agreement be declared invalid, void, or unenforceable
              by a Court of Competent Jurisdiction, such decision shall not
              affect the validity of any remaining portion of this Agreement,
              which shall remain in full force and effect, and the parties
              acknowledge and agree that they would have executed the remaining
              portion without including the part so declared by a Court of
              Competent Jurisdiction to be invalid, void, or unenforceable.
            </div>
            <div className="pt-2">
              <span className="underline">No Waiver.</span> A waiver by either
              party of any term or condition of this Agreement, or any breach,
              in any one instance, will not waive that term or condition or any
              later breach.
            </div>
            <div className="pt-2">
              <span className="underline">Assignment.</span> his Agreement and
              all of your rights and obligations under it will not be assignable
              or transferable by you without the prior written consent of
              Company. This Agreement will be binding upon and will inure to the
              benefit of the parties, their successors, and permitted assigns.
            </div>
            <div className="pt-2">
              <span className="underline">Independent Contractors.</span> You
              and Company are independent contractors, and no agency,
              partnership, joint venture, or employee-employer relationship is
              intended or created by this Agreement.
            </div>
            <div className="pt-2">
              <span className="underline">Third Party Beneficiaries.</span>{" "}
              Except where expressly stated herein, there are no third-party
              beneficiaries to this Agreement.
            </div>
            <div className="pt-2">
              <span className="underline">Headings.</span> The headings in this
              Agreement are for convenience only and shall have no legal or
              contractual effect.
            </div>
            <div className="pt-2 font-bold">
              18.CHANGES TO TERMS AND PRIVACY POLICY
            </div>
            <div className="pt-2">
              Internet technology and the applicable laws, rules, and
              regulations change frequently. We may need to make changes to this
              Agreement and the Privacy Policy from time to time, including to
              keep up with changes in the law. If we make a material change, we
              will notify you in advance so you can decide whether you want to
              continue using the Platform after the change takes effect. Your
              continued use of the Platform after the change constitutes your
              consent to the updated Agreement or Privacy Policy. It is up to
              you to keep the email address associated with your Account up to
              date so that you don’t miss any such notifications.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TeamCondtion
