import React, { useState } from 'react'
import { motion } from "motion/react"
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true)

    const formdata = new FormData()
    formdata.append("resume", resumeFile)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error)
      setAnalyzing(false);
    }
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      const result = await axios.post(ServerUrl + "/api/interview/generate-questions", { 
        role, experience, mode, resumeText, projects, skills 
      }, { withCredentials: true }) 
      
      if (userData) {
        dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }))
      }
      setLoading(false)
      onStart(result.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen flex items-center justify-center bg-slate-50 py-12 px-6 font-sans'
    >
      <div className='w-full max-w-6xl bg-white rounded-[32px] shadow-xl border border-slate-200 grid md:grid-cols-2 overflow-hidden'>

        {/* Left Information Panel */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className='relative bg-gradient-to-br from-indigo-50/80 via-slate-50 to-slate-100 p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200'
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6">
            Start Your AI Interview
          </h2>

          <p className="text-slate-600 mb-10 leading-relaxed font-normal">
            Practice real interview scenarios powered by AI. Improve your communication, technical skills, and professional confidence.
          </p>

          <div className='space-y-4'>
            {
              [
                {
                  icon: <FaUserTie className="text-indigo-600 text-lg shrink-0" />,
                  text: "Choose Role & Experience",
                },
                {
                  icon: <FaMicrophoneAlt className="text-indigo-600 text-lg shrink-0" />,
                  text: "Smart Voice Interview",
                },
                {
                  icon: <FaChartLine className="text-indigo-600 text-lg shrink-0" />,
                  text: "Performance Analytics",
                },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  className='flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 cursor-default'
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className='text-slate-800 font-medium text-sm md:text-base'>{item.text}</span>
                </motion.div>
              ))
            }
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-8 md:p-12 bg-white flex flex-col justify-center"
        >
          <h2 className='text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-8'>
            Interview Setup
          </h2>

          <div className='space-y-6'>
            {/* Role Input */}
            <div className='relative'>
              <FaUserTie className='absolute top-4 left-4 text-slate-400' />
              <input 
                type='text' 
                placeholder='Enter target role (e.g. Frontend Developer)'
                className='w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition'
                onChange={(e) => setRole(e.target.value)} 
                value={role} 
              />
            </div>

            {/* Experience Input */}
            <div className='relative'>
              <FaBriefcase className='absolute top-4 left-4 text-slate-400' />
              <input 
                type='text' 
                placeholder='Experience (e.g. 2 years)'
                className='w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition'
                onChange={(e) => setExperience(e.target.value)} 
                value={experience} 
              />
            </div>

            {/* Mode Selector */}
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className='w-full py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition cursor-pointer'
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR / Behavioral Interview</option>
            </select>

            {/* Resume Upload Box */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className='border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition group'
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FaFileUpload className='text-xl' />
                </div>

                <input 
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className='hidden'
                  onChange={(e) => setResumeFile(e.target.files[0])} 
                />

                <p className='text-slate-700 font-medium text-sm'>
                  {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                </p>
                <p className="text-slate-400 text-xs mt-1">Supports PDF format for tailored AI questions</p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className='mt-4 bg-slate-900 text-white font-medium px-6 py-2 rounded-xl text-sm hover:bg-slate-800 transition shadow-sm'
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Analysis Results Display */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4'
              >
                <div className="flex items-center justify-between">
                  <h3 className='text-sm font-bold text-indigo-950 uppercase tracking-wider'>
                    Resume Insights Applied
                  </h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">Ready</span>
                </div>

                {projects.length > 0 && (
                  <div>
                    <p className='font-semibold text-slate-800 text-xs mb-1.5'>Detected Projects:</p>
                    <ul className='list-disc list-inside text-slate-600 text-xs space-y-1'>
                      {projects.map((p, i) => (
                        <li key={i} className="truncate">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className='font-semibold text-slate-800 text-xs mb-1.5'>Skills Tagged:</p>
                    <div className='flex flex-wrap gap-1.5'>
                      {skills.map((s, i) => (
                        <span key={i} className='bg-white border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-medium shadow-2xs'>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Start Button */}
            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-base font-bold transition duration-200 shadow-md shadow-indigo-200 disabled:shadow-none'
            >
              {loading ? "Starting Session..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default Step1SetUp