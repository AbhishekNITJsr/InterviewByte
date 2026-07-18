import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({ isModel = false }) {
  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let User = response.user
      let name = User.displayName
      let email = User.email
      const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }

  return (
    <div className={`
      w-full font-sans
      ${isModel ? "py-4" : "min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20"}
    `}>
      <motion.div 
        initial={{ opacity: 0, y: -40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className={`
          w-full 
          ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
          bg-white shadow-xl border border-slate-200
        `}
      >
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100'>
            <BsRobot size={20} />
          </div>
          <h2 className='font-bold text-lg text-slate-800 tracking-tight'>InterviewByte.AI</h2>
        </div>

        <h1 className='text-2xl md:text-3xl font-bold text-center leading-snug mb-4 text-slate-900 tracking-tight'>
          Continue with <br />
          <span className='bg-indigo-50 text-indigo-600 border border-indigo-100 px-3.5 py-1 rounded-full inline-flex items-center gap-2 text-sm font-medium mt-1'>
            <IoSparkles size={16} className="text-indigo-600" />
            AI Smart Interview
          </span>
        </h1>

        <p className='text-slate-600 text-center text-sm md:text-base leading-relaxed mb-8'>
          Sign in to start AI-powered mock interviews, track your progress, and unlock detailed performance insights.
        </p>

        <motion.button 
          onClick={handleGoogleAuth}
          whileHover={{ opacity: 0.95, scale: 1.02 }}
          whileTap={{ opacity: 1, scale: 0.98 }}
          className='w-full flex items-center justify-center gap-3 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md font-medium transition-colors'
        >
          <FcGoogle size={22} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Auth