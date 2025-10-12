import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  FaLeaf,
  FaBrain,
  FaMoon,
  FaShieldAlt,
  FaHandHoldingHeart,
  FaSmile,
  FaHeartbeat,
  FaStethoscope,
} from "react-icons/fa";

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-500">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <p className="text-2xl text-white leading-relaxed">
            Discover the power of controlled breathing for a healthier, calmer
            life. Our app guides you through structured breathing exercises to
            reduce stress, improve focus, and enhance overall well-being.
          </p>
        </div>
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="/breathing patterns.png"
                alt="Breathing Patterns"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                What are Breathing Patterns?
              </h2>
              <p className="text-lg text-white mb-4">
                Breathing patterns are structured breathing exercises designed
                to improve mental and physical well-being. They involve
                controlled inhalation, exhalation, and holds to promote
                relaxation, reduce stress, and enhance focus.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-teal-50 py-12 px-6 rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Benefits of Breathing Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                <FaLeaf size={24} className="mr-2" /> Reduces Stress
              </h3>
              <p className="text-gray-700">
                Lowers cortisol levels and promotes relaxation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                <FaBrain size={24} className="mr-2" /> Improves Focus
              </h3>
              <p className="text-gray-700">
                Enhances concentration and mental clarity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                <FaMoon size={24} className="mr-2" /> Better Sleep
              </h3>
              <p className="text-gray-700">
                Helps you fall asleep faster and sleep deeper.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                <FaShieldAlt size={24} className="mr-2" /> Boosts Immunity
              </h3>
              <p className="text-gray-700">
                Strengthens the immune system through better oxygenation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                <FaHandHoldingHeart size={24} className="mr-2" /> Pain
                Management
              </h3>
              <p className="text-gray-700">
                Helps manage chronic pain by reducing tension.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                <FaSmile size={24} className="mr-2" /> Overall Well-being
              </h3>
              <p className="text-gray-700">
                Increases sense of calm and improves quality of life.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            Types of Breathing Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                1. Box Breathing (4-4-4-4)
              </h3>
              <p className="text-gray-700">
                Inhale 4s – Hold 4s – Exhale 4s – Hold 4s. Used by Navy SEALs to
                reduce stress and improve focus. Helps in high-stress situations
                and enhances mental clarity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
              <div className="text-6xl mb-4">😴</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                2. 4-7-8 Breathing
              </h3>
              <p className="text-gray-700">
                Inhale 4s – Hold 7s – Exhale 8s. Promotes relaxation and helps
                you fall asleep faster. Ideal for winding down before bed and
                managing insomnia.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="text-6xl mb-4">☯️</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                3. Alternate Nostril Breathing
              </h3>
              <p className="text-gray-700">
                Inhale through one nostril – Exhale through the other. Balances
                energy, reduces anxiety, and improves clarity. A yogic practice
                for harmonizing the body and mind.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
              <div className="text-6xl mb-4">💨</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                4. Diaphragmatic Breathing
              </h3>
              <p className="text-gray-700">
                Deep belly breathing. Strengthens the diaphragm and improves
                oxygen intake. Essential for better posture, reduced tension,
                and overall respiratory health.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                5. Wim Hof Breathing
              </h3>
              <p className="text-gray-700">
                30 deep breaths + breath hold. Boosts energy, focus, and cold
                tolerance. Increases alkalinity in the body and enhances
                physical performance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
              <div className="text-6xl mb-4">🌊</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                6. 5-5 Coherent Breathing
              </h3>
              <p className="text-gray-700">
                Inhale 5s – Exhale 5s. Balances your heart rate and calms the
                nervous system. Promotes emotional stability and synchronization
                of heart and brain rhythms.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-pink-500">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                7. Resonance Breathing (6-6)
              </h3>
              <p className="text-gray-700">
                Inhale 6s – Exhale 6s. Optimizes relaxation and emotional
                stability. Aligns breathing with natural body rhythms for
                maximum therapeutic benefits.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-16 bg-gray-100 py-12 px-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                How Breathing Patterns Help Cure Health Issues
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Breathing patterns are used as complementary therapies for
                various health conditions. They can help manage symptoms of
                asthma, hypertension, insomnia, and even aid in recovery from
                respiratory illnesses by improving oxygenation and reducing
                inflammation.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="flex items-center justify-center h-64 rounded-lg">
                <FaStethoscope size={100} className="text-blue-500" />
              </div>
            </div>
          </div>
        </section>
        <div className="text-center">
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-10 py-4 rounded-lg font-semibold text-xl hover:from-blue-600 hover:to-teal-600 transition duration-300 shadow-lg"
          >
            Start Your Breathing Journey
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
