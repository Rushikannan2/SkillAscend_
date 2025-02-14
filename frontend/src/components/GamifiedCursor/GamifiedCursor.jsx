import React, { useEffect, useRef } from "react";
import "./GamifiedCursor.css";

const GamifiedCursor = () => {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current && trailRef.current) {
        // Move the cursor and trail with the mouse
        cursorRef.current.style.left = `${e.pageX}px`;
        cursorRef.current.style.top = `${e.pageY}px`;

        trailRef.current.style.left = `${e.pageX}px`;
        trailRef.current.style.top = `${e.pageY}px`;
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.add("click");
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.remove("click");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div className="gamified-cursor" ref={cursorRef}></div>
      {/* Trail for a more dynamic feel */}
      <div className="cursor-trail" ref={trailRef}></div>
    </>
  );
};

export default GamifiedCursor;
