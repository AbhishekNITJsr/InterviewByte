import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from "react-icons/fa";
import Auth from '../pages/Auth';

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    if (userData) {
      onClose()
    }
  }, [userData, onClose])

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 font-sans'>
      <div className='relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200'>
        <button 
          onClick={onClose} 
          className='absolute top-6 right-6 z-10 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors'
        >
          <FaTimes size={16} />
        </button>
        <Auth isModel={true} />
      </div>
    </div>
  )
}

export default AuthModel