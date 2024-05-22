import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const GameContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#dff3e3',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Ball = styled(motion.div)({
  width: 50,
  height: 50,
  backgroundColor: '#f0ad4e',
  borderRadius: '50%',
  position: 'absolute',
  cursor: 'grab',
});

const Goal = styled(Box)({
  width: 10,
  height: 180,
  backgroundColor: '#5cb85c',
  position: 'absolute',
  left: '90%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

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
    <Box position="relative">
      <GameContainer>
        <Ball
          ref={ballRef}
          drag
          dragConstraints={constraints}
          style={{ x, y }}
          animate={controls}
        />
        <Goal ref={goalRef} />
      </GameContainer>
      <Box position="absolute" bottom="15px" right="50%">
        <Typography variant="h6">Голов: {goalsScore}</Typography>
      </Box>
    </Box>
  );
};

export default App;
