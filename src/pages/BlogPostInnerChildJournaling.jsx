import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Star, CheckCircle, BookOpen, Heart, Sparkles, Calendar, RefreshCw } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import GlitchTitle from '@/components/GlitchTitle';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AuthorBio from '@/components/blog/AuthorBio';
import { authorProfiles } from '@/data/authorProfiles';

const STORAGE_KEY_PROMPTS = 'lsw_journal_prompts_v1';
const STORAGE_KEY_TRACKER = 'lsw_journal_tracker_v1';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// PDF URL
const PDF_URL = "https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/prompts/Innerchildhealingprompts.pdf";

// Author for this post
const author = authorProfiles['Jeana'];

// Page Metadata
const pageTitle = "Inner Child Journaling Kit | 60 Healing Prompts";
const pageDescription = "Reconnect with your joy using 60 interactive prompts for inner child healing. From rediscovering play to soothing hard days, this kit is a safe space for your emotional recovery.";
const canonicalUrl = "https://littlespaceworld.com/blog/inner-child-journaling-prompt-kit";
const ogImageUrl = "https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/journal-kit-thumb.webp";
const publishedDate = "2025-12-12T08:00:00Z";

const categories = [
  {
    id: 'joy',
    title: 'Rediscover Joy (Days 1-10)',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400/30',
    prompts: [
      "What was your absolute favorite toy growing up, and why did you love it?",
      "Describe your perfect imaginary playground. What equipment does it have?",
      "What is a cartoon or movie that made you feel safest as a child?",
      "If you could have any animal (real or mythical) as a best friend, what would it be?",
      "What was your favorite snack that you weren't always allowed to have?",
      "List 5 things that make you smile instantly today.",
      "What did you want to be when you grew up? Do you still see parts of that in you?",
      "Describe a time you laughed so hard your tummy hurt.",
      "What colors make you feel happy and energized?",
      "If magic were real, what is the first spell you would cast?"
    ]
  },
  {
    id: 'hard',
    title: 'For the Harder Days (Days 11-20)',
    color: 'text-pink-500',
    borderColor: 'border-pink-500/30',
    prompts: [
      "What is something you wish an adult had said to you when you were sad?",
      "Describe a time you felt small. What did you need in that moment?",
      "If your sadness was a monster, what would it look like? Draw or describe it.",
      "Write a letter to the person who hurt you (you don't have to send it).",
      "What are three things that make you feel safe right now?",
      "When do you feel the most lonely? What comforts you then?",
      "It is okay to cry. Write 'I am allowed to have feelings' five times.",
      "What were you afraid of as a child? Does it still scare you?",
      "If you could build a fortress to hide in, what would it be made of?",
      "Write about a time you felt misunderstood."
    ]
  },
  {
    id: 'reparenting',
    title: 'Reparenting & Validation (Days 21-30)',
    color: 'text-purple-400',
    borderColor: 'border-purple-400/30',
    prompts: [
      "Write a letter from your Adult Self to your Little Self saying 'I am here now.'",
      "List 5 things you love about your personality.",
      "What is a boundary you need to set to protect your inner child?",
      "Complete this sentence: 'I forgive myself for...'",
      "How can you show yourself kindness today?",
      "What does 'safety' feel like in your body?",
      "Write down: 'It was not my fault' and sit with that feeling.",
      "How would you comfort a child who made the same mistake you just made?",
      "What are you proud of achieving, no matter how small?",
      "Promise your inner child one thing for the future."
    ]
  },
  {
    id: 'living',
    title: 'Living the Change (Days 31-40)',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    prompts: [
      "Buy yourself a small treat (sticker, candy, toy) and write about how it felt.",
      "Wear something just because it's fun or colorful today.",
      "Say 'No' to something you don't want to do. How did it feel?",
      "Ask for help with a simple task. Write about the experience.",
      "Spend 15 minutes coloring or doodling with no goal in mind.",
      "Have a 'nap time' or quiet rest period without your phone.",
      "Eat your dessert first (or have a fun breakfast).",
      "Watch an episode of a show you loved as a kid.",
      "Skip or jump instead of walking for a few steps.",
      "Look in the mirror and tell your reflection, 'I love you.'"
    ]
  },
  {
    id: 'bonus',
    title: 'Bonus Prompts (Days 41-60)',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400/30',
    prompts: [
      "Build a blanket fort and write a journal entry from inside it.",
      "Write a fairy tale where YOU are the hero who saves the day.",
      "Make a list of 'Rules' for your life that are actually just fun things.",
      "Describe your dream bedroom if you had an unlimited budget.",
      "Write a thank you note to your body for carrying you this far.",
      "What is a hobby you've always wanted to try? Why haven't you?",
      "If you could talk to animals, what would you ask your pet?",
      "Plan a 'Yes Day' for yourself. What would you do?",
      "Draw a picture of your feelings right now (stick figures are fine!).",
      "Write a list of 10 things you are grateful for in your Littlespace.",
      // New Bonus Prompts 51-60
      "What is your favorite color combination and why do you love it?",
      "If you were a cloud floating in the sky, what shape would you be?",
      "Write a short letter to your future self about what makes you happy today.",
      "What is the softest thing you own? Describe how it feels to touch.",
      "Make a playlist of 3 songs that make you want to wiggle and dance.",
      "If you could visit any fictional world from a book or movie, where would you go?",
      "Draw a picture (or describe) your absolute favorite comfort food.",
      "What is a nice compliment you would like to hear? Give it to yourself now.",
      "Describe your perfect cozy rainy day. What are you doing? What are you wearing?",
      "Write 'I am enough just as I am' in your favorite color three times."
    ]
  }
];

const BlogPostInnerChildJournaling = () => {
  const [completedPrompts, setCompletedPrompts] = useState({});
  const [trackerProgress, setTrackerProgress] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load Prompts
    const savedPrompts = localStorage.getItem(STORAGE_KEY_PROMPTS);
    if (savedPrompts) {
      try {
        const parsed = JSON.parse(savedPrompts);
        if (Date.now() - parsed.timestamp < ONE_YEAR_MS) {
          setCompletedPrompts(parsed.data);
        }
      } catch (e) {
        console.error("Failed to parse saved prompts", e);
      }
    }

    // Load Tracker
    const savedTracker = localStorage.getItem(STORAGE_KEY_TRACKER);
    if (savedTracker) {
      try {
        const parsed = JSON.parse(savedTracker);
        if (Date.now() - parsed.timestamp < ONE_YEAR_MS) {
          setTrackerProgress(parsed.data);
        }
      } catch (e) {
        console.error("Failed to parse saved tracker", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify({
      data: completedPrompts,
      timestamp: Date.now()
    }));
  }, [completedPrompts, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_TRACKER, JSON.stringify({
      data: trackerProgress,
      timestamp: Date.now()
    }));
  }, [trackerProgress, mounted]);

  const togglePrompt = (categoryIndex, promptIndex) => {
    const key = `${categoryIndex}-${promptIndex}`;
    setCompletedPrompts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleTrackerDay = (day) => {
    setTrackerProgress(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to clear all your progress? This cannot be undone.")) {
      setCompletedPrompts({});
      setTrackerProgress({});
      toast({
        title: "Progress Reset",
        description: "Your journal has been wiped clean for a fresh start!",
      });
    }
  };

  const handleDownload = () => {
    window.open(PDF_URL, '_blank');
    toast({
      title: "Downloading Kit...",
      description: "Your Healing Journal Kit is on its way!",
    });
  };

  // Schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": pageTitle,
    "description": pageDescription,
    "image": ogImageUrl,
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "url": "https://littlespaceworld.com/about"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://littlespaceworld.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://littlespaceworld.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Inner Child Journaling Kit",
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <PageHelmet 
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        schema={[blogPostingSchema, breadcrumbSchema]}
        type="article"
        image={ogImageUrl}
        publishedTime={publishedDate}
        modifiedTime={publishedDate}
        author={author.name}
      />

      <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <header className="text-center mb-16 relative flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-sm mb-4 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              Interactive Tool
            </span>
            
            <div className="mb-6 flex flex-col items-center gap-2">
              <GlitchTitle as="h1" className="text-4xl md:text-6xl leading-tight">
                Inner Child
              </GlitchTitle>
              <GlitchTitle as="div" className="text-4xl md:text-6xl leading-tight text-pink-500">
                Journaling Kit
              </GlitchTitle>
            </div>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              60 prompts to help you heal, play, and reconnect. This page is your safe space—your progress is saved automatically on your device.
            </p>
          </motion.div>
        </header>

        {/* RULES SECTION */}
        <section className="mb-16">
          <motion.div 
            className="glass-card p-8 rounded-2xl border border-purple-500/30 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500" />
            
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="text-cyan-400" />
              The Rules of Journaling
            </h2>
            
            <ul className="space-y-4 text-gray-300 text-lg">
              <li className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                <span><strong>No Judgment:</strong> There is no "right" or "wrong" way to answer. Your feelings are valid.</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                <span><strong>Go at Your Own Pace:</strong> You don't have to do these in order or every day. Skip the ones that feel too heavy.</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                <span><strong>Get Creative:</strong> You can write, draw, doodle, or collage your answers.</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                <span><strong>Keep it Safe:</strong> This journal is for YOU. You don't have to share it with anyone.</span>
              </li>
            </ul>
          </motion.div>
        </section>

        {/* MONTHLY TRACKER SECTION */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-yellow-400" />
              Monthly Habit Tracker
            </h2>
            <span className="text-sm text-gray-400 font-mono">Click to mark complete</span>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10">
            <div className="grid grid-cols-7 gap-3 md:gap-4">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isDone = !!trackerProgress[day];
                return (
                  <motion.button
                    key={day}
                    onClick={() => toggleTrackerDay(day)}
                    className={`
                      relative aspect-square rounded-xl flex flex-col items-center justify-center
                      border-2 transition-all duration-300 group
                      ${isDone 
                        ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
                        : 'bg-black/20 border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`text-xs md:text-sm font-mono mb-1 ${isDone ? 'text-pink-200' : 'text-gray-500'}`}>
                      {day}
                    </span>
                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                      >
                        <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                      </motion.div>
                    ) : (
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white/10 group-hover:border-pink-400/30" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROMPTS LIST */}
        <div className="space-y-12">
          {categories.map((cat, catIndex) => (
            <section key={cat.id} className="scroll-mt-24">
              <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${cat.color} flex items-center gap-3`}>
                <Sparkles className="w-6 h-6" />
                {cat.title}
              </h3>
              
              <div className="grid gap-4">
                {cat.prompts.map((prompt, promptIndex) => {
                  const globalIndex = `${catIndex}-${promptIndex}`;
                  const isComplete = !!completedPrompts[globalIndex];
                  
                  return (
                    <motion.div
                      key={promptIndex}
                      onClick={() => togglePrompt(catIndex, promptIndex)}
                      className={`
                        cursor-pointer p-4 md:p-6 rounded-xl border-l-4 transition-all duration-300
                        flex items-start gap-4 group select-none
                        ${isComplete 
                          ? 'bg-black/40 border-l-gray-600 opacity-60' 
                          : `bg-white/5 hover:bg-white/10 border-l-${cat.color.split('-')[1]}-500 shadow-lg`}
                      `}
                      whileHover={{ x: 4 }}
                    >
                      <div className={`
                        mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                        ${isComplete ? 'border-green-500 bg-green-500/20' : 'border-gray-500 group-hover:border-white'}
                      `}>
                        {isComplete && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                      
                      <p className={`text-lg leading-relaxed transition-all ${isComplete ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                        {prompt}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* AUTHOR BIO SECTION */}
        <AuthorBio author={author} />

        {/* FOOTER ACTIONS */}
        <section className="mt-16 flex flex-col items-center gap-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-900/40 to-purple-900/40 border border-white/20 text-center max-w-2xl w-full backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">Want to keep this forever?</h3>
            <p className="text-gray-300 mb-8">
              Download the beautifully designed PDF version of this kit to print out, draw on, and keep in your physical journal.
            </p>
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-lg px-8 py-6 h-auto rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.7)] transition-all"
            >
              <Download className="mr-2 w-6 h-6" />
              Download PDF Kit
            </Button>
          </div>

          <button 
            onClick={resetProgress}
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All Progress
          </button>
        </section>

      </div>
    </>
  );
};

export default BlogPostInnerChildJournaling;