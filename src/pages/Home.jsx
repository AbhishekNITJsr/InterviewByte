import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans'>
      <Navbar />

      <div className='flex-1 px-6 py-20'>
        <div className='max-w-6xl mx-auto'>

          {/* Badge */}
          <div className='flex justify-center mb-6'>
            <div className='bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm'>
              <HiSparkles size={18} className="text-indigo-600" />
              AI Powered Smart Interview Platform
            </div>
          </div>

          {/* Hero Section */}
          <div className='text-center mb-28'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight max-w-4xl mx-auto'
            >
              Practice Interviews with{" "}
              <span className='relative inline-block mt-2'>
                <span className='bg-indigo-100 text-indigo-600 px-5 py-1.5 rounded-full font-bold inline-block'>
                  AI Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='text-slate-600 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-normal'
            >
              Role-based mock interviews with smart follow-ups, adaptive difficulty, and real-time performance evaluation.
            </motion.p>

            <div className='flex flex-wrap justify-center gap-4 mt-10'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/interview")
                }}
                whileHover={{ opacity: 0.95, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-indigo-600 text-white font-medium px-10 py-3.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200'
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/history")
                }}
                whileHover={{ opacity: 0.95, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-white border border-slate-200 text-slate-700 font-medium px-10 py-3.5 rounded-full hover:bg-slate-100 transition shadow-sm'
              >
                View History
              </motion.button>
            </div>
          </div>

          {/* 3 Step Cards Section */}
          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-32'>
            {
              [
                {
                  icon: <BsRobot size={24} />,
                  step: "STEP 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjusts difficulty based on selected job role."
                },
                {
                  icon: <BsMic size={24} />,
                  step: "STEP 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers."
                },
                {
                  icon: <BsClock size={24} />,
                  step: "STEP 3",
                  title: "Timer Based Simulation",
                  desc: "Real interview pressure with time tracking."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 + index * 0.2 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className={`
                    relative bg-white rounded-3xl border-2 border-indigo-100 
                    hover:border-indigo-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl 
                    transition-all duration-300
                    ${index === 0 ? "rotate-[-4deg]" : ""}
                    ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl border-indigo-200" : ""}
                    ${index === 2 ? "rotate-[-3deg]" : ""}
                  `}
                >
                  <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white border-4 border-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'>
                    {item.icon}
                  </div>
                  <div className='pt-8 text-center'>
                    <div className='text-xs text-indigo-600 font-bold mb-2 tracking-wider uppercase'>{item.step}</div>
                    <h3 className='font-bold mb-3 text-lg text-slate-800 tracking-tight'>{item.title}</h3>
                    <p className='text-sm text-slate-600 leading-relaxed'>{item.desc}</p>
                  </div>
                </motion.div>
              ))
            }
          </div>

          {/* Advanced AI Capabilities */}
          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center mb-16'
            >
              Advanced AI <span className="text-indigo-600">Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={22} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy, and confidence."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={22} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={22} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weaknesses, and improvement insights."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={22} />,
                    title: "History & Analytics",
                    desc: "Track progress with performance graphs and topic analysis."
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className='bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all'
                  >
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                      <div className='w-full md:w-1/2 flex justify-center'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-56' />
                      </div>

                      <div className='w-full md:w-1/2'>
                        <div className='bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100'>
                          {item.icon}
                        </div>
                        <h3 className='font-bold mb-3 text-xl text-slate-800 tracking-tight'>{item.title}</h3>
                        <p className='text-slate-600 text-sm leading-relaxed'>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Multiple Interview Modes */}
          <div className='mb-24'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center mb-16'
            >
              Multiple Interview <span className="text-indigo-600">Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and communication-based evaluation."
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questioning based on selected role."
                  },
                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights."
                  },
                  {
                    img: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview sessions easily."
                  }
                ].map((mode, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all"
                  >
                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                        <h3 className="font-bold text-xl mb-3 text-slate-800 tracking-tight">
                          {mode.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>

                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain drop-shadow-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      <Footer />
    </div>
  )
}

export default Home