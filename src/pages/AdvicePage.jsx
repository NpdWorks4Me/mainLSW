import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, ChevronLeft, ChevronRight, MessageCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PageHelmet from '@/components/PageHelmet';

const AdvicePage = () => {
  const [activeCategory, setActiveCategory] = useState('self-help');
  const [currentSlides, setCurrentSlides] = useState({
    'self-help': 0,
    'navigating-relationships': 0,
  });
  const { toast } = useToast();

  const categories = [
    {
      id: 'self-help',
      title: 'Self-Help',
      icon: Lightbulb,
      description: 'Tools and insights for personal growth and emotional well-being.',
      topics: [
        { title: 'Mindfulness Practices', description: 'Techniques for staying present and calm.', alt: 'Person meditating peacefully in a serene natural setting', src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDYxOTh8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMHByYWN0aWNlc3xlbnwwfHx8fDE3MTgzMTIwMDd8MA&ixlib=rb-4.0.3&q=80&w=1080' },
        { title: 'Stress Management', description: 'Coping strategies for dealing with stress.', alt: 'Visual representation of stress melting away', src: 'https://images.unsplash.com/photo-1584931423298-c576fda548c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDYxOTh8MHwxfHxzdHJlc3MlMjBtYW5hZ2VtZW50fGVufDB8fHx8MTcxODMxMjAwN3ww&ixlib=rb-4.0.3&q=80&w=1080' },
        { title: 'Building Self-Esteem', description: 'Tips for improving self-worth and confidence.', alt: 'Person looking confidently into a mirror', src: 'https://images.unsplash.com/photo-1552699640-8a1e1b8feda' },
        { title: 'Emotional Regulation', description: 'Understanding and managing your feelings.', alt: 'A calm sea at sunset, representing emotional balance', src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDYxOTh8MHwxfHxlbW90aW9uYWwlMjByZWd1bGF0aW9ufGVufDB8fHx8MTcxODMxMjAwOHww&ixlib=rb-4.0.3&q=80&w=1080' },
      ]
    },
    {
      id: 'navigating-relationships',
      title: 'Navigating Relationships',
      icon: Users,
      description: 'Guidance on building healthy connections with others.',
      topics: [
        { title: 'Communication Skills', description: 'How to express yourself and listen effectively.', alt: 'Two people engaged in a deep, understanding conversation', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDYxOTh8MHwxfHNlYXJjaHwxfHxjb21tdW5pY2F0aW9uJTIwc2tpbGxzfGVufDB8fHx8MTcxODMxMjAwOHww&ixlib=rb-4.0.3&q=80&w=1080' },
        { title: 'Setting Boundaries', description: 'Protecting your energy and well-being.', alt: 'A serene landscape with a clear fence, symbolizing healthy boundaries', src: 'https://images.unsplash.com/photo-1586996395493-e15d46265437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDYxOTh8MHwxfHxzZXR0aW5nJTIwYm91bmRhcmllc3xlbnwwfHx8fDE3MTgzMTIwMDh8MA&ixlib=rb-4.0.3&q=80&w=1080' },
        { title: 'Conflict Resolution', description: 'Navigating disagreements constructively.', alt: 'Two hands shaking, symbolizing agreement and resolution', src: 'https://images.unsplash.com/photo-1541844053534-5d81a739d74c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDYxOTh8MHwxfHxjb25mbGljdCUyMHJlc29sdXRpb258ZW58MHx8fHwxNzE4MzEyMDA4fDA&ixlib=rb-4.0.3&q=80&w=1080' },
      ]
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const nextSlide = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setCurrentSlides(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] + 1) % category.topics.length
    }));
  };

  const prevSlide = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setCurrentSlides(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === 0 ? category.topics.length - 1 : prev[categoryId] - 1
    }));
  };

  const activeTab = categories.find(cat => cat.id === activeCategory);

  const handleAskQuestion = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "We're working on a way for you to ask questions. Stay tuned!",
    });
  };

  return (
    <>
      <PageHelmet
        title="Advice & Guidance"
        description="Get supportive advice for navigating relationships, work, and personal growth while exploring your littlespace journey!"
        canonical="/advice"
      />
      <div className="px-6 py-16">
        <motion.div
          className="max-w-6xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight font-['Nunito_Sans'] mb-4">
            Advice & Guidance
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Support for your journey in relationships, personal growth, and more.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'gradient-bg text-white shadow-lg'
                    : 'border-purple-300 text-purple-200 hover:bg-purple-500/20'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.title}</span>
              </Button>
            ))}
          </motion.div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3 font-['Nunito_Sans']">
                {activeTab.title}
              </h2>
              <p className="text-lg text-foreground/80">
                {activeTab.description}
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => prevSlide(activeCategory)}
                  variant="outline"
                  size="icon"
                  className="absolute left-0 sm:-left-4 z-10 bg-white/10 backdrop-blur-sm border-purple-300 text-purple-200 hover:bg-purple-500/20 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="w-full max-w-2xl mx-auto">
                  <motion.div
                    key={`${activeCategory}-${currentSlides[activeCategory]}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <img
                      className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                      alt={activeTab.topics[currentSlides[activeCategory]].alt}
                      src={activeTab.topics[currentSlides[activeCategory]].src} />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
                      <h3 className="font-bold mb-1">{activeTab.topics[currentSlides[activeCategory]].title}</h3>
                      <p className="text-sm text-white/90">{activeTab.topics[currentSlides[activeCategory]].description}</p>
                    </div>
                  </motion.div>
                </div>

                <Button
                  onClick={() => nextSlide(activeCategory)}
                  variant="outline"
                  size="icon"
                  className="absolute right-0 sm:-right-4 z-10 bg-white/10 backdrop-blur-sm border-purple-300 text-purple-200 hover:bg-purple-500/20 rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {activeTab.topics.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlides(prev => ({ ...prev, [activeCategory]: index }))}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlides[activeCategory]
                        ? 'bg-pink-400 scale-125'
                        : 'bg-purple-300/50 hover:bg-purple-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button onClick={handleAskQuestion} className="gradient-bg text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask a Question
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdvicePage;