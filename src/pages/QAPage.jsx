import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PageHelmet from '@/components/PageHelmet';
import { Sparkles, Send } from 'lucide-react';

const QAPage = () => {
  const [question, setQuestion] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: "Oops!",
        description: "Your question can't be empty, silly!",
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      description: "Your question has been received (not really, but imagine it was!).",
    });
    setQuestion('');
  };

  return (
    <>
      <PageHelmet
        title="Community Q&A | Little & Big"
        description="Ask questions and get advice from the Little & Big community."
        canonical="/community-qa"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-2xl mx-auto glass-card p-6 md:p-10 rounded-2xl border border-white/20 shadow-xl relative">
          <Sparkles className="absolute top-4 left-4 w-6 h-6 text-pink-300 animate-pulse" />
          <Sparkles className="absolute bottom-4 right-4 w-8 h-8 text-blue-300 animate-pulse delay-200" />
          
          <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-md mb-6">
            Ask the Community
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-prose mx-auto">
            Got a burning question? Need some advice or just want to share a thought? Our friendly community is here to help!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              className="w-full p-4 rounded-lg bg-white/10 border border-purple-500/50 text-white placeholder:text-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              placeholder="What's on your mind, friend?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={5}
            />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full max-w-xs mx-auto py-3 text-lg font-bold glow-on-hover flex items-center justify-center"
            >
              <Send className="mr-2 h-5 w-5" /> Submit Question
            </Button>
          </form>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="mt-10 flex items-center justify-center gap-4 text-purple-200 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            <p className="tracking-wide">Spread kindness, always!</p>
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default QAPage;