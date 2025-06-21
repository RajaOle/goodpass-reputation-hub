import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, TrendingUp, Shield, Users, CheckCircle } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto" />
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Make a Report</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Make Inquiries</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Developers</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600 font-medium">Login</button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Financial
            <br />
            <span className="text-blue-600">Reputation</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Goodpass creates a trusted community where friends and family can report loan 
            commitments, helping you build a verifiable financial reputation for better access to 
            credit.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Get Started Now
            </Button>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How Goodpass Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Goodpass Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our peer-to-peer platform enables transparent financial reporting between trusted 
              contacts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Make Reports</h3>
                <p className="text-gray-600">Report loan commitments and repayment history with trusted friends, family members, or business partners.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Make Inquiries</h3>
                <p className="text-gray-600">
                  Check financial reputation and lending history through our 
                  secure verification system.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Build Reputation</h3>
                <p className="text-gray-600">
                  Establish a verifiable track record that opens doors to better 
                  financial opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted by Communities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Trusted by Communities
                <br />
                Worldwide
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform is built on trust and transparency. Every report is 
                verified and encrypted to protect your privacy while building your 
                financial reputation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Bank-level reports and encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Community-verified reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Privacy-first approach</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="People collaborating" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Financial Reputation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already building trust through our 
            community-based platform.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto mb-4" />
              <p className="text-gray-600 max-w-md">
                Building financial trust through community-based reputation reporting.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Use</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Additional Terms of Use</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
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
    </div>;
};
export default Index;