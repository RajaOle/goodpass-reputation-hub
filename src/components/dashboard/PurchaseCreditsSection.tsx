import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleBuyClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setPaymentState('idle');
  };

  const handleProceedPayment = () => {
    setPaymentState('processing');
    setTimeout(() => {
      // Simulate payment success (80% chance)
      if (Math.random() < 0.8) {
        setPaymentState('success');
      } else {
        setPaymentState('error');
      }
    }, 1800);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setPaymentState('idle');
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'} transition-transform duration-200`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Most Popular
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-70 pointer-events-none" />
            <CardHeader className="text-center pb-4 relative z-10">
              <CardTitle className="text-2xl mb-4 font-extrabold tracking-tight text-gray-900">{plan.name}</CardTitle>
              <div className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">{plan.price}</div>
              <p className="text-sm text-gray-600 mb-4">{plan.pricePerCredit}</p>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${plan.buttonStyle} text-white text-lg font-semibold py-3 rounded-xl shadow-md transition-transform duration-150 hover:scale-105`}
                onClick={() => handleBuyClick(plan)}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md w-full rounded-2xl shadow-2xl p-0 overflow-hidden border-0 bg-gradient-to-br from-blue-100 to-white">
          {paymentState === 'idle' && selectedPlan && (
            <div className="p-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h2>
              <div className="text-lg font-semibold text-blue-700 mb-1">{selectedPlan.name} Plan</div>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">{selectedPlan.price}</div>
              <div className="text-gray-600 mb-4">{selectedPlan.credits} credits &bull; {selectedPlan.pricePerCredit}</div>
              <ul className="space-y-2 mb-6 w-full">
                {selectedPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700"><Check className="h-4 w-4 text-green-500" /> {feature}</li>
                ))}
              </ul>
              <div className="flex gap-4 w-full">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 rounded-xl shadow" onClick={handleProceedPayment}>
                  Proceed to Payment
                </Button>
                <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg py-2 rounded-xl shadow" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {paymentState === 'processing' && (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-6" />
              <div className="text-lg font-semibold text-gray-700">Processing Payment...</div>
            </div>
          )}
          {paymentState === 'success' && (
            <div className="p-12 flex flex-col items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500 animate-bounce mb-4" />
              <div className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</div>
              <div className="text-gray-700 mb-4">You have purchased <span className="font-bold">{selectedPlan.credits} credits</span>.</div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 rounded-xl shadow" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          )}
          {paymentState === 'error' && (
            <div className="p-12 flex flex-col items-center justify-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <div className="text-2xl font-bold text-red-700 mb-2">Payment Failed</div>
              <div className="text-gray-700 mb-4">There was a problem processing your payment. Please try again.</div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 rounded-xl shadow" onClick={handleProceedPayment}>
                Retry
              </Button>
              <Button className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg py-2 rounded-xl shadow" variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Section */}
      <div>
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
