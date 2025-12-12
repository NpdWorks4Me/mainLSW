import React from 'react';
import { AlertCircle } from 'lucide-react';

const DisclaimerBanner = () => (
  <div className="w-full bg-[#0f0f1a] border-t border-b border-purple-500/20 py-10 px-4 mt-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-purple-900/5 pointer-events-none" />
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-5 items-start relative z-10">
      <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 shrink-0">
        <AlertCircle className="w-6 h-6 text-purple-300" />
      </div>
      <div className="space-y-3">
        <h3 className="text-purple-200 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          Community & Safety Notice
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
          Little Space World is strictly a Safe For Work (SFW) community focused on therapeutic age regression and inner child healing as healthy coping mechanisms. Content provided is for educational and supportive purposes only and does not constitute professional medical or psychological advice. If you are experiencing a mental health crisis, please contact a qualified healthcare provider or emergency services immediately.
        </p>
      </div>
    </div>
  </div>
);

export default DisclaimerBanner;