import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Briefcase, Users, MessageSquare, Zap, ArrowRight, Check, ChevronDown } from "lucide-react";

function Landing() {
  const [activeTab, setActiveTab] = useState("applicant");
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      q: "Is DesignHire free to use?",
      a: "Yes! Applicants can browse and apply to jobs for free. Recruiters get premium features with affordable plans.",
    },
    {
      q: "How long does it take to find a job?",
      a: "Our average applicant gets matched within 3-5 days. It depends on your skills and the available opportunities.",
    },
    {
      q: "Are profiles verified?",
      a: "We verify all profiles to ensure quality. Both designers and recruiters go through our screening process.",
    },
    {
      q: "Can I apply to multiple jobs?",
      a: "Absolutely! Apply to as many jobs as you want. Track all your applications in one dashboard.",
    },
    {
      q: "How do payments work?",
      a: "Secure payments through our platform. Funds are protected until project completion.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      text: "Found my dream project within a week. DesignHire's platform is intuitive and the team is supportive!",
      rating: 5,
    },
    {
      name: "Marco Rossi",
      role: "Creative Director",
      text: "Hired 5 talented designers through DesignHire. The quality of applicants is exceptional.",
      rating: 5,
    },
    {
      name: "Lisa Wong",
      role: "Freelance Designer",
      text: "Love how easy it is to manage applications and communicate directly with clients.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="flex justify-between items-center px-6 sm:px-12 py-4 max-w-7xl mx-auto w-full">
          <div className="text-3xl font-black bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent">
            DesignHire
          </div>
          <div className="flex gap-4">
            <Link
              to="/signin"
              className="px-6 py-2 rounded-lg font-semibold text-gray-700 hover:text-gray-900 transition">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 bg-gradient-to-br from-[#48c6ef]/5 to-[#6f86d6]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Connect with Design <span className="bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent">Talent</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Find your next design opportunity or discover top creative talent. DesignHire connects designers with projects they love.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent">1000+</div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent">500+</div>
                  <p className="text-sm text-gray-600">Designers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent">4.9★</div>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:scale-105 transition transform text-center">
                  Get Started
                </Link>
                <Link
                  to="/signin"
                  className="border-2 border-gray-300 text-gray-900 font-bold px-8 py-4 rounded-lg hover:border-gray-900 transition text-center">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div
              className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#48c6ef]/20 to-[#6f86d6]/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">New Design Job</p>
                        <p className="text-xs text-gray-500">UI/UX Designer • Startup</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#48c6ef]/40 to-[#6f86d6]/40 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Application Accepted</p>
                        <p className="text-xs text-gray-500">You got the job!</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#48c6ef]/20 to-[#6f86d6]/20 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Message from Client</p>
                        <p className="text-xs text-gray-500">Let's discuss the project...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Role Selection Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#48c6ef]/5 to-[#6f86d6]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Designed for You
            </h2>
            <p className="text-lg text-gray-600">Features tailored to your needs</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("applicant")}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${activeTab === "applicant"
                    ? "bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Users className="inline mr-2" size={20} />
                Job Seekers
              </button>
              <button
                onClick={() => setActiveTab("recruiter")}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${activeTab === "recruiter"
                    ? "bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Briefcase className="inline mr-2" size={20} />
                Recruiters
              </button>
            </div>
          </div>

          {/* Sliding Content */}
          <div className="relative h-auto overflow-hidden">
            {/* Job Seeker Content */}
            <div
              className={`transition-all duration-500 ${activeTab === "applicant"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full absolute"
                }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Smart Search", desc: "Filter by skills, salary, and project type", icon: "🔍" },
                  { title: "One-Click Apply", desc: "Apply to jobs in seconds", icon: "⚡" },
                  { title: "Track Progress", desc: "Monitor all your applications", icon: "📊" },
                ].map((feat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition">
                    <div className="text-4xl mb-4">{feat.icon}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h4>
                    <p className="text-gray-600">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Content */}
            <div
              className={`transition-all duration-500 ${activeTab === "recruiter"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full absolute"
                }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Easy Posting", desc: "Create job postings in minutes", icon: "📝" },
                  { title: "Talent Pool", desc: "Access verified talented designers", icon: "👥" },
                  { title: "Analytics", desc: "Track applications and job performance", icon: "📈" },
                ].map((feat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition">
                    <div className="text-4xl mb-4">{feat.icon}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h4>
                    <p className="text-gray-600">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved by Designers & Recruiters
            </h2>
            <p className="text-lg text-gray-600">See what our community says</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#48c6ef]/5 to-[#6f86d6]/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition">
                  <span className="text-lg font-bold text-gray-900 text-left">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-[#48c6ef] flex-shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-8 pb-6 pt-0 text-gray-600 border-t border-gray-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">Get the latest jobs, tips, and updates delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#48c6ef]"
            />
            <button className="bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of designers and recruiters already on DesignHire.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-lg bg-white text-[#6f86d6] hover:shadow-lg hover:scale-105 transition transform">
            Start Your Journey <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white text-center">
        <p className="text-gray-400">© 2024 DesignHire. Crafted for the design community.</p>
      </footer>
    </div>
  );
}

export default Landing;
