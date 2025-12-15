import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import { ImageLightboxProvider } from '@/components/ImageLightboxProvider';
import PageHelmet from '@/components/PageHelmet';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { CartProvider } from '@/hooks/useCart';
import AuthModal from '@/components/auth/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/carousel.css';
import { ProductLightboxProvider } from '@/contexts/ProductLightboxContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import GlobalStarfield from '@/components/GlobalStarfield';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';
import CustomCursor from '@/components/CustomCursor';

// Home page: load lazily but expose a .preload() so we can fetch the chunk
// early (on idle) to reduce initial bundle size while keeping stability.
import lazyWithPreload from '@/utils/lazyWithPreload';
const HomePage = lazyWithPreload(() => import('@/pages/HomePage'));
const BlogListPage = lazy(() => import('@/pages/BlogListPage'));

// Pillar Hub Pages
const LittlespacePillar = lazy(() => import('@/pages/pillars/LittlespacePillar'));
const InnerChildPillar = lazy(() => import('@/pages/pillars/InnerChildPillar'));
const MentalHealthPillar = lazy(() => import('@/pages/pillars/MentalHealthPillar'));
const YoungAdultPillar = lazy(() => import('@/pages/pillars/YoungAdultPillar'));
const CreatePillar = lazy(() => import('@/pages/pillars/CreatePillar'));
const AdvocacyPillar = lazy(() => import('@/pages/pillars/AdvocacyPillar'));
const ResourcesPillar = lazy(() => import('@/pages/pillars/ResourcesPillar'));

// Blog Posts (Reorganized)
const BlogPostWhatIsLittleSpace = lazy(() => import('@/pages/BlogPostWhatIsLittleSpace'));
const BlogPostCreateYourLittlespace = lazy(() => import('@/pages/BlogPostCreateYourLittlespace'));
const BlogPostMyLittleSecrets = lazy(() => import('@/pages/BlogPostMyLittleSecrets'));
const BlogPostAmIAnAgeRegressor = lazy(() => import('@/pages/BlogPostAmIAnAgeRegressor'));
const BlogPostBedtimeRituals = lazy(() => import('@/pages/BlogPostBedtimeRituals'));
const BlogPostSurvivingYoungAdulthood = lazy(() => import('@/pages/BlogPostSurvivingYoungAdulthood'));
const BlogPostTherapeuticAgeRegression = lazy(() => import('@/pages/BlogPostTherapeuticAgeRegression'));
const BlogPostAgeVsPetRegression = lazy(() => import('@/pages/BlogPostAgeVsPetRegression'));
const BlogPostInnerChildJournaling = lazy(() => import('@/pages/BlogPostInnerChildJournaling'));
const BlogPostAgeRegression = lazy(() => import('@/pages/BlogPostAgeRegression'));

const ActivitiesPage = lazy(() => import('@/pages/ActivitiesPage'));
const GamesPage = lazy(() => import('@/pages/GamesPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const CookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ConfirmationPage = lazy(() => import('@/pages/ConfirmationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const StorePage = lazy(() => import('@/pages/StorePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));
const StoriesPage = lazy(() => import('@/pages/StoriesPage'));
const StorytimePage = lazy(() => import('@/pages/StorytimePage'));
const StorytimeDetailPage = lazy(() => import('@/pages/StorytimeDetailPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const QuizzesPage = lazy(() => import('@/pages/QuizzesPage'));
const SuperYouQuizPage = lazy(() => import('@/pages/SuperYouQuizPage'));
const ComfortFunctionsQuizPage = lazy(() => import('@/pages/ComfortFunctionsQuizPage'));
const SelfHelpPage = lazy(() => import('@/pages/SelfHelpPage'));
const SafetyPage = lazy(() => import('@/pages/SafetyPage'));
const GuidanceAndSupportPage = lazy(() => import('@/pages/GuidanceAndSupportPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AdvicePage = lazy(() => import('@/pages/AdvicePage'));
const QAPage = lazy(() => import('@/pages/QAPage'));
// Admin UI has been removed from this repository — route disabled to avoid importing admin-only bundles.
const SnakeGamePage = lazy(() => import('@/pages/SnakeGamePage'));
const WordSearchGamePage = lazy(() => import('@/pages/WordSearchGamePage'));
const TicTacToeGamePage = lazy(() => import('@/pages/TicTacToeGamePage'));
const ColorSequenceGamePage = lazy(() => import('@/pages/ColorSequenceGamePage'));
const MemoryGamePage = lazy(() => import('@/pages/MemoryGamePage'));
const NeonMinesweeperGamePage = lazy(() => import('@/pages/NeonMinesweeperGamePage'));
const ColorMatchGamePage = lazy(() => import('@/pages/ColorMatchGamePage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));

const RouteWrapper = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div 
      key={location.pathname} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
    >
      <ErrorBoundary>
        <Suspense fallback={
          <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a14] text-purple-300">
             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="animate-pulse">Loading Stardust...</p>
          </div>
        }>
          {children}
        </Suspense>
      </ErrorBoundary>
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  React.useEffect(() => {
    // Debug: log current location to ensure router is matching paths
    try { console.log('APP location:', location.pathname); } catch (e) {}
  }, [location.pathname]);

  return (
  <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AuthModalProvider>
            <ProgressProvider>
              <CartProvider>
                <ProductLightboxProvider>
                  <ImageLightboxProvider>
                    <CookieConsentProvider>
                      <ScrollToTop />
                      <CustomCursor />
                      <GlobalStarfield />
                      <div className="app-container min-h-screen bg-[#0a0a1f] text-white selection:bg-pink-500 selection:text-white">
                        <Layout>
                          <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                              <Route path="/" element={<RouteWrapper><HomePage /></RouteWrapper>} />
                              <Route path="explore" element={<RouteWrapper><ExplorePage /></RouteWrapper>} />
                              
                              {/* Blog Hub */}
                              <Route path="/blog" element={<RouteWrapper><LittlespacePillar /></RouteWrapper>} />
                              <Route path="/blog/*" element={<RouteWrapper><LittlespacePillar /></RouteWrapper>} />

                              {/* New Pillar Routes & Reorganized Posts */}
                              
                              {/* Littlespace Pillar */}
                              <Route path="littlespace" element={<RouteWrapper><LittlespacePillar /></RouteWrapper>} />
                              <Route path="littlespace/what-is-littlespace-a-simple-guide-for-new-age-regressors" element={<RouteWrapper><BlogPostWhatIsLittleSpace /></RouteWrapper>} />
                              <Route path="littlespace/my-little-secrets-because-adulting-is-literally-not-it" element={<RouteWrapper><BlogPostMyLittleSecrets /></RouteWrapper>} />
                              <Route path="littlespace/am-i-really-an-age-regressor" element={<RouteWrapper><BlogPostAmIAnAgeRegressor /></RouteWrapper>} />
                              <Route path="littlespace/5-littlespace-bedtime-rituals-for-the-best-sleep" element={<RouteWrapper><BlogPostBedtimeRituals /></RouteWrapper>} />
                              <Route path="littlespace/age-regression-vs-pet-regression-whats-the-difference" element={<RouteWrapper><BlogPostAgeVsPetRegression /></RouteWrapper>} />
                              <Route path="littlespace/age-regression-friends" element={<RouteWrapper><BlogPostAgeRegression /></RouteWrapper>} />

                              {/* Inner Child Pillar */}
                              <Route path="inner-child" element={<RouteWrapper><InnerChildPillar /></RouteWrapper>} />
                              <Route path="inner-child/inner-child-journaling-prompt-kit" element={<RouteWrapper><BlogPostInnerChildJournaling /></RouteWrapper>} />

                              {/* Mental Health Pillar */}
                              <Route path="mental-health" element={<RouteWrapper><MentalHealthPillar /></RouteWrapper>} />
                              <Route path="mental-health/therapeutic-age-regression-honest-coping-skill" element={<RouteWrapper><BlogPostTherapeuticAgeRegression /></RouteWrapper>} />

                              {/* Young Adult Pillar */}
                              <Route path="young-adult" element={<RouteWrapper><YoungAdultPillar /></RouteWrapper>} />
                              <Route path="young-adult/5-steps-to-surviving-young-adulthood" element={<RouteWrapper><BlogPostSurvivingYoungAdulthood /></RouteWrapper>} />

                              {/* Create Pillar */}
                              <Route path="create" element={<RouteWrapper><CreatePillar /></RouteWrapper>} />
                              <Route path="create/create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves" element={<RouteWrapper><BlogPostCreateYourLittlespace /></RouteWrapper>} />

                              {/* New Hubs (No posts assigned yet, but pages exist) */}
                              <Route path="advocacy" element={<RouteWrapper><AdvocacyPillar /></RouteWrapper>} />
                              <Route path="resources" element={<RouteWrapper><ResourcesPillar /></RouteWrapper>} />

                              {/* Other Routes */}
                              <Route path="coloring-pages" element={<RouteWrapper><ActivitiesPage /></RouteWrapper>} />
                              {/* Games */}
                              <Route path="games" element={<RouteWrapper><GamesPage /></RouteWrapper>} />
                              <Route path="games/wordsearch" element={<RouteWrapper><WordSearchGamePage /></RouteWrapper>} />
                              <Route path="games/tictactoe" element={<RouteWrapper><TicTacToeGamePage /></RouteWrapper>} />
                              <Route path="games/colorsequence" element={<RouteWrapper><ColorSequenceGamePage /></RouteWrapper>} />
                              <Route path="games/memory" element={<RouteWrapper><MemoryGamePage /></RouteWrapper>} />
                              <Route path="games/neonminesweeper" element={<RouteWrapper><NeonMinesweeperGamePage /></RouteWrapper>} />
                              <Route path="games/colormatch" element={<RouteWrapper><ColorMatchGamePage /></RouteWrapper>} />
                              <Route path="games/snake" element={<RouteWrapper><SnakeGamePage /></RouteWrapper>} />
                              {/* Gallery & Public User Profiles */}
                              <Route path="gallery" element={<RouteWrapper><GalleryPage /></RouteWrapper>} />
                              <Route path="user/:nickname" element={<RouteWrapper><UserProfilePage /></RouteWrapper>} />
                              <Route path="guidance-and-support" element={<RouteWrapper><GuidanceAndSupportPage /></RouteWrapper>} />
                              <Route path="about" element={<RouteWrapper><AboutPage /></RouteWrapper>} />
                              <Route path="privacy" element={<RouteWrapper><PrivacyPage /></RouteWrapper>} />
                              <Route path="terms" element={<RouteWrapper><TermsPage /></RouteWrapper>} />
                              <Route path="cookie-policy" element={<RouteWrapper><CookiePolicyPage /></RouteWrapper>} />
                              <Route path="contact" element={<RouteWrapper><ContactPage /></RouteWrapper>} />
                              <Route path="confirmation" element={<RouteWrapper><ConfirmationPage /></RouteWrapper>} />
                              <Route path="/auth/confirm" element={<RouteWrapper><ConfirmationPage /></RouteWrapper>} />
                              <Route path="profile" element={<ProtectedRoute><RouteWrapper><ProfilePage /></RouteWrapper></ProtectedRoute>} />
                              <Route path="/store" element={<RouteWrapper><StorePage /></RouteWrapper>} />
                              <Route path="product/:id" element={<RouteWrapper><ProductDetailPage /></RouteWrapper>} />
                              <Route path="success" element={<RouteWrapper><SuccessPage /></RouteWrapper>} />
                              <Route path="stories" element={<RouteWrapper><StoriesPage /></RouteWrapper>} />
                              <Route path="storytime" element={<RouteWrapper><StorytimePage /></RouteWrapper>} />
                              <Route path="storytime/:id" element={<RouteWrapper><StorytimeDetailPage /></RouteWrapper>} />
                              <Route path="login" element={<RouteWrapper><LoginPage /></RouteWrapper>} />
                              <Route path="signup" element={<RouteWrapper><SignUpPage /></RouteWrapper>} />
                              <Route path="forgot-password" element={<RouteWrapper><ForgotPasswordPage /></RouteWrapper>} />
                              <Route path="reset-password" element={<RouteWrapper><ResetPasswordPage /></RouteWrapper>} />
                              <Route path="quizzes" element={<RouteWrapper><QuizzesPage /></RouteWrapper>} />
                              <Route path="quizzes/super-you" element={<RouteWrapper><SuperYouQuizPage /></RouteWrapper>} />
                              <Route path="quizzes/comfort-functions" element={<RouteWrapper><ComfortFunctionsQuizPage /></RouteWrapper>} />
                              <Route path="self-help" element={<RouteWrapper><SelfHelpPage /></RouteWrapper>} />
                              <Route path="safety" element={<RouteWrapper><SafetyPage /></RouteWrapper>} />
                              <Route path="advice" element={<RouteWrapper><AdvicePage /></RouteWrapper>} />
                              <Route path="community-qa" element={<RouteWrapper><QAPage /></RouteWrapper>} />
                              <Route path="*" element={
                                <RouteWrapper>
                                  <PageHelmet title="Page Not Found" />
                                  <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a14] text-gray-100">
                                        <h1 className="text-6xl font-bold text-pink-500">404</h1>
                                      <p className="mt-4 text-xl text-gray-300">Uh oh! Page Not Found! 🦄</p>
                                  </div>
                                </RouteWrapper>
                              } />
                            </Routes>
                          </AnimatePresence>
                        </Layout>
                        <CookieConsentBanner />
                      </div>
                    </CookieConsentProvider>
                  </ImageLightboxProvider>
                </ProductLightboxProvider>
              </CartProvider>
            </ProgressProvider>
          </AuthModalProvider>
        </AuthProvider>
      </ErrorBoundary>
  </HelmetProvider>
  );
}

export default App;
