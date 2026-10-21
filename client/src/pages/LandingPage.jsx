import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Rocket, Brain, FileText, Target, ChevronRight, 
  CheckCircle2, Users, Briefcase, GraduationCap,
  LineChart, Sparkles, Code, FileCheck, ArrowRight,
  ShieldCheck, Zap
} from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing out function
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(end * easeOutQuart);
      
      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      title: "AI Skill Analysis",
      description: "Discover your strengths and weaknesses with our advanced AI assessing over 50+ technical and soft skills.",
      icon: Brain,
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Skill Gap Detection",
      description: "Compare your current skills against industry requirements for your target roles to see exactly what you need to learn.",
      icon: Target,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Resume Analyzer",
      description: "Upload your resume for an instant ATS compatibility score and actionable improvement suggestions.",
      icon: FileText,
      color: "from-pink-500 to-rose-400"
    },
    {
      title: "Learning Path",
      description: "Get personalized month-by-month roadmaps with curated resources to master missing skills.",
      icon: GraduationCap,
      color: "from-amber-500 to-orange-400"
    },
    {
      title: "Career Guidance",
      description: "Navigate your professional journey with data-driven insights tailored to your unique profile.",
      icon: Rocket,
      color: "from-emerald-500 to-teal-400"
    },
    {
      title: "Progress Tracking",
      description: "Visualize your growth over time with beautiful charts and gamified milestone achievements.",
      icon: LineChart,
      color: "from-violet-500 to-purple-500"
    }
  ];

  const faqs = [
    {
      q: "How does the AI Skill Analysis work?",
      a: "Our AI analyzes your inputs, project descriptions, and resume to map your competencies against a database of thousands of industry-standard skills, providing a precise proficiency score."
    },
    {
      q: "Is FutureForge really free for students?",
      a: "Yes! The core platform is completely free for students. We offer premium features for advanced ATS optimization and personalized mentorship."
    },
    {
      q: "Can it help me get an internship?",
      a: "Absolutely. By aligning your skills and resume with actual job descriptions for internships, you significantly increase your chances of passing ATS filters and catching a recruiter's eye."
    },
    {
      q: "Which industries do you support?",
      a: "Currently, we focus heavily on Tech, Design, Data Science, and Engineering, but our resume analyzer works for any industry."
    },
    {
      q: "How accurate is the Resume Analyzer?",
      a: "Our analyzer mimics the exact algorithms used by leading Applicant Tracking Systems (Workday, Greenhouse, etc.), providing a highly accurate estimate of how your resume will perform."
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/80 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm mb-8 border border-purple-200 dark:border-purple-800/50"
            >
              <Sparkles size={16} />
              <span>The future of career development is here</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            >
              Forge Your Skills.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                Shape Your Future.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered skill optimization, resume analysis and personalized career development for ambitious students and professionals.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] hover:-translate-y-1 flex items-center justify-center"
              >
                Get Started Free
                <ChevronRight size={20} className="ml-2" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 font-semibold text-lg transition-all flex items-center justify-center group"
              >
                <FileCheck size={20} className="mr-2 text-slate-400 group-hover:text-purple-500 transition-colors" />
                Analyze Resume
              </Link>
            </motion.div>
          </div>

          {/* Abstract Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 mx-auto max-w-5xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-20 h-full w-full pointer-events-none mt-40"></div>
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
              {/* Fake Window Controls */}
              <div className="flex space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-1 space-y-6">
                  {/* Card 1 */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <Target size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <Code size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column (Chart) */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-24 bg-purple-100 dark:bg-purple-900/30 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Abstract Graph */}
                  <div className="relative h-48 w-full mt-auto flex items-end justify-between space-x-2">
                    {[40, 70, 45, 90, 65, 100, 80].map((height, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="w-full bg-gradient-to-t from-purple-600/20 to-purple-500 rounded-t-sm"
                      ></motion.div>
                    ))}
                    {/* SVG Line overlay */}
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                        d="M0,60 C20,30 30,55 50,10 C70,35 85,0 100,20" 
                        fill="none" 
                        stroke="#8b5cf6" 
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-3">Why FutureForge?</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to land your dream job</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our comprehensive suite of tools replaces multiple disjointed platforms, giving you a unified command center for your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500 -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Skill Analysis (Split) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Analyze 50+ technical and soft skills with AI
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Stop guessing what you need to learn. Our engine evaluates your current proficiency across multiple domains and provides an exact breakdown of your capabilities.
              </p>
              <ul className="space-y-4 mb-8">
                {['Language specific syntax and idioms', 'System design & architecture', 'Algorithmic problem solving', 'Communication and leadership'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="inline-flex items-center font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 group">
                Try Skill Analysis
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative w-full aspect-square max-w-md mx-auto"
            >
              {/* Abstract Radar Chart CSS Mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center p-8 shadow-2xl">
                <div className="relative w-full h-full rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <div className="absolute w-3/4 h-3/4 rounded-full border border-slate-300/50 dark:border-slate-600/50"></div>
                  <div className="absolute w-1/2 h-1/2 rounded-full border border-slate-300/50 dark:border-slate-600/50"></div>
                  <div className="absolute w-1/4 h-1/4 rounded-full border border-slate-300/50 dark:border-slate-600/50"></div>
                  
                  {/* Axis lines */}
                  <div className="absolute w-full h-px bg-slate-300/50 dark:bg-slate-600/50 rotate-0"></div>
                  <div className="absolute w-full h-px bg-slate-300/50 dark:bg-slate-600/50 rotate-45"></div>
                  <div className="absolute w-full h-px bg-slate-300/50 dark:bg-slate-600/50 rotate-90"></div>
                  <div className="absolute w-full h-px bg-slate-300/50 dark:bg-slate-600/50 rotate-135"></div>

                  {/* Polygon shape representing skill levels */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <motion.polygon
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      points="50,15 80,30 90,60 70,85 30,80 15,50 30,20"
                      fill="rgba(139, 92, 246, 0.4)"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      className="origin-center"
                    />
                  </svg>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-slate-100 dark:border-slate-700">React</div>
                  <div className="absolute top-1/4 -right-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-slate-100 dark:border-slate-700">Node.js</div>
                  <div className="absolute bottom-1/4 -right-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-slate-100 dark:border-slate-700">Python</div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-slate-100 dark:border-slate-700">Leadership</div>
                  <div className="absolute bottom-1/4 -left-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-slate-100 dark:border-slate-700">UI/UX</div>
                  <div className="absolute top-1/4 -left-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-slate-100 dark:border-slate-700">DevOps</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resume Analyzer Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/50 dark:to-purple-900/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Beat the ATS Systems</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Upload your resume and get an instant score on how well it parses in Applicant Tracking Systems. Fix formatting errors before you apply.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <ShieldCheck size={32} className="text-green-400 mr-4" />
                <h3 className="text-2xl font-bold text-white">ATS Compatibility</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex text-slate-300">
                  <CheckCircle2 className="text-green-400 mr-3 mt-0.5 flex-shrink-0" size={18} />
                  Keyword optimization checking
                </li>
                <li className="flex text-slate-300">
                  <CheckCircle2 className="text-green-400 mr-3 mt-0.5 flex-shrink-0" size={18} />
                  Action verb analysis
                </li>
                <li className="flex text-slate-300">
                  <CheckCircle2 className="text-green-400 mr-3 mt-0.5 flex-shrink-0" size={18} />
                  Formatting and font parse checks
                </li>
              </ul>
              <div>
                <Link to="/register" className="px-6 py-3 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors inline-block">
                  Scan Your Resume
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-slate-800 p-8 flex items-center justify-center relative overflow-hidden">
              {/* Scanning Animation */}
              <motion.div 
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-1 bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.8)] z-20 left-0"
              />
              
              <div className="w-full max-w-sm bg-white p-6 rounded shadow-lg opacity-80 rotate-2 scale-95 relative z-10">
                <div className="h-6 w-1/2 bg-slate-800 rounded mb-4"></div>
                <div className="h-3 w-1/3 bg-slate-400 rounded mb-8"></div>
                <div className="space-y-3 mb-8">
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-1/4 bg-slate-600 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
                </div>
              </div>

              {/* Score Overlay */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-slate-900/90 backdrop-blur-sm border-2 border-green-500 rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.3)]"
              >
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Score</span>
                <span className="text-4xl font-black text-green-400">
                  <AnimatedCounter end={87} duration={2} />
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-purple-600 text-white relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black mb-2">
                <AnimatedCounter end={10} suffix="k+" />
              </div>
              <div className="text-purple-200 font-medium text-sm uppercase tracking-wider">Students</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black mb-2">
                <AnimatedCounter end={50} suffix="k+" />
              </div>
              <div className="text-purple-200 font-medium text-sm uppercase tracking-wider">Skills Analyzed</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black mb-2">
                <AnimatedCounter end={25} suffix="k+" />
              </div>
              <div className="text-purple-200 font-medium text-sm uppercase tracking-wider">Resumes Scored</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <div className="text-purple-200 font-medium text-sm uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <ChevronRight 
                    size={20} 
                    className={`transform transition-transform duration-300 text-purple-600 ${activeFaq === index ? 'rotate-90' : ''}`} 
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: activeFaq === index ? 'auto' : 0, opacity: activeFaq === index ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-0 text-slate-600 dark:text-slate-400">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 z-0"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Zap size={48} className="mx-auto text-yellow-400 mb-6" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Forge Your Future?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are taking control of their career trajectory today. It's free to get started.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1"
          >
            Create Your Free Account
            <Rocket size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
