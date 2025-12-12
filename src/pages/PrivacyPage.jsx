import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';

const PrivacyPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
      content: "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and any other information you choose to provide."
    },
    {
      title: "How We Use Your Information",
      icon: FileText,
      content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience. We do not sell your personal data to third parties."
    },
    {
      title: "Data Security",
      icon: Lock,
      content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction."
    }
  ];

  return (
    <div className="py-10 px-6 sm:px-8 md:px-12">
      <PageHelmet
        title="Privacy Policy"
        description="Read our Privacy Policy to understand how Little Space World collects, uses, and protects your personal information."
        canonical="/privacy"
      />
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 gradient-bg rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="w-10 h-10 text-gray-800" />
          </motion.div>
          
          <h1>Privacy Policy</h1>
          
          <motion.div 
            className="glass-card p-6 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <p className="text-lg text-foreground/80 mb-2">
              <strong>Last Updated:</strong> September 8, 2025
            </p>
            <p className="text-foreground/80">
              Your privacy is important to us. This policy outlines how we handle your data at Little Space World.
            </p>
          </motion.div>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="glass-card p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 gradient-bg rounded-xl mr-4">
                  <section.icon className="w-6 h-6 text-gray-800" />
                </div>
                <h2>{section.title}</h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;