import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import PageHelmet from '@/components/PageHelmet';
import { User, Calendar, Brain, PawPrint, MessageCircle, HeartHandshake, Zap, Smile, BookOpen } from 'lucide-react'; // Added new icons
import SectionCard from '@/components/blog/SectionCard'; // Import SectionCard

const InfoBox = ({
  children,
  icon,
  colorClass
}) => {
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} viewport={{
    once: true,
    amount: 0.3
  }} transition={{
    duration: 0.5
  }} className={`callout-box ${colorClass} flex items-start gap-4 my-8`}>
            {React.cloneElement(icon, {
      className: "w-7 h-7 shrink-0 mt-1"
    })}
            <div className="text-base md:text-lg">{children}</div>
        </motion.div>;
};
const BlogPostAgeVsPetRegression = () => {
  const postContentRef = useRef(null);
  const postSlug = 'age-regression-vs-pet-regression-whats-the-difference';
  const postDate = '2025-11-27T12:00:00Z';
  const authorName = "Chloe";
  const postTitle = "🐾 Age Regression vs. Pet Regression: What's the Difference?";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Age Regression vs. Pet Regression: What's the Difference?",
    "image": "https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/blog-images/babybigkitty.webp",
    // Updated image URL here
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Little Space World",
      "logo": {
        "@type": "ImageObject",
        "url": "https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/129b088f751e7151d826480c379feb02.webp"
      }
    },
    "datePublished": postDate,
    "description": "Curious if your brain wants a sippy cup or squeaky toys? Explore the cozy differences between age regression and pet regression to find which headspace offers you the best sensory relief."
  };
  return <>
            <PageHelmet title={postTitle} description="Curious if your brain wants a sippy cup or squeaky toys? Explore the cozy differences between age regression and pet regression to find which headspace offers you the best sensory relief." canonical={`/blog/${postSlug}`} schema={schema} />
            <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-40 2xl:px-56 blog-post-body">
                <div className="max-w-7xl mx-auto flex items-start gap-8">
                    <main ref={postContentRef} className="flex-1 min-w-0">
                        <motion.header className="text-center mb-8 sm:mb-12" initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{postTitle}</h1>
                            <p className="text-gray-400 italic"></p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 mb-6 sm:mb-8 italic max-w-md mx-auto text-gray-400 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-pink-400" />
                                    <span>{authorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-pink-400" />
                                    <span>November 27, 2025</span>
                                </div>
                            </div>
                        </motion.header>

                        <motion.div className="my-10 flex justify-center" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.7,
            delay: 0.2
          }}>
                            <img class="w-full max-w-lg h-auto rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105" alt="Illustration showing side-by-side comparison of age regression and pet regression with cozy, soft aesthetics and gentle lighting. One side features elements like pacifiers, plushies, and milk bottles, while the other features pet ears, tails, and toys like squeaky balls." src="https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/blog-images/babybigkitty.webp" />
                        </motion.div>
                        
                        <article className="space-y-6 md:space-y-8 mt-8 blog-post-content readable-text">
                           <p>If you've ever stared at your phone at 2 a.m. wondering, "Am I feeling little… or am I feeling like a golden retriever who just discovered squeaky toys exist?" — congratulations, you've found your people.</p>
                           <p>Here in our little corner of the internet we talk a lot about retreating from adult chaos into the safest, softest version of ourselves. Sometimes that looks like dinosaur chicken nuggets and Bluey on repeat. Sometimes it looks like ears, a tail, and the uncontrollable urge to zoom around the living room on all fours while making happy little "borf" noises.</p>
                           <p>Both are valid. Both are healing. Both can just be pure, unfiltered joy on a lazy Sunday when the dishes can wait and the world is finally quiet.</p>
                           <p>Ready to grab a juice box (or a bowl of water on the floor — no judgment) and figure out which flavor of cozy speaks to your soul today? Let's go.</p>
                           <InfoBox icon={<BookOpen className="text-blue-300" />} colorClass="callout-box-blue">
                               Before we dive in, let's quickly affirm what regression actually is. It's when your brain says "adulting is cancelled" and temporarily drops into a simpler, happier headspace. It can be a coping tool when life is Too Much™, or simply your favorite way to spend a free evening because it feels nice. Neither reason is "better." Your brain, your rules.
                           </InfoBox>
                           
                           <h2 className="text-2xl font-bold text-white mt-10 mb-4">👶 Part One: Age Regression (Agere)</h2>
                           <SectionCard icon={<HeartHandshake className="text-pink-300" />} iconBgColor="bg-pink-500/20" iconColor="text-pink-300">
                               <p>Picture this: you put on your favorite cartoon pajamas, the ones with the tiny moons on them, and suddenly the mortgage, the group chat drama, and that email you've been avoiding simply… poof. Don't exist anymore. That's little space.</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">What it feels like on the inside</h3>
                               <ul className="list-disc list-inside space-y-2 pl-4">
                                   <li>Your thoughts get smaller and rounder, like cotton candy.</li>
                                   <li>Big feelings shrink down to "I want mac and cheese" or "I need a hug."</li>
                                   <li>Time becomes delightfully wibbly-wobbly. An hour of coloring feels like ten minutes, and that's perfect.</li>
                               </ul>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">Ages people regress to</h3>
                               <p>Anywhere from newborn (mostly non-verbal, lots of rocking and soft textures) to big-kid (around 8–12, still loves rules and stickers but can tie their own shoes… sometimes).</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">The silly stuff littles love</h3>
                                <ul className="list-disc list-inside space-y-2 pl-4">
                                   <li>Building blanket forts tall enough to stand in (engineering degree optional)</li>
                                   <li>Collecting stickers like they're Pokémon cards</li>
                                   <li>Having very strong opinions about which stuffie gets to sleep closest to your face</li>
                                   <li>Accidentally calling your partner "dada/mama" in the grocery store and then pretending it was the stuffie who said it</li>
                               </ul>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">The gear</h3>
                               <p>Pastel everything, sippy cups that don't spill on your laptop, pacifiers (yes, grown-ups use them for oral sensory reasons — it's a thing), dino nuggets, glitter gel pens, and approximately 47 blankets.</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">Caregiver dynamics</h3>
                               <p>Some littles are independent and just want to color alone. Some have a friend or partner who happily slips into caregiver mode — tucking them in, cutting the crusts off sandwiches, reading bedtime stories in funny voices. When in a relationship with someone who also provides this level of care, it's important to keep in mind that healthy boundaries + open communication = happy couple. </p>
                           </SectionCard>

                           <h2 className="text-2xl font-bold text-white mt-10 mb-4">🐺 Part Two: Pet Regression (Petre)</h2>
                           <SectionCard icon={<PawPrint className="text-purple-300" />} iconBgColor="bg-purple-500/20" iconColor="text-purple-300">
                               <p>Now imagine you come home, kick off your shoes, clip on some ears, and suddenly the only thoughts in your head are:</p>
                               <ul className="list-disc list-inside space-y-2 pl-4">
                                   <li>"Ball. Ball? BALL!"</li>
                                   <li>"Person = pets = good"</li>
                                   <li>"Must zoom. Must roll. Must be dramatically belly-rubbed."</li>
                               </ul>
                               <p>That's pet space.</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">What it feels like on the inside</h3>
                               <p>Language? Optional. Worries? Evicted. Joy? Now occupying 100% of brain capacity.</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">Popular animals</h3>
                               <p>Puppies (high energy, zoomies, endless tail wags), kittens (sneaky, cuddly, occasional chaos gremlin), bunnies (soft, hoppy, love burrowing), foxes (sneaky clever + fluffy tail), literally any creature that makes your brain go "yes please."</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">The silly stuff pets love</h3>
                               <ul className="list-disc list-inside space-y-2 pl-4">
                                   <li>Making the exact noise of your animal and refusing to stop because it's too funny</li>
                                   <li>Learning tricks (sit, paw, spin) just because it feels good when your handler says "good puppy!"</li>
                                   <li>Hoarding all the blankets into the perfect nest and then flopping dramatically on top</li>
                                   <li>The sacred ritual of "presenting the belly" for rubs</li>
                               </ul>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">The gear</h3>
                               <p>Ears, tails that swish when you're happy, collars (some people love the gentle pressure, some just think they're cute), knee pads if you're a floor-dwelling critter, chew toys (great for stress or just because chewing is fun), and a water bowl that says "Good Puppy" because hydration is important.</p>
                               <h3 className="text-xl font-semibold text-white mt-6 mb-3">Handler dynamics</h3>
                               <p>Some pets are solo and just want to romp around the living room. Some have a partner who becomes their handler — throwing the ball, giving ear scratches, telling them they're the best bean in the world. Again, romantic partners can absolutely fill this role. Consent, respect, and clear communication are the entire foundation.</p>
                           </SectionCard>

                           <h2 className="text-2xl font-bold text-white mt-10 mb-4">🤝 Central Question: Which One Is My Brain Asking For?</h2>
                           <SectionCard icon={<MessageCircle className="text-cyan-300" />} iconBgColor="bg-cyan-500/20" iconColor="text-cyan-300">
                               <p>The most important thing to know is that your brain is just asking for comfort, and both spaces are valid ways to get it. You don't have to choose a side forever! Half the community is out here switching between sippy cups and squeaky toys like it's a wardrobe change.</p>
                               <p>Some days the inner child wants to be read to. Some days the inner puppy wants to be chased around the couch. Both are correct answers.</p>

                               <h3 className="text-xl font-semibold text-white mt-8 mb-4">Side-by-Side Showdown</h3>
                               <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse blog-table">
                                    <thead>
                                        <tr>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">Age Regression (Agere)</th>
                                            <th className="p-3">Pet Regression (Petre)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-3"><strong>Brain when you drop</strong></td><td className="p-3">"I am smol and need juice"</td><td className="p-3">"THOUGHTS? NEVER HEARD OF 'EM"</td></tr>
                                        <tr><td className="p-3"><strong>Primary focus</strong></td><td className="p-3">Emotional nurturing & innocence</td><td className="p-3">Instinct, movement & sensory grounding</td></tr>
                                        <tr><td className="p-3"><strong>Favorite phrase</strong></td><td className="p-3">"Can you read me one more story pwease?"</td><td className="p-3">happy bark that means absolutely nothing</td></tr>
                                        <tr><td className="p-3"><strong>Biggest temptation</strong></td><td className="p-3">Another pack of crayons</td><td className="p-3">Stealing exactly one sock and hiding it</td></tr>
                                        <tr><td className="p-3"><strong>How you greet your person</strong></td><td className="p-3">Running jump hug + "I missed you all day!"</td><td className="p-3">Full-body wiggle + possible gentle mouthing</td></tr>
                                        <tr><td className="p-3"><strong>Bedtime routine</strong></td><td className="p-3">Three stories, two stuffies, one night-light</td><td className="p-3">Zoomies → crash → starfish across the entire bed</td></tr>
                                        <tr><td className="p-3"><strong>Best for</strong></td><td className="p-3">When your heart needs gentle words and cozy structure</td><td className="p-3">When your brain needs to be turned off and body turned on (the zoomies way)</td></tr>
                                    </tbody>
                                </table>
                               </div>
                           </SectionCard>
                           
                           <h2 className="text-2xl font-bold text-white mt-10 mb-4">🧠 Neurodivergent Bonus Round</h2>
                           <SectionCard icon={<Brain className="text-orange-300" />} iconBgColor="bg-orange-500/20" iconColor="text-orange-300">
                               <p>A lot of us are autistic, ADHD, or both, and these headspaces are basically custom-made sensory heaven:</p>
                               <ul className="list-disc list-inside space-y-2 pl-4">
                                   <li><strong>Agere</strong> = deep pressure blankets + predictable routines + soft everything</li>
                                   <li><strong>Petre</strong> = proprioceptive input galore + permission to make noises + zero need for eye contact</li>
                               </ul>
                               <p>It's like the universe handed us two different flavors of weighted blanket for the soul.</p>
                           </SectionCard>
                           
                           <h2 className="text-2xl font-bold text-white mt-10 mb-4">A gentle note on the "coping" thing</h2>
                           <InfoBox icon={<Zap className="text-yellow-300" />} colorClass="callout-box-yellow">
                               Yes, sometimes we regress because the world is overwhelming and we need the emotional reset. But sometimes we regress because we have a free Saturday, the sun is shining, and being a toddler who believes in dinosaurs again (or a very dramatic husky) is simply the most fun way to spend the day. Both reasons are equally legitimate. You don't need a tragic backstory to deserve joy.
                           </InfoBox>
                           
                           <h2 className="text-2xl font-bold text-white mt-10 mb-4">✨ Final Thoughts</h2>
                           <SectionCard icon={<Smile className="text-green-300" />} iconBgColor="bg-green-500/20" iconColor="text-green-300">
                               <p>Whether you're building the world's tallest blanket fort, hoarding all the squeaky toys, or (let's be real) doing both in the same afternoon — you're not "weird." You're not "too old." You're not broken.</p>
                               <p>You're just someone who figured out that crayons, cartoons, zoomies, and ear scratches make the heart happy — and you decided happiness is allowed.</p>
                               <p>So go pour that chocolate milk. Clip on those ears. Stack another blanket on the fort. The dishes will still be there tomorrow. Your joy doesn't have to wait.</p>
                               <p>You've got this. Stay soft, stay silly, stay exactly as you are.</p>
                               <p className="text-center font-bold text-xl mt-8">🧃🐾✨</p>
                               <p className="mt-6 text-gray-400 italic"></p>
                           </SectionCard>
                        </article>
                    </main>
                </div>
            </div>
        </>;
};
export default BlogPostAgeVsPetRegression;