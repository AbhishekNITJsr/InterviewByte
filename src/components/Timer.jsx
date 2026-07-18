import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100

  return (
    <div className='w-20 h-20 font-sans'>
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "26px",
          pathTransitionDuration: 0.5,
          pathColor: "#4f46e5",  // Indigo-600
          textColor: "#0f172a",  // Slate-900
          trailColor: "#f1f5f9", // Slate-100
        })}
      />
    </div>
  )
}

export default Timer