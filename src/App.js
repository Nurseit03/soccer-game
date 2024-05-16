import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import './App.css';

const App = () => {
  const ballRef = useRef(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const goalRef = useRef(null);

  useEffect(() => {
    const handleDragEnd = (_, info) => {
      setVelocity(info.velocity);
      controls.start({
        x: x.get() + info.velocity.x * 0.5,
        y: y.get() + info.velocity.y * 0.5,
        transition: {
          type: 'inertia',
          velocity: { x: info.velocity.x, y: info.velocity.y },
          bounceStiffness: 300,
          bounceDamping: 20,
        },
      });
    };

    controls.start({
      x: x.get(),
      y: y.get(),
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
      },
    });

    const checkGoal = () => {
      const ballRect = ballRef.current.getBoundingClientRect();
      const goalRect = goalRef.current.getBoundingClientRect();
      if (
        ballRect.right > goalRect.left &&
        ballRect.left < goalRect.right &&
        ballRect.bottom > goalRect.top &&
        ballRect.top < goalRect.bottom
      ) {
        console.log('WIN');
      }
    };

    const intervalId = setInterval(checkGoal, 100);
    return () => clearInterval(intervalId);
  }, [controls, x, y]);


  const handleDragEnd = (_, info) => {
    controls.start({
      x: x.get() + info.velocity.x * 0.5,
      y: y.get() + info.velocity.y * 0.5,
      transition: {
        type: 'inertia',
        velocity: { x: info.velocity.x, y: info.velocity.y },
        bounceStiffness: 300,
        bounceDamping: 20,
      },
    });
  };

  
  return (
    <div className="game">
      <motion.div
        className="ball"
        ref={ballRef}
        drag
        dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
        onDragEnd={handleDragEnd}
        style={{ x, y }}
        animate={controls}
      />
      <div className="goal" ref={goalRef}></div>
    </div>
  );
};

export default App;
