import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Paintbrush, Lightbulb, ToyBrick, Mic, Heart, CheckCircle, Shield, Star } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import SectionCard from '@/components/blog/SectionCard';
import { authorProfiles } from '@/data/authorProfiles';
import AuthorBio from '@/components/blog/AuthorBio';

const BlogPostCreateYourLittlespace = () => {
    const postContentRef = useRef(null);

    // --- METADATA ---
    const postSlug = 'create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves';
    const postDate = '2025-06-17T12:00:00Z';
    const authorName = "Chloe";
    const author = authorProfiles[authorName];

    const postTitle = "Create Your LittleSpace: DIY Decor, Cozy Nooks & Sensory Faves";
    const featuredImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/68470a32-d856-4001-aa04-6ef3f0b873ca/c99793e63f89d57d1e49c35d6b2dfb8c.png";

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
        "description": "Transform any corner into a sensory sanctuary! From DIY blanket forts to soothing lighting, learn how to build a safe, physical space that nurtures your inner child and blocks out stress.",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://littlespaceworld.com/blog/${postSlug}`
        }
    };

    return (
        <React.Fragment>
            <PageHelmet
                title={postTitle}
                description="Transform any corner into a sensory sanctuary! From DIY blanket forts to soothing lighting, learn how to build a safe, physical space that nurtures your inner child and blocks out stress."
                canonical={`/blog/${postSlug}`}
                schema={schema}
                image={featuredImageUrl}
            />
            {/* Main Layout and Styling */}
            <div className="min-h-screen bg-gray-900 text-gray-100 font-sans py-6 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-40 blog-post-body">
                <div className="max-w-4xl mx-auto flex items-start gap-8">
                    <main ref={postContentRef} className="flex-1 min-w-0">
                        
                        {/* Header Section */}
                        <motion.header 
                            className="text-center mb-8 sm:mb-12"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h1>{postTitle}</h1>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 mb-8 text-gray-400 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-pink-400" />
                                    <span>{authorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-pink-400" />
                                    <span>June 17, 2025</span>
                                </div>
                            </div>
                        </motion.header>
                        
                        {/* Featured Image */}
                        <motion.div 
                            className="my-10 flex justify-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <img 
                                className="w-full h-auto rounded-3xl shadow-2xl border-4 border-purple-500/30 transition-transform duration-500 ease-in-out hover:scale-[1.01]" 
                                alt="A cozy, personalized nook filled with soft blankets, fairy lights, stuffed animals, and coloring books, representing an ideal littlespace." 
                                src={featuredImageUrl} 
                            />
                        </motion.div>

                        {/* Article Content */}
                        <article className="space-y-12 mt-10 text-gray-200 leading-relaxed">
                            
                            {/* 1. You Deserve a Comfort Space */}
                            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">You Deserve a Comfort Space</h2>
                            <SectionCard icon={<Heart />} iconBgColor="bg-pink-500/20" iconColor="text-pink-300">
                                <p className="text-lg">
                                    The world is SO stressful right now. Everything is happening all at once, and sometimes you just need somewhere to go where you can actually breathe. Somewhere that's just YOURS, and nobody can bother you. Your room (or corner, or whatever) should make you feel good! Like, not just "okay, I guess," but genuinely excited to be there.
                                </p>
                                <p className="text-lg mt-4">
                                    So, basically, I'm gonna tell you how to make the most amazing little comfort space ever. It's gonna be so cute and cozy and just... *chef's kiss*. This is your permission slip to create a sanctuary that nurtures your inner child and gives you a soft place to land after a hard day. <span className="font-semibold">If you're still exploring your identity, check out: <a href="https://littlespaceworld.com/blog/am-i-really-an-age-regressor" className="text-pink-400 hover:text-pink-300 underline">Am I Really an Age Regressor?</a></span> Let's make that happen!
                                </p>
                            </SectionCard>
                            
                            {/* 2. Secret Age-Regression Crafts with Pastels */}
                            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Secret Age-Regression Crafts with Pastels</h2>
                            <SectionCard icon={<Paintbrush />} iconBgColor="bg-purple-500/20" iconColor="text-purple-300">
                                <p className="text-lg">
                                    Making your own decor is a super fun littlespace activity! It adds a personal touch and lets you create things that are perfectly *you*. Here are some secret age-regression crafts with pastels that are easy and oh-so-cute.
                                </p>
                                
                                <h3 className="text-xl font-semibold text-purple-200 mt-6">Step-by-Step No-Sew Sock Plushie</h3>
                                <p>Turn a lonely sock into a new best friend! This is a classic for a reason—it's simple and adorable.</p>
                                <ul className="list-disc list-outside space-y-2 pl-6 mt-2 text-lg">
                                    <li><strong>Gather Your Supplies:</strong> You'll need a clean, fluffy sock (pastel colors are perfect!), rice or stuffing, rubber bands or string, and a non-toxic marker.</li>
                                    <li><strong>Fill 'er Up:</strong> Carefully fill the sock with rice, leaving a little room at the top to tie it off.</li>
                                    <li><strong>Create the Body:</strong> Tie the top of the sock off tightly with a rubber band. This forms the main body of your plushie.</li>
                                    <li><strong>Make a Head:</strong> Use another rubber band to section off a smaller part at the top for the head.</li>
                                    <li><strong>Add a Face:</strong> Draw a cute, sleepy face on with your marker. You can even make little ears by pinching and tying off small sections at the top!</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-purple-200 mt-6">Dreamy Cloud Garland</h3>
                                <p>Cut cloud shapes out of white felt or thick paper. Use a hole punch to make two holes in each cloud and thread them onto a long piece of pastel-colored yarn or string. You can even add glitter or draw sleepy faces on them. Hang it above your bed or desk for instant dreamy vibes.</p>
                            </SectionCard>

                            {/* 3. Age Regression Is Not Bad: Build a Safe Cozy Space */}
                            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Age Regression Is Not Bad: Build a Safe Cozy Space</h2>
                            <SectionCard icon={<Shield />} iconBgColor="bg-indigo-500/20" iconColor="text-indigo-300">
                                <p className="text-lg">
                                    Remember, age regression is not bad; it's a healthy coping mechanism. Building a safe, cozy space is an act of <a href="https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">self-care</a>. Your comfort nook doesn't need to be a whole room – it just needs to be yours. Even a small corner can become a magical escape!
                                </p>
                                
                                <h3 className="text-xl font-semibold text-indigo-200 mt-6">The Ultimate Blanket Fort</h3>
                                <p>Nothing says "safe and cozy" like a blanket fort. Drape sheets or blankets over chairs, a desk, or even your bed frame. Use clothespins or binder clips to hold them in place. The inside is your secret world!</p>

                                <h3 className="text-xl font-semibold text-indigo-200 mt-6">Magical Lighting Tips</h3>
                                <p>Lighting can completely change the mood. Ditch the harsh overhead light and try these instead:</p>
                                <ul className="list-disc list-outside space-y-2 pl-6 mt-2 text-lg">
                                    <li><strong>Fairy Lights:</strong> String them everywhere! Warm white gives a soft glow, while colored ones are super fun.</li>
                                    <li><strong>Galaxy Projector:</strong> Instantly turn your ceiling into a mesmerizing starry sky.</li>
                                    <li><strong>LED Light Strips:</strong> You can change the color to match your mood. A soft pink or calming blue is perfect for littlespace.</li>
                                    <li><strong>Salt Lamps or Lava Lamps:</strong> For a gentle, warm, and calming light source.</li>
                                </ul>
                            </SectionCard>

                            {/* 4. It's Okay to Age Regress with Soothing Textures */}
                            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">It's Okay to Age Regress with Soothing Textures</h2>
                            <SectionCard icon={<ToyBrick />} iconBgColor="bg-teal-500/20" iconColor="text-teal-300">
                                <p className="text-lg">
                                    It's okay to age regress, and engaging your senses is a powerful way to ground yourself. Think about what makes you feel good!
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-teal-200 mb-2">Touch</h3>
                                        <ul className="list-disc list-outside space-y-1 pl-6">
                                            <li>A super soft, fluffy blanket (minky or fleece is amazing!)</li>
                                            <li>A <a href="https://www.sensorydirect.com/wp/wp-content/uploads/2020/07/Weight-Therapy-Guide-Sensory-Direct-Ltd.-v2.pdf?srsltid=AfmBOopwwv9U3tN6dmafKEmkl1EdP9tHtgZxVcHxJ25sa3lHrO4Zzj3M" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">weighted stuffie or blanket</a> for that hug-like pressure.</li>
                                            <li>Fidget toys with interesting textures.</li>
                                            <li>Kinetic sand or play-doh.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-teal-200 mb-2">Sound</h3>
                                        <ul className="list-disc list-outside space-y-1 pl-6">
                                            <li>Calming playlists (lullabies, Studio Ghibli scores).</li>
                                            <li>White noise machine or app (rain sounds, purring cat).</li>
                                            <li>Audiobooks of children's stories.</li>
                                            <li>The crinkle of a new coloring book.</li>
                                        </ul>
                                        <p className="mt-3 text-sm italic text-gray-400">
                                            Need ideas for winding down? Check out <a href="https://littlespaceworld.com/blog/5-littlespace-bedtime-rituals-for-the-best-sleep" className="text-pink-400 hover:text-pink-300 underline">5 Littlespace Bedtime Rituals for the Best Sleep</a>.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-teal-200 mb-2">Smell</h3>
                                        <ul className="list-disc list-outside space-y-1 pl-6">
                                            <li>A calming essential oil diffuser (lavender, chamomile).</li>
                                            <li>Scented stuffies or pillows.</li>
                                            <li>The smell of freshly baked cookies or warm milk.</li>
                                            <li>Scratch-and-sniff stickers!</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-teal-200 mb-2">Sight</h3>
                                        <ul className="list-disc list-outside space-y-1 pl-6">
                                            <li>Comfort cartoons or movies.</li>
                                            <li>A mobile hanging from the ceiling.</li>
                                            <li>A snow globe or glitter jar to shake and watch.</li>
                                            <li>Cute snack plates and sippy cups.</li>
                                        </ul>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 5. Caring for Someone in Littlespace */}
                            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Caring for Someone in Littlespace</h2>
                            <SectionCard icon={<User />} iconBgColor="bg-green-500/20" iconColor="text-green-300">
                                <p className="text-lg">
                                    If you're a friend, partner, or caregiver to an age regressor, your support means the world. Creating a safe and supportive environment is key. Remember to be patient, understanding, and non-judgmental. Communication is everything!
                                </p>
                                
                                <h3 className="text-xl font-semibold text-green-200 mt-6">DIY Support: Creating a Safe Environment</h3>
                                <ul className="list-disc list-outside space-y-2 pl-6 mt-2 text-lg">
                                    <li><strong>Ask, Don't Assume:</strong> Ask them what they need. Do they want to be held, read a story, or just have quiet time?</li>
                                    <li><strong>Create a "Little Box":</strong> Help them put together a box with their favorite little things: a specific stuffie, a favorite snack, a coloring book. This can be a go-to when they're feeling small.</li>
                                    <li><strong>Learn Their Triggers:</strong> Gently learn what might cause them stress and try to create a space free from those things.</li>
                                    <li><strong>Participate (If Invited):</strong> Offer to watch a cartoon with them or color alongside them. Your presence can be incredibly comforting.</li>
                                </ul>
                            </SectionCard>
                            
                            {/* 6. Things to Gift an Age-Regressor */}
                            <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Things to Gift an Age-Regressor</h2>
                            <SectionCard icon={<Star />} iconBgColor="bg-yellow-500/20" iconColor="text-yellow-300">
                                <p className="text-lg">
                                    Looking for the perfect gift? It's all about comfort, cuteness, and creating that littlespace vibe. Here are some ideas for various budgets.
                                </p>

                                <p className="text-lg font-semibold mt-4 text-center">
                                    <a href="https://littlespaceworld.com/store" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 underline transition duration-300">Shop our Littlespace World Store here for instant comfort! ✨</a>
                                </p>

                                <h3 className="text-xl font-semibold text-yellow-200 mt-6">Budget-Friendly Gifts (Under $20)</h3>
                                <ul className="list-disc list-outside space-y-1 pl-6">
                                    <li>A new set of pastel gel pens or scented markers.</li>
                                    <li>A cute pair of fluffy socks or animal-themed slippers.</li>
                                    <li>A new coloring book and crayons.</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-yellow-200 mt-6">Mid-Range Gifts ($20 - $50)</h3>
                                <ul className="list-disc list-outside space-y-1 pl-6">
                                    <li>A super-soft minky blanket in their favorite color.</li>
                                    <li>A high-quality, cuddly plushie from a brand they love.</li>
                                    <li>A galaxy projector or a set of cute fairy lights.</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-yellow-200 mt-6">Splurge-Worthy Gifts ($50+)</h3>
                                <ul className="list-disc list-outside space-y-1 pl-6">
                                    <li>A <strong>weighted blanket</strong> or a large weighted plushie.</li>
                                    <li>A high-quality noise-canceling headset for quiet time.</li>
                                    <li>A large play tent or canopy to build the ultimate cozy nook.</li>
                                </ul>
                            </SectionCard>

                            {/* Conclusion */}
                            <div className="pt-8">
                                <SectionCard icon={<CheckCircle />} iconBgColor="bg-red-500/20" iconColor="text-red-300">
                                    <h3 className="text-3xl font-bold text-center">Your Space = Your Rules = Your Happiness</h3>
                                    <p className="text-xl italic text-gray-400 text-center mt-4">
                                        You deserve a place that's YOURS, where you feel safe, happy, and comfy. It doesn't have to be perfect or expensive. It just has to feel like a warm hug.
                                    </p>
                                    <p className="text-xl font-bold text-pink-400 text-center mt-4">
                                        Now go make something amazing! 💕
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

export default BlogPostCreateYourLittlespace;