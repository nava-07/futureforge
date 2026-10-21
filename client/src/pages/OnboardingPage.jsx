import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  ChevronRight, ChevronLeft, Plus, X, Upload, File as FileIcon, 
  CheckCircle2, Search, Link as LinkIcon, Briefcase, Award, Loader2, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { TECHNICAL_SKILLS, SOFT_SKILLS, INTERESTS, DEPARTMENTS, DEGREES, YEARS } from '../utils/constants';
import { profileService, resumeService, skillService } from '../services';

const STEPS = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Academic Details' },
  { id: 3, title: 'Technical Skills' },
  { id: 4, title: 'Soft Skills' },
  { id: 5, title: 'Interests' },
  { id: 6, title: 'Career Goals' },
  { id: 7, title: 'Experience' },
  { id: 8, title: 'Resume' }
];

const OnboardingPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    personal: {
      phone: '',
      location: '',
      bio: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    academic: {
      college: user?.college || '',
      department: user?.department || '',
      degree: user?.degree || '',
      yearOfStudy: user?.yearOfStudy || user?.year || '',
      gpa: '',
      expectedGraduation: ''
    },
    technicalSkills: [], // { name, proficiency }
    softSkills: [], // { name, proficiency }
    interests: [],
    careerGoals: {
      targetRole: '',
      targetCompanyType: '',
      timeline: '',
      careerSummary: ''
    },
    projects: [], // { title, description, technologies, projectUrl, githubUrl, duration }
    certifications: [] // { title, provider, date, url }
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  
  // Temporary state for skills search and project inputs
  const [skillSearch, setSkillSearch] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', projectUrl: '', githubUrl: '', duration: '' });
  const [newCert, setNewCert] = useState({ title: '', provider: '', date: '', url: '' });

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (step) => {
    if (step === 3 && formData.technicalSkills.length < 3) {
      toast.error('Please add at least 3 technical skills');
      return false;
    }
    if (step === 5 && formData.interests.length < 2) {
      toast.error('Please select at least 2 interests');
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        personalInfo: formData.personal,
        academic: formData.academic,
        technicalSkills: formData.technicalSkills.map(s => ({
          name: typeof s === 'string' ? s : s.name,
          level: Number(s.proficiency) || 50,
          category: 'Technical'
        })),
        softSkills: formData.softSkills.map(s => ({
          name: typeof s === 'string' ? s : s.name,
          level: Number(s.proficiency) || 50
        })),
        interests: formData.interests,
        careerGoals: formData.careerGoals,
        projects: formData.projects,
        certifications: formData.certifications,
        onboardingComplete: true
      };

      await profileService.updateProfile(payload);

      if (resumeFile) {
        try {
          await resumeService.uploadResume(resumeFile);
        } catch (rErr) {
          console.error('Resume upload error:', rErr);
        }
      }

      try {
        await skillService.analyzeSkills();
      } catch (sErr) {
        console.error('AI skill analysis error:', sErr);
      }

      if (updateUser) {
        updateUser({ onboardingComplete: true });
      }

      toast.success('Profile setup complete! AI is analyzing your profile...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast.error(error?.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field update handlers
  const updateNestedForm = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  // Technical Skills Handlers
  const addTechnicalSkill = (skillName) => {
    if (!formData.technicalSkills.find(s => s.name === skillName)) {
      setFormData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, { name: skillName, proficiency: 50 }]
      }));
    }
    setSkillSearch('');
  };

  const removeTechnicalSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s.name !== skillName)
    }));
  };

  const updateTechnicalSkillProficiency = (skillName, proficiency) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.map(s => 
        s.name === skillName ? { ...s, proficiency: Number(proficiency) } : s
      )
    }));
  };

  // Soft Skills Handlers
  const toggleSoftSkill = (skillName) => {
    const exists = formData.softSkills.find(s => s.name === skillName);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        softSkills: prev.softSkills.filter(s => s.name !== skillName)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        softSkills: [...prev.softSkills, { name: skillName, proficiency: 50 }]
      }));
    }
  };

  const updateSoftSkillProficiency = (skillName, proficiency) => {
    setFormData(prev => ({
      ...prev,
      softSkills: prev.softSkills.map(s => 
        s.name === skillName ? { ...s, proficiency: Number(proficiency) } : s
      )
    }));
  };

  // Interests Handler
  const toggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  // Project Handlers
  const addProject = () => {
    if (!newProject.title) {
      toast.error('Project title is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...newProject }]
    }));
    setNewProject({ title: '', description: '', technologies: '', projectUrl: '', githubUrl: '', duration: '' });
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Certification Handlers
  const addCertification = () => {
    if (!newCert.title) {
      toast.error('Certification title is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...newCert }]
    }));
    setNewCert({ title: '', provider: '', date: '', url: '' });
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Resume Dropzone Handler
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      setResumeFile(file);
      toast.success(`Selected file: ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const filteredTechSkills = TECHNICAL_SKILLS.filter(s => 
    s.toLowerCase().includes(skillSearch.toLowerCase()) && 
    !formData.technicalSkills.some(ts => ts.name === s)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl mb-3">
            <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Let's setup your profile</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tell us about yourself so our AI can personalize your career recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </span>
            <span className="text-xs font-semibold inline-block text-violet-600 dark:text-violet-400">
              {Math.round((currentStep / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-600"
            />
          </div>
        </div>

        {/* Wizard Container */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* STEP 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input type="text" value={formData.personal.phone} onChange={e => updateNestedForm('personal', 'phone', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location (City, Country)</label>
                        <input type="text" value={formData.personal.location} onChange={e => updateNestedForm('personal', 'location', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="New York, USA" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                      <textarea rows={3} value={formData.personal.bio} onChange={e => updateNestedForm('personal', 'bio', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="A brief summary about yourself..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn URL</label>
                        <input type="url" value={formData.personal.linkedin} onChange={e => updateNestedForm('personal', 'linkedin', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub URL</label>
                        <input type="url" value={formData.personal.github} onChange={e => updateNestedForm('personal', 'github', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="https://github.com/..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio URL</label>
                        <input type="url" value={formData.personal.portfolio} onChange={e => updateNestedForm('personal', 'portfolio', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="https://yourportfolio.com" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Academic Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Academic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">College/University</label>
                        <input type="text" value={formData.academic.college} onChange={e => updateNestedForm('academic', 'college', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                        <select value={formData.academic.department} onChange={e => updateNestedForm('academic', 'department', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500">
                          <option value="">Select Department</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                        <select value={formData.academic.degree} onChange={e => updateNestedForm('academic', 'degree', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500">
                          <option value="">Select Degree</option>
                          {DEGREES.map(deg => <option key={deg} value={deg}>{deg}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year of Study</label>
                        <select value={formData.academic.yearOfStudy} onChange={e => updateNestedForm('academic', 'yearOfStudy', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500">
                          <option value="">Select Year</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GPA / Percentage</label>
                        <input type="text" value={formData.academic.gpa} onChange={e => updateNestedForm('academic', 'gpa', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="e.g. 3.8 or 85%" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Graduation Year</label>
                        <input type="text" value={formData.academic.expectedGraduation} onChange={e => updateNestedForm('academic', 'expectedGraduation', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="e.g. 2026" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Technical Skills */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Technical Skills</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Search and select your technical skills. Set your proficiency level for each (Min 3 required).</p>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input type="text" value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills (e.g. React, Python, Docker)..." className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" />
                    </div>

                    {skillSearch && filteredTechSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border rounded-xl border-gray-200 dark:border-gray-700">
                        {filteredTechSkills.map(skill => (
                          <button key={skill} onClick={() => addTechnicalSkill(skill)} className="flex items-center gap-1 px-3 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-100 text-sm font-medium">
                            <Plus className="w-4 h-4" /> {skill}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4 mt-4">
                      {formData.technicalSkills.map(skill => (
                        <div key={skill.name} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center justify-between md:w-1/3">
                            <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                            <button onClick={() => removeTechnicalSkill(skill.name)} className="text-gray-400 hover:text-red-500 md:hidden">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 flex-1">
                            <input type="range" min="10" max="100" value={skill.proficiency} onChange={e => updateTechnicalSkillProficiency(skill.name, e.target.value)} className="w-full accent-violet-600" />
                            <span className="w-12 text-right font-medium text-violet-600 dark:text-violet-400 text-sm">{skill.proficiency}%</span>
                          </div>
                          <button onClick={() => removeTechnicalSkill(skill.name)} className="text-gray-400 hover:text-red-500 hidden md:block">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Soft Skills */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Soft Skills</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select soft skills that describe your interpersonal abilities.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {SOFT_SKILLS.map(skill => {
                        const selected = formData.softSkills.some(s => s.name === skill);
                        return (
                          <button key={skill} onClick={() => toggleSoftSkill(skill)} className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-all ${selected ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-300'}`}>
                            {skill}
                            {selected && <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-3 mt-6">
                      {formData.softSkills.map(skill => (
                        <div key={skill.name} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                          <span className="font-medium text-sm text-gray-800 dark:text-gray-200 w-1/3">{skill.name}</span>
                          <input type="range" min="10" max="100" value={skill.proficiency} onChange={e => updateSoftSkillProficiency(skill.name, e.target.value)} className="w-full accent-violet-600" />
                          <span className="w-12 text-right font-medium text-violet-600 text-sm">{skill.proficiency}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Interests */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Fields of Interest</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select at least 2 fields you are passionate about.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {INTERESTS.map(interest => {
                        const selected = formData.interests.includes(interest);
                        return (
                          <button key={interest} onClick={() => toggleInterest(interest)} className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${selected ? 'border-violet-600 bg-violet-600 text-white shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-300'}`}>
                            {interest}
                            {selected && <CheckCircle2 className="w-5 h-5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 6: Career Goals */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Career Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Role</label>
                        <input type="text" value={formData.careerGoals.targetRole} onChange={e => updateNestedForm('careerGoals', 'targetRole', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500" placeholder="e.g. Full Stack Engineer, Data Scientist" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Company Type</label>
                        <select value={formData.careerGoals.targetCompanyType} onChange={e => updateNestedForm('careerGoals', 'targetCompanyType', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500">
                          <option value="">Select Company Type</option>
                          <option value="MNC">MNC / Big Tech</option>
                          <option value="Startup">High Growth Startup</option>
                          <option value="Product">Product Company</option>
                          <option value="Service">Service Company</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Timeline</label>
                      <select value={formData.careerGoals.timeline} onChange={e => updateNestedForm('careerGoals', 'timeline', e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500">
                        <option value="">Select Timeline</option>
                        <option value="Immediate">Immediate / 1 Month</option>
                        <option value="3 Months">Within 3 Months</option>
                        <option value="6 Months">Within 6 Months</option>
                        <option value="1 Year">Within 1 Year</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 7: Experience (Projects & Certifications) */}
                {currentStep === 7 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">Projects</h3>
                      <div className="space-y-4 mb-4">
                        {formData.projects.map((proj, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{proj.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{proj.description}</p>
                              <span className="text-xs text-violet-600 dark:text-violet-400 mt-2 block font-medium">Tech: {proj.technologies}</span>
                            </div>
                            <button onClick={() => removeProject(idx)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 space-y-3">
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Add a Project</h4>
                        <input type="text" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm" />
                        <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm" rows={2} />
                        <input type="text" placeholder="Technologies (comma separated)" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm" />
                        <button onClick={addProject} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">Add Project</button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">Certifications</h3>
                      <div className="space-y-3 mb-4">
                        {formData.certifications.map((cert, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-sm text-gray-900 dark:text-white">{cert.title}</span>
                              <span className="text-xs text-gray-500 ml-2">by {cert.provider}</span>
                            </div>
                            <button onClick={() => removeCertification(idx)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 space-y-3">
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Add a Certification</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input type="text" placeholder="Certification Title" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm" />
                          <input type="text" placeholder="Provider (e.g. AWS, Coursera)" value={newCert.provider} onChange={e => setNewCert({...newCert, provider: e.target.value})} className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm" />
                        </div>
                        <button onClick={addCertification} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">Add Certification</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Resume Upload */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Upload Resume (Optional)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload your PDF or DOCX resume for instant ATS scoring and AI analysis.</p>

                    <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-violet-400'}`}>
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-4 bg-violet-100 dark:bg-violet-900/40 rounded-full">
                          <Upload className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                        </div>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                          {resumeFile ? resumeFile.name : 'Drag & drop your resume here, or click to browse'}
                        </p>
                        <p className="text-xs text-gray-400">Supports PDF, DOCX (Max 5MB)</p>
                      </div>
                    </div>

                    {resumeFile && (
                      <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{resumeFile.name}</p>
                            <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button onClick={() => setResumeFile(null)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Wizard Navigation Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </button>

              {currentStep === STEPS.length && (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline mr-4"
                >
                  Skip for now
                </button>
              )}
              
              {currentStep < STEPS.length ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-sm"
                >
                  Next Step <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Saving...</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5 mr-2" /> Complete Setup</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
