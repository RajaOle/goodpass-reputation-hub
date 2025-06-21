
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdditionalTermsOfUse = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Additional Terms of Use</h1>
          <p className="text-gray-600 mb-8">Last Modified 26 October 2021</p>

          <div className="space-y-6 text-gray-700">
            <p>
              Credit report Inquiry is provided by Goodpass Pte. Ltd ("Goodpass") as part of a community-based character building report for any individual or companies who do not have a credit track record on any financial institutions. Goodpass provided this service on an as-is basis. Goodpass Pte. Ltd ("Goodpass") will try to verify the validity of the report to the best of its ability, however, the accuracy and the quality of the report lies on the details given by the community reporter.
            </p>
            
            <p>
              As an Individual or Company who requested the Credit Inquiry, you understand that the information given on the Credit Report may contain very sensitive and confidential information, hence you are solely responsible to keep the information strictly confidential to you, and for the use of credit report character assessment only.
            </p>
            
            <p>
              After inquiring about the information, you may not:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                Make a copy, make a screenshot, take a picture, alter, modify, or any other duplication activities, other than the information that Goodpass Pte. Ltd ("Goodpass") has provided to you.
              </li>
              <li>
                You may not share, make it public, or tell information about the individuals/companies to other parties, other than for yourself.
              </li>
            </ol>
            
            <p>
              Failure to comply with the rules. 2, could risk yourself being subject to criminal prosecution under the UU ITE, or Confidential Information Act.
            </p>
            
            <p>
              Goodpass Pte. Ltd ("Goodpass") will not be responsible for any misuse of information provided to you by the use of this Credit Report Inquiry feature.
            </p>
            
            <p>
              You have read, understood and agreed to comply with <a href="/about-us/terms-of-use" className="text-blue-600 hover:text-blue-700">https://goodpass.id/about-us/terms-of-use/</a> in this Credit Report Request feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalTermsOfUse;
