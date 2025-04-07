import React from 'react';
import { motion } from 'framer-motion';
import './testimonials.css';

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Student",
    content: "The platform has transformed my learning experience. The interactive content and expert instructors make learning engaging and effective.",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Professional",
    content: "I love the flexibility of learning at my own pace. The courses are well-structured and the support is excellent.",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Career Switcher",
    content: "The platform helped me transition into a new career. The practical projects and real-world examples were invaluable.",
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  }
  
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2>What Our Students Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            className="testimonial-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-content">
              <p className="testimonial-text">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="author-image"
                />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;