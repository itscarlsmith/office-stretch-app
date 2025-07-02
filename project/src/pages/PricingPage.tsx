import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, ArrowLeft, Zap } from 'lucide-react';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Office Stretch</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                Back to Home
              </Link>
              <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Simple, Affordable Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Get started for less than the cost of a single physical therapy session. 
              No hidden fees, no long-term commitments.
            </p>
            
            {/* Annual Discount Banner */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>💰</span>
              Save 20% with annual billing
            </div>
          </div>

          {/* Single Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-500 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-500">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Office Stretch</h3>
                <p className="text-slate-600 mb-4">Everything you need to feel better</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">$9</span>
                  <span className="text-slate-600">/month</span>
                  <div className="text-sm text-slate-500 mt-1">
                    $86/year (save 20%)
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited personalized reminders",
                  "50+ targeted stretches",
                  "Progress tracking",
                  "Works on any device",
                  "Cancel anytime"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className="block w-full py-4 rounded-2xl font-semibold text-center transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:shadow-xl"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Why This is a Great Deal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-500 mb-2">$150+</div>
                  <p className="text-slate-600">Single physical therapy session</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-500 mb-2">$50+</div>
                  <p className="text-slate-600">Monthly gym membership</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500 mb-2">$9</div>
                  <p className="text-slate-600">Office Stretch (monthly)</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Is there a free trial?",
                  answer: "Yes! You get a 14-day free trial with full access to all features. No credit card required to get started."
                },
                {
                  question: "Can I cancel anytime?",
                  answer: "Absolutely. You can cancel your subscription at any time with just one click. No questions asked."
                },
                {
                  question: "What devices does it work on?",
                  answer: "Office Stretch works on any device with a web browser - desktop, laptop, tablet, or phone."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full."
                },
                {
                  question: "How is this different from YouTube videos?",
                  answer: "We provide personalized reminders, track your progress, and offer stretches specifically designed for office workers. It's like having a personal stretching coach."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to feel better?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of people who've eliminated their desk pain
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Start Your Free Trial
              </Link>
              <p className="text-blue-200 mt-4 text-sm">No credit card required • Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;