"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white shadow-md border-b-2 border-orange-500 z-50 flex justify-between items-center px-6 md:px-10 py-4">        {/* LOGO + NAME */}
        <div className="flex gap-3">
          <img
            src="/Logo/logo.png"
            alt="logo"
            className="w-10 h-10 object-contain hover:scale-110 transition"
          />

          <h1 className="text-xl md:text-2xl font-bold">
            <span className="text-orange-500">Rent</span>{" "}
            <span className="text-gray-800">& Ride</span>
          </h1>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-6 text-gray-600">
          {["Home", "Vehicles", "Booking", "Dashboard"].map((item, i) => (
            <p
              key={i}
              onClick={() => {
                if (item === "Home") {
                  window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ stay on page
                } else {
                  isLoggedIn
                    ? router.push(`/${item.toLowerCase()}`)
                    : router.push("/login");
                }
              }
              }
              className="cursor-pointer hover:text-orange-500 transition"
            >
              {item}
            </p>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 items-center">

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
              >
                Login
              </button>

              <button
                onClick={() => router.push("/register")}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Register
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="/cars/user.png"
                className="w-10 h-10 rounded-full border-2 border-orange-500"
              />
              <span className="hidden md:block font-medium">Profile</span>
            </div>
          )}

        </div>

      </nav>

      {/* HERO */}
      <section className="pt-32 px-6 md:px-12 min-h-screen flex flex-col md:flex-row items-center justify-between gap-10">

        <div className="max-w-xl scroll-animate">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Drive Your Dreams with{" "}
            <span className="text-orange-500 inline-block">Rent & Ride</span>
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
      <section className="px-6 md:px-10 py-20 bg-gray-50 text-center scroll-animate">
        <h3 className="text-3xl font-bold mb-10">How It Works</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {["Choose Vehicle", "Book Instantly", "Enjoy Ride"].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h4 className="text-orange-500 font-semibold text-lg">{item}</h4>
              <p className="text-gray-600 mt-3">
                Simple, fast and efficient rental experience.
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
