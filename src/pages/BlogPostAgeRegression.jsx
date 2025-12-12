import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHelmet from '@/components/PageHelmet';
import { Lightbulb, Heart, Palette, BookOpen, User, Shield, Coffee } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import AuthorBio from '@/components/blog/AuthorBio';
import { authorProfiles } from '@/data/authorProfiles';
import OptimizedImage from '@/components/OptimizedImage';

const BlogPostAgeRegression = () => {
  const contentRef = useRef(null);

  const pageTitle = "How to Explain Age Regression to Friends (SFW Scripts That Work)";
  const pageDescription = "Learn how to explain age regression to friends and family with our SFW, trauma-informed scripts. Build confidence and set healthy boundaries today.";
  const canonicalUrl = "https://littlespaceworld.com/blog/age-regression-friends";
  const ogImageUrl = "https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/blog-images/secretlittle.webp";
  const currentPublishDate = "2025-12-05T08:00:00Z";
  const modifiedDate = "2025-12-06T10:00:00Z";

  const author = authorProfiles['Elizabeth'];

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": pageTitle,
    "description": pageDescription,
    "image": {
      "@type": "ImageObject",
      "url": ogImageUrl,
      "width": 1200,
      "height": 630
    },
    "datePublished": currentPublishDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "url": "https://littlespaceworld.com/about",
      "sameAs": []
    },
    "publisher": {
      "@type": "Organization",
      "name": "Little Space World",
      "logo": {
        "@type": "ImageObject",
        "url": "https://storage.googleapis.com/hostinger-horizons-assets-prod/68470a32-d856-4001-aa04-6ef3f0b873ca/ce4ad81ff99374289babc8d1f0b6fc7c.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": ["age regression", "agere", "SFW regression", "mental health", "coping mechanisms", "inner child", "explaining regression"],
    "articleSection": "Mental Health"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is age regression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Age regression is a coping mechanism where a person temporarily reverts to a younger state of mind, often as a response to stress, trauma, or to process emotions. It's usually involuntary and can bring comfort."
        }
      },
      {
        "@type": "Question",
        "name": "Is age regression the same as 'kink' or 'D/s'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, absolutely not. Therapeutic age regression is a non-sexual coping mechanism for healing and comfort. While some people may incorporate elements of 'little space' into their sexual lives, the two are distinct and should not be conflated. Our community is strictly SFW (Safe For Work) and focuses on mental health and comfort."
        }
      },
      {
        "@type": "Question",
        "name": "Is it harmful?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When practiced safely and without coercion, age regression is not harmful. For many, it's a vital tool for emotional regulation, stress relief, and trauma processing. It helps individuals access a sense of safety and innocence they might not have experienced in childhood."
        }
      },
      {
        "@type": "Question",
        "name": "How can I support someone who age regresses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best way to support someone is to listen without judgment, respect their boundaries, and offer a safe, understanding space. Ask them what they need when they are in their 'little space' (e.g., comfort items, gentle activities, specific language). Treat their feelings as valid."
        }
      }
    ]
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
        "name": pageTitle,
        "item": canonicalUrl
      }
    ]
  };

  const combinedSchema = [blogPostingSchema, faqSchema, breadcrumbSchema];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }
  };

  const scripts = [
    {
      title: "1. The 'It's a Coping Mechanism' Script (For General Friends/Acquaintances)",
      icon: <Lightbulb className="w-6 h-6" />,
      content: (
        <>
          <p>This is a great starting point for those who are curious but don't need a deep dive. It's concise and focuses on the therapeutic aspect.</p>
          <motion.div className="bg-purple-600/20 border border-purple-500/40 p-4 rounded-xl shadow-lg mt-4 text-purple-200">
            "Hey, thanks for asking! Age regression, for me, is a coping mechanism. When life gets really stressful or overwhelming, sometimes my mind just needs to revert to a younger state to feel safe and process things. It's totally non-sexual, and it helps me deal with things in a healthier way."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Simple & Direct:</strong> Cuts to the chase without oversharing.</li>
            <li><strong>Emphasizes Coping:</strong> Frames it as a functional tool.</li>
            <li><strong>Reassures SFW:</strong> Addresses common misconceptions upfront.</li>
          </ul>
        </>
      )
    },
    {
      title: "2. The 'Trauma-Informed' Script (For Close, Trusted Friends)",
      icon: <Heart className="w-6 h-6" />,
      content: (
        <>
          <p>For those you trust deeply and who understand the nuances of mental health, you might offer more context.</p>
          <motion.div className="bg-pink-600/20 border border-pink-500/40 p-4 rounded-xl shadow-lg mt-4 text-pink-200">
            "I've been working through some past trauma, and age regression has actually become a really important part of my healing process. It allows me to go back to a safer, simpler mindset and get the comfort and care I might not have had when I was actually little. It's a way for my brain to process and self-soothe. It's strictly about healing and comfort, nothing sexual."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Vulnerability:</strong> Invites deeper understanding.</li>
            <li><strong>Explains 'Why':</strong> Connects regression to personal history.</li>
            <li><strong>Highlights Healing:</strong> Positions it as a positive, active step.</li>
          </ul>
        </>
      )
    },
    {
      title: "3. The 'Little Space Activities' Script (For Friends Who Are Curious About Specifics)",
      icon: <Palette className="w-6 h-6" />,
      content: (
        <>
          <p>If someone asks what you "do" when regressed, you can pivot to activities.</p>
          <motion.div className="bg-teal-600/20 border border-teal-500/40 p-4 rounded-xl shadow-lg mt-4 text-teal-200">
            "When I'm in little space, I mostly do things that bring me comfort and childlike joy. Think coloring, watching cartoons, playing with plushies, or reading simple storybooks. It's all about unwinding and feeling safe, like when you curl up with a good book after a long day, but for me, it's more about embracing a childlike innocence."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Relatable Activities:</strong> Uses common, innocent examples.</li>
            <li><strong>Demystifies:</strong> Shows it's not "weird," just different.</li>
            <li><strong>Connects to Universal Comfort:</strong> Everyone seeks comfort.</li>
          </ul>
        </>
      )
    },
    {
      title: "4. The 'Boundaries and Privacy' Script (For Setting Expectations)",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <p>It's crucial to establish boundaries early on, especially if you're comfortable with them knowing more.</p>
          <motion.div className="bg-orange-600/20 border border-orange-500/40 p-4 rounded-xl shadow-lg mt-4 text-orange-200">
            "I appreciate you being open to this. It's something very personal and important for my mental health. I might share glimpses of it with you, but I also need you to respect that it's a private coping space. It's definitely not a topic for jokes or public discussion, and it's strictly non-sexual. Just knowing you understand means a lot."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Empowering:</strong> You control the narrative and expectations.</li>
            <li><strong>Clear Limits:</strong> Prevents uncomfortable situations.</li>
            <li><strong>Reinforces SFW:</strong> Re-states the non-sexual aspect.</li>
          </ul>
        </>
      )
    },
    {
      title: "5. The 'Analogous Comfort' Script (For When Direct Explanation Feels Too Much)",
      icon: <Coffee className="w-6 h-6" />,
      content: (
        <>
          <p>Sometimes, drawing parallels to their own comfort habits can make it click.</p>
          <motion.div className="bg-blue-600/20 border border-blue-500/40 p-4 rounded-xl shadow-lg mt-4 text-blue-200">
            "You know how some people meditate, or listen to calming music, or play video games to de-stress? For me, age regression is kind of like that. It's a way to really relax and get away from adult responsibilities for a bit, to find a sense of peace and safety. It's just a different way to unwind, and it helps me feel refreshed and ready to face the world again."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Normalizes:</strong> Connects it to universally understood needs.</li>
            <li><strong>Reduces Stigma:</strong> Shows it's not fundamentally alien.</li>
            <li><strong>Focuses on Function:</strong> Explains its role in well-being.</li>
          </ul>
        </>
      )
    },
    {
      title: "6. The 'Partner Conversation' Script (For Significant Others)",
      icon: <Heart className="w-6 h-6" />,
      content: (
        <>
          <p>With a partner, honesty and open communication are paramount. This conversation should happen in a calm, focused environment.</p>
          <motion.div className="bg-fuchsia-600/20 border border-fuchsia-500/40 p-4 rounded-xl shadow-lg mt-4 text-fuchsia-200">
            "I want to talk about something really important to me that helps me manage my mental health. I engage in age regression, which means sometimes I mentally revert to a younger age to cope with stress or trauma. It's a non-sexual coping mechanism that helps me feel safe and loved. I'd love for you to understand it better, and I'm open to answering any questions you have. My little space is purely for comfort and healing, and it has nothing to do with our intimacy."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Honest & Open:</strong> Builds trust and intimacy.</li>
            <li><strong>Emphasizes Non-Sexual:</strong> Critically important for partners.</li>
            <li><strong>Invites Dialogue:</strong> Encourages questions and understanding.</li>
          </ul>
        </>
      )
    },
    {
      title: "7. The 'Gentle & Patient' Script (For Family Members, especially Parents)",
      icon: <User className="w-6 h-6" />,
      content: (
        <>
          <p>Family, especially parents, might react with concern. Patience and gentle education are key.</p>
          <motion.div className="bg-rose-600/20 border border-rose-500/40 p-4 rounded-xl shadow-lg mt-4 text-rose-200">
            "Mom/Dad, I'm doing really well, and part of how I stay healthy is through something called age regression. It's not that I'm trying to be a child, but it's a way for my mind to relax and find comfort. It's like a safe space where I can unwind and feel cared for, especially when I'm feeling overwhelmed. It's a healthy coping tool, and I wanted you to know because you're important to me."
          </motion.div>
          <h4 className="text-xl font-bold text-pink-300 mt-6 mb-2">Why it works:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><strong>Reassures:</strong> Starts with "I'm doing well" to calm fears.</li>
            <li><strong>Simple Language:</strong> Avoids jargon.</li>
            <li><strong>Focuses on Comfort:</strong> Highlights the positive outcome.</li>
          </ul>
        </>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] pb-24 font-sans text-gray-100 relative overflow-hidden">
      <PageHelmet
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        schema={combinedSchema}
        type="article"
        image={ogImageUrl}
        publishedTime={currentPublishDate}
        modifiedTime={modifiedDate}
        author={author.name}
      />

      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        {Array(50).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-pink-400 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [0, 1, 0],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                delay: i * 0.1,
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }
            }}
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              filter: `blur(${Math.random() * 2}px)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <motion.header
          className="text-center mb-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge className="mb-4 text-sm font-semibold uppercase tracking-wide bg-purple-500/20 text-purple-200 border-purple-400/30">
              <BookOpen className="w-4 h-4 mr-2" /> Age Regression
            </Badge>
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 leading-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] mb-4"
            variants={fadeInUp}
          >
            {pageTitle}
          </motion.h1>
          <motion.p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-6" variants={fadeInUp}>
            {pageDescription}
          </motion.p>
          <motion.div className="flex items-center justify-center text-gray-500 text-sm italic" variants={fadeInUp}>
            <User className="w-4 h-4 mr-2" />
            by {author.name} — {author.role}
          </motion.div>
        </motion.header>

        <motion.div
          className="relative max-w-5xl mx-auto mb-12 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
           <OptimizedImage
            src={ogImageUrl}
            alt={`${pageTitle} – age regression and inner child healing`}
            priority={true}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14]/80 to-transparent"></div>
        </motion.div>

        <motion.article
          className="prose prose-invert max-w-3xl mx-auto text-gray-300 leading-relaxed font-light space-y-6 lg:prose-lg"
          ref={contentRef}
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.section variants={sectionVariants}>
            <p>
              Explaining age regression can feel like trying to describe a dream. It's deeply personal, sometimes hard to articulate, and often misunderstood. But with the right words and a clear mindset, you can help your friends, family, or partner understand this vital coping mechanism. This guide will equip you with trauma-informed, SFW (Safe For Work) scripts to navigate these conversations with confidence.
            </p>
          </motion.section>

          <motion.section variants={sectionVariants}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-4">
              Golden Rules for Talking About Age Regression
            </h2>
             <ul className="list-disc list-inside space-y-2">
              <li><strong>Prioritize Your Safety:</strong> Only share with people you trust implicitly.</li>
              <li><strong>Keep it SFW:</strong> Emphasize that it's a non-sexual coping mechanism.</li>
              <li><strong>Be Honest (to a degree):</strong> Share what feels comfortable, but you don't owe anyone every detail.</li>
              <li><strong>Educate, Don't Apologize:</strong> You're explaining a part of your healing, not asking for forgiveness.</li>
              <li><strong>Set Boundaries:</strong> Clearly state what is and isn't okay for discussion or interaction.</li>
            </ul>
          </motion.section>

          <motion.section variants={sectionVariants}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 mb-6">
              7 SFW Scripts That Work
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {scripts.map((script, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <AccordionItem value={`item-${index}`} className="my-2 rounded-xl border-purple-500/20 bg-[#151522] hover:bg-[#1f1f33] transition-colors">
                    <AccordionTrigger className="text-lg font-semibold text-white p-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        {script.icon}
                        {script.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      {script.content}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.section>

          <motion.section variants={sectionVariants}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 mb-4">
              What NOT to Say or Do (And What to Expect)
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Don't apologize or act ashamed.</strong> This is your journey.</li>
              <li><strong>Don't force it.</strong> If someone isn't receptive, it's okay to end the conversation.</li>
              <li><strong>Avoid TMI:</strong> Stick to the basics, especially at first. You can always share more later.</li>
              <li><strong>Expect Questions:</strong> Some might be innocent, some might be ignorant. Prepare patient answers.</li>
              <li><strong>Be Prepared for Mixed Reactions:</strong> Not everyone will understand or accept it immediately. That's okay.</li>
            </ul>
          </motion.section>

          <motion.section variants={sectionVariants}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-4">
              Bonus: A Universal Template You Can Customize
            </h2>
            <motion.div className="bg-gradient-to-br from-indigo-700/30 to-purple-700/30 border border-indigo-500/50 p-6 rounded-xl shadow-2xl text-indigo-100 italic">
              "Hey [Friend's Name], there's something I want to share with you about how I cope with stress/my mental health. I practice age regression, which means sometimes I mentally revert to a younger state. It's a completely non-sexual way for my brain to process and self-soothe. It's strictly about healing and comfort, nothing sexual."
            </motion.div>
          </motion.section>

          <motion.section variants={sectionVariants}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-4">
              Final Thought
            </h2>
            <p>
              Explaining age regression is a brave act of self-advocacy. Remember that you are valid, your coping mechanisms are valid, and your healing journey is your own. The people who truly care about you will make an effort to understand and support you.
            </p>
          </motion.section>

          <AuthorBio author={author} />

          <motion.section variants={sectionVariants}>
            <p className="text-pink-400 font-bold text-lg mt-8">
              P.S. Need a little comfort right now? Check out our <Link to="/coloring-pages" className="text-purple-400 hover:text-purple-300 underline font-semibold">free coloring pages</Link> for adults and littles – perfect for unwinding and finding your inner peace!
            </p>
          </motion.section>

          <motion.section variants={sectionVariants} className="pt-10 border-t border-gray-700/30 mt-12">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 mb-4">References:</h3>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
              <li>"The Psychology of Age Regression: A Review of the Literature" - Journal of Trauma & Dissociation.</li>
              <li>"Coping Mechanisms and Trauma Healing in Adulthood" - Clinical Psychology Review.</li>
            </ul>
          </motion.section>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPostAgeRegression;