import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Lock, MessageCircle, Heart, AlertTriangle, Mail } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SafetyPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const sections = [
    {
      id: 1,
      title: "Our Commitment to Safety",
      icon: Shield,
      content: "At Little Space World, your safety and well-being are our top priorities. We are dedicated to providing a strictly SFW (Safe For Work) environment where everyone can explore their inner child, connect with others, and find comfort. This page outlines our guidelines and resources to help maintain a secure and positive community."
    },
    {
      id: 2,
      title: "SFW (Safe For Work) Policy",
      icon: Lock,
      content: "Little Space World is a non-sexual, therapeutic, and recreational space. We value freedom of expression, but any content or behavior that is explicit or overtly suggestive is strictly prohibited. Our focus is on the wholesome nature of age regression.",
      points: [
        {
          title: "No Explicit Content:",
          text: "No discussions, images, links, or references to overtly sexual topics or adult themes. We aim to keep the space comfortable for everyone."
        },
        {
          title: "Respectful Language:",
          text: "Keep language clean and respectful. No profanity, slurs, or derogatory terms."
        },
        {
          title: "No Harassment or Bullying:",
          text: "Treat all members with kindness. Harassment, bullying, hate speech, or personal attacks are strictly forbidden."
        }
      ]
    },
    {
      id: 3,
      title: "Protecting Your Privacy",
      icon: Users,
      content: "We encourage you to be mindful of the information you share online. While we take measures to protect your data, personal responsibility is key:",
      points: [
        {
          title: "Personal Information:",
          text: "Never share your real name, address, phone number, or other identifying personal details with strangers. Use your nickname and keep your profile private if you prefer."
        },
        {
          title: "Online Interactions:",
          text: "Be cautious when interacting with new people. If someone makes you uncomfortable, block them and report their behavior to our moderators."
        },
        {
          title: "External Links:",
          text: "Be careful when clicking on external links. We are not responsible for the content or privacy practices of third-party websites."
        }
      ]
    },
    {
      id: 4,
      title: "Reporting & Moderation",
      icon: AlertTriangle,
      content: "Our moderation team works hard to keep Little Space World safe. You can help by reporting any content or behavior that violates our rules:",
      points: [
        {
          title: "How to Report:",
          text: "If you encounter inappropriate content or behavior, please use the 'Report' function or contact a moderator directly. Provide as much detail as possible."
        },
        {
          title: "What Happens After Reporting:",
          text: "All reports are reviewed by our moderation team. Actions may include warnings, content removal, temporary bans, or permanent bans, depending on the severity of the violation."
        },
        {
          title: "Zero Tolerance:",
          text: "We have a zero-tolerance policy for explicit content and harassment. Violations will result in immediate action."
        }
      ]
    },
    {
      id: 5,
      title: "Mental Health & Well-being",
      icon: Heart,
      content: "While age regression can be a healthy coping mechanism, we understand that some individuals may be dealing with underlying mental health challenges. We are not a substitute for professional help:",
      points: [
        {
          title: "Seek Professional Help:",
          text: <span>If you are struggling with mental health issues, please reach out to a qualified mental health professional. We provide resources on our <Link to='/guidance-and-support' className='underline text-cyan-300 hover:text-cyan-200 font-medium'>Guidance & Support</Link> page.</span>
        },
        {
          title: "Self-Care:",
          text: "Prioritize your self-care. If you feel overwhelmed or triggered, take a break from online interactions and focus on activities that bring you comfort and peace."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <PageHelmet
        title="Safety Guidelines | Little Space World"
        description="Learn about the safety guidelines and SFW policy of Little Space World. We are committed to providing a secure, respectful, and positive environment for all members."
        canonical="/safety"
      />
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        className="max-w-5xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)] mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="w-12 h-12 text-cyan-300" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 leading-tight pb-2">
            Safety Guidelines
          </h1>
          
          <motion.div 
            className="glass-card px-8 py-4 max-w-2xl mx-auto rounded-full bg-white/5 border border-white/10"
            variants={fadeInUp}
          >
            <p className="text-gray-300 text-lg">
              <strong className="text-white">Last Updated:</strong> December 4, 2025
            </p>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className="glass-card p-8 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md hover:bg-black/30 transition-colors duration-300"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {section.title}
                  </h2>
                  
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {section.content}
                  </p>

                  {section.points && (
                    <ul className="grid gap-4 mt-6">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <p className="font-bold text-cyan-300 mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                            {point.title}
                          </p>
                          <p className="text-gray-300 pl-3.5">{point.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Contact Section (Originally #6, now improved) */}
          <motion.div
            className="glass-card p-10 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-black/50 relative overflow-hidden text-center"
            variants={itemVariants}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-purple-300" />
              </div>
              
              <h2 className="text-3xl font-bold text-white">Still have questions?</h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                If you have any safety concerns, need to report an incident, or just want clarification on our policies, we are here to help.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 text-white border-none shadow-[0_0_20px_rgba(236,72,153,0.3)] rounded-full px-8 h-14">
                  <a href="mailto:jeana@littlespaceworld.com">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Jeana Directly
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/50 hover:text-cyan-200 rounded-full px-8 h-14 bg-transparent backdrop-blur-sm">
                  <Link to="/contact">
                    Visit Contact Page
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 pt-4">
                Direct Support Email: <span className="text-gray-400 select-all">jeana@littlespaceworld.com</span>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafetyPage;