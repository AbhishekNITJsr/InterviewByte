import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

function InterviewHistory() {
  const [interviews, setInterviews] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })
        setInterviews(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    getMyInterviews()
  }, [])

  return (
    <div className='min-h-screen bg-slate-50 py-10 font-sans'>
      <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

        {/* Header */}
        <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
          <button
            onClick={() => navigate("/")}
            className='mt-1 p-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow transition text-slate-600 hover:text-slate-900'
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className='text-3xl font-bold text-slate-900 tracking-tight'>
              Interview History
            </h1>
            <p className='text-slate-600 mt-1'>
              Track your past interviews and performance reports
            </p>
          </div>
        </div>

        {/* Content */}
        {interviews.length === 0 ? (
          <div className='bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center'>
            <p className='text-slate-600 font-medium'>
              No interviews found. Start your first practice session!
            </p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {interviews.map((item, index) => (
              <div 
                key={index}
                onClick={() => navigate(`/report/${item._id}`)}
                className='bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200 hover:border-indigo-200'
              >
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                      {item.role}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1 font-medium">
                      {item.experience} • <span className="capitalize">{item.mode}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className='flex items-center gap-6'>
                    {/* SCORE */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {item.finalScore || 0}/10
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Overall Score
                      </p>
                    </div>

                    {/* STATUS BADGE */}
                    <span className={`px-3.5 py-1 rounded-full text-xs font-semibold border ${
                      item.status === "completed"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewHistory