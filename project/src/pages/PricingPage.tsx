import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, Crown, Zap, Star, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      description: 'Perfect for trying out Office Stretch',
      price: 0,
      priceAnnual: 0,
      daysPerWeek: 2,
      features: [
        '2 days per week usage',
        'Basic exercise library',
        'Simple timer functionality',
        'Email support'
      ],
      buttonText: 'Current Plan',
      popular: false,
      color: 'gray'
    },
    {
      id: '3day',
      name: 'Essential',
      description: 'Great for light office workers',
      price: 3,
      priceAnnual: 30, // $2.50/month when billed annually
      daysPerWeek: 3,
      features: [
        '3 days per week usage',
        'Full exercise library',
        'Advanced timer features',
        'Custom schedules',
        'Priority email support'
      ],
      buttonText: 'Choose Essential',
      popular: false,
      color: 'blue'
    },
    {
      id: '5day',
      name: 'Professional',
      description: 'Perfect for full-time office workers',
      price: 5,
      priceAnnual: 50, // $4.17/month when billed annually
      daysPerWeek: 5,
      features: [
        '5 days per week usage',
        'Full exercise library',
        'Advanced timer features',
        'Custom schedules',
        'Browser notifications',
        'Priority email support'
      ],
      buttonText: 'Choose Professional',
      popular: true,
      color: 'green'
    },
    {
      id: '7day',
      name: 'Premium',
      description: 'For the ultimate wellness experience',
      price: 7,
      priceAnnual: 70, // $5.83/month when billed annually
      daysPerWeek: 7,
      features: [
        'Unlimited daily usage',
        'Full exercise library',
        'Advanced timer features',
        'Custom schedules',
        'Browser notifications',
        'Priority chat support',
        'Wellness analytics'
      ],
      buttonText: 'Choose Premium',
      popular: false,
      color: 'purple'
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    if (planId === 'free') {
      return; // Already on free plan
    }

    setSelectedPlan(planId);
    
    // Create Stripe checkout session
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          isAnnual,
          userId: user.id,
          userEmail: user.email
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });
        
        if (error) {
          console.error('Stripe redirect error:', error);
          alert('Error redirecting to checkout. Please try again.');
        }
      } else {
        console.error('Stripe not loaded');
        alert('Payment system not loaded. Please refresh and try again.');
      }
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setSelectedPlan(null);
    }
  };

  const getColorClasses = (color: string, popular: boolean = false) => {
    const colors = {
      gray: {
        border: 'border-gray-200',
        button: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        accent: 'text-gray-600'
      },
      blue: {
        border: 'border-blue-200',
        button: 'bg-blue-600 text-white hover:bg-blue-700',
        accent: 'text-blue-600'
      },
      green: {
        border: popular ? 'border-green-400 ring-2 ring-green-200' : 'border-green-200',
        button: 'bg-green-600 text-white hover:bg-green-700',
        accent: 'text-green-600'
      },
      purple: {
        border: 'border-purple-200',
        button: 'bg-purple-600 text-white hover:bg-purple-700',
        accent: 'text-purple-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Add Stripe.js script to head */}
      <script src="https://js.stripe.com/v3/"></script>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Office Stretch</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-800">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Choose Your Wellness Plan
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Stay healthy and productive with our flexible subscription plans designed for every work style
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                !isAnnual
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Annual
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const colors = getColorClasses(plan.color, plan.popular);
            const currentPrice = isAnnual ? plan.priceAnnual : plan.price;
            const monthlyPrice = isAnnual ? (plan.priceAnnual / 12).toFixed(2) : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 ${colors.border} hover:shadow-2xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
                    plan.color === 'gray' ? 'from-gray-400 to-gray-500' :
                    plan.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    plan.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } flex items-center justify-center`}>
                    {plan.id === 'free' && <Zap className="w-8 h-8 text-white" />}
                    {plan.id === '3day' && <Calendar className="w-8 h-8 text-white" />}
                    {plan.id === '5day' && <Crown className="w-8 h-8 text-white" />}
                    {plan.id === '7day' && <Star className="w-8 h-8 text-white" />}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {plan.id === 'free' ? (
                      <div className="text-4xl font-bold text-slate-900">Free</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-slate-900">
                          ${monthlyPrice}
                          <span className="text-lg font-normal text-slate-600">/month</span>
                        </div>
                        {isAnnual && (
                          <div className="text-sm text-green-600 mt-1">
                            Billed annually (${currentPrice}/year)
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    plan.daysPerWeek === 7 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {plan.daysPerWeek === 7 ? 'Unlimited' : `${plan.daysPerWeek} days/week`}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={selectedPlan === plan.id || (plan.id === 'free' && user)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${colors.button} ${
                    selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Processing...' : plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-slate-600">Yes! You can upgrade, downgrade, or cancel your subscription at any time from your dashboard.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">What happens when I hit my weekly limit?</h3>
              <p className="text-slate-600">The app will prompt you to upgrade your plan. Your usage resets every Monday at midnight UTC.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Do you offer refunds?</h3>
              <p className="text-slate-600">Yes, we offer a 30-day money-back guarantee for all paid plans, no questions asked.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Is my payment information secure?</h3>
              <p className="text-slate-600">Absolutely. We use Stripe for payment processing, which is bank-level secure and PCI DSS compliant.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
