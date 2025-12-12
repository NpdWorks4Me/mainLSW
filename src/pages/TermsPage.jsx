import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertCircle, Gavel } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';

const TermsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileCheck,
      content: "By accessing or using Little Space World, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "User Conduct",
      icon: AlertCircle,
      content: "You agree to use the website only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material."
    },
    {
      title: "Intellectual Property",
      icon: Scale,
      content: "All content included on this site, such as text, graphics, logos, images, and software, is the property of Little Space World or its content suppliers and protected by international copyright laws."
    },
    {
      title: "Limitation of Liability",
      icon: Gavel,
      content: "In no event shall Little Space World be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Little Space World's website."
    }
  ];

  return (
    <div className="py-10 px-6 sm:px-8 md:px-12">
      <PageHelmet
        title="Terms of Service"
        description="Read the Terms of Service for Little Space World. These terms govern your use of our website and services."
        canonical="/terms"
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
            <Scale className="w-10 h-10 text-gray-800" />
          </motion.div>
          
          <h1>Terms of Service</h1>
          
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
              Please read these terms carefully before using our services.
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

export default TermsPage;