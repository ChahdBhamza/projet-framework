import Footer from "../Footer";
import Header from "../Header";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Zap, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Aboutus() {
  return (
    <main>
      {/* Navbar */}
      <Header/>

      {/* Banner */}
       <section className="relative h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center bg-[url('/banner.jpg')]">
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-7xl font-Poppins mb-5 mt-5">
            About <span className="font-quicksand text-[#7ab530]">Us</span>
          </h1>

          <p className="text-lg mb-6 text-gray-200">
            Discover personalized meal plans crafted just for your goals — powered by smart nutrition.
          </p>

          <button className="px-8 py-3 rounded-full bg-[#7ab530] text-white transition-colors duration-700 hover:bg-transparent hover:text-[#7ab530]">
            Get Started
          </button>
        </div>
      </section>
      {/* Founder's Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] group">
            <Image
              src="/happyperson.jpg"
              alt="Founder story"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Right: Copy */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-[#e8f7d6] text-[#6aa42a] text-sm font-semibold">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#1f2937]">
              Fast forward to today, and we've helped people around the world feel confident about eating well and living fully.
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis.
            </p>
            <button className="inline-flex items-center gap-2 text-[#7ab530] font-semibold hover:gap-3 transition-all">
              Learn more <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Emphasis quote */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#f0fdf4] via-white to-[#e8f7d6]">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-semibold text-[#1f2937] leading-relaxed italic">
            "Eating kale doesn't matter when so many other elements of your life aren't working! When I started approaching my wellbeing as self-care in a really holistic way, everything changed."
          </blockquote>
        </div>
      </section>

      {/* Nourish your body section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text block */}
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold text-[#1f2937] leading-tight">
              Nourish your body, fuel your goals
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              At FitMeal, we believe eating healthy should be enjoyable, accessible, and tailored to your lifestyle. Our mission is to inspire people to live better through mindful nutrition and smart planning.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Every plan is crafted to balance flavor and nutrition — so you can eat what you love while achieving your wellness goals.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <CheckCircle2 className="w-5 h-5 text-[#7ab530] flex-shrink-0" />
              <span className="text-gray-700 font-medium">Science-backed nutrition plans</span>
            </div>
          </div>

          {/* Right: 4-Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              "/rainbow vegbowl.jpg",
               "/salmon.jpg",
              
              "/chickenherbed.jpg",
              "/citrusquinoa.jpg",
             
            ].map((imageSrc, i) => (
              <div key={i} className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
                <Image 
                  src={imageSrc} 
                  alt={`Healthy meal ${i + 1}`} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f9fafb] to-[#f0fdf4]"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4">What Makes Us Different</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore the core features that set FitMeal apart</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: CheckCircle2, title: "Balanced", desc: "Macros made simple", color: "from-[#e8f7d6] to-[#d1fae5]" },
              { icon: Zap, title: "Fast", desc: "15-min recipes", color: "from-[#cffafe] to-[#a5f3fc]" },
              { icon: ShoppingCart, title: "Smart lists", desc: "Zero food waste", color: "from-[#fef3c7] to-[#fde68a]" },
              { icon: TrendingUp, title: "Habits", desc: "Track what matters", color: "from-[#f3e8ff] to-[#e9d5ff]" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`rounded-2xl p-6 bg-gradient-to-br ${item.color} shadow-sm hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1`}>
                  <Icon className="w-8 h-8 text-[#7ab530] mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-[#1f2937] text-lg">{item.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h3 className="text-2xl font-bold text-[#1f2937] mb-6">Frequently asked questions</h3>
            {[
              { q: "How does FitMeal personalize plans?", a: "We adapt to your goals, preferences, and schedule—then let you swap, resize, and save meals." },
              { q: "Do I need special ingredients?", a: "Nope. We keep grocery lists practical and flexible with easy substitutions." },
            ].map((item, idx) => (
              <details key={idx} className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:ring-[#7ab530]/30 transition-all">
                <summary className="cursor-pointer list-none font-semibold text-[#1f2937] flex items-center justify-between">
                  {item.q}
                  <span className="text-[#7ab530] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#7ab530] to-[#6aa42a] p-12 md:p-16 text-white shadow-2xl">
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Start your first plan today</h3>
            <p className="text-lg text-green-50 mb-8 leading-relaxed">
              Pick your preferences, set your goals, and we'll do the planning.
            </p>
            <button className="px-8 py-4 rounded-full bg-white text-[#7ab530] font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Get started
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
