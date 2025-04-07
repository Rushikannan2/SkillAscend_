import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./about.css";

const About = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText =
    "  We deliver world-class online courses tailored to help individuals thrive in their careers. With expert instructors and engaging content, our programs empower you to achieve your goals. Let’s grow together.";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Adjust typing speed (in milliseconds)
    return () => clearInterval(typingInterval);
  }, [fullText]);

  return (
    <div className="about">
      <motion.div
        className="about-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About Us
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {displayText}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default About;
