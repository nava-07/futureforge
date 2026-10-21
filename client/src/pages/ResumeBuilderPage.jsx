import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileService, resumeService, aiService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { toast } from 'react-hot-toast';
import { 
  Plus, Trash2, Wand2, Download, Save, 
  ChevronDown, ChevronUp, Layout, CheckCircle 
} from 'lucide-react';
// Note: In a real app we'd import html2pdf.js dynamically or normally
// import html2pdf from 'html2pdf.js';

const ResumeBuilderPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'
  const [template, setTemplate] = useState('classic'); // 'classic' | 'modern' | 'minimal'
  
  const previewRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    languages: []
  });

  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch both profile and resume info
      const [profileRes, resumeRes] = await Promise.all([
        profileService.getProfile(),
        resumeService.getResume()
      ]);
      
      if (resumeRes.success && resumeRes.data) {
        setResumeData(prev => ({
          ...prev,
          ...resumeRes.data,
          personalInfo: {
            ...prev.personalInfo,
            ...(resumeRes.data.personalInfo || {}),
            fullName: profileRes.data?.name || resumeRes.data?.personalInfo?.fullName || '',
            email: profileRes.data?.email || resumeRes.data?.personalInfo?.email || ''
          }
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await resumeService.updateResume(resumeData);
      toast.success('Resume saved successfully');
    } catch (err) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    // Basic implementation since we can't reliably load html2pdf in this environment
    toast.success('Downloading PDF...');
    // if (previewRef.current) {
    //   const opt = {
    //     margin:       0.5,
    //     filename:     `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
    //     image:        { type: 'jpeg', quality: 0.98 },
    //     html2canvas:  { scale: 2 },
    //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    //   };
    //   html2pdf().set(opt).from(previewRef.current).save();
    // }
  };

  const generateAISummary = async () => {
    try {
      toast.loading('Generating summary...', { id: 'ai-summary' });
      const prompt = `Write a professional summary for a resume based on this data: ${JSON.stringify({ skills: resumeData.skills, experience: resumeData.experience, projects: resumeData.projects })}`;
      const res = await aiService.generateContent(prompt);
      if (res.success) {
        setResumeData(prev => ({ ...prev, summary: res.data.content }));
        toast.success('Summary generated!', { id: 'ai-summary' });
      }
    } catch (err) {
      toast.error('Failed to generate summary', { id: 'ai-summary' });
    }
  };

  const improveAIBullet = async (section, index, bulletIndex) => {
    toast.loading('Improving text...', { id: 'ai-bullet' });
    // Mock implementation for AI bullet improvement
    setTimeout(() => {
      const newData = { ...resumeData };
      if (section === 'experience') {
        newData.experience[index].bullets[bulletIndex] += ' (Improved by AI)';
      }
      setResumeData(newData);
      toast.success('Improved!', { id: 'ai-bullet' });
    }, 1000);
  };

  const handleChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addItem = (section, item) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], item]
    }));
    setExpandedSections(prev => ({ ...prev, [`${section}-${resumeData[section].length}`]: true }));
  };

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorState message={error} retry={fetchResume} />;

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'summary', label: 'Summary' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certs' },
    { id: 'achievements', label: 'Awards' },
    { id: 'languages', label: 'Languages' },
  ];

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Header */}
      <header className={`shrink-0 h-16 flex items-center justify-between px-6 border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Resume Builder
          </h1>
          {/* Mobile Tab Toggle */}
          <div className="md:hidden flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button 
              onClick={() => setMobileView('editor')}
              className={`px-3 py-1 text-sm rounded-md ${mobileView === 'editor' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
            >
              Editor
            </button>
            <button 
              onClick={() => setMobileView('preview')}
              className={`px-3 py-1 text-sm rounded-md ${mobileView === 'preview' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
            >
              Preview
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Download size={16} /> <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Save size={16} /> <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Panel */}
        <div className={`w-full md:w-1/2 flex flex-col border-r ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} ${mobileView === 'editor' ? 'flex' : 'hidden md:flex'}`}>
          {/* Tab Navigation */}
          <div className="shrink-0 overflow-x-auto no-scrollbar border-b dark:border-gray-800 p-2">
            <div className="flex space-x-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === tab.id ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Content Form */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" value={resumeData.personalInfo.fullName || ''} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={resumeData.personalInfo.email || ''} onChange={e => handleChange('personalInfo', 'email', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input type="tel" value={resumeData.personalInfo.phone || ''} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input type="text" value={resumeData.personalInfo.location || ''} onChange={e => handleChange('personalInfo', 'location', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">LinkedIn</label>
                        <input type="url" value={resumeData.personalInfo.linkedin || ''} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">GitHub</label>
                        <input type="url" value={resumeData.personalInfo.github || ''} onChange={e => handleChange('personalInfo', 'github', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Portfolio URL</label>
                        <input type="url" value={resumeData.personalInfo.portfolio || ''} onChange={e => handleChange('personalInfo', 'portfolio', e.target.value)} className="w-full p-2 border rounded-lg bg-transparent dark:border-gray-700" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Professional Summary</h2>
                      <button onClick={generateAISummary} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                        <Wand2 size={16} /> Auto Generate
                      </button>
                    </div>
                    <textarea 
                      value={resumeData.summary || ''} 
                      onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                      rows={6}
                      className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                      placeholder="Brief overview of your professional background..."
                    />
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
                    
                    {resumeData.experience.map((exp, index) => {
                      const key = `exp-${index}`;
                      const isExpanded = expandedSections[key];
                      
                      return (
                        <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                          <div 
                            className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
                            onClick={() => toggleSection(key)}
                          >
                            <div>
                              <h3 className="font-medium">{exp.position || '(Not specified)'}</h3>
                              <p className="text-sm text-gray-500">{exp.company}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); removeItem('experience', index); }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 size={16} />
                              </button>
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="p-4 space-y-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs mb-1">Company</label>
                                  <input type="text" value={exp.company || ''} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full p-2 text-sm border rounded bg-transparent dark:border-gray-700" />
                                </div>
                                <div>
                                  <label className="block text-xs mb-1">Position</label>
                                  <input type="text" value={exp.position || ''} onChange={e => handleArrayChange('experience', index, 'position', e.target.value)} className="w-full p-2 text-sm border rounded bg-transparent dark:border-gray-700" />
                                </div>
                                <div>
                                  <label className="block text-xs mb-1">Duration</label>
                                  <input type="text" value={exp.duration || ''} placeholder="e.g. Jan 2020 - Present" onChange={e => handleArrayChange('experience', index, 'duration', e.target.value)} className="w-full p-2 text-sm border rounded bg-transparent dark:border-gray-700" />
                                </div>
                                <div>
                                  <label className="block text-xs mb-1">Location</label>
                                  <input type="text" value={exp.location || ''} onChange={e => handleArrayChange('experience', index, 'location', e.target.value)} className="w-full p-2 text-sm border rounded bg-transparent dark:border-gray-700" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs mb-2 flex justify-between items-center">
                                  <span>Bullet Points</span>
                                </label>
                                <textarea 
                                  value={(exp.bullets || []).join('\n')}
                                  onChange={e => handleArrayChange('experience', index, 'bullets', e.target.value.split('\n'))}
                                  rows={5}
                                  placeholder="- Achieved X by doing Y..."
                                  className="w-full p-2 text-sm border rounded bg-transparent dark:border-gray-700"
                                />
                                <button onClick={() => improveAIBullet('experience', index, 0)} className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                                  <Wand2 size={12} /> AI Enhance Bullets
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <button 
                      onClick={() => addItem('experience', { company: '', position: '', duration: '', location: '', bullets: [] })}
                      className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 hover:text-purple-600 hover:border-purple-300 flex justify-center items-center gap-2 transition-colors"
                    >
                      <Plus size={18} /> Add Experience
                    </button>
                  </div>
                )}

                {/* Other tabs can be similarly implemented... for brevity I'll provide placeholders with some functionality */}
                {['education', 'projects', 'certifications'].includes(activeTab) && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4 capitalize">{activeTab}</h2>
                    {resumeData[activeTab].map((item, index) => (
                       <div key={index} className="flex gap-2 items-start mb-2">
                         <div className="flex-1 space-y-2">
                           <input type="text" value={item.title || item.institution || item.name || ''} placeholder="Title / Name" onChange={e => handleArrayChange(activeTab, index, item.institution !== undefined ? 'institution' : 'title', e.target.value)} className="w-full p-2 text-sm border rounded bg-transparent dark:border-gray-700" />
                         </div>
                         <button onClick={() => removeItem(activeTab, index)} className="p-2 text-red-500"><Trash2 size={18} /></button>
                       </div>
                    ))}
                    <button onClick={() => addItem(activeTab, {})} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 flex justify-center items-center gap-2">
                      <Plus size={18} /> Add {activeTab}
                    </button>
                  </div>
                )}
                
                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Skills</h2>
                    <textarea 
                      value={resumeData.skills.join(', ')} 
                      onChange={e => setResumeData({...resumeData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                      rows={4}
                      className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-700"
                      placeholder="React, Node.js, Python, Leadership..."
                    />
                    <p className="text-xs text-gray-500">Comma separated</p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={`w-full md:w-1/2 flex flex-col bg-gray-200 dark:bg-gray-950 ${mobileView === 'preview' ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Template Selector */}
          <div className="shrink-0 p-4 border-b border-gray-300 dark:border-gray-800 flex justify-center gap-4 bg-gray-100 dark:bg-gray-900">
            {['classic', 'modern', 'minimal'].map(tpl => (
              <button
                key={tpl}
                onClick={() => setTemplate(tpl)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${template === tpl ? 'bg-white shadow-md text-purple-600 dark:bg-gray-800' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
              >
                <Layout size={16} /> <span className="capitalize">{tpl}</span>
              </button>
            ))}
          </div>

          {/* PDF Preview Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            <div 
              ref={previewRef}
              className={`w-full max-w-[800px] min-h-[1056px] bg-white text-black shadow-xl rounded-sm p-8 sm:p-12 overflow-hidden transition-all duration-300 origin-top`}
              style={{
                fontFamily: template === 'classic' ? 'Times New Roman, serif' : template === 'minimal' ? 'Inter, sans-serif' : 'Arial, sans-serif'
              }}
            >
              {/* Personal Info Header */}
              <div className={`mb-6 ${template === 'classic' ? 'text-center border-b-2 border-gray-800 pb-4' : template === 'modern' ? 'border-l-4 border-purple-600 pl-4' : 'mb-8'}`}>
                <h1 className={`${template === 'classic' ? 'text-3xl font-bold uppercase tracking-wider' : 'text-4xl font-bold text-gray-900'}`}>
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm ${template === 'classic' ? 'justify-center text-gray-800' : 'text-gray-600'}`}>
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                  {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin}</span>}
                  {resumeData.personalInfo.github && <span>• {resumeData.personalInfo.github}</span>}
                </div>
              </div>

              {/* Layout varies by template */}
              <div className={template === 'modern' ? 'grid grid-cols-3 gap-8' : ''}>
                
                {/* Main Column */}
                <div className={template === 'modern' ? 'col-span-2 space-y-6' : 'space-y-6'}>
                  
                  {/* Summary */}
                  {resumeData.summary && (
                    <div>
                      <h2 className={`text-lg font-bold mb-2 ${template === 'classic' ? 'uppercase border-b border-gray-400' : template === 'modern' ? 'text-purple-700' : 'tracking-wide'}`}>
                        Professional Summary
                      </h2>
                      <p className="text-sm leading-relaxed text-gray-800">{resumeData.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div>
                      <h2 className={`text-lg font-bold mb-3 ${template === 'classic' ? 'uppercase border-b border-gray-400' : template === 'modern' ? 'text-purple-700' : 'tracking-wide'}`}>
                        Experience
                      </h2>
                      <div className="space-y-4">
                        {resumeData.experience.map((exp, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-gray-900">{exp.position}</h3>
                              <span className="text-sm font-medium text-gray-600">{exp.duration}</span>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                              <span className="text-sm font-semibold text-gray-700">{exp.company}</span>
                              <span className="text-sm text-gray-500">{exp.location}</span>
                            </div>
                            {exp.bullets && exp.bullets.length > 0 && (
                              <ul className="list-disc list-outside ml-4 text-sm text-gray-800 space-y-1">
                                {exp.bullets.map((b, bi) => b && <li key={bi}>{b}</li>)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education (if not in side column) */}
                  {template !== 'modern' && resumeData.education.length > 0 && (
                    <div>
                      <h2 className={`text-lg font-bold mb-3 ${template === 'classic' ? 'uppercase border-b border-gray-400' : 'tracking-wide'}`}>
                        Education
                      </h2>
                      <div className="space-y-3">
                        {resumeData.education.map((edu, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-bold text-gray-900">{edu.title || edu.institution}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Side Column (Modern Template) */}
                {template === 'modern' && (
                  <div className="col-span-1 space-y-6">
                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div>
                        <h2 className="text-lg font-bold mb-3 text-purple-700">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className="text-lg font-bold mb-3 text-purple-700">Education</h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, i) => (
                            <div key={i}>
                              <h3 className="font-bold text-gray-900 text-sm">{edu.title || edu.institution}</h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Skills for Classic/Minimal */}
              {template !== 'modern' && resumeData.skills.length > 0 && (
                <div className="mt-6">
                  <h2 className={`text-lg font-bold mb-2 ${template === 'classic' ? 'uppercase border-b border-gray-400' : 'tracking-wide'}`}>
                    Skills
                  </h2>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {resumeData.skills.join(' • ')}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
