import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Report...</p>
        </div>
      </div>
    );
  }

  const navigate = useNavigate()
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // ================= TITLE =================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo-600 (#4f46e5)
    doc.text("InterviewByte AI Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // Underline
    doc.setDrawColor(79, 70, 229);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // ================= FINAL SCORE BOX =================
    doc.setFillColor(238, 242, 255); // Indigo-50 (#eef2ff)
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(
      `Final Score: ${finalScore}/10`,
      pageWidth / 2,
      currentY + 12,
      { align: "center" }
    );

    currentY += 30;

    // ================= SKILLS BOX =================
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}/10`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}/10`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}/10`, margin + 10, currentY + 26);

    currentY += 45;

    // ================= ADVICE =================
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // ================= QUESTION TABLE =================
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
        textColor: [51, 65, 85], // Slate-700
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo-600
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Slate-50
      },
    });

    doc.save("InterviewByte_AI_Report.pdf");
  };

  return (
    <div className='min-h-screen bg-slate-50 font-sans px-4 sm:px-6 lg:px-10 py-10'>
      {/* Header Controls */}
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto'>
        <div className='w-full flex items-start gap-4'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow transition text-slate-600 hover:text-slate-900'
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
              Interview Analytics Dashboard
            </h1>
            <p className='text-slate-600 text-sm mt-1'>
              AI-powered performance insights and tailored evaluation
            </p>
          </div>
        </div>

        <button 
          onClick={downloadPDF} 
          className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-indigo-200 transition text-sm sm:text-base whitespace-nowrap shrink-0'
        >
          Download PDF Report
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto'>

        {/* Left Col: Overall Score & Skill Metrics */}
        <div className='space-y-6'>
          
          {/* Overall Score Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Overall Performance
            </h3>

            <div className='relative w-32 h-32 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#4f46e5", // Indigo-600
                  textColor: "#0f172a", // Slate-900
                  trailColor: "#f1f5f9", // Slate-100
                })}
              />
            </div>

            <p className="text-slate-400 mt-3 text-xs font-medium uppercase tracking-wider">
              Aggregate Score
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="font-bold text-slate-900 text-base">
                {performanceText}
              </p>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          {/* Skills Breakdown Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8'
          >
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-6">
              Skill Evaluation
            </h3>

            <div className='space-y-5'>
              {skills.map((s, i) => (
                <div key={i}>
                  <div className='flex justify-between mb-2 text-sm'>
                    <span className="font-medium text-slate-700">{s.label}</span>
                    <span className='font-bold text-indigo-600'>{s.value}/10</span>
                  </div>

                  <div className='bg-slate-100 h-2.5 rounded-full overflow-hidden'>
                    <div 
                      className='bg-indigo-600 h-full rounded-full transition-all duration-500'
                      style={{ width: `${(s.value / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Performance Graph & Question Breakdown */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8'
          >
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-6">
              Performance Trend
            </h3>

            <div className='h-64 sm:h-72 w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                  />
                  <Area 
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5" // Indigo-600
                    fill="#e0e7ff"   // Indigo-100
                    strokeWidth={3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Question List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8'
          >
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-6">
              Question Breakdown
            </h3>

            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-slate-50 p-6 rounded-2xl border border-slate-200'>
                  
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4'>
                    <div className="pr-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Question {i + 1}
                      </span>
                      <p className="font-bold text-slate-800 text-sm sm:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className='bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full font-bold text-xs sm:text-sm shrink-0'>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs mt-3'>
                    <p className='text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1.5'>
                      AI Feedback
                    </p>
                    <p className='text-sm text-slate-600 leading-relaxed font-normal'>
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default Step3Report