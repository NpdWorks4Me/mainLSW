"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Shield, CheckCircle, Clock, Heart, AlertCircle, Sparkles, Lock, Unlock, X } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

// Configuration constants
const TABLE_NAME = 'community_questions';

const QAPortal = ({ onClose, className, isEmbedded = false }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Generate or retrieve a mock submitter ID
  const getSubmitterId = () => {
    let id = localStorage.getItem('qa_submitter_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('qa_submitter_id', id);
    }
    return id;
  };

  const supabase = useSupabaseClient();
  useEffect(() => {
    fetchQuestions();

    // Real-time subscription
  const channel = supabase
      .channel('qa-portal-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setQuestions((prev) => [payload.new, ...prev]);
            if (isAdmin) {
               toast({ title: "New Question!", description: "Someone just asked a question." });
            }
          } else if (payload.eventType === 'UPDATE') {
            setQuestions((prev) => prev.map((q) => (q.id === payload.new.id ? payload.new : q)));
          }
        }
      )
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
    };
  }, [isAdmin, toast]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Could not load community questions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            question_text: newQuestion,
            submitter_id: getSubmitterId(),
            is_answered: false
          }
        ]);

      if (error) throw error;

      setNewQuestion('');
      toast({
        title: "Question Sent! 🌟",
        description: "Jeana will see it shortly!",
        className: "bg-indigo-500 text-white border-none"
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to send question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    const answerText = answerInputs[questionId];
    if (!answerText?.trim()) return;

    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          answer_text: answerText,
          is_answered: true
        })
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Answer Published!",
        description: "The community can now see this answer.",
        className: "bg-emerald-500 text-white border-none"
      });
      
      // Clear input
      setAnswerInputs(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish answer.",
        variant: "destructive"
      });
    }
  };

  const unansweredCount = questions.filter(q => !q.is_answered).length;
  const displayedQuestions = isAdmin 
    ? questions.sort((a, b) => (a.is_answered === b.is_answered ? 0 : a.is_answered ? 1 : -1)) // Unanswered first for admin
    : questions.filter(q => q.is_answered); // Only answered for public

  return (
    <div className={cn(
      "bg-gradient-to-b from-indigo-50 to-white font-sans text-slate-800 overflow-y-auto",
      isEmbedded ? "h-full rounded-xl shadow-inner" : "min-h-screen p-4 md:p-8",
      className
    )}>
      <div className={cn("mx-auto", isEmbedded ? "p-4" : "max-w-4xl")}>
        
        {/* Header Section */}
        <header className="flex justify-between items-start mb-10 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="uppercase tracking-wider text-xs font-bold">Community Q&A</span>
            </div>
            <h1 className={cn("font-extrabold text-slate-900", isEmbedded ? "text-2xl" : "text-3xl md:text-4xl")}>
              Ask Me Anything!
            </h1>
            <p className="text-slate-500 max-w-lg">
              A safe space to ask questions about regression, self-care, or just say hello. 
              I answer as many as I can! 💜
            </p>
          </div>

          <div className="flex gap-2">
            {/* Admin Toggle */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2 rounded-full transition-all duration-300 ${isAdmin ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-300 hover:text-slate-600'}`}
              title="Toggle Admin Mode"
            >
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>
            
            {/* Close Button (if embedded/modal) */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                title="Close Portal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Admin Alert Banner */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 shadow-sm overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                Admin Dashboard: You have <span className="font-bold text-amber-900">{unansweredCount}</span> unanswered questions waiting.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Submission Form (Public) */}
        {!isAdmin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 p-6 mb-12 border border-indigo-50 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-400" />
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              Ask a Question
            </h3>
            <form onSubmit={handleSubmitQuestion} className="relative">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="w-full min-h-[120px] p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Anonymous & Safe
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestion.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {isSubmitting ? 'Sending...' : 'Send Question'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Questions List - Only show if NOT embedded (page usually shows popular separately) or if Admin mode */}
        {(!isEmbedded || isAdmin) && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 pl-2 border-l-4 border-indigo-300">
              {isAdmin ? 'All Questions' : 'Recent Answers'}
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : displayedQuestions.length === 0 ? (
               <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  <p>No questions found yet. Be the first to ask!</p>
               </div>
            ) : (
              <AnimatePresence>
                {displayedQuestions.map((q) => (
                  <motion.div
                    key={q.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${!q.is_answered && isAdmin ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 hover:shadow-md'}`}
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                         <span className="bg-slate-100 px-2 py-1 rounded-md">Anonymous</span>
                         <span>•</span>
                         <span className="flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                         </span>
                      </div>
                      {!q.is_answered && isAdmin && (
                         <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">Unanswered</span>
                      )}
                    </div>

                    {/* Question Body */}
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 leading-relaxed">
                      {q.question_text}
                    </h4>

                    {/* Answer Section */}
                    {q.is_answered ? (
                      <div className="bg-indigo-50/50 rounded-xl p-5 mt-4 border border-indigo-100 relative">
                        <div className="absolute -top-3 left-4 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-current" />
                          Jeana's Answer
                        </div>
                        <p className="text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">
                          {q.answer_text}
                        </p>
                      </div>
                    ) : isAdmin ? (
                      /* Admin Answer Input */
                      <div className="mt-4 pt-4 border-t border-amber-200/50">
                        <label className="block text-xs font-bold text-amber-800 mb-2 uppercase">Write Answer:</label>
                        <textarea
                          value={answerInputs[q.id] || ''}
                          onChange={(e) => setAnswerInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full p-3 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm mb-3 min-h-[100px]"
                          placeholder="Write a nurturing response..."
                        />
                        <button
                          onClick={() => handleSubmitAnswer(q.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-emerald-200"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Submit Answer & Publish
                        </button>
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QAPortal;