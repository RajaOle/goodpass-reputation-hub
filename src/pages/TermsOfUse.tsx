
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto" />
              </Link>
            </div>
            
            {/* Back Button */}
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-gray-600 mb-8">Last Update: 27 Feb 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">WHO WE ARE & WHAT WE DO</h2>
            <p className="text-gray-700 mb-4">Welcome to the Goodpass, Terms and Agreement!</p>
            <p className="text-gray-700 mb-4">
              Goodpass. Pte. Ltd. ("Goodpass") is a community based credit reporting tool, that helps our communities build Credit Score outside of the formal Financial Institution, by producing reports (loan or other reports), by the communities, and for the communities.
            </p>
            <p className="text-gray-700 mb-4">
              We help Reporters (the person making the report) remind their peers about outstanding loans or other conducts, and also help the Reportees (the person being reported) build credit score and credit worthiness track record, outside of formal Financial Institution.
            </p>
            <p className="text-gray-700 mb-4">
              We DO NOT provide access to direct funding, loans, investments or any financial instruments directly to the Reporting Party or the Reported Party. Financial transactions, agreements, commitments, and reports are made between the community, and our role here is only to record and verify and check the validity of these reports so as to generate behavioral credit scores from the Reported Parties.
            </p>
            <p className="text-gray-700 mb-4">
              These Goodpass Terms of Use ("TOU") are the terms that apply to your use of the Goodpass. We hope that these will help ensure the community is valuable to you and serves as a platform where we can all become better together. These Community TOU also protect the interests of all of our members, as well as our goodwill and reputation. These terms are so important that we cannot permit you to use the Goodpass unless you agree to them. By using the Goodpass, you are agreeing to these terms.
            </p>
            <p className="text-gray-700 mb-4">
              Every community user of ours agrees to abide by these Community TOU and is responsible for any violations. You are not allowed to assist or engage others in a way that would violate these Community TOU. We will enforce and ensure compliance with this Community TOU by using methods we consider to be appropriate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">DEFINITIONS</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>("Agreement")</strong> or <strong>("Community TOU")</strong> means these Goodpass, Terms of Use and all materials referred or linked to in here.
              </p>
              <p>
                <strong>("Community")</strong> means other members of the Goodpass, including yourself.
              </p>
              <p>
                <strong>("Community Content")</strong> means all content, including without limitation, language, data, information, and images, provided through or disclosed by the use of the Goodpass, whether by us, our customers or other members by the communities. Community Content, does not include Your Content.
              </p>
              <p>
                <strong>("Sensitive Information")</strong> means debit or credit card number, personal financial information, national identity or passports documents, driver license, bank account numbers, financial or health information, fraud report, loan report, including any information subject to regulations, laws, or industry standards designed to protect data privacy and security.
              </p>
              <p>
                <strong>("Third Party Sites")</strong> Means any third party services or websites linked from within or accessed through Goodpass App
              </p>
              <p>
                <strong>("You")</strong> means the person or entity using Goodpass
              </p>
              <p>
                <strong>("Your Content")</strong> means all content, including without limitation, language, data, information, and images, provided through or disclosed by the use of the Goodpass, provided by You.
              </p>
              <p>
                <strong>("We, Us, Our, Goodpass, Goodpass App, Goodpass Score or Goodpass")</strong> means Goodpass App which is owned by PT Digital Venture International, a company registered in and under the law of Indonesia.
              </p>
              <p>
                <strong>("Reporter")</strong> is the person or entity, submitting a report about loan commitment, fraud or other reports, whether the file is provided by Your Content, or a Community Content.
              </p>
              <p>
                <strong>("Reportee")</strong> is the person or entity being reported by Your or by the Community.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">YOUR CONDUCT & CONTENT</h2>
            <p className="text-gray-700 mb-4">
              We will provide you access to use the Goodpass, according to the terms of this Agreement. We may use Third Party service providers to provide some or all elements of the Goodpass. In order to access and use some of the Goodpass features which is provided by the Third Party, We may require you to provide a Legal Identification for KYC (Know Your Customer) process, and you grant us the right to share the information necessary to enable your use of Goodpass App with our third party service providers.
            </p>
            <p className="text-gray-700 mb-4">
              You may not use a username and or Legal Identification that: (i) belongs to someone else, (ii) impersonates another person, (iii) is misleading, (iv) violates any intellectual property or other proprietary rights, (v) is vulgar or offensive, (vi) uses "Goodpass" as all or part of it, unless we provide express permission to do so, or (vii) we reject, which we may choose to do in our discretion. All information you provide in your profile must be accurate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">USAGE GUIDELINES</h2>
            <p className="text-gray-700 mb-4">
              You must review and follow the Community Guidelines. We may change the Community Guidelines from time to time by updating the applicable website. Your use of the Goodpass Community is subject to the Community Guidelines, which are incorporated to this Agreement by reference.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ACCEPTABLE USE</h2>
            <p className="text-gray-700 mb-4">
              You will use the Goodpass Community only for its intended purpose, and will not use it for any other purpose than that.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OUR USE OF YOUR CONTENT</h2>
            <p className="text-gray-700 mb-4">
              We respect the intellectual property rights of others, and we ask our users to do the same. We may, in its sole discretion, suspend the access or terminate the accounts of users who violate others' intellectual property rights. If you believe that your work has been copied in a way that constitutes infringement on our website, please follow the steps and provide the information as detailed in the 'Claims of Copyright Infringement' the Goodpass Website Terms of Use available at <a href="/about-us/terms-of-use" className="text-blue-600 hover:text-blue-700">https://goodpass.id/about-us/terms-of-use/</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OUR PROPRIETARY RIGHTS</h2>
            <p className="text-gray-700 mb-4">
              You are not granted a license for any software under this Agreement. Goodpass products are protected by intellectual property laws, they are the property of and belong to us or our licensors (if any), and we hold all ownership rights to these products. Our trademarks include, but are not limited to, those registered at <a href="/" className="text-blue-600 hover:text-blue-700">https://goodpass.id</a> (which we can update at at any time without notice to you) and you may not use any of this without our prior written permission.
            </p>
            <p className="text-gray-700 mb-4">
              We encourage all customers to give suggestions to improve it on Goodpass products, and vote on suggestions they like. You agree that all such comments and suggestions are not confidential and that we have all the rights to use and include them in Goodpass products, without payment or attribution to you.
            </p>
            <p className="text-gray-700 mb-4">
              We retain all ownership rights in Goodpass trademarks. During the term of this Agreement, you may use our trademarks as long as you follow the usage requirements in this section and the incorporated guidelines. You must: (i) only use the images of our trademarks that we make available to you for use as part of your participation in the Community (e.g., customer advocacy badges), without altering them in any way; (ii) only use our trademarks in connection with this Agreement and our general Trademark Usage Guidelines found here: <a href="/" className="text-blue-600 hover:text-blue-700">https://goodpass.id</a>; and (iii) immediately comply if we request that you discontinue use.
            </p>
            <p className="text-gray-700 mb-4">
              You must not use any of our trademarks: (a) in a misleading or disparaging way; (b) outside the scope of this Agreement; (c) in a way that implies we endorse, sponsor or approve of your services or products; or (d) in violation of applicable law or in connection with an obscene, indecent, or unlawful topic or material.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">THIRD PARTY SITES & PRODUCTS</h2>
            <p className="text-gray-700 mb-4">
              Third Party Products and Third Party Sites are not under our control. Third Party Sites and Products are provided to you for convenience only, and the availability of Third Party Sites or Products does not mean that we endorse, support, or guarantee Third Party Sites or Products. If a loss occurs it is not our responsibility.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PRIVACY</h2>
            <p className="text-gray-700 mb-4">
              Your use of the Goodpass Community is subject to Goodpass Privacy Policy, available at <a href="/about-us/privacy-policy" className="text-blue-600 hover:text-blue-700">https://goodpass.id/about-us/privacy-policy/</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">TERM & TERMINATION</h2>
            <p className="text-gray-700 mb-4">
              <strong>Term:</strong> This Agreement will apply for as long as you use or maintain a username for the Goodpass Community.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Termination and Suspension:</strong> We may terminate this Agreement and/or suspend your access to the Goodpass Apps and Score immediately if you: (i) violate any of the terms of this Agreement, (ii) use the Goodpass Apps and score in a way which has or may negatively reflect on or affect us, our prospects, or our customers, or (iii) if we determine it to be necessary or desirable in our sole discretion. We are not obligated to provide you with any of Your Content used in connection with the Goodpass Community after termination. Termination or expiration of this Agreement shall not cause your subscription agreement to be terminated, if you have one.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">YOUR REPRESENTATION & WARRANTIES</h2>
            <p className="text-gray-700 mb-4">
              You represent and warrant that: (i) your participation in the Goodpass Community will not conflict with your existing agreements or arrangements, (ii) you have first obtained permission from people who have a connection to data and sufficient rights to share all your data with us for our use and with other Goodpass member users. Community, and that you have ensured and have not violated any obligations of confidentiality by submitting your Content to the Goodpass Community of Goodpass, and (iii) that your Content does not violate or constitute a violation of intellectual property rights, privacy rights, publicity rights, or other people's property rights. other.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">INDEMNIFICATION</h2>
            <p className="text-gray-700 mb-4">
              You will indemnify, defend and hold us free, at your expense, against any third party claims, lawsuits, actions, or legal process (each, "Action") brought against us (and our officers, directors, employees, agents, our services providers, licensors and affiliates) by third parties to the extent that such Actions are based on or arise from (a) your use of the Goodpass Community, (b) disclosure or solicitation of your personal information, (c) use of any personal information that you disclose, whether this use is by you or a third party, (d) non-compliance or violation of this Agreement, (e) members may not spread fake news, reports, half-truths, clikbait, hoaxes and inappropriate and inappropriate behavior if members spread misleading news whether intentionally or unintentionally which in this case is detrimental to Goodpass it will be subject to penalties applicable in the Republic of Indonesia and Goodpass will not be held responsible for any losses incurred or (f) your use of the Product Third Party, or Third Party Sites. We will: notify you in writing within seven (7) days of our becoming aware of the claim; gives you sole control over the defense or settlement of claims; You may not accept any settlement that (i) holds us liable; (ii) ask us to make a confession; or (iii) impose liability not covered by this remedy or place restrictions on us without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">DISCLAIMERS, LIMITATION OF LIABILITIES</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-2">Disclaimer of Warranties</h3>
                <p className="text-sm">
                  WE AND OUR AFFILIATES AND AGENTS MAKE NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, SECURITY OR ACCURACY OF THE GOODPASS PRODUCTS OR SERVICES, THE GOODPASS COMMUNITY, OR THE COMMUNITY CONTENT FOR ANY PURPOSE. APPLICATION PROGRAMMING INTERFACES (APIs) MAY NOT BE AVAILABLE AT ALL TIMES. TO THE EXTENT PERMITTED BY LAW, THE GOODPASS COMMUNITY IS PROVIDED "AS IS" WITHOUT WARRANTY OR CONDITION OF ANY KIND. WE DISCLAIM ALL WARRANTIES AND CONDITIONS OF ANY KIND WITH REGARD TO THE GOODPASS COMMUNITY AND THE COMMUNITY CONTENT, INCLUDING ALL IMPLIED WARRANTIES, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. THE GOODPASS COMMUNITY AND COMMUNITY CONTENT MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL ERRORS.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Indirect Damages</h3>
                <p className="text-sm">
                  TO THE EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS OR BUSINESS OPPORTUNITIES.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-sm">
                  ANY INFORMATION OR DATA POSTED ON THE GOODPASS IS THE RESPONSIBILITY OF THE PERSON OR PERSONS WHO CONDUCTING SUCH POSTS. GOODPASS IS NOT RESPONSIBLE IN ANY WAY FOR "MEMBER" OR ANYTHING POSTED ON THE SITE OR ASSOCIATED WITH THE GOODPASS SERVICES, WHETHER CAUSED BY "MEMBER", OR BY ANY EQUIPMENT OR MANAGEMENT OF THE SERVICE. WE CANNOT COMPLETELY CONTROL AND THERE IS NOT RESPONSIBLE FOR WHAT THE "MEMBER" CONTAINS ON THE SITE, AND IS NOT RESPONSIBLE FOR THERE.YOU UNDERSTAND AND AGREE THAT YOUR DISAGREEMENT TO THIS LIMITATION OF LIABILITY, WE WOULD NOT PROVIDE THE GOODPASS COMMUNITY TO YOU.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GENERAL TERMS</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-2">Amendment; No Waiver</h3>
                <p>
                  We may update and change any part or all of this Agreement. If we update or change this Agreement, the updated Agreement will be posted at <a href="/about-us/terms-of-use" className="text-blue-600 hover:text-blue-700">https://goodpass.id/about-us/terms-of-use/</a>. The updated Agreement will become effective and binding on the next business day after it is posted. When we change this Agreement, the "Last Modified" date above will be updated to reflect the date of the most recent version. We encourage you to review this Agreement periodically. If you do not agree with a modification to this Agreement, you should not use the Goodpass Community.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Applicable law</h3>
                <p>
                  This agreement will be governed by the laws of the Republic of Indonesia, without regard to conflicts of legal provisions. If either of us initiates action in connection with this Agreement or any other dispute between the parties, the exclusive venue and jurisdiction of the action rests in the favor of the Goodpass Directors at the Court is chosen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Force Majeure</h3>
                <p>
                  Neither party will be responsible for failure or delay of performance if caused by: an act of war, hostility, or sabotage; act of God; electrical, internet, or telecommunication outage that is not caused by the obligated party; government restrictions; or other event outside the reasonable control of the obligated party. Each party will use reasonable efforts to mitigate the effect of a force majeure event.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Relationship of the Parties</h3>
                <p>
                  Both you and we agree that no joint venture, partnership, employment, or agency relationship exists between you and us as a result of this Agreement.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Correction of Errors and Inaccuracies</h3>
                <p>
                  The Community Content may contain typographical errors or other errors or inaccuracies and may not be complete or current. We therefore reserve the right to correct any errors, inaccuracies or omissions and to change or update the Community Content and Your Content at any time without prior notice. However, we do not guarantee that any errors, inaccuracies or omissions will be corrected.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Severability</h3>
                <p>
                  If any part of this Agreement is determined to be invalid or unenforceable by applicable law, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of this Agreement will continue in effect.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">The whole agreement</h3>
                <p>
                  This Agreement is the entire agreement between us for the Community of Goodpass and supersedes all proposals and other agreements, whether electronic, oral or written, between us. We object and reject any additional or different terms you propose. It is your and our express desire that this Agreement and all related documents be in Indonesia. We may provide versions of this Agreement in languages other than Indonesia. If we do, the Indonesia language version of this Agreement will govern our relationship and the translated version is provided for convenience only and will not be construed to alter the Indonesia version of this Agreement.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Third Party Reportees</h3>
                <p>
                  Not regulated in this agreement is implied, to be able to transfer and or to give to any person or entity (other than the parties herein) includes rights, obligations, data, benefits, or recovery of any kind based on or for the reasons of this Agreement.Community Guidelines; We may change the Community Guidelines from time to time by updating our website.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Licenses</h3>
                <p>
                  We grant to you only the rights and licenses expressly stated in this Agreement, and you receive no other rights or licenses with respect to us, the Goodpass products and services, our trademarks, or any other property or right of ours.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Authority</h3>
                <p>
                  Each party represents and warrants to the other that it has full power and authority to enter into this Agreement and that it is binding upon such party and enforceable in accordance with its terms.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Survival</h3>
                <p>
                  The following sections shall survive the expiration or termination of this Agreement: 'Goodpass Proprietary Rights', 'Representations and Warranties', 'Indemnification', 'Disclaimers; Limitation of Liability', and 'General'.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
