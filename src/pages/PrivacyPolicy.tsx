import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  const tableOfContents = [{
    id: "introduction",
    title: "Introduction"
  }, {
    id: "information-we-collect",
    title: "Information We Collect"
  }, {
    id: "how-we-use-information",
    title: "How We Use Your Information"
  }, {
    id: "sharing-disclosure",
    title: "Sharing and Disclosure of Information"
  }, {
    id: "data-retention",
    title: "Data Retention"
  }, {
    id: "data-security",
    title: "Data Security"
  }, {
    id: "your-rights",
    title: "Your Rights and Choices"
  }, {
    id: "cookies",
    title: "Cookies and Tracking Technologies"
  }, {
    id: "third-party",
    title: "Third-Party Services"
  }, {
    id: "children",
    title: "Children's Privacy"
  }, {
    id: "international",
    title: "International Data Transfers"
  }, {
    id: "changes",
    title: "Changes to This Privacy Policy"
  }, {
    id: "contact",
    title: "Contact Us"
  }];
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto" />
              </Link>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        {/* Table of Contents Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
            <nav className="space-y-2">
              {tableOfContents.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === item.id ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  {item.title}
                </button>)}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: January 15, 2024</p>

            <section id="introduction" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Welcome to Goodpass ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our community-based credit reporting platform.
                </p>
                <p>
                  By using Goodpass, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </section>

            <section id="information-we-collect" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Information You Provide</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="font-semibold">Examples</TableHead>
                          <TableHead className="font-semibold">Purpose</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Account Information</TableCell>
                          <TableCell>Name, email address, phone number, date of birth</TableCell>
                          <TableCell>Account creation and verification</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Identity Verification</TableCell>
                          <TableCell>Government ID, passport, driver's license</TableCell>
                          <TableCell>KYC compliance and fraud prevention</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Financial Information</TableCell>
                          <TableCell>Bank account details, transaction history</TableCell>
                          <TableCell>Credit reporting and verification</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Communication Data</TableCell>
                          <TableCell>Messages, support tickets, feedback</TableCell>
                          <TableCell>Customer support and service improvement</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Information We Collect Automatically</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, click patterns)</li>
                    <li>Location data (if permitted by your device settings)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="how-we-use-information" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect for the following purposes:</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Purpose</TableHead>
                        <TableHead className="font-semibold">Legal Basis</TableHead>
                        <TableHead className="font-semibold">Data Types</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Service Provision</TableCell>
                        <TableCell>Contract Performance</TableCell>
                        <TableCell>Account, Identity, Financial</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Credit Score Generation</TableCell>
                        <TableCell>Legitimate Interest</TableCell>
                        <TableCell>Financial, Transaction History</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Fraud Prevention</TableCell>
                        <TableCell>Legal Obligation</TableCell>
                        <TableCell>Identity, Device, Usage</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Customer Support</TableCell>
                        <TableCell>Contract Performance</TableCell>
                        <TableCell>Communication, Account</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Service Improvement</TableCell>
                        <TableCell>Legitimate Interest</TableCell>
                        <TableCell>Usage, Communication</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>

            <section id="sharing-disclosure" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sharing and Disclosure of Information</h2>
              <div className="space-y-6 text-gray-700">
                <p>We may share your information in the following circumstances:</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Recipient</TableHead>
                        <TableHead className="font-semibold">Information Shared</TableHead>
                        <TableHead className="font-semibold">Purpose</TableHead>
                        <TableHead className="font-semibold">Safeguards</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Community Members</TableCell>
                        <TableCell>Credit scores, payment history</TableCell>
                        <TableCell>Credit reporting and verification</TableCell>
                        <TableCell>Anonymized data, consent required</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Service Providers</TableCell>
                        <TableCell>Technical and operational data</TableCell>
                        <TableCell>Platform maintenance and support</TableCell>
                        <TableCell>Data processing agreements</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Legal Authorities</TableCell>
                        <TableCell>As required by law</TableCell>
                        <TableCell>Legal compliance</TableCell>
                        <TableCell>Legal process verification</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Business Partners</TableCell>
                        <TableCell>Aggregated, non-personal data</TableCell>
                        <TableCell>Service enhancement</TableCell>
                        <TableCell>Non-disclosure agreements</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>

            <section id="data-retention" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Retention</h2>
              <div className="space-y-4 text-gray-700">
                <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Data Type</TableHead>
                        <TableHead className="font-semibold">Retention Period</TableHead>
                        <TableHead className="font-semibold">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Account Information</TableCell>
                        <TableCell>Duration of account + 7 years</TableCell>
                        <TableCell>Legal requirements, dispute resolution</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Credit Reports</TableCell>
                        <TableCell>7 years from creation</TableCell>
                        <TableCell>Credit reporting standards</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Communication Records</TableCell>
                        <TableCell>3 years</TableCell>
                        <TableCell>Customer service and legal protection</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Usage Data</TableCell>
                        <TableCell>2 years</TableCell>
                        <TableCell>Analytics and service improvement</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>

            <section id="data-security" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>
              <div className="space-y-4 text-gray-700">
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Safeguards</h4>
                    <ul className="text-sm space-y-1">
                      <li>• End-to-end encryption</li>
                      <li>• Secure data transmission (SSL/TLS)</li>
                      <li>• Regular security audits</li>
                      <li>• Multi-factor authentication</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Access controls and permissions</li>
                      <li>• Employee training programs</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular policy updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="your-rights" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-700">
                <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Right</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">How to Exercise</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Access</TableCell>
                        <TableCell>Request copies of your personal data</TableCell>
                        <TableCell>Contact privacy@goodpass.id</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rectification</TableCell>
                        <TableCell>Request correction of inaccurate data</TableCell>
                        <TableCell>Update in account settings or contact support</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Erasure</TableCell>
                        <TableCell>Request deletion of your data</TableCell>
                        <TableCell>Submit deletion request via support</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Portability</TableCell>
                        <TableCell>Receive your data in a structured format</TableCell>
                        <TableCell>Request data export via support</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Objection</TableCell>
                        <TableCell>Opt out of certain data processing</TableCell>
                        <TableCell>Adjust privacy settings or contact support</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>

            <section id="cookies" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-gray-700">
                <p>We use cookies and similar technologies to enhance your experience on our platform. You can manage your cookie preferences through your browser settings.</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Cookie Type</TableHead>
                        <TableHead className="font-semibold">Purpose</TableHead>
                        <TableHead className="font-semibold">Duration</TableHead>
                        <TableHead className="font-semibold">Can be disabled?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Essential</TableCell>
                        <TableCell>Core functionality and security</TableCell>
                        <TableCell>Session/Persistent</TableCell>
                        <TableCell>No</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Performance</TableCell>
                        <TableCell>Analytics and site optimization</TableCell>
                        <TableCell>Up to 2 years</TableCell>
                        <TableCell>Yes</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Functional</TableCell>
                        <TableCell>User preferences and settings</TableCell>
                        <TableCell>Up to 1 year</TableCell>
                        <TableCell>Yes</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Marketing</TableCell>
                        <TableCell>Targeted advertising and campaigns</TableCell>
                        <TableCell>Up to 1 year</TableCell>
                        <TableCell>Yes</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>

            <section id="third-party" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
              <div className="space-y-4 text-gray-700">
                <p>Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services.</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                  <p className="text-yellow-700 text-sm">
                    Before using any third-party service linked from our platform, please review their privacy policies and terms of service. Your interactions with these services are governed by their respective policies, not ours.
                  </p>
                </div>
              </div>
            </section>

            <section id="children" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
                </p>
                <p>
                  If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately at privacy@goodpass.id.
                </p>
              </div>
            </section>

            <section id="international" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country.
                </p>
                <p>
                  When we transfer your personal information internationally, we ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
                </p>
              </div>
            </section>

            <section id="changes" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Update the "Last Updated" date at the top of this policy</li>
                  <li>Notify you via email if the changes are material</li>
                  <li>Post a notice on our platform highlighting the changes</li>
                  <li>For significant changes, provide additional notice as required by law</li>
                </ul>
                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </section>

            <section id="contact" className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">General Inquiries</h4>
                      <p className="text-sm text-gray-600 mb-1">Email: privacy@goodpass.id</p>
                      <p className="text-sm text-gray-600 mb-1">Phone: +62-21-1234-5678</p>
                      <p className="text-sm text-gray-600">Response time: 48 hours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                      <p className="text-sm text-gray-600 mb-1">Email: dpo@goodpass.id</p>
                      <p className="text-sm text-gray-600 mb-1">Address:  Singapore</p>
                      <p className="text-sm text-gray-600">For data rights requests</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  We will respond to your inquiry within a reasonable timeframe and in accordance with applicable data protection laws.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>;
};
export default PrivacyPolicy;