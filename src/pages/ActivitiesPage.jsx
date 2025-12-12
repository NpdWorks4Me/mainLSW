import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Palette, Download, FileText, Loader2, AlertCircle, 
  RefreshCcw, Sparkles, Heart, Printer,
  Search, Filter, Coffee, Image as ImageIcon, 
  ExternalLink, Menu, X, Home, ShoppingCart, 
  BookOpen, Bot, HeartHandshake, 
  MessageCircle as MessageCircleQuestion, 
  User, Key, UserPlus, ChevronDown, Shield, 
  BrainCircuit, Sofa, Feather, HelpCircle, Info, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import PageHelmet from '@/components/PageHelmet';

// --- Internal Component: SafeImage ---
const SafeImage = ({ src, alt, className, onClick }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
  }, [src]);

  if (status === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-900 text-gray-500 ${className}`}>
        <ImageIcon className="w-12 h-12 opacity-20 mb-2" />
        <span className="text-xs uppercase tracking-widest opacity-40">Preview Unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-pink-500/50 animate-spin" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-all duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClick}
      />
    </div>
  );
};

// --- Main Component ---
const ActivitiesPage = () => {
  // State Management
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  
  // Sticky Search State
  const [isStickySearchExpanded, setIsStickySearchExpanded] = useState(false);
  const stickySearchInputRef = useRef(null);
  
  const { toast } = useToast();
  const sentinelRef = useRef(null);
  const mainNavSentinelRef = useRef(null);

  // Scroll Progress for Shooting Star (Re-implemented here for the sticky header)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const starLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Menu Data
  const menuItems = useMemo(() => [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Store', href: '/store', icon: ShoppingCart },
    {
      name: 'Blog',
      href: '/blog',
      icon: BookOpen,
      children: [
        { name: 'All Posts', href: '/blog', icon: BookOpen, featured: true },
        { name: 'Age vs. Pet Regression', href: '/blog/age-regression-vs-pet-regression-whats-the-difference', icon: BrainCircuit },
        { name: 'Surviving Young Adulthood', href: '/blog/5-steps-to-surviving-young-adulthood', icon: BrainCircuit },
        { name: 'What is Littlespace?', href: '/blog/what-is-littlespace-a-simple-guide-for-new-age-regressors', icon: Info },
        { name: 'Create Your Littlespace', href: '/blog/create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves', icon: Sofa },
        { name: 'Bedtime Rituals', href: '/blog/5-littlespace-bedtime-rituals-for-the-best-sleep', icon: Shield },
      ],
    },
    {
      name: 'Activities',
      href: '/coloring-pages',
      icon: Bot,
      children: [
        { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
        { name: 'Story Time', href: '/storytime', icon: Feather },
        { name: 'Coloring Pages', href: '/coloring-pages', icon: Palette },
      ],
    },
    { name: 'Self-Help', href: '/self-help', icon: HeartHandshake },
    { name: 'Q & As', href: '/community-qa', icon: MessageCircleQuestion },
    {
      name: 'Account',
      href: '#',
      icon: User,
      children: [
        { name: 'My Profile', href: '/profile', icon: User },
        { name: 'Login', href: '/login', icon: Key },
        { name: 'Sign Up', href: '/signup', icon: UserPlus },
        { name: 'Forgot Password', href: '/forgot-password', icon: Key },
      ],
    },
  ], []);

  // Mobile-only main nav hide logic
  useEffect(() => {
    if (window.innerWidth > 768) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldHide = !entry.isIntersecting;
        document.documentElement.classList.toggle('hide-main-nav', shouldHide);
        document.body.style.paddingTop = shouldHide ? '48px' : '';
      }, 
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );
    
    if (mainNavSentinelRef.current) observer.observe(mainNavSentinelRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Scroll Observer for Sticky Header
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting (it's above viewport), we are sticky
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: [0, 1], rootMargin: "-1px 0px 0px 0px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle opening sticky search
  const handleStickySearchOpen = () => {
    setIsStickySearchExpanded(true);
    // Slight delay to ensure DOM update before focus
    setTimeout(() => {
      stickySearchInputRef.current?.focus();
    }, 100);
  };

  // Handle closing sticky search
  const handleStickySearchClose = () => {
    setIsStickySearchExpanded(false);
  };

  // --- Metadata Generation Logic ---
  const enrichFileMetadata = useCallback((file, publicUrl) => {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const rawTitle = nameWithoutExt.replace(/[-_]/g, " ");
    const lowerName = rawTitle.toLowerCase();
    
    let category = "General";
    let tags = ["coloring", "printable"];
    let description = "A high-quality printable coloring page designed for relaxation.";
    let difficulty = "Medium";

    if (lowerName.match(/(space|star|moon|planet|alien|galaxy|cosmos|astronaut|rocket)/)) {
      category = "Space & Sci-Fi";
      tags.push("space", "stars", "cosmic");
      description = "Blast off with this cosmic coloring sheet featuring celestial themes.";
    } else if (lowerName.match(/(animal|cat|dog|bear|bunny|pet|dino|fox|wolf|panda)/)) {
      category = "Cute Animals";
      tags.push("animals", "cute", "nature");
      description = "An adorable animal friend waiting for your colors to bring it to life.";
    } else if (lowerName.match(/(mandala|pattern|geometric|zen|floral)/)) {
      category = "Mandalas";
      tags.push("mandala", "mindfulness", "complex");
      difficulty = "Hard";
      description = "Intricate patterns designed to help you center your mind and focus.";
    } else if (lowerName.match(/(fantasy|dragon|fairy|magic|castle|unicorn|mermaid)/)) {
      category = "Fantasy";
      tags.push("fantasy", "magic", "mythical");
      description = "Escape to a magical realm with this enchanting fantasy scene.";
    } else if (lowerName.match(/(simple|easy|kid|basic|chibi)/)) {
      difficulty = "Easy";
      tags.push("simple", "quick");
      description = "A simple, bold design perfect for relaxation without eye strain.";
    }

    const displayName = rawTitle.replace(/\b\w/g, l => l.toUpperCase()); // Title Case

    return {
      id: file.id || file.name,
      fileName: file.name,
      displayName,
      publicUrl,
      description,
      category,
      tags,
      difficulty,
      size: (file.metadata?.size / 1024).toFixed(1) + ' KB',
      isPdf: file.metadata?.mimetype === 'application/pdf' || file.name.endsWith('.pdf'),
      altText: `Free printable ${category} coloring page for adults and littles – ${displayName}`
    };
  }, []);

  // --- Supabase Fetching Logic ---
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: listData, error: listError } = await supabase
        .storage
        .from('Coloring Pages')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) throw listError;

      if (!listData || listData.length === 0) {
        setFiles([]);
        return;
      }

      const processedFiles = listData
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
           const { data: urlData } = supabase.storage
            .from('Coloring Pages')
            .getPublicUrl(file.name);
           return enrichFileMetadata(file, urlData.publicUrl);
        });

      setFiles(processedFiles);
    } catch (err) {
      console.error('Supabase Fetch Error:', err);
      setError("Failed to load coloring pages. Please check your connection.");
      toast({
        variant: "destructive",
        title: "Error Loading Pages",
        description: "We couldn't fetch the coloring pages from the vault.",
      });
    } finally {
      setLoading(false);
    }
  }, [enrichFileMetadata, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // --- Filtering Logic ---
  const categories = useMemo(() => {
    return ["All", ...new Set(files.map(f => f.category))].sort();
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = 
        file.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        file.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === "All" || file.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [files, searchQuery, activeCategory]);

  // --- Download Logic ---
  const handleDownload = async (file) => {
    toast({
      title: "Preparing Download...",
      description: "Fetching your artwork from the stars.",
    });

    try {
      const { data, error } = await supabase.storage
        .from('Coloring Pages')
        .download(file.fileName);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Complete! 🎨",
        description: "Happy coloring!",
        className: "bg-green-600 text-white border-none",
      });
    } catch (err) {
      console.error('Download failed:', err);
      window.open(file.publicUrl, '_blank');
      toast({
        title: "Opened in New Tab",
        description: "Direct download failed, so we opened it for you.",
        variant: "default",
      });
    }
  };

  const pageTitle = "Free Coloring Pages for Adults & Littles – Printable, Downloadable, No Sign-Up";
  const pageDescription = "100% free, high-quality, ad-free coloring pages for adults and littles (age-regressors & littlespace). Instant download & print – no registration or email required.";

  return (
    <div className="min-h-screen bg-[#0a0a14] pb-24 font-sans text-gray-100">
      <div ref={mainNavSentinelRef} className="absolute top-0 left-0 w-full h-1 pointer-events-none z-50" />

      <PageHelmet 
        title={pageTitle}
        description={pageDescription}
        keywords="coloring pages, free printables, adult coloring, age regression, little space, art therapy, free coloring pages for adults and littles, printable coloring pages littlespace, age regression coloring pages, agere printables, free coloring pages no sign up"
      />

      <Helmet>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": pageTitle,
            "description": pageDescription,
            "keywords": "free coloring pages for adults and littles, printable coloring pages littlespace, age regression coloring pages, agere printables, free coloring pages no sign up",
            "isAccessibleForFree": true,
            "audience": {
              "@type": "Audience",
              "audienceType": ["Adults", "Age Regressors", "Littles", "Coloring Enthusiasts"]
            },
            "provider": {
              "@type": "Organization",
              "name": "Little Space World"
            }
          })}
        </script>
      </Helmet>

      {/* Fake background layer to cover original nav bar when sticky is active */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 h-24 bg-[#0a0a14] z-[40]" />
      )}

      {/* Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-[#0a0a14] border-r border-white/10 z-[101] overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                
                {/* Filters in Menu for Mobile/Sticky Context */}
                <div className="mb-8 pb-8 border-b border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setIsMobileMenuOpen(false);
                            // Scroll to top of grid smoothly
                            document.getElementById('main-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            activeCategory === cat 
                            ? 'bg-pink-600 border-pink-500 text-white' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                  </div>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.name} className="space-y-1">
                      {item.children ? (
                        <div className="space-y-1">
                          <button 
                            onClick={() => setActiveSubMenu(activeSubMenu === item.name ? null : item.name)}
                            className="w-full flex items-center justify-between p-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeSubMenu === item.name ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {activeSubMenu === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4"
                              >
                                {item.children.map((child) => (
                                  <Link 
                                    key={child.name}
                                    to={child.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 text-sm text-gray-400 hover:text-pink-400 transition-colors"
                                  >
                                    <child.icon className="w-4 h-4" />
                                    {child.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-[#0a0a14] -z-10" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Palette className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold tracking-wider text-pink-100 uppercase">Creative Therapy</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            Free Printable Coloring Pages for Adults, Littles & Inner-Child Healing
          </h1>
          
          <div className="space-y-4 max-w-2xl mx-auto">
             <h2 className="text-pink-400 font-bold text-sm tracking-widest uppercase">
               100 % free · ad-free · no sign-up required
             </h2>
             
             <p className="text-lg text-gray-300 leading-relaxed">
               Discover a safe haven for stress relief, mindfulness, and trauma recovery. 
               Whether you're exploring <strong>age regression (agere)</strong>, <strong>littlespace</strong>, or simply 
               need a moment of <strong>inner-child nurturing</strong>, our collection is here for you.
             </p>
             
             <p className="text-gray-400 text-base">
               Featuring: cute animals, dreamy space scenes, intricate mandalas, fantasy worlds, and seasonal specials.
             </p>
             
             <p className="text-indigo-300 font-medium pt-2">
               Scroll down and start coloring your calm today
             </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 py-1.5 px-4">
              <Printer className="w-3 h-3 mr-2 text-cyan-400" />
              Print Friendly
            </Badge>
            <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2 text-yellow-400" />
              High Resolution
            </Badge>
            <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 py-1.5 px-4">
              <Download className="w-3 h-3 mr-2 text-green-400" />
              Instant Access
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Sticky Filter Bar Sentinel — THIS TRIGGERS THE STICKY HEADER */}
      <div ref={sentinelRef} className="w-full h-px" />

      {/* STATIC Search Section (Scrolls Away) */}
      <div className="max-w-7xl mx-auto mb-12 pt-4 pb-4 px-4 md:px-6">
        <div className="bg-[#131320]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs..."
                className="pl-10 bg-black/20 border-white/10 focus:border-pink-500/50 text-white h-11"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                    ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20' 
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM STICKY HEADER (Replaces nav when scrolled) */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-0 z-[60] h-12 bg-[#0a0a14] border-b border-white/10 shadow-2xl"
          >
             {/* Progress Bar Overlay (Highest Z-Index within Header) */}
             <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-visible pointer-events-none z-[55]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-transparent via-pink-500 to-yellow-300 origin-left"
                  style={{ scaleX }}
                />
                <motion.div
                   className="absolute top-1/2 -translate-y-1/2 -ml-2"
                   style={{ left: starLeft }}
                >
                   <Star className="w-3 h-3 text-yellow-200 fill-yellow-200 animate-spin-slow drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                </motion.div>
             </div>

             {/* Content Container */}
             <div className="w-full h-full flex items-center justify-between px-4 z-[51]">
              {/* Left: Hamburger Menu */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0 text-white hover:bg-white/10 rounded-full h-9 w-9"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Main menu"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Right: Expandable Search */}
              <div className={`flex items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isStickySearchExpanded ? 'flex-1 ml-3' : 'w-auto'}`}>
                
                {/* The Expanded Input Container */}
                <div 
                  className={`
                    relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${isStickySearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}
                  `}
                >
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-pink-500" />
                    </div>
                    <input
                      ref={stickySearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={handleStickySearchClose}
                      onKeyDown={(e) => e.key === 'Enter' && handleStickySearchClose()}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-full py-1.5 pl-9 pr-8 text-sm focus:outline-none focus:border-pink-500/70 focus:ring-1 focus:ring-pink-500/50 transition-colors"
                      placeholder="Search..."
                    />
                    <button 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white cursor-pointer"
                      onMouseDown={(e) => {
                         // Prevent blur from firing immediately when clicking X
                         e.preventDefault();
                         setSearchQuery('');
                         handleStickySearchClose();
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                </div>

                {/* The Collapsed Search Icon Trigger */}
                {!isStickySearchExpanded && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full h-9 w-9"
                    onClick={handleStickySearchOpen}
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                )}
              </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div id="main-grid" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
            <p className="text-gray-400 animate-pulse">Fetching your canvas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-3xl max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-200 mb-2">Connection Error</h3>
            <p className="text-red-300/70 mb-6 px-8">{error}</p>
            <Button onClick={fetchFiles} variant="outline" className="border-red-500/30 text-red-200 hover:bg-red-500/20">
              <RefreshCcw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-32">
             <div className="inline-flex p-6 rounded-full bg-white/5 mb-4">
                <Filter className="w-8 h-8 text-gray-500" />
             </div>
             <p className="text-xl text-gray-300 font-medium">No pages match your search.</p>
             <Button 
               variant="link" 
               className="text-pink-400 mt-2"
               onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
             >
               Clear all filters
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredFiles.map((file, idx) => (
                <motion.div
                  layout
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="group relative bg-[#181825] rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-900/20 transition-all duration-300"
                >
                  {/* Image Area */}
                  <div className="aspect-[3/4] bg-gray-900 relative overflow-hidden cursor-pointer" onClick={() => handleDownload(file)}>
                    {file.isPdf ? (
                       <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-500">
                          <FileText className="w-16 h-16 text-pink-300/50 mb-3" />
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">PDF Document</span>
                       </div>
                    ) : (
                       <SafeImage 
                          src={file.publicUrl} 
                          alt={file.altText}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6">
                       <Button 
                         className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                         onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                       >
                         <Download className="w-4 h-4 mr-2" /> Download
                       </Button>
                       <p className="mt-4 text-xs text-gray-300 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                         {file.size} • {file.difficulty}
                       </p>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`
                        backdrop-blur-md shadow-sm border-none text-white font-bold
                        ${file.difficulty === 'Easy' ? 'bg-green-500/90' : 
                          file.difficulty === 'Hard' ? 'bg-purple-500/90' : 'bg-blue-500/90'}
                      `}>
                        {file.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-[#181825]">
                    <h3 className="text-base font-bold text-white mb-1 truncate" title={file.displayName}>
                      {file.displayName}
                    </h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded uppercase tracking-wider">
                         {file.category}
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleDownload(file)}
                          className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-pink-400 transition-colors"
                          title="Quick Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => window.open(file.publicUrl, '_blank')}
                           className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-colors"
                           title="View Fullscreen"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* SEO / Content Section */}
      <section className="border-t border-white/10 bg-[#0f0f1a]">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-pink-400 mb-2">
              <Heart className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-widest">Self Care</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Why Coloring?</h2>
            <div className="prose prose-invert text-gray-400">
              <p>
                Coloring isn't just for kids. It's a powerful tool for <strong>mindfulness</strong> and <strong>stress relief</strong>. 
                By focusing on patterns and colors, you can quiet the noisy chatter of everyday life and enter a state of flow.
              </p>
              <p className="mt-4">
                For our <strong>Age Regression (Agere)</strong> community, these pages provide a safe, gentle activity to help connect with your inner child. 
                Choose a simple design for regression, or a complex mandala for deep focus.
              </p>
            </div>
          </div>

          <div className="bg-[#151522] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <Coffee className="w-5 h-5 text-orange-400" />
               Tips for a Cozy Session
             </h3>
             <ul className="space-y-4">
               {[
                 "Create a dedicated 'coloring nook' with soft lighting.",
                 "Use crayons for texture or markers for vibrancy.",
                 "Put on a lo-fi or Disney piano playlist.",
                 "Remember: There are no mistakes, only happy accidents."
               ].map((tip, i) => (
                 <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                   <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-pink-400 shrink-0 mt-0.5">
                     {i + 1}
                   </span>
                   {tip}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesPage;