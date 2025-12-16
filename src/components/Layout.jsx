import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Home, Bot, BookOpen, Info, Sofa, Shield, HelpCircle,
  Feather, Palette, ShoppingCart, User, Key, UserPlus, ChevronDown,
  Menu as MenuIcon, X as XIcon, BrainCircuit, Sparkles, Star, 
  MessageCircle as MessageCircleQuestion, HeartHandshake, ArrowLeft
} from 'lucide-react';
import DesktopFooter from '@/components/DesktopFooter';
import StarryBackground from '@/components/StarryBackground';
import ShoppingCartView from '@/components/ShoppingCart';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';

const LOGO_URL = "https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/logo.webp";

const NavItem = ({ item, closeMenu, activeSubMenu, setActiveSubMenu }) => {
  const isSubMenuOpen = activeSubMenu === item.name;

  const handleToggle = (e) => {
    if (item.children) {
      e.preventDefault();
      setActiveSubMenu(isSubMenuOpen ? null : item.name);
    }
  };

  const handleLinkClick = () => {
    if (!item.children) {
      closeMenu();
    }
  };

  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="menu-item">
      <NavLink
        to={item.href}
        className={({ isActive }) => `menu-link ${isActive && !hasChildren ? 'active' : ''}`}
        onClick={hasChildren ? handleToggle : handleLinkClick}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span>{item.name}</span>
        {hasChildren && <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-300 ${isSubMenuOpen ? 'rotate-180' : ''}`} />}
      </NavLink>
      <AnimatePresence>
        {hasChildren && isSubMenuOpen && (
          <motion.ol
            className="sub-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {item.children.map(child => (
              <li key={child.name} className="sub-menu-item" onClick={closeMenu}>
                <NavLink to={child.href} className={`sub-menu-link ${child.featured ? 'featured-menu-item' : ''}`}>
                  <child.icon className="w-4 h-4 mr-3" />
                  {child.name}
                  {child.featured && <Sparkles className="w-3 h-3 ml-2 text-yellow-400" />}
                </NavLink>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </li>
  );
};

const MobileMenu = ({ menuItems, isMenuOpen, closeMenu }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${isMenuOpen ? 'z-40 pointer-events-auto' : 'z-10 pointer-events-none'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
          <motion.div
            className={`fixed top-0 left-0 h-full w-72 ${isMenuOpen ? 'z-50 pointer-events-auto' : 'z-20 pointer-events-none'}`}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-glass-card h-full p-4 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <Link to="/" onClick={closeMenu}>
                  <img src={LOGO_URL} alt="Logo" className="h-12" />
                </Link>
                <button onClick={closeMenu} className="p-2 text-white">
                  <XIcon size={28} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto">
                <ol>
                  {menuItems.map(item => (
                    <NavItem
                      key={item.name}
                      item={item}
                      closeMenu={closeMenu}
                      activeSubMenu={activeSubMenu}
                      setActiveSubMenu={setActiveSubMenu}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const starLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    {
      name: 'Store',
      href: '/store',
      icon: ShoppingCart,
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: BookOpen,
      children: [
        { name: 'All Posts', href: '/blog', icon: BookOpen, featured: true },
        { name: 'Inner Child Journaling Kit', href: '/inner-child/inner-child-journaling-prompt-kit', icon: Sparkles },
        { name: 'Age vs. Pet Regression', href: '/littlespace/age-regression-vs-pet-regression-whats-the-difference', icon: BrainCircuit },
        { name: 'Surviving Young Adulthood', href: '/young-adult/5-steps-to-surviving-young-adulthood', icon: BrainCircuit },
        { name: 'What is Littlespace?', href: '/littlespace/what-is-littlespace-a-simple-guide-for-new-age-regressors', icon: Info },
        { name: 'Create Your Littlespace', href: '/create/create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves', icon: Sofa },
        { name: 'Bedtime Rituals', href: '/littlespace/5-littlespace-bedtime-rituals-for-the-best-sleep', icon: Shield },
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
    {
      name: 'Self-Help',
      href: '/self-help',
      icon: HeartHandshake,
    },
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
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const isHomePage = location.pathname === '/';

  return (
    <div ref={scrollRef} className="h-screen w-screen overflow-x-hidden overflow-y-auto font-inter text-foreground transition-colors duration-300 bg-transparent relative">
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <StarryBackground />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 py-0`}>
        <nav 
          className={`
            relative flex items-center justify-between max-w-7xl mx-auto transition-all duration-500
            h-20 glass-card border-white/10
          `}
        >
           <div 
             className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-opacity duration-500 opacity-100`} 
           />
           
           <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-visible pointer-events-none">
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


          <div className="flex-1 flex justify-start pl-4">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-white hover:text-pink-300 transition-colors" aria-label="Toggle menu">
              <MenuIcon size={28} />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex-shrink-0" aria-label="Go to homepage">
              <motion.img
                src={LOGO_URL}
                alt="Little Space World Logo"
                className="w-auto origin-center"
                initial={false}
                animate={{ height: "6rem" }} // Always maintain initial height
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{
                  scale: 1.05,
                  filter: 'drop-shadow(0 0 10px hsl(var(--primary)))'
                }}
                width="119" height="64" loading="eager" />
            </Link>
          </div>

          <div className="flex-1 flex justify-end pr-4">
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-white hover:text-cyan-300 transition-colors relative" aria-label="Open shopping cart">
              <ShoppingCart size={28} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-bounce-slow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu menuItems={menuItems} isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
      <ShoppingCartView isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />

      <main className={`flex-grow pt-20`}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} className="w-full">
            {!isHomePage && (
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-8 relative z-20 pointer-events-none">
                <div className="pointer-events-auto inline-block">
                    <BackButton />
                </div>
              </div>
            )}
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {!isHomePage && <DesktopFooter />}
    </div>
  );
};

export default Layout;