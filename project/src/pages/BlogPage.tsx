import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, User, ArrowRight, Calendar } from 'lucide-react';

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Desk Stretches That Actually Work",
      excerpt: "Simple stretches you can do without leaving your chair to reduce tension and improve circulation.",
      content: "Discover the most effective desk stretches that busy professionals swear by...",
      author: "Dr. Sarah Chen",
      readTime: "3 min read",
      date: "December 15, 2024",
      category: "Stretches",
      image: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg",
      featured: true
    },
    {
      id: 2,
      title: "The Science Behind Micro-Breaks",
      excerpt: "Why short, frequent breaks are more effective than long ones for maintaining productivity and health.",
      content: "Research shows that micro-breaks can significantly improve focus and reduce fatigue...",
      author: "Dr. Michael Rodriguez",
      readTime: "5 min read",
      date: "December 12, 2024",
      category: "Research",
      image: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg",
      featured: false
    },
    {
      id: 3,
      title: "Building a Stretching Culture at Work",
      excerpt: "How to get your entire team on board with workplace stretching initiatives and create lasting change.",
      content: "Creating a culture of stretching requires more than just good intentions...",
      author: "Emily Johnson",
      readTime: "4 min read",
      date: "December 10, 2024",
      category: "Culture",
      image: "https://images.pexels.com/photos/4498447/pexels-photo-4498447.jpeg",
      featured: false
    },
    {
      id: 4,
      title: "Ergonomics 101: Setting Up Your Workspace",
      excerpt: "A comprehensive guide to creating an ergonomic workspace that prevents pain and boosts productivity.",
      content: "Your workspace setup can make or break your physical health...",
      author: "Dr. Lisa Park",
      readTime: "6 min read",
      date: "December 8, 2024",
      category: "Ergonomics",
      image: "https://images.pexels.com/photos/4498159/pexels-photo-4498159.jpeg",
      featured: false
    },
    {
      id: 5,
      title: "Managing Screen Time for Better Eye Health",
      excerpt: "Practical tips to reduce eye strain and protect your vision during long work sessions.",
      content: "Digital eye strain affects millions of office workers worldwide...",
      author: "Dr. James Wilson",
      readTime: "4 min read",
      date: "December 5, 2024",
      category: "Health",
      image: "https://images.pexels.com/photos/4498835/pexels-photo-4498835.jpeg",
      featured: false
    },
    {
      id: 6,
      title: "The Psychology of Workplace Stretching",
      excerpt: "Understanding the mental health benefits of physical stretching programs in the workplace.",
      content: "Physical and mental health are more connected than most people realize...",
      author: "Dr. Amanda Foster",
      readTime: "7 min read",
      date: "December 3, 2024",
      category: "Psychology",
      image: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg",
      featured: false
    }
  ];

  const categories = ["All", "Stretches", "Research", "Culture", "Ergonomics", "Health", "Psychology"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
                Home
              </Link>
              <Link to="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Stretching Blog
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Expert insights, practical tips, and the latest research on workplace stretching 
              to help you and your team thrive.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-square bg-slate-200 overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        Featured
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-20">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get the latest stretching tips, research insights, and product updates 
                delivered straight to your inbox.
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
                  Subscribe
                </button>
              </div>
              <p className="text-blue-200 mt-4 text-sm">
                No spam, unsubscribe at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;