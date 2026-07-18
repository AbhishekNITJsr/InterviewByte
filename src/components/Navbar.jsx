import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      setShowCreditPopup(false)
      setShowUserPopup(false)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-slate-50 flex justify-center px-6 pt-6 font-sans'>
      <motion.div 
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-200 px-8 py-4 flex justify-between items-center relative'
      >
        {/* Logo */}
        <div onClick={() => navigate("/")} className='flex items-center gap-3 cursor-pointer'>
          <div className='bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100'>
            <BsRobot size={20} />
          </div>
          <h1 className='font-bold hidden md:block text-lg text-slate-900 tracking-tight'>InterviewByte.AI</h1>
        </div>

        {/* Right Controls */}
        <div className='flex items-center gap-4 relative'>
          
          {/* Credits Button & Dropdown */}
          <div className='relative'>
            <button 
              onClick={() => {
                if (!userData) {
                  setShowAuth(true)
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false)
              }} 
              className='flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-800 hover:bg-slate-200/80 transition'
            >
              <BsCoin size={18} className="text-amber-500" />
              <span>{userData?.credits || 0}</span>
            </button>

            {showCreditPopup && (
              <div className='absolute right-0 mt-3 w-64 bg-white shadow-xl border border-slate-200 rounded-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150'>
                <p className='text-xs font-medium text-slate-600 mb-4 leading-relaxed'>
                  Need more credits to continue your AI mock interviews?
                </p>
                <button 
                  onClick={() => {
                    setShowCreditPopup(false);
                    navigate("/pricing");
                  }} 
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl text-xs transition shadow-sm'
                >
                  Buy More Credits
                </button>
              </div>
            )}
          </div>

          {/* User Avatar & Dropdown */}
          <div className='relative'>
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true)
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false)
              }} 
              className='w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition'
            >
              {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={18} />}
            </button>

            {showUserPopup && (
              <div className='absolute right-0 mt-3 w-52 bg-white shadow-xl border border-slate-200 rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150'>
                <div className='px-3 py-2 border-b border-slate-100 mb-1'>
                  <p className='text-xs text-slate-400 font-medium'>Signed in as</p>
                  <p className='text-sm text-slate-900 font-bold truncate'>{userData?.name}</p>
                </div>

                <button 
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate("/history");
                  }} 
                  className='w-full text-left text-sm py-2 px-3 rounded-xl hover:bg-slate-100 text-slate-700 font-medium transition'
                >
                  Interview History
                </button>

                <button 
                  onClick={handleLogout} 
                  className='w-full text-left text-sm py-2 px-3 rounded-xl hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium transition mt-1'
                >
                  <HiOutlineLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Navbar