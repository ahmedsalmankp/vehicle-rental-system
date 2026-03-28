"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();
  const goProtected = () => {
    router.push("/login");
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 Check login status
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);


  const features = [
    { name: "Fleet Management", img: "/cars/fleet.webp" },
    { name: "Analytics Reports", img: "/cars/analytics.png" },
    { name: "AI Fraud Score", img: "/cars/Fraud.png" },
    { name: "Long Term Rentals", img: "/cars/maruti.avif" },
    { name: "Reseller System", img: "/cars/resellers.jpg" },
    { name: "Secure Payments", img: "/cars/payment.webp" },
  ];

  const testimonials = [
    "Amazing service!", "Best rental app!", "Smooth booking!",
    "Loved the UI!", "Highly recommended!", "Very fast!",
    "Secure platform!", "Great experience!", "Affordable!",
    "Super easy!", "Clean cars!", "Top service!"
  ];
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-animate");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);



  return (
    <div className="bg-white text-gray-900">

      <Navbar />

      {/* HERO */}
      <section className="pt-32 px-6 md:px-12 min-h-screen flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="max-w-xl scroll-animate">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight inline-block">
            Drive Your Dreams with{" "}
            <span className="inline-flex items-center gap-3 mt-2 md:mt-0">
              <img src="/Logo/logo.png" alt="logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span className="text-orange-500">Rent & Ride</span>
            </span>
          </h2>

          <p className="mt-6 text-gray-600 text-xl">
            Smart booking platform with secure rides, AI fraud detection,
            and seamless vehicle management.
          </p>
        </div>

        <div className="animate-car">
          <Image
            src="/cars/Lamborghini.webp"
            alt="Car"
            width={500}
            height={300}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-10 py-24 bg-gray-50 text-center scroll-animate">
        <h3 className="text-3xl font-bold mb-4">How It Works</h3>
        <p className="text-gray-500 max-w-2xl mx-auto mb-12">Getting behind the wheel has never been easier. Follow these three simple steps to start your rental journey right away.</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Choose Vehicle",
              desc: "Browse our expansive collection of premium and practical cars. Check out our detailed AI fraud scores and vehicle specs to find your perfect match with absolutely zero hassle."
            },
            {
              title: "Book Instantly",
              desc: "Confirm your selection with a secure ID verification, select your dates, and process payments safely with our seamlessly structured checkout system in just a few quick clicks."
            },
            {
              title: "Enjoy Ride",
              desc: "Pick up your keys and hit the road with complete peace of mind. Return the car securely and leverage our flexible scheduling policies designed around your comfort."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all flex flex-col items-center hover:-translate-y-2 border-t-4 border-transparent hover:border-orange-500 duration-300">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold text-2xl mb-6 shadow-sm">
                {i + 1}
              </div>
              <h4 className="text-gray-800 font-bold text-xl">{item.title}</h4>
              <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES WITH IMAGES */}
      <section className="px-6 md:px-10 py-20 text-center bg-gray-50">
        <h3 className="text-3xl font-bold mb-10">Powerful Features</h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-orange-300 hover:scale-105 transition scroll-animate">
              {/* IMAGE */}
              {f.name === "AI Fraud Score" ? (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-100">
                  <div className="w-24 h-24 rounded-full border-8 border-orange-500 flex items-center justify-center text-xl font-bold text-orange-500">
                    92%
                  </div>
                  <p className="mt-2 text-gray-600">Fraud Risk</p>
                </div>
              ) : (
                <img
                  src={f.img}
                  alt={f.name}
                  className="w-full h-40 object-cover"
                />
              )}

              {/* TEXT */}
              <div className="p-4">
                <h4 className="font-semibold text-orange-500">{f.name}</h4>
                <p className="text-gray-600 text-sm mt-2">
                  {f.name === "Secure Payments"
                    ? "Fast and secure online payment system."
                    : f.name === "Analytics Reports"
                      ? "Detailed insights and reports for better decisions."
                      : f.name === "Fleet Management"
                        ? "Manage all vehicles efficiently in one place."
                        : "Advanced system for seamless experience."}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* VEHICLES */}
      <section className="px-6 md:px-10 py-20 bg-gray-50 text-center scroll-animate">
        <h3 className="text-3xl font-bold mb-10">Featured Vehicles</h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Audi A6", img: "/cars/Audi-A6.webp" },
            { name: "Lamborghini", img: "/cars/Lamborghini.webp" },
            { name: "BMW", img: "/cars/bmw.webp" },
          ].map((car, i) => (
            <div
              key={i}
              onClick={goProtected}
              className="cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-xl hover:scale-105 transition"
            >
              <Image src={car.img} width={400} height={250} alt={car.name} className="w-full h-52 object-cover" />
              <h4 className="p-4 font-semibold">{car.name}</h4>
            </div>
          ))}
        </div>
      </section>
      <section className="text-center py-16 bg-gray-50 scroll-animate">
        <h3 className="text-3xl font-bold">
          Get the App
        </h3>

        <p className="text-gray-600 mt-3">
          Download Rent & Ride from your favorite app store
        </p>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">

          {/* PLAY STORE */}
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              ▶ Google Play
            </button>
          </a>

          {/* APP STORE */}
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
               App Store
            </button>
          </a>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 overflow-hidden bg-white scroll-animate">
        <div className="flex gap-6 animate-scroll whitespace-nowrap">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-orange-100 border border-orange-300 px-6 py-4 rounded-xl shadow min-w-max">
              ⭐⭐⭐⭐⭐ {t}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-10">
        <p className="font-semibold">
          Team: Bhuvan Prakash | Ahmed Salman | Kunchi Sindhu | Varsha Reddy
        </p>
        <p className="mt-2">📞 765965755</p>
        <p className="mt-4 italic">
          "Contact us to experience the future of vehicle rentals."
        </p>
      </footer>

      {/* ANIMATION */}
      <style jsx>{`
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
    @keyframes scrollX {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll {
  display: flex;
  animation: scrollX 20s linear infinite;
}

  .animate-car {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* INITIAL STATE */
  .scroll-animate {
    opacity: 0;
    transform: translateY(40px);
  }

  /* WHEN VISIBLE */
  .scroll-animate.show {
    animation: fadeUp 0.8s ease forwards;
  }
`}</style>

    </div>
  );
}
