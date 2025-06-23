
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from 'lucide-react';

const PurchaseCreditsSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "Rp 50K",
      pricePerCredit: "Rp 500 per credit",
      credits: 50,
      features: [
        "50 inquiry credits",
        "Valid for 6 months",
        "Basic support"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonStyle: "bg-gray-600 hover:bg-gray-700"
    },
    {
      name: "Standard",
      price: "Rp 140K",
      pricePerCredit: "Rp 350 per credit",
      credits: 150,
      features: [
        "150 inquiry credits",
        "Valid for 12 months",
        "Email support",
        "Priority support"
      ],
      popular: true,
      buttonText: "Buy Credits",
      buttonStyle: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Premium",
      price: "Rp 225K",
      pricePerCredit: "Rp 300 per credit",
      credits: 250,
      features: [
        "250 inquiry credits",
        "Valid for 18 months",
        "10% savings",
        "Priority support"
      ],
      popular: false,
      buttonText: "Buy Credits",
      buttonStyle: "bg-gray-600 hover:bg-gray-700"
    },
    {
      name: "Enterprise",
      price: "Rp 425K",
      pricePerCredit: "Rp 250 per credit",
      credits: 500,
      features: [
        "500 inquiry credits",
        "Valid for 24 months",
        "15% savings",
        "Dedicated support"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonStyle: "bg-gray-600 hover:bg-gray-700"
    }
  ];

  const faqs = [
    {
      question: "How do credits work?",
      answer: "Each inquiry or report request uses 1 credit. Credits are valid for the specified duration and never expire within that period."
    },
    {
      question: "Can I buy more credits anytime?",
      answer: "Yes, you can purchase additional credits at any time. New credits will be added to your existing balance."
    },
    {
      question: "What happens if I don't use all my credits?",
      answer: "Credits remain valid for the specified duration (6-24 months depending on the package). You can use them at your own pace."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Simple, Credit-Based
        </h1>
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Pricing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Buy credits to make inquiries and access reports. Pay only for what you use with no monthly commitments.
        </p>
      </div>

      {/* Current Balance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Current Credit Balance</h3>
              <p className="text-3xl font-bold text-blue-600">150 Credits</p>
              <p className="text-sm text-blue-700">Valid for 12 months</p>
            </div>
            <CreditCard className="h-12 w-12 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl mb-4">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900 mb-2">{plan.price}</div>
              <p className="text-sm text-gray-600 mb-4">{plan.pricePerCredit}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${plan.buttonStyle} text-white`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Usage History</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Premium search - ABC Company</p>
                  <p className="text-sm text-gray-600">Today, 2:30 PM</p>
                </div>
                <span className="text-red-600 font-medium">-2 Credits</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Detailed report access</p>
                  <p className="text-sm text-gray-600">Yesterday, 10:15 AM</p>
                </div>
                <span className="text-red-600 font-medium">-5 Credits</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Credit purchase - Standard Plan</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
                <span className="text-green-600 font-medium">+150 Credits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseCreditsSection;
