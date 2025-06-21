
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SignUpForm from "@/components/SignUpForm";

const MakeReport = () => {
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
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/make-report" className="text-blue-600 font-medium">Make a Report</Link>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Make Inquiries</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Developers</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
              <SignUpForm />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Make a Report</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join Goodpass to build trust and transparency in your community. Whether you're an individual 
            or an institution, contributing to our platform helps create a more inclusive ecosystem.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Individual Section */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
                Why Individuals Should Contribute to
                <br />
                Goodpass Reports
              </h2>
              
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/c4ff4d6e-8eff-417b-8039-114063f75a51.jpg" 
                  alt="Individual working" 
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Build Your Credit Profile</h3>
                  <p className="text-gray-600 text-sm">
                    By contributing to or creating reports on Goodpass, individuals can establish a trusted 
                    GP Score, improving their chances of securing loans from banks or investors, even 
                    without a formal credit history.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Strengthen Community Trust</h3>
                  <p className="text-gray-600 text-sm">
                    Reporting accurate loan or behavioral data on Goodpass fosters transparency, helping 
                    individuals build a reputation for reliability and trustworthiness within their community.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Simplify Personal Lending</h3>
                  <p className="text-gray-600 text-sm">
                    Goodpass automates tracking and reminders for informal loans, reducing awkwardness 
                    and ensuring smoother financial interactions with peers, while contributing to a shared 
                    credit ecosystem.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-8 py-3">
                Start Individual Report
              </Button>
            </CardContent>
          </Card>

          {/* Institution Section */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-600 text-center mb-6">
                Why Institutions Should Contribute to
                <br />
                Goodpass Commitment Reports
              </h2>
              
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/c4ff4d6e-8eff-417b-8039-114063f75a51.jpg" 
                  alt="Institution workspace" 
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enhance Financial Inclusion</h3>
                  <p className="text-gray-600 text-sm">
                    By contributing verified commitment reports to Goodpass, institutions help build 
                    community-based credit scores, enabling business to get access for funding not only to 
                    formal institution but additional lines of credit from suppliers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Reduce Lending Risks</h3>
                  <p className="text-gray-600 text-sm">
                    Providing accurate data to Goodpass's platform allows institutions to leverage 
                    comprehensive credit behavior insights, minimizing the business commitment of a non-
                    payment fraud risk.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Strengthen Community Trust</h3>
                  <p className="text-gray-600 text-sm">
                    Participating as a reporter in Goodpass fosters transparency and accountability, 
                    reinforcing trust within communities and supporting ethical lending practices.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-8 py-3">
                Start Institution Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/">
                <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto mb-4" />
              </Link>
              <p className="text-gray-600 max-w-md">160 Robinson Road, #14-04 Singapore Business Federation Center
Singapore (068914)</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us/terms-of-use" className="text-gray-600 hover:text-blue-600">Terms of Use</Link></li>
                <li><Link to="/about-us/terms-of-use/additional-terms-of-use" className="text-gray-600 hover:text-blue-600">Additional Terms of Use</Link></li>
                <li><Link to="/about-us/privacy-policy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Developers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500">© 2024 Goodpass. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-1">Powered by Goodpass</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MakeReport;
