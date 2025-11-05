import Image from "next/image";

const meals = [
  {
    title: "Rainbow Veg Bowl",
    description: "Wholesome veggies, protein-packed, ready in 15 minutes.",
    price: "$9.99",
    image: "/rainbow vegbowl.jpg",},
  {
    title: "Citrus Quinoa Salad",
    description: "Zesty, fresh, and fiber-rich for lasting energy.",
    price: "$8.49",
    image: "/citrusquinoa.jpg",
  },
  {
    title: "Herbed Chicken Plate",
    description: "Lean protein with seasonal greens and grains.",
    price: "$11.50",
    image: "/chickenherbed.jpg",
  },
  {
    title: "Spiced Lentil Bowl",
    description: "Comforting plant power with bold flavor.",
    price: "$8.99",
    image: "/spicelentil.jpg",
  },
];

export default function PopularMeals() {
  return (
    <section  id="PopularMeals" className="relative py-16 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfeff]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 px-3 py-1 mb-3">
            <span className="text-[#7ab530] text-lg">🥗</span>
            <span className="text-sm text-gray-700">Popular this week</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: "#7ab530" }}>
            Fresh Meals for You
          </h2>
          <p className="text-gray-600 mt-2">Four favorites picked for flavor, balance, and ease.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {meals.map((meal, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-100 hover:-translate-y-1 transition-transform"
            >
              <div className="relative h-40">
                <Image src={meal.image} alt={meal.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{meal.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{meal.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#7ab530] font-semibold">{meal.price}</span>
                  <button className="px-4 py-2 rounded-full bg-[#7ab530] text-white hover:bg-[#6aa42a] transition-colors">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


