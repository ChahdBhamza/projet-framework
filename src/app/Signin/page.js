import link from "next/link"
export default function Signin(){


    return( 
        <main>
               {/* Navbar */}
      <header className="navbar flex items-center justify-between p-6">
        <div className="logo">
          <h2 id="logotx" className="text-1xl ">FitMeal</h2>
        </div>

        <nav className="nav-links flex gap-6">
          <a href="/">Home</a>
          <a href="#PopularMeals">Products</a>
          <a href="#">MealPlans</a>
          <a href="/Aboutus">About us</a>
        </nav>

        <div className="actions flex gap-3">
          <button className="border border-green-600 text-green-600 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition">
            Sign In
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
            Sign Up
          </button>
        </div>
      </header>
            
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

        </main>
    )
}