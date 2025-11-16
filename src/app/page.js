import Testimonials from "./Testimonials";
import Footer from "./Footer";
import Header from "./Header";

import WhyChooseUs from "./WhyChooseUs";
import MealPlanCTA from "./MealPlanCTA";
import Aboutblock from "./Aboutblock"
import PopularMeals from "./PopularMeals";


import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main>

      <Header/>

      {/* Banner */}
      <section className="relative h-[80vh] flex items-center justify-center text-center text-white bg-cover bg-center bg-[url('/banner.jpg')]">
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-5xl font-Poppins mb-4">
            Eat <span className="font-quicksand" style={{ color: "#7ab530" }}>Healthy</span>, Feel{" "}
            <span style={{ color: "#7ab530" }}>Great</span>
          </h1>

          <p className="text-lg mb-6 text-gray-200">
            Discover personalized meal plans crafted just for your goals — powered by smart nutrition.
          </p>

          <button className="px-8 py-3 rounded-full bg-[#7ab530] text-white transition-colors duration-700 hover:bg-transparent hover:text-[#7ab530]">
            Get Started
          </button>
        </div>
      </section>
      <Aboutblock />
      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Meal Plan CTA Section */}
      <MealPlanCTA />

      {/* Popular Meals Section */}
      <PopularMeals />

      {/* Testimonials Section */}
      
      <Testimonials />
      <div className="mb-16" >

      <Footer/>
      </div>
    </main>
  );
}
