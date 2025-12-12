import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, Phone, MessageCircle, Globe, ShieldCheck, LifeBuoy, ExternalLink } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import { Button } from '@/components/ui/button';

// --- Custom Styling for Celestial Aesthetic ---
const customStyles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .glass-panel {
    background: rgba(20, 10, 40, 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  
  .resource-card-hover:hover {
    background: rgba(40, 20, 70, 0.7);
    border-color: rgba(168, 85, 247, 0.3);
    box-shadow: 0 10px 40px -10px rgba(168, 85, 247, 0.3);
    transform: translateY(-4px);
  }
`;

const GuidanceAndSupportPage = () => {
  const resources = [
    {
      title: "Crisis Text Line",
      description: "Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US to text with a trained Crisis Counselor.",
      icon: MessageCircle,
      action: "Text HOME to 741741",
      href: "sms:741741",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      title: "988 Suicide & Crisis Lifeline",
      description: "The 988 Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones.",
      icon: Phone,
      action: "Call or Text 988",
      href: "tel:988",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30"
    },
    {
      title: "The Trevor Project",
      description: "The world's largest suicide prevention and mental health organization for LGBTQ (lesbian, gay, bisexual, transgender, queer, and questioning) young people.",
      icon: HeartHandshake,
      action: "Connect Now",
      href: "https://www.thetrevorproject.org/get-help/",
      isExternal: true,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30"
    },
    {
      title: "RAINN",
      description: "The Rape, Abuse & Incest National Network is the nation's largest anti-sexual violence organization. Access the National Sexual Assault Hotline 24/7.",
      icon: ShieldCheck,
      action: "Call 800-656-HOPE",
      href: "tel:18006564673",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <PageHelmet
        title="Guidance & Support | Professional Resources"
        description="Access verified mental health resources, crisis hotlines, and professional support organizations. A safe space to find the help you deserve."
        canonical="/guidance-and-support"
      />
      
      {/* Inject Styles */}
      <style>{customStyles}</style>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/20 to-blue-600/20 border border-teal-400/30 mb-6 shadow-[0_0_30px_rgba(45,212,191,0.2)]"
          >
            <LifeBuoy className="w-10 h-10 text-teal-300" />
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-purple-200 mb-6 leading-tight"
          >
            You Are Never Alone
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Asking for help is an act of courage, not weakness. Below are trusted, confidential resources available to support you through difficult times.
          </motion.p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <a 
                href={resource.href} 
                target={resource.isExternal ? "_blank" : undefined}
                rel={resource.isExternal ? "noopener noreferrer" : undefined}
                className="block h-full"
              >
                <div className={`h-full glass-panel rounded-2xl p-8 transition-all duration-300 resource-card-hover group border ${resource.borderColor} flex flex-col`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${resource.bgColor} shadow-lg backdrop-blur-sm`}>
                      <resource.icon className={`w-8 h-8 ${resource.color}`} />
                    </div>
                    {resource.isExternal && (
                      <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-200 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                    {resource.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="inline-flex items-center font-semibold text-white text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/20 transition-colors">
                      {resource.action}
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Emergency Disclaimer - High Importance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="glass-panel rounded-2xl p-8 border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/30 to-transparent relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="p-4 rounded-full bg-red-500/20 shrink-0 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">In Immediate Danger?</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you or someone you know is in immediate danger or experiencing a medical emergency, please do not wait. Call your local emergency number (like <span className="text-white font-bold">911</span> in the US) or go to the nearest emergency room immediately.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                  <Globe className="w-4 h-4" />
                  <span>International Considerations</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                   The resources listed above are primarily US-based. If you are outside the US, please search for local crisis lines in your country immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center text-gray-500 text-sm mt-12 max-w-2xl mx-auto"
        >
            Little Space World provides these resources for informational purposes. We are a peer support community and not a substitute for professional medical advice, diagnosis, or treatment.
        </motion.p>
      </div>
    </div>
  );
};

export default GuidanceAndSupportPage;