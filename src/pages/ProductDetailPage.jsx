import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, Loader2, AlertCircle, Maximize, Star, Truck, Share2, Zap, Mail, ArrowRight, ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { FaFacebook, FaTwitter, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/useCart';
import PageHelmet from '@/components/PageHelmet';
import * as EcommerceApi from '@/api/EcommerceApi';
import { useImageLightbox } from '@/components/ImageLightboxProvider';
import LazyImage from '@/components/LazyImage';
import confetti from 'canvas-confetti';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from '@/components/BackButton';
import '@/styles/product-page.css';

// Utility to strip HTML for meta descriptions
const stripHtml = html => {
  if (typeof document === 'undefined') return '';
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// SEO Content Generator based on product keywords
const getEnhancedSEOContent = title => {
  const t = title.toLowerCase();
  const content = {
    benefits: [],
    useCases: [],
    keywords: []
  };

  // Default content
  content.benefits = [
    "Promotes relaxation and stress relief through sensory engagement.",
    "Provides a safe, comforting outlet for inner child expression.",
    "Handcrafted with love and attention to sensory details."
  ];
  content.useCases = [
    "During quiet time or meditation to ground yourself.",
    "As a comforting companion during stressful situations.",
    "Part of your bedtime ritual for better sleep hygiene."
  ];
  content.keywords = ["age regression gear", "little space shop", "comfort items", "sensory toys for adults"];

  // 1. Shell Picky Pad Specifics (No beads references)
  if (t.includes('shell') && t.includes('picky')) {
     content.benefits = [
        "Satisfies the urge to pick or peel with natural, organic textures.",
        "Features smooth, satisfying surfaces for unique tactile exploration.",
        "Helps channel anxious energy into a calming, repetitive activity.",
        "A gentle, non-destructive alternative to skin picking behaviors."
     ];
     content.useCases = [
        "A discreet desk companion for office or school stress.",
        "Perfect for grounding during high-anxiety moments.",
        "Use while watching TV to keep hands busy and mind calm."
     ];
     content.keywords.push("dermatillomania fidget", "shell fidget toy", "textured sensory toy", "anxiety relief picking");
     return content; 
  }

  // 2. General Picky Pads (Stones, Pebbles, etc.)
  if (t.includes('picky pad') || t.includes('stone') || t.includes('pebble')) {
    content.benefits = [
      "Satisfies the urge to pick or peel in a healthy, non-destructive way.",
      "Provides rich tactile feedback with various textures (stones, silicone, accents).",
      "Helps reduce anxiety and focus the mind during moments of overwhelm.",
      "Durable alternative to skin picking (dermatillomania) behaviors."
    ];
    content.useCases = [
      "Keep on your desk for stress relief during work or study.",
      "Use during travel to manage transit anxiety.",
      "A perfect 'fidget' for watching movies or reading."
    ];
    content.keywords.push("skin picking alternative", "dermatillomania toy", "tactile sensory toy", "anxiety fidget");
    return content;
  }

  // 3. 3D Kandi Cuffs (Rave/Kandi specific)
  if (t.includes('kandi') || t.includes('cuff') && !t.includes('pacifier')) {
    content.benefits = [
      "Express your unique style with bold, maximalist 3D designs.",
      "Immerses you in rave culture with authentic, handcrafted kandi aesthetic.",
      "Provides satisfying tactile stimulation through chunky, textured beads.",
      "Durable, stretchy construction fits comfortably for all-day wear."
    ];
    content.useCases = [
      "The ultimate accessory for your next rave, festival, or concert outfit.",
      "Trading with friends to create lasting PLUR memories.",
      "Wear as a statement piece to express your vibrant personality daily."
    ];
    content.keywords.push("kandi cuff", "rave jewelry", "3d kandi", "festival accessories", "plur culture", "maximalist jewelry");
    return content;
  }

  // 4. Pacifiers (Adult/Deco)
  if (t.includes('pacifier') && !t.includes('clip')) {
     content.benefits = [
       "Oral fixation relief that instantly soothes the nervous system.",
       "High-quality, adult-sized teat designed for proper comfort and safety.",
       "Signals safety and regression to the brain, aiding in rapid relaxation.",
       "Customizable designs allow for personal expression within little space."
     ];
     content.useCases = [
       "Use during bedtime to fall asleep faster and feel secure.",
       "During regression sessions to enhance immersion.",
       "When feeling overwhelmed to quickly self-soothe."
     ];
     content.keywords.push("adult pacifier", "agere pacifier", "deco paci", "adult baby gear", "abdl pacifier");
     return content;
  }

  // 5. Pacifier Clips
  if (t.includes('clip')) {
      content.benefits = [
        "Dual-function accessory: securely holds your paci while acting as a stimulating fidget toy.",
        "Features textured beads designed for rolling, spinning, and tactile exploration.",
        "Sturdy clip attaches easily to clothing, ensuring your comfort items stay clean and close.",
        "Provides discreet sensory input to help ground you during stressful moments."
      ];
      content.useCases = [
        "Clip to your collar or sleeve for an accessible, wearable fidget.",
        "Attach to your adult pacifier to keep it safe and within reach.",
        "Use the beaded chain for silent stimming during movies or quiet time."
      ];
      content.keywords.push("pacifier clip", "fidget jewelry", "sensory bead clip", "adult sensory accessory", "agere clip");
      return content;
  }

  // 6. Mystery Boxes & Bundles
  if (t.includes('mystery') || t.includes('box') || t.includes('bundle') || t.includes('starter pack')) {
    content.benefits = [
      "The ultimate surprise to spark joy and excitement.",
      "Curated selection of items that work perfectly together.",
      "Great value compared to purchasing items individually.",
      "Removes the decision fatigue of choosing individual items."
    ];
    content.useCases = [
        "A perfect gift for yourself or a little friend.",
        "Starting your collection with a matched set.",
        "Unboxing experience that triggers happy brain chemicals."
    ];
    content.keywords.push("little space mystery box", "agere surprise bundle", "regression starter pack", "gift box");
    return content;
  }

  // 7. Keychains / Shakers / Fidgets (General)
  if (t.includes('keychain') || t.includes('fidget') || t.includes('shaker')) {
    content.benefits = [
      "Portable comfort you can take anywhere discreetly.",
      "Engaging visual and tactile stimulation to ground you.",
      "Durable construction designed for everyday use on bags or keys.",
      "Provides a subtle sensory outlet in public spaces."
    ];
    content.useCases = [
        "Attach to your backpack or purse for on-the-go comfort.",
        "Use as a silent fidget during meetings or classes.",
        "Clip to your belt loop for immediate grounding access."
    ];
    content.keywords.push("discreet fidget", "sensory keychain", "adult stim toy", "shaker charm");
    return content;
  }

  // 8. Plushies / Soft Toys
  if (t.includes('plush') || t.includes('stuffie') || t.includes('bear') || t.includes('bunny')) {
      content.benefits = [
          "Ultra-soft textures provide immediate tactile comfort.",
          "Perfect size for hugging, providing deep pressure therapy.",
          "A friendly face that offers unconditional companionship.",
          "High-quality materials that stand up to lots of love."
      ];
      content.useCases = [
          "The ultimate cuddle buddy for sleeping or napping.",
          "A listener for your secrets and worries.",
          "Comfort object for movie nights or reading sessions."
      ];
      content.keywords.push("stuffed animal", "plushie", "comfort object", "cuddle buddy");
      return content;
  }

  return content;
};

const RelatedProductCard = ({
  product
}) => {
  const navigate = useNavigate();
  const displayVariant = product.variants?.[0];
  if (!displayVariant) return null;
  const price = EcommerceApi.formatCurrency(displayVariant.price_in_cents, displayVariant.currency_info);
  return <div onClick={() => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  }} className="group cursor-pointer flex flex-col gap-2 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
      <div className="aspect-square rounded-lg overflow-hidden relative">
        <LazyImage src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h4 className="font-bold text-sm text-white/90 line-clamp-2 group-hover:text-cyan-400 transition-colors">{product.title}</h4>
      <p className="text-fuchsia-400 font-bold text-sm mt-auto">{price}</p>
    </div>;
};

const ProductDetailPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    addToCart
  } = useCart();
  const {
    openLightbox
  } = useImageLightbox();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [api, setApi] = useState();
  const [stockLevel, setStockLevel] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await EcommerceApi.getProduct(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
            const initialVariant = fetchedProduct.variants[0];
            setSelectedVariant(initialVariant);
            setStockLevel(initialVariant.inventory_quantity);
          }

          // Fetch Related Products
          const allProducts = await EcommerceApi.getProducts({
            limit: 4
          });
          // Filter out current product and grab first 4
          const related = allProducts.products.filter(p => p.id !== fetchedProduct.id).slice(0, 4);
          setRelatedProducts(related);
        } else {
          setError("This treasure seems to be lost in another dimension!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("This treasure seems to be lost in another dimension!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Sticky Bar Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Stock on Variant Change
  useEffect(() => {
    if (selectedVariant) {
      setStockLevel(selectedVariant.inventory_quantity);
    }
  }, [selectedVariant]);

  // Images Logic
  const allImages = useMemo(() => {
    if (!product) return [];
    return product.images && product.images.length > 0 ? product.images.sort((a, b) => a.order - b.order) : product.image_url ? [{
      url: product.image_url,
      order: 1
    }] : [];
  }, [product]);

  // Scroll Carousel to Variant Image
  useEffect(() => {
    if (product?.variants && selectedVariant && api) {
      const variantImageIndex = allImages.findIndex(img => img.url === selectedVariant.image_url);
      if (variantImageIndex !== -1) {
        api.scrollTo(variantImageIndex);
      }
    }
  }, [selectedVariant, product, api, allImages]);
  const handleAddToCart = async () => {
    if (product && selectedVariant) {
      try {
        await addToCart(product, selectedVariant, quantity);
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} x ${product.title} added.`
        });
        confetti({
          particleCount: 40,
          spread: 60,
          origin: {
            y: 0.7
          },
          colors: ['#A855F7', '#06B6D4', '#FFFFFF', '#F0ABFC'],
          shapes: ['square', 'star'],
          scalar: 1.2
        });
      } catch (error) {
        toast({
          title: "Oops!",
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  };
  const handleImageClick = index => {
    if (allImages.length > 0) {
      const lightboxImages = allImages.map(img => ({
        src: img.url,
        alt: product.title,
        title: product.title
      }));
      openLightbox(lightboxImages, index);
    }
  };

  // Price Logic
  const saleInfo = useMemo(() => {
    if (!selectedVariant || !selectedVariant.sale_price_in_cents || !selectedVariant.price_in_cents) return null;
    const salePrice = selectedVariant.sale_price_in_cents;
    const originalPrice = selectedVariant.price_in_cents;
    const percentage = Math.round((originalPrice - salePrice) / originalPrice * 100);
    return {
      displayPrice: EcommerceApi.formatCurrency(salePrice, selectedVariant.currency_info),
      originalPrice: EcommerceApi.formatCurrency(originalPrice, selectedVariant.currency_info),
      percentage
    };
  }, [selectedVariant]);
  const defaultPrice = useMemo(() => {
    if (saleInfo || !selectedVariant) return null;
    return EcommerceApi.formatCurrency(selectedVariant.price_in_cents, selectedVariant.currency_info);
  }, [selectedVariant, saleInfo]);

  // SEO Data Generation
  const seoData = useMemo(() => {
    if (!product) return null;
    const enhanced = getEnhancedSEOContent(product.title);
    const plainDesc = stripHtml(product.description);
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": allImages.map(img => img.url),
      "description": plainDesc.substring(0, 300) + (plainDesc.length > 300 ? '...' : ''),
      "sku": selectedVariant?.sku || product.id,
      "brand": {
        "@type": "Brand",
        "name": "Little Space World"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": selectedVariant?.currency || 'USD',
        "price": selectedVariant?.price_in_cents / 100 || 0,
        "availability": stockLevel && stockLevel > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };
    return {
      enhanced,
      schema,
      plainDesc
    };
  }, [product, selectedVariant, allImages, stockLevel]);
  if (loading) return <div className="flex justify-center items-center h-screen bg-[#0f172a]"><Loader2 className="w-12 h-12 animate-spin text-cyan-400" /></div>;
  if (error) return <div className="text-center py-20 px-6 bg-[#0f172a] min-h-screen flex flex-col items-center justify-center"><AlertCircle className="w-16 h-16 text-pink-500 mx-auto mb-6 animate-bounce" /><h1 className="text-4xl font-bold text-white mb-4">Oh no! 404</h1><p className="text-xl text-purple-200 mt-2 max-w-lg">{error}</p><Button onClick={() => navigate('/store')} variant="secondary" className="mt-8"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Store</Button></div>;
  if (!product) return null;
  return <div className="min-h-screen bg-[#0a0a14] text-white font-sans selection:bg-pink-500 selection:text-white pb-24 md:pb-0">
      <PageHelmet title={`${product.title} | Little Space World Shop`} description={seoData?.plainDesc.substring(0, 160)} canonical={`/product/${id}`} keywords={seoData?.enhanced.keywords.join(', ')} />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(seoData?.schema)}
        </script>
      </Helmet>
      
      <div className="max-w-[1400px] mx-auto pt-6 md:pt-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
           <Link to="/" className="hover:text-white">Home</Link>
           <span>/</span>
           <Link to="/store" className="hover:text-white">Store</Link>
           <span>/</span>
           <span className="text-cyan-400 truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Main Content Layout - Adjusted for Even Distribution (50/50 Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          
          {/* LEFT COLUMN: Images - Constrained Width for "Medium" size on desktop */}
          <div className="w-full max-w-lg mx-auto lg:max-w-[480px] relative">
            <div className="lg:sticky lg:top-28 space-y-4">
               <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.5
            }} className="relative w-full rounded-2xl overflow-hidden border border-purple-500/30 bg-black/20 carousel-inner-glow shadow-2xl">
                  <Carousel setApi={setApi} className="w-full" opts={{
                loop: true
              }}>
                    <CarouselContent>
                      {allImages.map((image, index) => <CarouselItem key={index} className="basis-full">
                          <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/3] w-full flex items-center justify-center p-4 bg-gradient-to-b from-white/5 to-transparent">
                             <LazyImage src={image.url} alt={`${product.title} - View ${index + 1} - Age Regression Gear`} className="w-full h-full object-contain drop-shadow-2xl z-10" />
                             <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-20 h-10 w-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10 shadow-sm transition-all duration-200" onClick={() => handleImageClick(index)}>
                                <Maximize className="w-5 h-5 opacity-90" />
                             </Button>
                          </div>
                        </CarouselItem>)}
                    </CarouselContent>
                    {/* Carousel navigation arrows removed as requested */}
                  </Carousel>
               </motion.div>

               {/* Thumbnails */}
               {allImages.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2 snap-x px-1 custom-scrollbar">
                    {allImages.map((image, index) => <button key={index} onClick={() => api?.scrollTo(index)} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-all focus:outline-none focus:border-purple-500 bg-white/5">
                        <LazyImage src={image.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                      </button>)}
                 </div>}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info */}
          <div className="flex flex-col space-y-8 pt-2 lg:pt-0">
             
             <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-4">
               <div className="flex gap-2">
                 <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/30">
                    Little Space Essentials
                 </span>
               </div>

               <h1 className="text-4xl md:text-5xl font-black leading-tight neon-title-outline">
                 {product.title}
                 {product.title.toLowerCase().includes('basic starter pack') && (
                    <span className="block text-2xl md:text-3xl text-pink-400 mt-2 font-bold italic tracking-wide" style={{ textShadow: 'none' }}>
                      for littlespace
                    </span>
                 )}
               </h1>

               <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-300">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <span className="ml-2 text-gray-400">(5.0)</span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <span className="text-purple-300 font-medium">Handmade with love</span>
               </div>

               <div className="flex items-baseline gap-4 mt-2">
                 {saleInfo ? <>
                     <span className="text-4xl md:text-5xl font-bold text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                       {saleInfo.displayPrice}
                     </span>
                     <span className="text-xl text-gray-500 line-through">
                       {saleInfo.originalPrice}
                     </span>
                     <span className="text-xs font-bold text-black bg-green-400 px-2 py-1 rounded">
                       SAVE {saleInfo.percentage}%
                     </span>
                   </> : <span className="text-4xl md:text-5xl font-bold text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                     {defaultPrice}
                   </span>}
               </div>
             </motion.div>

             <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

             <div className="space-y-8">
                {product.variants.length > 1 && <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Select Style</label>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map(variant => <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border ${selectedVariant?.id === variant.id ? 'border-cyan-400 bg-cyan-950/50 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'border-white/10 bg-white/5 text-gray-400 hover:border-purple-400 hover:text-white'}`}>
                          {variant.title}
                        </button>)}
                    </div>
                  </div>}

                <div className="flex flex-col sm:flex-row gap-4">
                   <div className="flex items-center bg-white/5 border border-white/20 rounded-xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                   </div>

                   <Button onClick={handleAddToCart} disabled={!selectedVariant || stockLevel !== null && stockLevel < 1} className="flex-1 h-14 rounded-xl text-lg font-black uppercase tracking-widest bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border-none shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:shadow-[0_0_30px_rgba(192,38,211,0.6)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                         {stockLevel !== null && stockLevel < 1 ? 'Sold Out' : <><Zap className="w-5 h-5 fill-yellow-300 text-yellow-300 group-hover:animate-bounce" /> Add to Cart</>}
                      </span>
                   </Button>
                </div>
             </div>

             <div className="pt-4">
               <Tabs defaultValue="details" className="w-full">
                 <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0 gap-6 mb-6 overflow-x-auto flex-nowrap">
                   <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-300 text-gray-400 px-0 py-3 text-base whitespace-nowrap">Details & Specs</TabsTrigger>
                   <TabsTrigger value="benefits" className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-300 text-gray-400 px-0 py-3 text-base whitespace-nowrap">Benefits</TabsTrigger>
                   <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-300 text-gray-400 px-0 py-3 text-base whitespace-nowrap">Shipping</TabsTrigger>
                 </TabsList>

                 <TabsContent value="details" className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{
                  __html: product.description
                }} />
                 </TabsContent>
                 
                 <TabsContent value="benefits" className="animate-in slide-in-from-left-4 duration-500">
                    <div className="grid gap-6">
                       <div className="glass-panel-strong p-6 rounded-2xl space-y-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Heart className="w-24 h-24 text-pink-500" />
                          </div>
                          <h3 className="text-xl font-bold text-pink-300 flex items-center gap-2">
                             <Sparkles className="w-5 h-5" /> Why You'll Love This
                          </h3>
                          <ul className="space-y-3 relative z-10">
                            {seoData?.enhanced.benefits.map((benefit, i) => <li key={i} className="flex items-start gap-3 text-gray-300">
                                 <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />
                                 <span className="leading-relaxed">{benefit}</span>
                               </li>)}
                          </ul>
                       </div>

                       <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-2xl border border-white/5">
                          <h3 className="text-lg font-bold text-blue-300 mb-4">Perfect For...</h3>
                          <div className="grid gap-3">
                            {seoData?.enhanced.useCases.map((useCase, i) => <div key={i} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <Star className="w-4 h-4 text-blue-300" />
                                </div>
                                <span className="text-sm text-gray-300">{useCase}</span>
                              </div>)}
                          </div>
                       </div>
                    </div>
                 </TabsContent>

                 <TabsContent value="shipping" className="animate-in slide-in-from-left-4 duration-500">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass-panel-strong p-5 rounded-xl">
                           <Truck className="w-8 h-8 text-cyan-400 mb-3" />
                           <h4 className="font-bold mb-1">Processing & Shipping</h4>
                           <p className="text-sm text-gray-400">Each item is carefully packaged to ensure privacy and safety. Please allow 5-7 business days for us to craft and/or prepare your order.</p>
                        </div>
                        <div className="glass-panel-strong p-5 rounded-xl flex flex-col items-start">
                           <Mail className="w-8 h-8 text-purple-400 mb-3" />
                           <h4 className="font-bold mb-1">Discreet Packaging</h4>
                           <p className="text-sm text-gray-400 mb-4">
                             We understand the need for privacy. All orders are shipped in plain, unmarked packaging.
                           </p>
                        </div>
                    </div>
                 </TabsContent>
               </Tabs>
             </div>

             <div className="border-t border-white/10 pt-6 mt-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-wider font-bold">
                   <Share2 className="w-4 h-4" /> Share this find
                </span>
                <div className="flex gap-3">
                   <Button variant="ghost" size="icon" className="hover:bg-blue-600/20 hover:text-blue-400 rounded-full"><FaTwitter className="w-5 h-5" /></Button>
                   <Button variant="ghost" size="icon" className="hover:bg-blue-800/20 hover:text-blue-600 rounded-full"><FaFacebook className="w-5 h-5" /></Button>
                   <Button variant="ghost" size="icon" className="hover:bg-red-600/20 hover:text-red-500 rounded-full"><FaPinterest className="w-5 h-5" /></Button>
                   <Button variant="ghost" size="icon" className="hover:bg-green-500/20 hover:text-green-400 rounded-full"><FaWhatsapp className="w-5 h-5" /></Button>
                </div>
             </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && <div className="mt-12 border-t border-white/10 pt-10">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
              You Might Also Treasure
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <RelatedProductCard key={p.id} product={p} />)}
            </div>
          </div>}
      </div>

      <AnimatePresence>
        {showStickyBar && <motion.div initial={{
        y: 100
      }} animate={{
        y: 0
      }} exit={{
        y: 100
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }} className="fixed bottom-0 left-0 right-0 z-40 sticky-buy-bar p-4 md:hidden">
             <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-white truncate">{product.title}</h3>
                   <span className="text-fuchsia-400 font-bold text-sm">{saleInfo ? saleInfo.displayPrice : defaultPrice}</span>
                </div>
                <Button onClick={handleAddToCart} disabled={!selectedVariant || stockLevel !== null && stockLevel < 1} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-bold text-white shadow-lg">
                   {stockLevel !== null && stockLevel < 1 ? 'Sold Out' : 'Add to Cart'}
                </Button>
             </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default ProductDetailPage;