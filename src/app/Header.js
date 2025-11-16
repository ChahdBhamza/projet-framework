import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="navbar flex items-center justify-between p-6">
      {/* Navbar */}
      <div className="logo">
        <h2 id="logotx" className="text-1xl">Dietopia</h2>
      </div>

      <nav className="nav-links flex gap-6">
        <a href="/">Home</a>
        <a href="/Products">Products</a>
        <a href="/MealPlans">MealPlans</a>
        <a href="/Aboutus">About us</a>
      </nav>

      <div className="actions flex gap-3">
        <Link href="/Signin">
          <button className="border border-[#7ab530] text-[#7ab530] px-4 py-2 rounded-full hover:bg-[#7ab530] hover:text-white transition">
            Sign In
          </button>
        </Link>
        <Link href="/Signup">
          <button className="bg-[#7ab530] text-white px-4 py-2 rounded-full hover:bg-[#6ba027] transition">
            Sign Up
          </button>
        </Link>
      </div>
    </header>
  );
}
