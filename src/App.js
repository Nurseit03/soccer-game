import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import './App.css';

const App = () => {
  const ballRef = useRef(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [goalsScore, setGoalsScore] = useState(0);
  const goalRef = useRef(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  const handlePositionReset = () => {
    controls.start({ x: 0, y: 0, transition: { duration: 0 } });
  };

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        left: -window.innerWidth / 2.5,
        right: window.innerWidth / 2.5,
        top: -window.innerHeight / 2.5,
        bottom: window.innerHeight / 2.5,
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);

    return () => {
      window.removeEventListener('resize', updateConstraints);
    };
  }, []);

  useEffect(() => {
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
        setGoalsScore((prev) => prev + 1);
        handlePositionReset();
      }
    };

    const intervalId = setInterval(checkGoal, 100);
    return () => clearInterval(intervalId);
  }, [controls, x, y]);

  return (
    <div className="container">
      <div className="game">
        <motion.div
          className="ball"
          ref={ballRef}
          drag
          dragConstraints={constraints}
          style={{ x, y }}
          animate={controls}
        />
        <div className="goal" ref={goalRef}>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "15px", right: "50%" }}>
        Голов: {goalsScore}
      </div>
    </div>
  );
};

export default App;
