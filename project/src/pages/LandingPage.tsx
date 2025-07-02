import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Play, 
  CheckCircle, 
  Users, 
  Clock, 
  Target, 
  BarChart3,
  Zap,
  Heart,
  TrendingUp,
  Star,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Set your work hours, we'll remind you when to stretch"
    },
    {
      icon: Target,
      title: "Targeted Stretches",
      description: "Stretches designed for YOUR specific pain points"
    },
    {
      icon: Zap,
      title: "Quick Sessions",
      description: "2-5 minute breaks that actually work and fit into your busy schedule"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Watch your pain levels decrease over time"
    }
  ];

  const benefits = [
    { icon: TrendingUp, stat: "95%", text: "Feel less pain" },
    { icon: Zap, stat: "3 min", text: "Average session" },
    { icon: Heart, stat: "Daily", text: "Relief" },
    { icon: CheckCircle, stat: "Pain-free", text: "Workdays" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graphic Designer",
      content: "My neck pain disappeared after just one week!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Software Developer",
      content: "Finally found stretches that actually work during coding sessions.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Writer",
      content: "Love how it fits perfectly into my writing schedule. No more afternoon back pain!",
      rating: 5
    }
  ];

  const blogPosts = [
    {
      title: "5 Desk Stretches That Actually Work",
      excerpt: "Simple stretches you can do without leaving your chair",
      readTime: "3 min read",
      date: "Dec 15, 2024",
      image: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
    },
    {
      title: "How to Stop Neck Pain Before It Starts",
      excerpt: "Prevention tips that take less than 2 minutes",
      readTime: "5 min read",
      date: "Dec 12, 2024",
      image: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg"
    },
    {
      title: "The 2-Minute Morning Routine That Changed My Workday",
      excerpt: "Start your day pain-free with this simple routine",
      readTime: "4 min read",
      date: "Dec 10, 2024",
      image: "https://images.pexels.com/photos/4498447/pexels-photo-4498447.jpeg"
    }
  ];

  const userTypes = ["Designers", "Developers", "Writers", "Analysts", "Managers", "Students"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Office Stretch</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <Link to="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link to="/blog" className="text-slate-600 hover:text-blue-600 transition-colors">Blog</Link>
              <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">Login</Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Start Free Trial
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-200 py-4">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors px-4">Features</a>
                <Link to="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors px-4">Pricing</Link>
                <Link to="/blog" className="text-slate-600 hover:text-blue-600 transition-colors px-4">Blog</Link>
                <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors px-4">Login</Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold mx-4 text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Say Goodbye to 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500"> Desk Pain</span> With Just 3 Stretches a Day
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Fully customizable break reminders with targeted stretches that focus on your pain points and fit your busy schedule. 
                Feel better, move more, work pain-free.
              </p>
              
              {/* Key Statistic */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
                <p className="text-sm text-slate-500 mb-2">Join the Community</p>
                <p className="text-lg text-slate-800">
                  <span className="font-bold text-blue-500">10,000+</span> people have already eliminated their desk pain with Office Stretch
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-slate-300 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl flex items-center justify-center overflow-hidden relative">
                <img
                  src="https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
                  alt="Person stretching at desk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-slate-800 font-semibold">Quick relief, anywhere</p>
                </div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">95%</div>
                  <div className="text-sm text-slate-600">Feel Better</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">3 min</div>
                  <div className="text-sm text-slate-600">Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Problem */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Your Body Hurts After Work</h2>
              <div className="space-y-6">
                {[
                  { icon: "😫", title: "That constant ache in your neck", desc: "Hours of looking at screens create lasting tension" },
                  { icon: "⚡", title: "Afternoon energy crashes", desc: "Poor posture drains your energy and focus" },
                  { icon: "💸", title: "Costly physical therapy sessions", desc: "Treatment is expensive and time-consuming" },
                  { icon: "😔", title: "Dreading long work days", desc: "Pain makes every hour feel longer" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">How You'll Feel Better Every Day</h2>
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, title: "Gentle reminders just for you", desc: "Smart scheduling that adapts to your workflow" },
                  { icon: Target, title: "Target exactly where you hurt", desc: "Personalized stretches for your specific pain points" },
                  { icon: Clock, title: "Works with YOUR schedule", desc: "2-5 minute sessions that don't disrupt your work" },
                  { icon: BarChart3, title: "Feel better in days, not weeks", desc: "Track your progress and see real improvements" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need for a Pain-Free Workday</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Personalized stretching tools designed specifically for busy professionals like you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Real Results from Real People</h2>
            <p className="text-xl text-slate-600">See what happens when you prioritize your stretching</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{benefit.stat}</div>
                <p className="text-slate-600">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Loved by Busy Professionals</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
              <div><span className="font-bold">10,000+</span> happy users</div>
              <div><span className="font-bold">50+</span> pain-free countries</div>
              <div><span className="font-bold">1M+</span> stretches completed</div>
            </div>
          </div>
          
          {/* User Types */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center opacity-90">
            {userTypes.map((userType, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-4 text-center text-white font-semibold">
                {userType}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Stretching Tips</h2>
            <p className="text-xl text-slate-600">Expert advice to help you feel your best every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{post.title}</h3>
                  <p className="text-slate-600 mb-4">{post.excerpt}</p>
                  <Link 
                    to="/blog" 
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Feel Better Every Day?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of people who've said goodbye to desk pain. 
            Start your journey to pain-free workdays.
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-blue-200 mt-4">No credit card required • Feel better in 7 days</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Office Stretch</span>
              </div>
              <p className="text-slate-400 mb-4">
                Helping you feel your best, every workday.
              </p>
              <div className="flex gap-4">
                {/* Social Media Icons */}
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Office Stretch. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Product Demo</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Demo video coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;