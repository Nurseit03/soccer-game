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

  const handlePositionReset = () => {
    controls.start({ x: 0, y: 0 });
  };

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
    <>
        <div className="game">
      <motion.div
        className="ball"
        ref={ballRef}
        drag
        dragConstraints={{ left: -300, right: 600, top: -300, bottom: 300 }}
        style={{ x, y }}
        animate={controls}
      />
      <div className="goal" ref={goalRef}>
        Ворота
      </div>
    </div>
    <div style={{position: "absolute", bottom: "15px", right: "50%"}}>
      Голов: {goalsScore}
    </div>
    </>

  );
};

export default App;
