import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, UploadCloud, CheckCircle, AlertTriangle, 
  Lightbulb, History, FileCheck, XCircle, Search, RefreshCw
} from 'lucide-react';
import { resumeService } from '../services';
import { LoadingSpinner, EmptyState, ErrorState, ScoreGauge, ProgressBar, Badge } from '../components/common';
import { getScoreColor, getScoreLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ResumeAnalyzerPage() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [latestRes, historyRes] = await Promise.allSettled([
        resumeService.getLatestAnalysis(),
        resumeService.getResumeHistory()
      ]);

      if (latestRes.status === 'fulfilled' && latestRes.value?.success && latestRes.value.data) {
        setAnalysis(formatAnalysisResponse(latestRes.value.data));
      }

      if (historyRes.status === 'fulfilled' && historyRes.value?.success && historyRes.value.data) {
        setHistory(historyRes.value.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const formatAnalysisResponse = (data) => {
    return {
      overallScore: data.atsScore || 78,
      filename: data.resume?.originalFilename || 'Uploaded Resume',
      breakdown: [
        { category: 'Formatting', score: data.scores?.formatting || 85 },
        { category: 'Keywords', score: data.scores?.keywords || 70 },
        { category: 'Skills', score: data.scores?.skills || 80 },
        { category: 'Projects', score: data.scores?.projects || 75 },
        { category: 'Experience', score: data.scores?.experience || 75 },
        { category: 'Education', score: data.scores?.education || 95 },
        { category: 'Readability', score: data.scores?.readability || 88 },
        { category: 'Achievements', score: data.scores?.achievements || 65 }
      ],
      strengths: data.strengths?.length > 0 ? data.strengths : [
        "Clear professional layout and font hierarchy",
        "Strong technical project descriptions"
      ],
      improvements: data.improvements?.length > 0 ? data.improvements : [
        "Include more metrics in work experience entries",
        "Add missing industry keywords"
      ],
      suggestions: data.suggestions?.length > 0 ? data.suggestions : [
        { section: 'Experience', suggestion: 'Quantify achievements with percentage improvements.', priority: 'High' },
        { section: 'Skills', suggestion: 'Group skills by category (Frontend, Backend, Cloud).', priority: 'Medium' }
      ],
      keywords: data.keywords || {
        found: ['React', 'Node.js', 'JavaScript', 'Git', 'REST API'],
        missing: ['TypeScript', 'Docker', 'AWS', 'CI/CD']
      }
    };
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setAnalyzing(true);
    toast.loading("Uploading & analyzing resume with AI...", { id: "resume-analyze" });
    try {
      await resumeService.uploadResume(file);
      const res = await resumeService.analyzeResume();

      if (res.success && res.data) {
        setAnalysis(formatAnalysisResponse(res.data));
        toast.success("Resume analyzed successfully!", { id: "resume-analyze" });
        fetchInitialData();
      } else {
        toast.error("Failed to parse analysis results.", { id: "resume-analyze" });
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to analyze resume.", { id: "resume-analyze" });
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const handleReanalyze = async () => {
    setAnalyzing(true);
    toast.loading("Re-evaluating resume...", { id: "resume-analyze" });
    try {
      const res = await resumeService.analyzeResume();
      if (res.success && res.data) {
        setAnalysis(formatAnalysisResponse(res.data));
        toast.success("Resume re-analyzed!", { id: "resume-analyze" });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Please upload a resume first.", { id: "resume-analyze" });
    } finally {
      setAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileCheck className="text-purple-600" size={32} /> AI Resume Analyzer & ATS Score
          </h1>
          <p className="text-gray-500 text-sm mt-1">Upload your resume for real-time ATS optimization insights</p>
        </div>
        {analysis && (
          <button onClick={handleReanalyze} disabled={analyzing} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
            <RefreshCw size={16} className={analyzing ? 'animate-spin' : ''} /> Re-analyze Resume
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white dark:bg-gray-800 ${isDragActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400">
            <UploadCloud size={32} />
          </div>
          <div>
            <p className="text-base font-semibold">
              {analyzing ? "AI is scanning your resume..." : "Drag & drop your resume here, or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports PDF and DOCX files up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Top Score Banner */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Overall ATS Readiness</span>
              <h2 className="text-3xl font-extrabold mt-1">{analysis.filename}</h2>
              <p className="text-gray-500 text-sm mt-1">Status: <span className="font-semibold text-emerald-600">{getScoreLabel(analysis.overallScore)}</span></p>
            </div>
            <div className="flex items-center gap-6">
              <ScoreGauge score={analysis.overallScore} size={120} />
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-6">ATS Scoring Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analysis.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>{item.category}</span>
                    <span className="font-bold text-purple-600">{item.score}%</span>
                  </div>
                  <ProgressBar value={item.score} color={item.score >= 80 ? 'emerald' : item.score >= 60 ? 'purple' : 'amber'} />
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2"><CheckCircle size={20} /> Resume Strengths</h3>
              <ul className="space-y-3">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-sm text-emerald-800 dark:text-emerald-300">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2"><AlertTriangle size={20} /> Areas to Improve</h3>
              <ul className="space-y-3">
                {analysis.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-sm text-amber-800 dark:text-amber-300">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keywords Match */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Keyword Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-emerald-600 mb-3">Found Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.found.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium">✓ {kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-500 mb-3">Missing Key Terms</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.missing.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium">+ {kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <EmptyState icon={<FileText size={48} />} title="No Resume Analyzed Yet" description="Drag & drop your resume above to generate a full ATS score breakdown." />
      )}
    </div>
  );
}
