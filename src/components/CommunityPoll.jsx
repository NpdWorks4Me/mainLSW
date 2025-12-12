"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import confetti from 'canvas-confetti';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { v4 as uuidv4 } from 'uuid';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const POLL_ID = 1;

const getAnonymousVoterId = () => {
  let voterId = localStorage.getItem('anonymousVoterId');
  if (!voterId) {
    voterId = uuidv4();
    localStorage.setItem('anonymousVoterId', voterId);
  }
  return voterId;
};

const CommunityPoll = () => {
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { toast } = useToast();
  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [anonymousVoted, setAnonymousVoted] = useState(false);

  const spaceColors = [
    'rgba(138, 43, 226, 0.7)', // BlueViolet
    'rgba(75, 0, 130, 0.7)',   // Indigo
    'rgba(0, 0, 139, 0.7)',    // DarkBlue
    'rgba(25, 25, 112, 0.7)',  // MidnightBlue
  ];

  const spaceBorderColors = [
    'rgba(138, 43, 226, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(0, 0, 139, 1)',
    'rgba(25, 25, 112, 1)',
  ];

  const processVotes = useCallback((pollVotes, currentPoll) => {
    const voteCounts = {};
    if (currentPoll && currentPoll.options) {
      currentPoll.options.forEach(option => {
        voteCounts[option] = 0;
      });
    }

    pollVotes.forEach(vote => {
      if (voteCounts[vote.option] !== undefined) {
        voteCounts[vote.option]++;
      }
    });

    return voteCounts;
  }, []);

  const supabase = useSupabaseClient();
  useEffect(() => {
    // Check if anonymous user has already voted
    const anonVote = localStorage.getItem(`voted_poll_${POLL_ID}`);
    if (anonVote) {
      setUserVote(anonVote);
      setAnonymousVoted(true);
    }
  
    const fetchPollData = async () => {
      setLoading(true);
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*, poll_votes(*)')
        .eq('id', POLL_ID)
        .single();

      if (pollError) {
        console.error('Error fetching poll:', pollError);
        toast({ title: "Error", description: "Could not load the poll.", variant: "destructive" });
        setLoading(false);
        return;
      }

      setPoll(pollData);
      const initialVotes = processVotes(pollData.poll_votes, pollData);
      setVotes(initialVotes);

      if (user) {
        const userVoteRecord = pollData.poll_votes.find(v => v.user_id === user.id);
        if(userVoteRecord) {
          setUserVote(userVoteRecord.option);
          setShowResults(true);
        }
      }
      setLoading(false);
    };

    fetchPollData();

    const channel = supabase
      .channel('poll_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes', filter: `poll_id=eq.${POLL_ID}` }, (payload) => {
        setVotes(currentVotes => {
          const newVotes = { ...currentVotes };
          const option = payload.new.option;
          if (newVotes[option] !== undefined) {
            newVotes[option]++;
          }
          return newVotes;
        });
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
    };
  }, [user, processVotes, toast]);
  
  const handleVote = async (option) => {
    if (userVote || submitting) return;

    setSubmitting(true);
    
    let insertData = {
        poll_id: POLL_ID,
        option: option,
    };

    if (user) {
        insertData.user_id = user.id;
    } else {
        insertData.anonymous_voter_id = getAnonymousVoterId();
    }

    const { error } = await supabase.from('poll_votes').insert(insertData);

    if (error) {
      if (error.code === '23505') { // unique_violation
        toast({ title: "Already voted!", description: "You've already cast your vote in this poll.", variant: "destructive" });
        // Since we check localStorage for anonymous, this is likely for a logged-in user
        if(user) {
            const { data: existingVote } = await supabase.from('poll_votes').select('option').eq('poll_id', POLL_ID).eq('user_id', user.id).single();
            if(existingVote) setUserVote(existingVote.option);
        }
      } else {
        toast({ title: "Error", description: "Something went wrong with your vote. Please try again.", variant: "destructive" });
      }
    } else {
      setUserVote(option);
      if(!user) {
        localStorage.setItem(`voted_poll_${POLL_ID}`, option);
        setAnonymousVoted(true);
      } else {
        setShowResults(true);
      }
      
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#0ea5e9', '#ffffff']
      });
      toast({ title: "Vote cast!", description: "Thank you for participating!", variant: "success" });
    }
    setSubmitting(false);
  };
  
  const handleShowResults = () => {
    if (!user) {
      toast({
        title: "Login to see results!",
        description: "Viewing poll results is a special perk for our community members.",
      });
      if (openModal) openModal();
    } else {
      setShowResults(true);
    }
  };

  const totalVotes = Object.values(votes).reduce((acc, count) => acc + count, 0);

  const chartData = {
    labels: Object.keys(votes),
    datasets: [{
      label: 'Votes',
      data: Object.values(votes),
      backgroundColor: spaceColors,
      borderColor: spaceBorderColors,
      borderWidth: 1,
    }],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e5e7eb', font: { family: "'Inter', sans-serif", size: 14 } }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
      }
    },
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 my-8 flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!poll) {
    return null;
  }
  
  const hasVoted = !!userVote;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-12 w-full max-w-2xl mx-auto relative poll-glow-container"
    >
      <div className="poll-container-modern">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-100 font-inter tracking-tight">{poll.question}</h2>

        {!hasVoted && (
          <div className="text-center text-lg mb-4 text-sky-300 animate-pulse">Cast Your Vote!</div>
        )}

        <AnimatePresence mode="wait">
          {showResults || (hasVoted && user) ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              className="results-view"
            >
              <div className="space-y-3">
                {Object.entries(votes).sort(([,a],[,b]) => b-a).map(([option, count]) => {
                  const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                  return (
                    <div key={option} className="relative w-full bg-black/20 rounded-full h-12 overflow-hidden text-sm flex items-center px-4 border border-white/10">
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full origin-left"
                        style={{ background: userVote === option ? 'linear-gradient(to right, #4f46e5, #7c3aed)' : 'linear-gradient(to right, #0ea5e9, #3b82f6)' }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: percentage / 100 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <span className="relative z-10 font-semibold text-white">{option}</span>
                      <span className="relative z-10 ml-auto font-bold text-white">{percentage.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="h-64 md:h-80 mt-8"><Pie data={chartData} options={chartOptions} /></div>
              <p className="text-center mt-4 text-gray-400 font-semibold">Total Votes: {totalVotes}</p>
            </motion.div>
          ) : hasVoted && !user ? (
             <motion.div
              key="voted-anon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              className="text-center p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Thank you for voting!</h3>
              <p className="text-lg text-gray-300 mb-6">Want to see what others think? Log in or sign up to view the results!</p>
              <Button onClick={handleShowResults} className="bg-sky-500 hover:bg-sky-400 text-white">
                Login to View Results
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {poll.options.map(option => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 15 }}
                  className="poll-option-button"
                  onClick={() => handleVote(option)}
                  disabled={submitting}
                >
                  <span className="font-semibold text-white text-center">{option}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!hasVoted && (
            <div className="text-center mt-6">
                <Button onClick={handleShowResults} variant="ghost" className="text-sky-300 hover:bg-white/10 hover:text-white">View Results</Button>
            </div>
        )}

      </div>
    </motion.section>
  );
};

export default CommunityPoll;