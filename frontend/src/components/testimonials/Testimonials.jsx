import React from "react";
import { motion } from "framer-motion"; // Import motion for animations
import "./testimonials.css";

// Import the local image
import dhruvImage from "../../assets/6143241528089360410.jpg"; // Adjust the path based on your folder structure

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://th.bing.com/th?q=Current+Bachelor&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://th.bing.com/th/id/OIP.GKAiW3oc2TWXVEeZAzrWOAHaJF?w=135&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      id: 3,
      name: "Ishaan Verma",
      position: "Student",
      message:
        "The hands-on coding exercises and real-world problem solving have significantly boosted my programming skills.",
      image:
        "https://img.freepik.com/premium-photo/education-graduation-people-concept-happy-indian-male-graduate-student-mortar-board-ba_396607-18896.jpg",
    },
    {
      id: 4,
      name: "Priya Deshmukh",
      position: "Student",
      message:
        "I've gained a deep understanding of legal principles, and the quizzes made studying enjoyable and effective.",
      image:
        "https://img.freepik.com/free-photo/african-female-graduate-smiling-holding-diploma_176420-14312.jpg",
    },

    {
      id: 5,
      name: "Dhruv Nair",
      position: "Student",
      message:
        "I am truly grateful for this website, as it has completely transformed my life. I used to be a game addict, but this platform gamified learning, helping me stay focused and productive.",
      image: dhruvImage, // Use the imported image here
    },
  ];

  return (
    <section className="testimonials">
      <h2>What our students say</h2>
      <div className="testimonials-cards">
        {testimonialsData.map((e) => (
          <motion.div
            className="testimonial-card"
            key={e.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="student-image">
              <img src={e.image} alt={e.name} />
            </div>
            <p className="message">{e.message}</p>
            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">{e.position}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
