import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Gamepad2, ArrowRight, Image as ImageIcon, Palette } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';

const LazyImage = lazy(() => import('@/components/LazyImage'));

const ExplorePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const topics = [{
    title: "Blog",
    description: "Educational articles and guides to help you understand littlespace, age regression, and personal growth. Perfect for beginners and those seeking deeper insights into this wonderful world.",
    icon: BookOpen,
    href: "/blog",
    imageSrc: "https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/29f26cce71d33fe2b48b2a66dd78f98c.webp",
    imageAlt: "Person relaxing on a bed, browsing educational content about littlespace on a smartphone.",
    color: "from-blue-400 to-purple-500"
  }, {
    title: "Gallery",
    description: "A collection of fun, inspiring, and random images to brighten your day! Discover wholesome memes, room inspiration, cute animals, and more. Our gallery is a visual treat designed to make you smile.",
    icon: ImageIcon,
    href: "/gallery",
    imageSrc: "https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b04395ac06dafe4006d9c1f87b412b1a.webp",
    imageAlt: "A cute, fluffy cat laughing, representing the fun and lighthearted images in the gallery.",
    color: "from-pink-400 to-rose-500"
  }, {
    title: "Coloring Pages",
    description: "Download printable coloring pages, worksheets, and word puzzles designed to bring joy, relaxation, and learning to your littlespace experience. These activities are perfect for a cozy day in.",
    icon: Palette,
    href: "/coloring-pages",
    imageSrc: "https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/9597da3eebbbac8e96d9b55c2bb68b60.webp",
    imageAlt: "A hand holding a pencil, carefully solving a maze puzzle, representing engaging activities.",
    color: "from-green-400 to-teal-500"
  }, {
    title: "Games",
    description: "Play fun and simple games designed to help you relax and unwind. From classic puzzles to cute challenges, there's something for everyone to enjoy. Take a break and have some fun!",
    icon: Gamepad2,
    href: "/games",
    imageSrc: "https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/c6753346961f0fbffcc51f8c1e72f534.webp",
    imageAlt: "A cute character holding a video game controller, ready to play.",
    color: "from-yellow-400 to-orange-500"
  }];

  const preloadLazyImage = () => {
    import('@/components/LazyImage');
  };

  return <div className="py-10 px-6 sm:px-8 md:px-12">
      <PageHelmet
        title="Explore Our World - Blog, Gallery & More"
        description="Explore our world of age regression resources. Discover our blog for littlespace guides, a gallery of fun images, activities like coloring pages, and self-help tools for personal growth."
        canonical="/explore"
      />
      <motion.div className="max-w-6xl mx-auto text-center mb-12" initial={{
      opacity: 0,
      y: -30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.7
    }}>
        <h1>Explore</h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
          Discover everything Little Space World has to offer! From educational content to fun activities and self-help resources, 
          we're here to support your journey of self-discovery and growth.
        </p>
      </motion.div>

      <motion.div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" variants={staggerContainer} initial="initial" animate="animate">
        {topics.map((topic, index) => (
          <motion.div 
            key={index} 
            variants={fadeInUp} 
            className="glass-card p-6 overflow-hidden flex flex-col group" 
            whileHover={{ y: -5 }}
            onMouseEnter={preloadLazyImage}
          >
            <Link to={topic.href} className="w-full mb-6 block interactive-star-effect">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg">
                <Suspense fallback={<div className="w-full h-full bg-slate-200/20 animate-pulse rounded-lg" />}>
                  <LazyImage className="w-full h-full object-cover clickable-image" alt={topic.imageAlt} src={topic.imageSrc} eager={index < 2} />
                </Suspense>
              </div>
            </Link>
            
            <div className="w-full text-center flex flex-col flex-grow">
              <div className="flex items-center justify-center mb-4">
                <motion.div className={`w-14 h-14 bg-gradient-to-r ${topic.color} rounded-2xl flex items-center justify-center mr-4 transition-all duration-300`} whileHover={{ scale: 1.1 }}>
                  <topic.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  <Link to={topic.href} className="hover:text-pink-300 transition-colors interactive-star-effect">{topic.title}</Link>
                </h2>
              </div>
              
              <p className="text-base text-foreground/80 leading-relaxed mb-6 flex-grow">
                {topic.description}
              </p>
              
              <motion.div className="mt-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild>
                  <Link to={topic.href}>
                    Explore {topic.title}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="mt-16 text-center" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.5
    }}>
        <div className="glass-card p-8 max-w-3xl mx-auto">
          <div className="title-overlay mb-6">
            <h2 className="text-[22px] md:text-[26px] font-semibold mb-4">What's Next?</h2>
          </div>
          <p className="text-lg text-foreground/80 mb-6">
            Every journey starts with a single step. Choose what interests you most and begin exploring 
            the wonderful world of littlespace at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button asChild size="lg">
                <Link to="/blog">
                  Start with Our Blog
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button asChild size="lg" variant="outline" className="border-2 border-purple-300 text-purple-300 hover:bg-purple-500/20 hover:text-white">
                <Link to="/coloring-pages">
                  Try Some Activities
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>;
};
export default ExplorePage;