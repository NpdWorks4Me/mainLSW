import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Frown, Shield, MessageSquare, Star, CheckCircle, Car, Briefcase } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import SectionCard from '@/components/blog/SectionCard';
import { authorProfiles } from '@/data/authorProfiles';
import AuthorBio from '@/components/blog/AuthorBio';

const BlogPostMyLittleSecrets = () => {
    const postContentRef = useRef(null);

    // --- METADATA ---
    const postSlug = 'my-little-secrets-because-adulting-is-literally-not-it';
    const postDate = '2025-08-15T12:00:00Z';
    const authorName = "Chloe";
    const author = authorProfiles[authorName];
    
    const featuredImageUrl = "https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/i%20miss%20childhood%20(%20(3).webp";

    const postTitle = "My Little Secrets";
    const postSubtitle = "(Because Adulting is Literally Not It)";
    const postDescription = "A candid and relatable look at the daily exhaustion of early adulthood. Discover why therapeutic age regression is a vital, secret space for rest, healing, and self-preservation.";

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postTitle,
        "image": featuredImageUrl, 
        "author": { "@type": "Person", "name": authorName },
        "publisher": {
            "@type": "Organization",
            "name": "Little Space World",
            "logo": {
                "@type": "ImageObject",
                "url": "https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/129b088f751e7151d826480c379feb02.webp"
            }
        },
        "datePublished": postDate,
        "description": postDescription,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://littlespaceworld.com/blog/${postSlug}`
        }
    };

    return (
        <React.Fragment>
            <PageHelmet
                title={`${postTitle} ${postSubtitle}`}
                description={postDescription}
                canonical={`/blog/${postSlug}`}
                schema={schema}
                image={featuredImageUrl}
            />
            <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 blog-post-body min-h-screen text-gray-100 font-sans">
                <div className="max-w-7xl mx-auto flex items-start gap-8">
                    <main ref={postContentRef} className="flex-1 min-w-0">
                        <motion.header 
                            className="text-center mb-8 sm:mb-12"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h1>{postTitle}</h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-4 italic">{postSubtitle}</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 mb-6 sm:mb-8 italic max-w-md mx-auto text-gray-400 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-pink-400" />
                                    <span>{authorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-pink-400" />
                                    <span>August 15, 2025</span>
                                </div>
                            </div>
                        </motion.header>
                        
                        <motion.div 
                            className="my-10 flex justify-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <img 
                                className="w-full max-w-lg h-auto rounded-xl shadow-2xl transition-transform duration-300 ease-in-out hover:scale-[1.02] border-4 border-pink-500/30" 
                                alt="A nostalgic image representing the comfort and safety of childhood and the desire for rest." 
                                src={featuredImageUrl}
                            />
                        </motion.div>

                        <article className="space-y-12 mt-8">
                            
                            {/* --- SECTION 1 --- */}
                            <h2 className="text-3xl font-bold text-center">The Real Talk We Need 😩</h2>
                            <SectionCard 
                                icon={<Frown className="text-red-400" />} 
                                iconBgColor="bg-red-900/40" 
                                iconColor="text-red-400"
                                title="Drowning in Responsibilities"
                            >
                                <p className="readable-text">
                                    Okay besties, we need to have a <strong>REAL talk</strong> about something that's been on my mind almost 24/7 lately: being a secret little. I feel like screaming "<strong>I AM DROWNING IN ADULT RESPONSIBILITIES!!</strong>" sometimes, but who around me would understand? Nobody. And that's why I am happy being a secret little, for now...
                                </p>
                                <p className="readable-text mt-4">
                                    I'm 19 years old now. And I'm supposed to be a "big girl" all the time. Always expected to have the answers, keep it together, and be the strong one for everyone else. I play this role in my family, and in my workplace. I use every bit of energy to keep things going, and at the end of the day, I am <strong>exhausted, drained, and reeling from the day's overwhelm</strong>. I just want to cuddle up with something snuggly, and zone out to some chill 'toons or tunes, and just be <strong>baby</strong>! Be cared for in the way I care for others. Sound familiar?
                                </p>
                                <p className="readable-text mt-6 text-sm italic text-gray-400">
                                    If this intense feeling of being overwhelmed resonates, you might find support in our guide: <a href="https://littlespaceworld.com/blog/5-steps-to-surviving-young-adulthood" className="text-purple-400 hover:text-purple-300 underline font-semibold transition duration-200">5 Steps to Surviving Young Adulthood</a>.
                                </p>
                            </SectionCard>

                            {/* --- SECTION 2 --- */}
                            <h2 className="text-3xl font-bold text-center">The Societal Squeeze 😤</h2>
                            <SectionCard 
                                icon={<MessageSquare className="text-teal-300" />} 
                                iconBgColor="bg-teal-900/40" 
                                iconColor="text-teal-300"
                                title="The Pressure to Perform"
                            >
                                <p className="readable-text">
                                    Can we talk about how messed up it is that society basically tells us, "Congrats, you're an adult now, please delete all your childish comfort needs, and become a boring, productive robot"? We're expected to handle bills, work, school, and social lives without ever showing a crack in the facade.
                                </p>
                                <p className="readable-text mt-4">
                                    Crying is seen as weakness. Needing a stuffie is "childish." Wanting to watch cartoons is "immature." This constant pressure to perform "<strong>adulting</strong>" perfectly is exhausting, and it leaves no room for the soft, vulnerable parts of ourselves that still need nurturing.
                                </p>
                            </SectionCard>

                            {/* --- SECTION 3 --- */}
                            <h2 className="text-3xl font-bold text-center">My Undercover Comfort Operation 🛡️</h2>
                            <SectionCard 
                                icon={<Shield className="text-blue-300" />} 
                                iconBgColor="bg-blue-900/40" 
                                iconColor="text-blue-300"
                                title="Building My Invisible Fort"
                            >
                                <p className="readable-text">
                                    Because the outside world demands so much, my little world is top-secret. I'm basically running a <strong>covert comfort operation</strong> just to feel okay in my own skin. I'm not about hiding who I am, but protecting a part of me that's too precious to expose to judgment.
                                </p>
                                <p className="readable-text mt-4">
                                    Last night, after the shift from hell, I finally made it to my room (aka my sanctuary). Locked the door, pulled out my secret comfort box, and there was Ms. Peach, my beloved, well-worn stuffed elephant. As soon as I held him, the weight of the day started to lift and I felt a certain silliness and lightheartedness drift in.
                                </p>
                                <p className="readable-text mt-4">
                                    My "invisible fort" isn't a physical place as much as a collection of feelings and rituals. It's built from tiny, secret acts of self-love:
                                </p>
                                <ul className="list-disc list-inside space-y-3 pl-4 mt-4 readable-text">
                                    <li><strong>The Comfort Box:</strong> A simple shoebox under my bed filled with my favorite pacifier, a soft baby blanket, and a small coloring book. It's my emergency kit for bad days.</li>
                                    <li><strong>The Digital Hideaway:</strong> A private Pinterest board of cute animals, a cozy games folder on my Switch, and a playlist of Studio Ghibli soundtracks. My phone becomes a portal to peace.</li>
                                    <li><strong>The Sensory Escape:</strong> Changing into my softest oversized hoodie, sipping warm chocolate milk from my favorite mug, and dimming the lights with my galaxy projector. It's about creating a vibe. (Find more inspiration in our guide: <a href="https://littlespaceworld.com/blog/create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves" className="text-purple-400 hover:text-purple-300 underline font-semibold transition duration-200">DIY Guide for Cozy Nooks and Sensory Faves</a>).</li>
                                </ul>
                            </SectionCard>

                            {/* --- SECTION 4 --- */}
                            <h2 className="text-3xl font-bold text-center">Taking the Magic on the Go 🚗✨</h2>
                            
                            <SectionCard 
                                icon={<Car className="text-indigo-300" />} 
                                iconBgColor="bg-indigo-900/40" 
                                iconColor="text-indigo-300"
                                title="My Car: The Mobile Safe Space"
                            >
                                <p className="readable-text">
                                    The secret to surviving adulting is sprinkling a little bit of that comfort magic into your everyday life. It’s about finding ways to feel small and <strong>safe</strong>, even when you’re out in the big world. Here’s how I do it:
                                </p>
                                <ul className="list-disc list-inside space-y-3 pl-4 mt-4 readable-text">
                                    <li><strong>Rearview Mirror Charms:</strong> A little dangling strawberry or a fluffy pom-pom is just for me. Every time I see it, I smile.</li>
                                    <li><strong>Cute Decals:</strong> A tiny, holographic star sticker on my back window or a peeking cat decal is subtle enough that most people won't notice, but I know it's there.</li>
                                    <li><strong>Seat Covers & Cushions:</strong> A super soft, pastel seat cover makes every drive feel like a hug. Plus, a cute neck pillow is a game-changer for comfort.</li>
                                    <li><strong>Fairy Lights:</strong> A string of battery-powered fairy lights tucked along the dashboard or ceiling creates the dreamiest atmosphere for night drives. Instant cozy vibes!</li>
                                </ul>
                            </SectionCard>

                            <SectionCard 
                                icon={<Briefcase className="text-orange-300" />} 
                                iconBgColor="bg-orange-900/40" 
                                iconColor="text-orange-300"
                                title="Workplace Whimsy: The Lanyard Trick"
                            >
                                <p className="readable-text">
                                    Okay, so we can't exactly bring a stuffie to the office. But we can definitely add a little personality to our work gear. My work lanyard used to be so boring, but now it’s a <strong>tiny beacon of joy</strong>.
                                </p>
                                <p className="readable-text mt-4">
                                    I’ve added a few cute enamel pins (a smiling cloud, a little ghost) and a tiny keychain of a cartoon character I love. It’s professional enough to fly under the radar, but it’s a constant, private reminder of my playful side. It’s my little secret that helps me get through the toughest meetings.
                                </p>
                            </SectionCard>

                            {/* --- SECTION 5 --- */}
                            <h2 className="text-3xl font-bold text-center">Why Keeping it Secret is a Superpower 🌟</h2>
                            <SectionCard 
                                icon={<Star className="text-yellow-300" />} 
                                iconBgColor="bg-yellow-900/40" 
                                iconColor="text-yellow-300"
                                title="Protecting Your Peace is Strength"
                            >
                                <p className="readable-text">
                                    For a long time, I felt guilty for keeping my regression a secret. Was I being fake? Ashamed? But I've realized something powerful: <strong>protecting your peace is a form of strength, not weakness</strong>. This therapeutic approach is a healthy coping mechanism (<a href="https://www.verywellmind.com/coping-mechanisms-for-stress-and-anxiety-5216391" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline font-semibold transition duration-200">read more from Verywell Mind</a>).
                                </p>
                                <ul className="list-disc list-inside space-y-3 pl-4 mt-4 readable-text">
                                    <li><strong>It's About Safety:</strong> My littlespace is for ME. It’s where I can be 100% vulnerable without fear of misunderstanding or criticism. It's a controlled environment where I get to decide who, if anyone, gets to see that side of me.</li>
                                    <li><strong>It Prevents Burnout:</strong> Having this private escape allows me to recharge my social and emotional batteries. It's the reason I <strong>CAN be a responsible "adult"</strong> at my job—because I know I have a safe place to fall apart and put myself back together later. (For professional methods on preventing stress and burnout, check out <a href="https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/burnout/art-20046642" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline font-semibold transition duration-200">the Mayo Clinic</a>).</li>
                                    <li><strong>It's Sacred:</strong> Keeping it private makes it feel special. It's my own magical world, untainted by outside opinions. It belongs only to me and my inner child, and that bond is unbreakable.</li>
                                </ul>
                            </SectionCard>

                            <div className="pt-8">
                                <SectionCard 
                                    icon={<CheckCircle className="text-green-300" />} 
                                    iconBgColor="bg-green-900/40" 
                                    iconColor="text-green-300"
                                    title="You're Not Alone in This, Bestie 💕"
                                >
                                    <p className="text-xl font-bold text-center">
                                        If you're reading this and nodding along, hi, hello, we are in this together!
                                    </p>
                                    <p className="text-lg italic text-gray-400 text-center mt-4">
                                        It's badass that you're honoring your authentic self, even when the world tells you to be someone else. Go be kind to that inner little. You earned it.
                                    </p>
                                </SectionCard>
                            </div>

                            <AuthorBio author={author} />
                        </article>
                    </main>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BlogPostMyLittleSecrets;