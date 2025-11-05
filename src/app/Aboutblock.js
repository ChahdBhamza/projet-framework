import Image from "next/image";

export default function Aboutblock() {
        return (
                <section id="about" className="aboutblock relative py-20 px-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfeff]" />

                        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                                <div>
                                        <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 px-3 py-1 mb-4">
                                                <span className="text-[#7ab530] text-lg">🥗</span>
                                                <span className="text-sm text-gray-700">Feel-good food, minus the fads</span>
                                        </div>

                                        <h2 className="text-4xl font-bold tracking-tight mb-3   ">
                                                Who we are?
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed">
                                                DietApp is a small team of nutritionists, home cooks, and engineers
                                                on a mission to make healthy eating simple, joyful, and sustainable.
                                                We built this for our friends and families first—real people with busy
                                                lives who wanted guidance without guilt.
                                        </p>
                                        <p className="text-gray-600 mt-4 mb-6 leading-relaxed">
                                                Our approach blends evidence‑based nutrition with practical tools you’ll
                                                actually use: flexible plans, tasty recipes, and smart lists that fit
                                                your routine—not the other way around.
                                        </p>

                                        <ul className="space-y-3 text-gray-800">
                                                <li className="flex items-start gap-3">
                                                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[#e8f7d6] text-[#7ab530] flex items-center justify-center">✓</span>
                                                        <span>Evidence over fads—guidance rooted in nutrition science</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[#e8f7d6] text-[#7ab530] flex items-center justify-center">✓</span>
                                                        <span>Flavor first—recipes you’ll actually crave</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[#e8f7d6] text-[#7ab530] flex items-center justify-center">✓</span>
                                                        <span>Progress over perfection—small steps that last</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[#e8f7d6] text-[#7ab530] flex items-center justify-center">✓</span>
                                                        <span>Inclusive and accessible—for every lifestyle and background</span>
                                                </li>
                                        </ul>

                                        <div className="mt-6 flex flex-wrap items-center gap-4">
                                                <a href="#plans" className="px-5 py-2.5 rounded-full bg-[#7ab530] text-white hover:bg-[#6aa42a] transition-colors">Start your plan</a>
                                                <span className="text-sm text-gray-500">No fads. Just food that works.</span>
                                        </div>

                                        <div className="mt-8 grid grid-cols-3 md:w-3/4 gap-4">
                                                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-4 text-center">
                                                        <div className="text-2xl">⏱️</div>
                                                        <div className="text-sm text-gray-600">15‑min meals</div>
                                                </div>
                                                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-4 text-center">
                                                        <div className="text-2xl">🌿</div>
                                                        <div className="text-sm text-gray-600">Whole‑food focus</div>
                                                </div>
                                                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-4 text-center">
                                                        <div className="text-2xl">📈</div>
                                                        <div className="text-sm text-gray-600">Habit tracking</div>
                                                </div>
                                        </div>
                                </div>

                                <div className="relative h-[360px] md:h-[440px]">
                                        <div className="absolute -inset-6 bg-gradient-to-tr from-[#d1fae5] to-[#cffafe] blur-2xl opacity-60 rounded-[2rem]" />
                                        <div className="relative h-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-100">
                                                <Image src="/abtblock.jpg" alt="Healthy meals" fill className="object-cover" />
                                        </div>
                                        <div className="absolute -bottom-4 left-6 right-6 grid grid-cols-2 gap-3">
                                                <div className="rounded-xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-gray-100 p-3">
                                                        <div className="text-xs text-gray-500">This week</div>
                                                        <div className="text-sm font-medium">7 new recipes</div>
                                                </div>
                                                <div className="rounded-xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-gray-100 p-3">
                                                        <div className="text-xs text-gray-500">Saved time</div>
                                                        <div className="text-sm font-medium">+3 hrs meal‑prep</div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </section>
        );
}