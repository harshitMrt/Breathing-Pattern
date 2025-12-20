import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const benefitCards = [
    {
      icon: <FaLeaf size={24} className="mr-2 icon-hover" />,
      title: "Reduces Stress",
      description: "Lowers cortisol levels and promotes relaxation.",
    },
    {
      icon: <FaBrain size={20} className="mr-2 icon-hover" />,
      title: "Improves Focus",
      description: "Enhances concentration and mental clarity.",
    },
    {
      icon: <FaMoon size={20} className="mr-2 icon-hover" />,
      title: "Better Sleep",
      description: "Helps you fall asleep faster and sleep deeper.",
    },
    {
      icon: <FaShieldAlt size={20} className="mr-2 icon-hover" />,
      title: "Boosts Immunity",
      description: "Strengthens the immune system through better oxygenation.",
    },
    {
      icon: <FaHandHoldingHeart size={20} className="mr-2 icon-hover" />,
      title: "Pain Management",
      description: "Helps manage chronic pain by reducing tension.",
    },
    {
      icon: <FaSmile size={20} className="mr-2 icon-hover" />,
      title: "Overall Well-being",
      description: "Increases sense of calm and improves quality of life.",
    },
  ];

  const patternCards = [
    {
      emoji: "🌿",
      title: "Box Breathing (4-4-4-4)",
      description:
        "Inhale 4s – Hold 4s – Exhale 4s – Hold 4s. Used by Navy SEALs to reduce stress and improve focus. Helps in high-stress situations and enhances mental clarity.",
      borderColor: "border-blue-500",
    },
    {
      emoji: "😴",
      title: "4-7-8 Breathing",
      description:
        "Inhale 4s – Hold 7s – Exhale 8s. Promotes relaxation and helps you fall asleep faster. Ideal for winding down before bed and managing insomnia.",
      borderColor: "border-teal-500",
    },
    {
      emoji: "☯️",
      title: "Alternate Nostril Breathing",
      description:
        "Inhale through one nostril – Exhale through the other. Balances energy, reduces anxiety, and improves clarity. A yogic practice for harmonizing the body and mind.",
      borderColor: "border-green-500",
    },
    {
      emoji: "💨",
      title: "Diaphragmatic Breathing",
      description:
        "Deep belly breathing. Strengthens the diaphragm and improves oxygen intake. Essential for better posture, reduced tension, and overall respiratory health.",
      borderColor: "border-purple-500",
    },
    {
      emoji: "🔥",
      title: "Wim Hof Breathing",
      description:
        "30 deep breaths + breath hold. Boosts energy, focus, and cold tolerance. Increases alkalinity in the body and enhances physical performance.",
      borderColor: "border-red-500",
    },
    {
      emoji: "🌊",
      title: "5-5 Coherent Breathing",
      description:
        "Inhale 5s – Exhale 5s. Balances your heart rate and calms the nervous system. Promotes emotional stability and synchronization of heart and brain rhythms.",
      borderColor: "border-indigo-500",
    },
    {
      emoji: "🧘‍♀️",
      title: "Resonance Breathing (6-6)",
      description:
        "Inhale 6s – Exhale 6s. Optimizes relaxation and emotional stability. Aligns breathing with natural body rhythms for maximum therapeutic benefits.",
      borderColor: "border-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-500">
      <Header />
      <motion.div
        ref={ref}
        className="container mx-auto px-4 py-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.p
            className="text-xl text-white leading-relaxed"
            variants={itemVariants}
          >
            Discover the power of controlled breathing for a healthier, calmer
            life. Our app guides you through structured breathing exercises to
            reduce stress, improve focus, and enhance overall well-being.
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.button
            onClick={onStart}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold text-lg btn-enhanced ripple text-glow-blue relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Start Your Breathing Journey
            </motion.span>
          </motion.button>
        </motion.div>

        <motion.section className="mb-16" variants={itemVariants}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.img
                src="/breathing patterns.png"
                alt="Breathing Patterns"
                className="rounded-lg shadow-lg max-w-full h-auto image-hover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <motion.h2
                className="text-3xl font-semibold text-white mb-4"
                variants={itemVariants}
              >
                What are Breathing Patterns?
              </motion.h2>
              <motion.p
                className="text-lg text-white mb-4"
                variants={itemVariants}
              >
                Breathing patterns are structured breathing exercises designed
                to improve mental and physical well-being. They involve
                controlled inhalation, exhalation, and holds to promote
                relaxation, reduce stress, and enhance focus.
              </motion.p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mb-12 bg-gradient-to-r from-blue-50 to-teal-50 py-8 px-4 rounded-lg"
          variants={itemVariants}
        >
          <motion.h2
            className="text-2xl font-semibold text-center text-gray-800 mb-6"
            variants={itemVariants}
          >
            Benefits of Breathing Patterns
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
          >
            {benefitCards.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md benefit-card"
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                  {benefit.icon} {benefit.title}
                </h3>
                <p className="text-gray-700">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className="mb-12" variants={itemVariants}>
          <motion.h2
            className="text-2xl font-semibold text-center text-white mb-6"
            variants={itemVariants}
          >
            Types of Breathing Patterns
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {patternCards.map((pattern, index) => (
              <motion.div
                key={index}
                className={`bg-white p-4 rounded-lg shadow-lg border-l-4 ${pattern.borderColor} pattern-card`}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-5xl mb-4 emoji-hover"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {pattern.emoji}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {pattern.title}
                </h3>
                <p className="text-gray-700">{pattern.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="mb-12 bg-gray-100 py-8 px-4 rounded-lg"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <motion.h2
                className="text-2xl font-semibold text-gray-800 mb-4"
                variants={itemVariants}
              >
                How Breathing Patterns Help Cure Health Issues
              </motion.h2>
              <motion.p
                className="text-base text-gray-700 mb-4"
                variants={itemVariants}
              >
                Breathing patterns are used as complementary therapies for
                various health conditions. They can help manage symptoms of
                asthma, hypertension, insomnia, and even aid in recovery from
                respiratory illnesses by improving oxygenation and reducing
                inflammation.
              </motion.p>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <motion.div
                className="flex items-center justify-center h-48 rounded-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaStethoscope
                    size={80}
                    className="text-blue-500 icon-hover"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LandingPage;
