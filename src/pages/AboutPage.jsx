import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageCircle, Heart, Shield, Users, Sparkles, Award, Brain, AlertCircle } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};
const values = [{
  icon: Heart,
  title: "Acceptance & Authenticity",
  description: "Celebrating your true self in a judgment-free zone."
}, {
  icon: Shield,
  title: "Safety & Trust",
  description: "A rigorously moderated SFW environment prioritizing your wellbeing."
}, {
  icon: Sparkles,
  title: "Joyful Healing",
  description: "Rediscovering wonder and play as tools for emotional regulation."
}, {
  icon: Users,
  title: "Community Support",
  description: "Unconditional support from people who truly understand."
}];
const faqs = [{
  question: "What is SFW age regression?",
  answer: "SFW (Safe For Work) age regression is a therapeutic coping mechanism where an individual mentally reverts to a younger age to manage stress, process trauma, or nurture their inner child. It is strictly non-sexual and focuses on comfort, safety, and emotional healing."
}, {
  question: "Is this space professionally guided?",
  answer: "While Little Space World is founded by an Occupational Therapy professional, the site provides peer support and educational resources, not medical advice. We encourage using our resources alongside professional therapy when needed."
}, {
  question: "Who is this community for?",
  answer: "This community is for age regressors, dreamers, those doing inner-child work, and anyone seeking a safe, nostalgic refuge from the pressures of adulthood. We welcome all backgrounds and identities."
}];
const AboutPage = () => {
  return <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <PageHelmet title="About Us | Professional Support for Age Regression" description="Meet Jeana, the Occupational Therapy professional behind Little Space World. Discover our mission to provide safe, therapeutic resources for age regression and inner child healing." canonical="/about" />

      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <motion.section className="text-center space-y-6 mt-8" initial="initial" animate="animate" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="inline-block mb-2">
            <span className="px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-sm font-medium tracking-wider uppercase">About Us</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 pb-2 leading-tight">A Safe Haven for Your 
Inner Child</motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Welcome to a world built on professional expertise, personal understanding, and the belief that everyone deserves a safe and validating space.</motion.p>
        </motion.section>

        {/* Founder Bio Section - EEAT Optimized */}
        <motion.section className="relative" initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.8
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/40 rounded-3xl blur-xl -z-10" />
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col md:flex-row gap-10 items-center md:items-start">
            
            <div className="flex-shrink-0 w-full md:w-72 flex flex-col items-center text-center space-y-6">
               <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full blur-md opacity-50 animate-pulse group-hover:opacity-75 transition-opacity" />
                  <img className="relative w-64 h-64 rounded-full object-cover border-4 border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" alt="Jeana, founder of Little Space World and Occupational Therapy professional" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/68470a32-d856-4001-aa04-6ef3f0b873ca/f6485a0ed4d95e99084743c5fc4c5fb0.png" width="256" height="256" loading="lazy" />
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-white">Jeana</h2>
                 <p className="text-cyan-300 font-medium text-sm uppercase tracking-wider mt-2">Founder & Educational OT Specialist</p>
               </div>
            </div>

            <div className="flex-1 space-y-6 text-gray-200 text-lg leading-relaxed">
              <div className="flex items-center gap-3 mb-2">
                <Award className="text-yellow-400 w-8 h-8" />
                <h3 className="text-2xl md:text-3xl font-semibold text-white">Meet the Founder</h3>
              </div>
              
              <p>Hi there! I'm Jeana. My mission for this site is to create a truly unique and safe space for all.</p>

              <div className="pl-6 border-l-4 border-purple-500/50 py-2 bg-purple-900/10 rounded-r-xl">
                <p className="italic text-gray-300">
                  "With more than 15 years of experience in the field of occupational therapy, I've specialized in sensory processing, emotional regulation, and developmental needs, particularly for individuals with Autism Spectrum Disorder (ASD). My work has always centered on helping people find effective ways to cope, connect, and thrive."
                </p>
              </div>

              <p>
                My passion for this work is deeply rooted in my personal journey. Growing up, I witnessed firsthand the challenges of mental health, with a mother battling Borderline Personality Disorder (BPD) and a sibling navigating both BPD and ASD. These experiences instilled in me a profound understanding of the need for compassionate, informed support systems.
              </p>
              <p>
                Through both my professional career and personal life, I came to understand age regression not merely as a coping mechanism, but as a powerful, valid, and often therapeutic tool. It offers a unique path for healing trauma, managing stress, and nurturing the inner child.
              </p>
              
              <p>
                <strong className="text-white block mb-1">My Vision for Little Space World:</strong> 
                To create a sanctuary where the joy and innocence of childhood meet evidence-informed, professional understanding. This platform is designed to be a judgment-free zone, fostering connection and providing resources within a rigorously moderated, supportive community. My goal is to empower you to explore your inner self, find comfort, and confidently navigate your journey towards well-being.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Core Values */}
        <section className="relative z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Our Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => <motion.div key={index} className="glass-card p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 text-center group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} viewport={{
            once: true
          }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/10">
                  <value.icon className="w-7 h-7 text-cyan-300 group-hover:text-cyan-200" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-400">{value.description}</p>
              </motion.div>)}
          </div>
        </section>

        {/* FAQs */}
        <motion.section className="max-w-3xl mx-auto" initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }}>
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
            <Brain className="text-purple-400" />
            Common Questions
          </h2>
          <div className="glass-card p-2 rounded-2xl bg-black/20 border border-white/10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => <AccordionItem value={`item-${index}`} key={index} className="border-b-white/10 last:border-b-0 px-4">
                  <AccordionTrigger className="hover:no-underline text-lg text-white py-5 text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-300 text-base leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </motion.section>

        {/* Disclaimer Section */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="max-w-4xl mx-auto">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div className="text-sm text-yellow-200/90 leading-relaxed">
                    <strong className="text-yellow-500 block mb-1 text-base">Important Disclaimer</strong>
                    While Little Space World is founded by a licensed Occupational Therapy professional, the content and community interactions provided here are for educational and peer-support purposes only. They are not intended to substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified mental health provider with any questions you may have regarding a medical condition.
                </div>
            </div>
        </motion.section>

        {/* Contact / CTA */}
        <motion.section id="contact" className="text-center py-8" initial={{
        opacity: 0,
        scale: 0.95
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }}>
          <div className="glass-card p-10 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-transparent relative overflow-hidden">
             {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">We're Here For You</h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Whether you need support, have a suggestion, or just want to share your story, we are always listening.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 text-white border-none shadow-[0_0_20px_rgba(236,72,153,0.4)] rounded-full px-8">
                    <a href="mailto:jeana@littlespaceworld.com">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Jeana
                    </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/50 hover:text-cyan-200 rounded-full px-8 bg-transparent">
                    <a href="https://wa.me/17573011258" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                    </a>
                </Button>
                </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>;
};
export default AboutPage;