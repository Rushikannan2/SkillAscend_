import React from "react";
import { useNavigate } from "react-router-dom";
import TypingEffect from "react-typing-effect"; // Typing effect library
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <motion.div
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="home-content"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>
            <TypingEffect
              text={["Welcome to our Skill Ascend Platform"]}
              speed={100}
              eraseSpeed={50}
              eraseDelay={2000}
              typingDelay={500}
            />
          </h1>
          <p>
            <TypingEffect
              text={["Learn, Grow, Excel"]}
              speed={100}
              eraseSpeed={50}
              eraseDelay={2000}
              typingDelay={1500}
            />
          </p>
          <motion.button
            onClick={() => navigate("/courses")}
            className="common-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          className="home-character"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <img
            src="https://imgur.com/BJTVG52.gif" // ✅ Correct GIF link
            alt="Friendly Character"
            className="character-image"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <Testimonials />
      </motion.div>
    </div>
  );
};

export default Home;
