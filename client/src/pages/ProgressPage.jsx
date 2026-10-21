import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Trophy, TrendingUp, BookOpen, Star, Activity } from 'lucide-react';
import { profileService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProgressPage = () => {
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const scoreHistory = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 58 },
    { month: 'Apr', score: 65 },
    { month: 'May', score: 72 },
    { month: 'Jun', score: 85 },
  ];

  const skillGrowth = [
    { name: 'React', before: 40, after: 85 },
    { name: 'Node.js', before: 20, after: 60 },
    { name: 'TypeScript', before: 10, after: 75 },
    { name: 'CSS', before: 60, after: 90 },
  ];

  const learningData = [
    { name: 'Completed', value: 12 },
    { name: 'In Progress', value: 3 },
    { name: 'Planned', value: 8 },
  ];
  const COLORS = ['#10b981', '#8b5cf6', '#e5e7eb'];

  const timeline = [
    { id: 1, title: 'Achieved "React Master" Badge', type: 'badge', date: '2 days ago' },
    { id: 2, title: 'Resume Score improved by 13 points', type: 'resume', date: '1 week ago' },
    { id: 3, title: 'Completed Course: Advanced UI Patterns', type: 'course', date: '2 weeks ago' },
    { id: 4, title: 'Generated first Learning Path', type: 'path', date: '1 month ago' },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your growth and career readiness over time.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Skills Improved</p>
              <h3 className="text-2xl font-bold">14</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Courses Done</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Resume Score</p>
              <h3 className="text-2xl font-bold">85 <span className="text-sm text-green-500 font-normal">+13</span></h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Milestones</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Score Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-6">Resume Score Trend</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Growth Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-6">Skill Proficiency Growth</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" name="Initial" dataKey="before" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={{r:4}} />
                <Line type="monotone" name="Current" dataKey="after" stroke="#10b981" strokeWidth={3} dot={{r:6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Distribution */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h2 className="text-lg font-bold mb-6">Learning Distribution</h2>
          <div className="h-[250px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={learningData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {learningData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={item.id} className="flex gap-4 relative">
                {index !== timeline.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                )}
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 z-10 border border-white dark:border-gray-900">
                  <Activity size={14} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
