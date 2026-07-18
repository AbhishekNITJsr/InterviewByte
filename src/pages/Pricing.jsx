import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      }, { withCredentials: true })
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewByte.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifypay = await axios.post(ServerUrl + "/api/payment/verify", response, { withCredentials: true })
          dispatch(setUserData(verifypay.data.user))
          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")
        },
        theme: {
          color: "#4f46e5", // Indigo-600 hex
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      setLoadingPlan(null);
    } catch (error) {
      console.log(error)
      setLoadingPlan(null);
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans py-16 px-6'>
      {/* Header */}
      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
        <button 
          onClick={() => navigate("/")} 
          className='mt-1 p-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow transition text-slate-600 hover:text-slate-900'
        >
          <FaArrowLeft />
        </button>

        <div className="text-center w-full pr-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-slate-600 mt-2 text-base md:text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div 
              key={plan.id}
              whileHover={!plan.default && { scale: 1.02 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-200 border ${
                isSelected
                  ? "border-indigo-600 shadow-xl bg-white ring-2 ring-indigo-600/10"
                  : "border-slate-200 bg-white shadow-sm hover:shadow-md"
              } ${plan.default ? "cursor-default opacity-90" : "cursor-pointer"}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-indigo-600 text-white font-semibold text-xs px-3.5 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-slate-100 text-slate-600 font-semibold text-xs px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-indigo-600">
                  {plan.price}
                </span>
                <p className="text-slate-500 font-medium text-sm mt-1">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-slate-600 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-indigo-600 shrink-0 text-sm" />
                    <span className="text-slate-700 text-sm font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {!plan.default && (
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id)
                    } else {
                      handlePayment(plan)
                    }
                  }} 
                  className={`w-full mt-8 py-3.5 rounded-xl font-semibold transition shadow-sm ${
                    isSelected
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Pricing