import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import AIVisualizer from './AIVisualizer';
import UserVoiceVisualizer from './UserVoiceVisualizer';
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash, FaPlay } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from '../App';
import { BsArrowRight } from 'react-icons/bs';

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  // Flow State
  const [hasStarted, setHasStarted] = useState(false);
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Audio & Mic State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  // Interview Data State
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const isMicOnRef = useRef(isMicOn);
  const isAIPlayingRef = useRef(isAIPlaying);

  const currentQuestion = questions[currentIndex];

  // Keep refs synchronized with React state for event listeners
  useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
  useEffect(() => { isAIPlayingRef.current = isAIPlaying; }, [isAIPlaying]);

  /* ---------------- SPEAK FUNCTION (ZERO-VIDEO VERSION) ---------------- */
  const speakText = (text) => {
    return new Promise(async (resolve) => {
      try {
        if (!text) {
          resolve();
          return;
        }

        setSubtitle(text);
        setIsAIPlaying(true);
        stopMic();

        const response = await axios.post(
          `${ServerUrl}/api/interview/tts`,
          { text, gender: voiceGender },
          { 
            responseType: 'blob', 
            withCredentials: true 
          }
        );

        const audioUrl = URL.createObjectURL(response.data);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setIsAIPlaying(false);
          URL.revokeObjectURL(audioUrl);

          if (isMicOnRef.current) {
            startMic();
          }
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };

        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsAIPlaying(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        await audio.play();

      } catch (error) {
        console.error("TTS Fetch Error:", error);
        setIsAIPlaying(false);
        resolve();
      }
    });
  };

  /* ---------------- INTERVIEW FLOW CONTROL ---------------- */
  useEffect(() => {
    if (!hasStarted) return;

    const runFlow = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 600));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOnRef.current) {
          startMic();
        }
      }
    };

    runFlow();
  }, [hasStarted, isIntroPhase, currentIndex]);

  /* ---------------- TIMER LIFECYCLE ---------------- */
  useEffect(() => {
    if (!hasStarted || isIntroPhase || !currentQuestion || isAIPlaying || feedback) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isIntroPhase, currentIndex, isAIPlaying, feedback]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex, isIntroPhase]);

  /* ---------------- SPEECH RECOGNITION (SELF-HEALING MIC) ---------------- */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onresult = (event) => {
      let newFinalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newFinalText += event.results[i][0].transcript + " ";
        }
      }
      if (newFinalText.trim()) {
        setAnswer((prev) => (prev + " " + newFinalText.trim()).trim());
      }
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        setTimeout(() => {
          try {
            if (!isRecognizingRef.current && isMicOnRef.current) {
              recognition.start();
            }
          } catch (e) {
            console.log("Auto-restart prevented:", e.message);
          }
        }, 300);
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isRecognizingRef.current && !isAIPlayingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log("Mic start prevented:", e.message);
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  /* ---------------- SUBMISSIONS ---------------- */
  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(`${ServerUrl}/api/interview/submit-answer`, {
        interviewId,
        questionIndex: currentIndex,
        answer: answer.trim() || "No answer provided.",
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true });

      setFeedback(result.data.feedback);
      setIsSubmitting(false);
      await speakText(result.data.feedback);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(`${ServerUrl}/api/interview/finish`, { interviewId }, { withCredentials: true });
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase || !hasStarted) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
    };
  }, []);

  // ---------------- GATE SCREEN (PREVENTS AUTOPLAY BUG) ----------------
  if (!hasStarted) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans'>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200 space-y-6'
        >
          <div className='w-16 h-16 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm'>
            <FaPlay size={24} className="ml-1" />
          </div>

          <div className="space-y-2">
            <h2 className='text-2xl font-bold text-slate-900 tracking-tight'>Ready to Begin?</h2>
            <p className='text-slate-600 text-sm leading-relaxed font-normal'>
              Please ensure your speakers are on and your microphone is allowed. Our AI interviewer is ready for you, <span className="font-semibold text-slate-800">{userName}</span>.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button 
              onClick={() => setVoiceGender("female")}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
                voiceGender === 'female' 
                  ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-600/20' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              👩 Female Interviewer
            </button>
            <button 
              onClick={() => setVoiceGender("male")}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
                voiceGender === 'male' 
                  ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-600/20' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              👨 Male Interviewer
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setHasStarted(true)}
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl shadow-md shadow-indigo-200 font-bold text-base transition flex items-center justify-center gap-2'
          >
            Start Interview <BsArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ---------------- MAIN INTERVIEW UI ----------------
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans'>
      <div className='w-full max-w-6xl min-h-[80vh] bg-white rounded-[32px] shadow-xl border border-slate-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* Left: AI Visualizer & Timer section */}
        <div className='w-full lg:w-[36%] bg-slate-50/50 flex flex-col items-center p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200'>
          
          <div className='w-full max-w-md'>
            <AIVisualizer isAIPlaying={isAIPlaying} gender={voiceGender} />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className='w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'
            >
              <p className='text-slate-700 text-xs sm:text-sm font-medium text-center leading-relaxed'>{subtitle}</p>
            </motion.div>
          )}

          {/* Timer Area */}
          <div className='w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5 mt-auto'>
            <div className='flex justify-between items-center'>
              <span className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Status</span>
              {isAIPlaying ? (
                <span className='text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 animate-pulse'>
                  AI Speaking...
                </span>
              ) : (
                <span className='text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full'>
                  Listening to You
                </span>
              )}
            </div>

            <div className="h-px bg-slate-100"></div>

            <div className='flex justify-center py-2'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
            </div>

            <div className="h-px bg-slate-100"></div>

            <div className='grid grid-cols-2 gap-4 text-center'>
              <div className="bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                <span className='text-xl font-extrabold text-indigo-600'>{currentIndex + 1}</span>
                <span className='text-[11px] font-medium text-slate-500 block mt-0.5 uppercase tracking-wider'>Current</span>
              </div>
              <div className="bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                <span className='text-xl font-extrabold text-slate-700'>{questions.length}</span>
                <span className='text-[11px] font-medium text-slate-500 block mt-0.5 uppercase tracking-wider'>Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question & User Voice Waveform section */}
        <div className='flex-1 flex flex-col p-6 sm:p-8 md:p-10 relative justify-between bg-white'>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className='text-lg sm:text-xl font-bold text-slate-900 tracking-tight'>
                AI Smart Interview
              </h2>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                Live Session
              </span>
            </div>

            {!isIntroPhase ? (
              <div className='relative mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm'>
                <p className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <div className='text-base sm:text-lg font-bold text-slate-800 leading-relaxed'>
                  {currentQuestion?.question}
                </div>
              </div>
            ) : (
              <div className='relative mb-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-center'>
                <p className='text-indigo-950 font-medium text-sm'>
                  Please listen to the introductory instructions from your AI interviewer.
                </p>
              </div>
            )}
          </div>
          
          {/* User Voice Waveform */}
          <div className="w-full my-auto py-6">
            <UserVoiceVisualizer 
              isMicOn={isMicOn} 
              isAIPlaying={isAIPlaying} 
              isIntroPhase={isIntroPhase} 
            />
          </div>

          {!feedback ? ( 
            <div className='flex items-center gap-4 mt-6 pt-4 border-t border-slate-100'>
              <motion.button
                onClick={toggleMic}
                disabled={isAIPlaying || isIntroPhase}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition disabled:opacity-50 ${
                  isMicOn 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting || isAIPlaying || isIntroPhase}
                whileTap={{ scale: 0.98 }}
                className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl shadow-md shadow-indigo-200 transition font-bold text-base disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed'
              >
                {isSubmitting ? "Evaluating Answer..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-6 bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl shadow-sm space-y-4'
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/60 px-2.5 py-1 rounded-md">
                  AI Feedback Analysis
                </span>
                <p className='text-slate-800 font-medium text-sm mt-3 leading-relaxed'>{feedback}</p>
              </div>

              <button
                onClick={handleNext}
                disabled={isAIPlaying}
                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50'
              >
                {currentIndex + 1 >= questions.length ? "Finish Interview" : "Next Question"} <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;