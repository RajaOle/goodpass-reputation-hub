
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import SignUpForm from "@/components/SignUpForm";

const Pricing = () => {
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
              <Link to="/make-report" className="text-gray-600 hover:text-blue-600 font-medium">Make a Report</Link>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Make Inquiries</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Developers</a>
              <Link to="/pricing" className="text-blue-600 font-medium">Pricing</Link>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simple, Credit-Based
          </h1>
          <h1 className="text-4xl font-bold text-blue-600 mb-6">Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Buy credits to make inquiries and access reports. Pay only for what you use with no monthly commitments.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {/* Basic Plan */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Basic</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">Rp 50K</span>
                <p className="text-sm text-gray-600">Rp 500 per credit</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">50 inquiry credits</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Valid for 6 months</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Basic support</span>
                </li>
              </ul>

              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Standard Plan - Most Popular */}
          <Card className="bg-white border border-gray-200 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Standard</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">Rp 140K</span>
                <p className="text-sm text-gray-600">Rp 350 per credit</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">150 inquiry credits</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Valid for 12 months</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Buy Credits
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Premium</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">Rp 225K</span>
                <p className="text-sm text-gray-600">Rp 300 per credit</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">250 inquiry credits</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Valid for 18 months</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">10% savings</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Buy Credits
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Enterprise</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">Rp 425K</span>
                <p className="text-sm text-gray-600">Rp 250 per credit</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">500 inquiry credits</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Valid for 24 months</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">15% savings</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
              </ul>

              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do credits work?</h3>
              <p className="text-gray-600">
                Each inquiry or report request uses 1 credit. Credits are valid for the specified duration and never expire within that period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I buy more credits anytime?</h3>
              <p className="text-gray-600">
                Yes, you can purchase additional credits at any time. New credits will be added to your existing balance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I don't use all my credits?</h3>
              <p className="text-gray-600">
                Credits remain valid for the specified duration (6-24 months depending on the package). You can use them at your own pace.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Absolutely. We use bank-level encryption and security measures to protect all your data and transactions.
              </p>
            </div>
          </div>
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

export default Pricing;
