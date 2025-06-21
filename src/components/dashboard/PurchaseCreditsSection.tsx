
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Zap, Crown, Star } from 'lucide-react';

const PurchaseCreditsSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      credits: 50,
      icon: Zap,
      features: [
        "50 premium searches",
        "Basic report access",
        "Email support",
        "Standard response time"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$19.99",
      credits: 150,
      icon: Star,
      features: [
        "150 premium searches",
        "Full report access",
        "Priority support",
        "Advanced analytics",
        "Export capabilities"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49.99",
      credits: 500,
      icon: Crown,
      features: [
        "500 premium searches",
        "Unlimited report access",
        "24/7 dedicated support",
        "Custom integrations",
        "API access",
        "White-label options"
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Credits</h1>
        <p className="text-gray-600">Upgrade your account to access premium features and detailed reports.</p>
      </div>

      {/* Current Balance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Current Credit Balance</h3>
              <p className="text-3xl font-bold text-blue-600">25 Credits</p>
              <p className="text-sm text-blue-700">Expires in 30 days</p>
            </div>
            <CreditCard className="h-12 w-12 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto rounded-lg ${plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{plan.price}</div>
                  <p className="text-gray-600">{plan.credits} Credits</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    Purchase Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
                  <p className="font-medium">Credit purchase - Pro Plan</p>
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
