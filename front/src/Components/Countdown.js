import React, { useState, useEffect } from "react";

const Countdown = ({ deliveryTime, predictedAt }) => {
  const [timeLeft, setTimeLeft] = useState(deliveryTime);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Math.floor(
        (Date.now() - new Date(predictedAt)) / 1000
      );
      setTimeLeft(deliveryTime - timeElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [deliveryTime, predictedAt]);

  if (timeLeft <= 0) {
    return <span>Time's up!</span>;
  }

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span>
      {days > 0 && `${days}d `}
      {hours > 0 && `${hours}h `}
      {minutes > 0 && `${minutes}m `}
      {seconds > 0 && `${seconds}s`}
    </span>
  );
};

export default Countdown;
