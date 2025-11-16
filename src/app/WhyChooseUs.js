export default function WhyChooseUs() {
  return (
    <section className="why-choose-us py-16 px-6" >
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Title */}
        <p className="text-lg  mb-2 text-gray-700">Why Choose Us</p>
        
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl mb-12 text-gray-900">
          Why Choose <span style ={{ color: '#7ab530',fontWeight: 'bold' }}>FitMeal?</span>
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Feature 1 - Quality */}
          <div className="feature-card flex flex-col items-center text-center px-6">
            {/* Crown Icon */}
            <div className="icon-container mb-6">
              <svg 
                className="w-16 h-16" 
                fill="none" 
                stroke="#7ab530" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L8 8h8l-4-6z" />
                <path d="M8 8v6l4 3 4-3V8" />
                <path d="M8 14l-3 8h14l-3-8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Quality You Can Trust</h3>
            <p className="text-gray-700 leading-relaxed">
              Our meal plans are carefully crafted by certified nutritionists to ensure balanced nutrition and delicious flavors. We go above and beyond to bring you the best quality meal recommendations, so you can enjoy each bite while meeting your health goals.
            </p>
          </div>

          {/* Feature 2 - Convenience */}
          <div className="feature-card flex flex-col items-center text-center px-6">
            {/* Delivery Truck Icon */}
            <div className="icon-container mb-6">
              <svg 
                className="w-16 h-16" 
                fill="none" 
                stroke="#7ab530" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
                <path d="M16 11h-3" strokeWidth="1.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Convenience at Your Fingertips</h3>
            <p className="text-gray-700 leading-relaxed">
              We know your time is valuable. With our easy-to-use platform and personalized meal planning service, Dietopia makes it simple to manage your nutrition from the comfort of your home, helping you stay on track with your wellness journey.
            </p>
          </div>

          {/* Feature 3 - Customer Service */}
          <div className="feature-card flex flex-col items-center text-center px-6">
            {/* Customer Support Icon */}
            <div className="icon-container mb-6">
              <svg 
                className="w-16 h-16" 
                fill="none" 
                stroke="#7ab530" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Exceptional Customer Service</h3>
            <p className="text-gray-700 leading-relaxed">
              Your satisfaction is our priority. Our team is always ready to assist you with any questions or requests, ensuring a smooth and enjoyable experience as you work towards your health and nutrition goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

