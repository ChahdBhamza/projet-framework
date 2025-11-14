import Footer from "../Footer";
import Image from "next/image";
import Link from "next/link";
export default function Aboutus() {
  return (
    <main>
      {/* Navbar */}
      <header className="navbar flex items-center justify-between p-6">
        <div className="logo">
          <h2 id="logotx" className="text-1xl">FitMeal</h2>
        </div>

        <nav className="nav-links flex gap-6">
          <a href="/">Home</a>
          <a href="#PopularMeals">Products</a>
          <a href="#">MealPlans</a>
          <a href="/Aboutus">About us</a>
        </nav>
        
        <div className="actions flex gap-3">
        <Link href="/Signin">
          <button className="  border border-[#7ab530] text-[#7ab530] px-4 py-2 rounded-full hover:bg-[#7ab530] hover:text-white transition">
            Sign In
          </button>
          </Link>
          <Link href="/Signup">
          <button className="bg-[#7ab530] text-white px-4 py-2 rounded-full hover:bg-[#7ab530]-900 transition">
            Sign Up
          </button>
          </Link>
        </div>
      </header>

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
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Image */}
          <div className="relative rounded-2xl overflow-hidden shadow ring-1 ring-gray-100 h-[500px]">
            <Image
              src="/happyperson.jpg"
              alt="Founder story"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Copy */}
          <div>
            <div className="text-[#7ab530] font-semibold mb-2">
              It’s about being you, only better!
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug mb-4">
              Fast forward to today, and we’ve helped people around the world
              feel confident about eating well and living fully.
            </h2>
            <p className="text-gray-600 mb-4">
              Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet
              adipiscing sem neque sed ipsum. Nunc quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
            </p>
            <p className="text-gray-600 mb-4">
              Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in,
              viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.
            </p>
            <p className="text-gray-600">
              Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit
              consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris.
            </p>
          </div>
        </div>
          {/* Emphasis quote */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-medium text-[#3f6212]">
            Eating kale doesn’t matter when so many other elements of your life aren’t working! 
            When I started approaching my wellbeing as self-care in a really holistic way, everything changed.
          </h3>
        </div>
      </section>

      </section>

      {/* 💚 NEW SECTION: Left Text + 4 Images */}
      <section className="py-16 px-6 bg-[#e8f7d6]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center ">
          {/* Left: Text block with light green background */}
          <div className=" p-10 rounded-2xl h-full flex flex-col justify-center">
            <h3 className="text-3xl font-semibold mb-4 text-[#1f2937]">
              Nourish your body, fuel your goals
            </h3>
            <p className="text-gray-700 mb-4">
              At FitMeal, we believe eating healthy should be enjoyable, accessible, 
              and tailored to your lifestyle. Our mission is to inspire people to 
              live better through mindful nutrition and smart planning.
            </p>
            <p className="text-gray-700">
              Every plan is crafted to balance flavor and nutrition — so you can eat 
              what you love while achieving your wellness goals.
            </p>
          </div>

          {/* Right: 4-Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
              <Image src="/meal1.jpg" alt="Healthy meal 1" fill className="object-cover" />
            </div>
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
              <Image src="/meal2.jpg" alt="Healthy meal 2" fill className="object-cover" />
            </div>
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
              <Image src="/meal3.jpg" alt="Healthy meal 3" fill className="object-cover" />
            </div>
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
              <Image src="/meal4.jpg" alt="Healthy meal 4" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

    
      {/* Highlights */}
      <section className="relative py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f0fdf4] via-white to-[#ecfeff]"></div>
        <div className="relative max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center text-[#7ab530]">Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: "🥗", title: "Balanced", desc: "Macros made simple", color: "bg-[#e8f7d6]" },
              { icon: "⏱️", title: "Fast", desc: "15-min recipes", color: "bg-[#cffafe]" },
              { icon: "🛒", title: "Smart lists", desc: "Zero food waste", color: "bg-[#fde68a]" },
              { icon: "📈", title: "Habits", desc: "Track what matters", color: "bg-[#e9d5ff]" },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl p-5 ${item.color} text-[#1f2937] shadow-sm`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-700">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-10 max-w-3xl mx-auto">
            <details className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 mb-3">
              <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                How does FitMeal personalize plans?
                <span className="text-[#7ab530]">+</span>
              </summary>
              <p className="text-gray-600 mt-3">
                We adapt to your goals, preferences, and schedule—then let you swap, resize, and save meals.
              </p>
            </details>
            <details className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                Do I need special ingredients?
                <span className="text-[#7ab530]">+</span>
              </summary>
              <p className="text-gray-600 mt-3">
                Nope. We keep grocery lists practical and flexible with easy substitutions.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center rounded-2xl bg-gradient-to-tr from-[#d1fae5] to-[#cffafe] p-10">
          <h3 className="text-3xl font-semibold mb-3 text-[#1f2937]">Start your first plan today</h3>
          <p className="text-gray-700 mb-6">
            Pick your preferences, set your goals, and we’ll do the planning.
          </p>
          <a href="#" className="px-6 py-3 rounded-full bg-[#7ab530] text-white hover:bg-[#6aa42a] transition-colors">
            Get started
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
