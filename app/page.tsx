"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Check, 
  Tv, 
  Smartphone, 
  Headphones, 
  Zap, 
  Shield, 
  Globe,
  Star,
  ChevronDown
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* Background Effects */}
      <div className="fixed left-0 top-96 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
<div className="fixed right-0 top-96 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-black/80 border-b border-slate-800" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4 md:py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="DreamStream"
              width={50}
              height={50}
              className="rounded-xl"
              priority
            />
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-white">Dream</span>
              <span className="text-blue-500">Stream</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 text-lg">
            <button onClick={() => scrollToSection("home")} className="hover:text-blue-400 transition">Home</button>
            <button onClick={() => scrollToSection("features")} className="hover:text-blue-400 transition">Features</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-blue-400 transition">Pricing</button>
            <button onClick={() => scrollToSection("testimonials")} className="hover:text-blue-400 transition">Testimonials</button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-blue-400 transition">FAQ</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-blue-400 transition">Contact</button>
          </div>

          <div className="hidden md:block">
            <Link
              href="/form"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden backdrop-blur-md bg-black/95 border-b border-slate-800">
            <div className="px-6 py-4 space-y-3">
              <button onClick={() => scrollToSection("home")} className="block w-full text-left py-2 hover:text-blue-400 transition">Home</button>
              <button onClick={() => scrollToSection("features")} className="block w-full text-left py-2 hover:text-blue-400 transition">Features</button>
              <button onClick={() => scrollToSection("pricing")} className="block w-full text-left py-2 hover:text-blue-400 transition">Pricing</button>
              <button onClick={() => scrollToSection("testimonials")} className="block w-full text-left py-2 hover:text-blue-400 transition">Testimonials</button>
              <button onClick={() => scrollToSection("faq")} className="block w-full text-left py-2 hover:text-blue-400 transition">FAQ</button>
              <button onClick={() => scrollToSection("contact")} className="block w-full text-left py-2 hover:text-blue-400 transition">Contact</button>
              <Link
                href="/form"
                className="block w-full text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold mt-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative max-w-7xl mx-auto text-center px-6 pt-40 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
          <Zap size={16} />
          <span>Trusted by 10,000+ streamers worldwide</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
          Premium Streaming
          <span className="block text-blue-500">Reimagined</span>
        </h1>

        <p className="max-w-3xl mx-auto mt-8 text-xl md:text-2xl text-gray-400 leading-relaxed">
          Enjoy HD and 4K streaming on all your devices with blazing-fast performance 
          and a modern experience designed for you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <Link
            href="/form"
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl text-lg font-semibold transition flex items-center justify-center gap-2"
          >
            Start Free Trial
            <Check size={20} />
          </Link>
          <button
            onClick={() => scrollToSection("pricing")}
            className="border border-slate-700 hover:bg-slate-800 px-10 py-4 rounded-2xl text-lg transition"
          >
            View Plans
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-green-500" />
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-blue-500" />
            <span className="text-sm">Available Worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones size={20} className="text-purple-500" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose DreamStream?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience streaming like never before with our cutting-edge features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Tv size={32} />}
            title="4K Ultra HD Quality"
            description="Crystal clear picture quality with HDR support on every device. Stream in stunning detail."
          />
          <FeatureCard
            icon={<Smartphone size={32} />}
            title="Seamless Device Switching"
            description="Start watching on your TV, continue on your phone. Your progress syncs automatically across all devices."
          />
          <FeatureCard
            icon={<Zap size={32} />}
            title="Lightning Fast"
            description="Zero buffering with our global CDN. Start watching instantly, every time."
          />
          <FeatureCard
            icon={<Headphones size={32} />}
            title="24/7 Premium Support"
            description="Our expert team is always ready to help you with any questions or issues."
          />
          <FeatureCard
            icon={<Shield size={32} />}
            title="Secure & Private"
            description="Your data is protected with enterprise-grade encryption and privacy controls."
          />
          <FeatureCard
            icon={<Globe size={32} />}
            title="Global Access"
            description="Access your content from anywhere in the world with no restrictions."
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your streaming needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic */}
          <PricingCard
            name="Basic"
            price="9.99"
            period="year"
            description="Perfect for individuals"
            features={[
              "HD Streaming (1080p)",
              "Limited Content Library",
              "Email Support",
              "Ad-supported"
            ]}
            cta="Subscribe"
            href="/form?plan=basic"
          />

          {/* Advanced */}
          <PricingCard
            name="Advanced"
            price="24.99"
            period="year"
            description="Most Popular"
            features={[
              "Full HD Streaming (1080p)",
              "One device at a time",
              "Full Content Library",
              "Priority Support",
              "No Ads",
              "Download for Offline"
            ]}
            cta="Subscribe"
            href="/form?plan=advance"
            highlighted
          />

          {/* Premium */}
          <PricingCard
            name="Premium"
            price="69.99"
            period="year"
            description="Ultimate experience"
            features={[
              "4K Ultra HD + HDR",
              "One device at a time",
              "Exclusive Premium Content",
              "24/7 VIP Support",
              "No Ads",
              "Unlimited Downloads",
              "Early Access to New Features"
            ]}
            cta="Subscribe"
            href="/form?plan=premium"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-xl text-gray-400">See what our customers have to say</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <TestimonialCard
            stars={5}
            text="Best streaming service I've ever used! The 4K quality is absolutely stunning and I never experience buffering."
            author="Sarah Johnson"
            role="Premium Member"
          />
          <TestimonialCard
            stars={5}
            text="Amazing value for money. The Advanced plan gives me everything I need for my family. Highly recommend!"
            author="Michael Chen"
            role="Advanced Member"
          />
          <TestimonialCard
            stars={5}
            text="Customer support is incredible. They helped me set up on all my devices in minutes. 10/10 service!"
            author="Emma Williams"
            role="Basic Member"
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400">Everything you need to know</p>
        </div>

        <div className="space-y-4">
          <FAQItem
            question="Can I cancel my subscription anytime?"
            answer="Yes! You can cancel your subscription at any time with no questions asked. Your access will continue until the end of your billing period."
          />
          <FAQItem
            question="What devices are supported?"
            answer="DreamStream works on Smart TVs (Samsung, LG, Android TV), smartphones (iOS & Android), tablets, laptops, gaming consoles (PlayStation, Xbox), and streaming devices (Roku, Fire TV, Apple TV)."
          />
          <FAQItem
            question="Is there a free trial?"
            answer="Yes! We offer a 24-hour free trial on all plans. No credit card required to start."
          />
          <FAQItem
            question="Can I upgrade or downgrade my plan?"
            answer="Absolutely! You can change your plan at any time from your account settings. Changes take effect immediately."
          />
          <FAQItem
            question="Do you offer refunds?"
            answer="Yes, we offer a 3-day money-back guarantee. If you're not satisfied, contact our support team for a full refund."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Streaming?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and experience the future of streaming today.
          </p>
          <Link
            href="/form"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition"
          >
            Get Started Now
            <Check size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="DreamStream"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <h3 className="text-2xl font-bold">
                  <span className="text-white">Dream</span>
                  <span className="text-blue-500">Stream</span>
                </h3>
              </div>
              <p className="text-gray-400">Premium streaming reimagined for the modern world.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition">Features</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-white transition">Pricing</button></li>
                <li><Link href="/form" className="hover:text-white transition">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection("testimonials")} className="hover:text-white transition">Testimonials</button></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:text-white transition">FAQ</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-white transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@dreamstream.com</li>
                <li>24/7 Support Available</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-gray-400">
            <p>© 2026 DreamStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Subcomponents ---------- */
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 group">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mt-6">{title}</h3>
      <p className="text-gray-400 mt-4 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`rounded-3xl p-8 ${
      highlighted 
        ? "bg-blue-600 scale-105 shadow-2xl shadow-blue-600/25" 
        : "bg-slate-900 border border-slate-800"
    }`}>
      <h3 className="text-2xl font-bold">{name}</h3>
      <p className={`mt-2 ${highlighted ? "text-blue-100" : "text-gray-400"}`}>{description}</p>
      
      <div className="mt-6">
        <span className="text-5xl font-bold">€{price}</span>
        <span className={`${highlighted ? "text-blue-100" : "text-gray-400"}`}>/{period}</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check size={20} className={highlighted ? "text-white" : "text-blue-500"} />
            <span className={highlighted ? "text-white" : "text-gray-300"}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`block text-center w-full mt-10 py-4 rounded-xl font-semibold transition ${
          highlighted 
            ? "bg-black hover:bg-gray-900 text-white" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function TestimonialCard({ stars, text, author, role }: { stars: number; text: string; author: string; role: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8">
      <div className="flex gap-1 mb-4">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} size={20} className="fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">"{text}"</p>
      <div>
        <p className="font-bold">{author}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-900 transition"
      >
        <span className="font-semibold text-lg">{question}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}