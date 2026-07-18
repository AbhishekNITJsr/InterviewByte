import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-slate-50 flex justify-center px-6 pb-12 pt-10 font-sans'>
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-200 py-10 px-6 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
          <div className='bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-100'>
            <BsRobot size={18} />
          </div>
          <h2 className='font-bold text-lg text-slate-800 tracking-tight'>InterviewByte.AI</h2>
        </div>
        <p className='text-slate-600 text-sm max-w-xl mx-auto leading-relaxed'>
          AI-powered interview preparation platform designed to improve communication skills, technical depth, and professional confidence.
        </p>
      </div>
    </div>
  )
}

export default Footer