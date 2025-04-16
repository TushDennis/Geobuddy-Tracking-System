import React from "react";
import childrenImage from "../Assets/child.jpg";
import petImage from "../Assets/pets.jpg";
import LuggageImage from "../Assets/luggage.jpg";



const Home = () => {
  return (
    <div>

      {/* Hero Section of the Page */}
      <section className="bg-green-500 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Stay connected and secure with Geobuddy platform, the ultimate friend, family locator and location-tracking app</h1>
        <p className="mt-4 text-lg">Whether at home, online, or on the move, our comprehensive family safety features bring peace of mind to your loved ones AND help safeguard your personal belongings. Experience location safety features that surpass ordinary GPS tracking apps.</p>
        <div className="mt-6 flex justify-center">
          
          <a
            href="/Travel"
            className="ml-4 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
          TravelHistory
          </a>
          <a
            href="/UserTable"
            className="ml-4 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
           User Management
          </a>
        </div>
      </section>

      {/* property tracking items */}
      <section className="p-5">
        <h2 className="text-2xl font-bold mb-4">Property Tracking </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: "Children", image: childrenImage },
            { name: "Pets", image: petImage },
            { name: "Luggages", image: LuggageImage },
          ].map((destination, index) => (
            <div
              key={index}
              className="bg-green-100 p-6 rounded-lg text-center font-semibold"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <p>{destination.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials or Reviews */}
      <section className="p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Reviews by our Customers</h2>
        <div className="grid gap-4">
          {[
            { name: "Fredrick Oriri", review: "Amazing services from Geobuddy, Highly recommend by my family." },
            { name: "Abdimalic Moris", review: "I love this Geobuddy app, because I can keep up with my family while they are away or on the go. It tells me the speed of the car to make sure the teenagers are driving safe" },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-center"
            >
              <p className="italic">"{testimonial.review}"</p>
              <p className="mt-2 font-bold">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

{/* Call to Action */}
<section className="p-6 bg-green-600 text-white text-center">
  <h2 className="text-2xl font-bold">Travel Confidently and Secure – Let’s Get Started?</h2>
  <p className="mt-2">
    Book your Tracking device now and safeguard your property with us.
  </p>
  <div className="mt-4">
    <a
      href="/track-register"
      className="inline-block"
    >
      <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-200">
        REGISTER NOW WITH US
      </button>
    </a>
  </div>
</section>
      
    </div>
  );
};

export default Home;