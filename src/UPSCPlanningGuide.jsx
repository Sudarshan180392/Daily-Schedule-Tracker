import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { englishPlanner, hindiPlanner, englishWorkingPlanner, hindiWorkingPlanner } from './planningGuideData';

function UPSCPlanningGuide() {
  const [aspirantType, setAspirantType] = useState('fulltime');
  const [medium, setMedium] = useState('english');

  let content = '';
  if (aspirantType === 'working') {
    content = medium === 'english' ? englishWorkingPlanner : hindiWorkingPlanner;
  } else {
    content = medium === 'english' ? englishPlanner : hindiPlanner;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-3">
              UPSC Planning Guide
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              The ultimate 15-month masterplan to crack the UPSC CSE
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Aspirant Type Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 shadow-inner border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => setAspirantType('fulltime')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  aspirantType === 'fulltime'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Full Time Aspirant
              </button>
              <button
                onClick={() => setAspirantType('working')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  aspirantType === 'working'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Working Aspirant
              </button>
            </div>

            {/* Medium Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 shadow-inner border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => setMedium('english')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  medium === 'english'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                English Medium
              </button>
              <button
                onClick={() => setMedium('hindi')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  medium === 'hindi'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Hindi Medium
              </button>
            </div>
          </div>
        </div>

        {/* Content Render */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-lg font-bold mt-5 mb-2 text-slate-800 dark:text-slate-100" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-600 dark:text-slate-300" {...props} />,
              li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
              em: ({node, ...props}) => <em className="italic text-slate-700 dark:text-slate-300" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-50 dark:bg-indigo-900/20 italic text-slate-700 dark:text-slate-300 rounded-r-lg" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto mb-6"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg" {...props} /></div>,
              thead: ({node, ...props}) => <thead className="bg-slate-50 dark:bg-slate-900" {...props} />,
              tbody: ({node, ...props}) => <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700" {...props} />,
              tr: ({node, ...props}) => <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" {...props} />,
              th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider" {...props} />,
              td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap" {...props} />,
              hr: ({node, ...props}) => <hr className="my-8 border-slate-200 dark:border-slate-700" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

      </div>
    </div>
  );
}

export default UPSCPlanningGuide;
