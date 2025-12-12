import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const story = {
    'cover': {
        title: 'The Race Back Home',
        text: 'The sun is setting, and Miles\' curfew is tied to when the streetlights come on. Will Miles make it home from the arcade in time?',
        nextPage: 'start'
    },
    'start': {
        title: 'It\'s Time to Fly!',
        steps: [
            { type: 'continue', text: 'The arcade was a total blast, but now the sun is dipping low and it\'s time to bolt. Miles heads to the change machine for more tokens and notices it\'s getting dark outside. Then he remembers: daylight savings time makes it get dark so fast! Recently, his mom agreed to let him hangout at the arcade inside the neighborhood recreation center each Friday afterschool, but he must get home before the streetlights come on to keep the privelege.' },
            { type: 'choices', text: 'The streetlights are gonna pop on any second, and he can\'t risk getting grounded for life. Jaz adjusts her butterfly clips and nods. "Let\'s dip out! What\'s our move?"', choices: [
                { text: 'Take the shortcut through the spooky alley.', nextPage: 'shortcut' },
                { text: 'Take the main road, even though it\'s longer.', nextPage: 'mainRoad' },
                { text: 'Find a payphone to call your parents.', nextPage: 'payphoneCall' }
            ]}
        ]
    },
    'shortcut': {
        title: 'The Shortcut',
        steps: [
            { type: 'continue', text: 'You and Jaz make a break for it, turning down a narrow alley. A spooky dog 🐕 barks, and a black cat 🐈‍⬛ hisses. It\'s a little freaky, but you know it’s the quickest way home. As you round the last corner, you see it—a shortcut through a fence that leads right to your street.' },
            { type: 'choices', text: 'But the fence has a hole, and it looks like a tight squeeze. "I think we can make it!" Jaz whispers.', choices: [
                { text: 'Squeeze through the hole in the fence.', nextPage: 'tunnelSurprise' },
                { text: 'Go back and take the main road, being honest about why you\'re late.', nextPage: 'honesty' },
                { text: 'Check out the weird, glowing object on the ground.', nextPage: 'glowingObject' }
            ]}
        ]
    },
    'mainRoad': {
        title: 'The Main Drag',
        steps: [
            { type: 'continue', text: 'You decide against the spooky alley and stick to the main road. The streetlights flick on one by one, their neon glow making everything look trippy. You know you\'re going to be late, but at least you\'re not getting into more trouble.' },
            { type: 'choices', text: 'As you walk, a grown-up from the rec center, a cool dude with frosted tips, pulls up in his ride. "Hey guys, need a lift?" he asks. Do you get in?', choices: [
                { text: 'Accept the ride to get home faster.', nextPage: 'getRide' },
                { text: 'Politely decline and walk the rest of the way.', nextPage: 'walkHome' },
                { text: 'Go buy that rare, sparkly soda you just saw at the corner store.', nextPage: 'vendingMachine' }
            ]}
        ]
    },
    'getRide': {
        title: 'Cruisin\' Home',
        steps: [
            { type: 'continue', text: 'You hop in the car, and the dude from the rec center cranks up a killer boy-band song. You jam out, feeling like total V.I.P.s. He drops you off right in front of your house, and you sprint inside just as your mom is about to call.' },
            { type: 'choices', text: 'You\'re not grounded, but you didn\'t quite get home on your own. You feel a little weird about taking the easy way out.', choices: [
                { text: 'Talk about it with your parents.', nextPage: 'confessRide' },
                { text: 'Keep it a secret and just be glad you\'re not grounded.', nextPage: 'secret' },
                { text: 'Tell him to drop you off a few blocks away and walk the rest.', nextPage: 'splitRide' }
            ]}
        ]
    },
    'walkHome': {
        title: 'The Long Walk Home',
        steps: [
            { type: 'continue', text: 'You and Jaz wave goodbye to the dude from the rec center and keep walking. You pass by other kids who are already home and safe, and you feel the shame sink in. You know you\'re going to be in trouble, but you also know that you made a promise to walk home. You have to be honest and tell the truth.' },
            { type: 'choices', text: 'Your walk home is long and quiet, but you know you made the right decision. What happens when you get home?', choices: [
                { text: 'Tell the truth and face the consequences.', nextPage: 'faceConsequences' }
            ]}
        ]
    },
    'honesty': {
        title: 'Honesty is the Best Policy',
        steps: [
            { type: 'continue', text: 'You decide the fence is too risky, and you turn back to the main road. You are going to be late, but you know it\'s the right thing to do. You get home just as the last streetlight clicks on, and your parents are waiting for you at the door.' },
            { type: 'choices', text: 'You explain everything, from the arcade to the shortcut, and you are ready for your punishment. Your parents listen patiently and then give you a big hug. "Thank you for being honest," your dad says. "That\'s more important than anything." You still have to do some chores, but you feel good about yourself.', choices: [
                { text: 'Start a new adventure!', nextPage: 'start' }
            ]}
        ]
    },
    'faceConsequences': {
        title: 'Facing the Music',
        steps: [
            { type: 'continue', text: 'You get home and your parents are waiting. You tell them everything that happened—losing track of time, the reason for your lateness, and what you did on the way. You\'re ready for a lecture, but your mom looks at you with a soft smile.' },
            { type: 'choices', text: '"It takes a lot of guts to admit when you\'ve messed up," she says. You still have to do a few extra chores to make up for it, but you know you did the right thing, and that feels better than anything. Your integrity is intact!', choices: [
                { text: 'Start a new adventure!', nextPage: 'start' }
            ]}
        ]
    },
    'confessRide': {
        title: 'Telling the Truth',
        steps: [
            { type: 'continue', text: 'You decide to tell your parents about the ride, even though it could get you in trouble. You sit them down and explain that you got a ride home from the dude at the rec center to beat the streetlights.' },
            { type: 'choices', text: 'They are a little mad at first, but they listen to you, and they appreciate your honesty. Your dad says, "It\'s a lot better to own up to your mistakes than to hide them." You still have to do some chores, but you feel better knowing you told the truth.', choices: [
                { text: 'Start a new adventure!', nextPage: 'start' }
            ]}
        ]
    },
    'secret': {
        title: 'Keeping a Secret',
        steps: [
            { type: 'continue', text: 'You decide to keep the ride a secret. You act super chill when you walk in the door and tell your parents you just made it in time. They don\'t suspect a thing, and you feel a little sneaky, but you\'re not grounded.' },
            { type: 'choices', text: 'The next day, you find out that another kid from the rec center, who was also walking home, got grounded for being out after the streetlights came on. You feel guilty, and you know you made the wrong choice, but you\'re not sure how to fix it.', choices: [
                { text: 'Try to fix your mistake by talking to your parents.', nextPage: 'faceMusicAfterSecret' }
            ]}
        ]
    },
    'faceMusicAfterSecret': {
        title: 'The Weight of the Truth',
        steps: [
            { type: 'continue', text: 'You sit your parents down, and the words spill out: the ride, the lie, the guilt. They are disappointed but also proud that you came to them. "The truth is always better," your mom says. "Even when it\'s hard."' },
            { type: 'choices', text: 'You are grounded for a week, but you feel a huge weight off your shoulders. You learned that secrets can feel heavy, and honesty is the best way to live a good life.', choices: [
                { text: 'Start a new adventure!', nextPage: 'start' }
            ]}
        ]
    },
    'tunnelSurprise': {
        title: 'Tangled in the Fence!',
        steps: [
            { type: 'continue', text: 'You and Jaz squeeze through the hole in the fence, but your backpack gets caught! You tug and pull, but it\'s not budging. The streetlights start to buzz and pop on all around you. You are officially busted!' },
            { type: 'choices', text: 'You manage to free your bag, but now you\'re way late, and you have to face your parents. This is not the way you wanted this adventure to end.', choices: [
                { text: 'Go home and face your parents.', nextPage: 'faceConsequences' }
            ]}
        ]
    },
    'payphoneCall': {
        title: 'The Payphone',
        steps: [
            { type: 'continue', text: 'You race to the corner store with the vintage payphone. You jiggle the receiver, but the line is dead. "This thing is so old-school!" Jaz says.' },
            { type: 'choices', text: 'You are out of options. The streetlights are about to come on, and you are far from home. You have to make a tough call. Do you try to find another way home, or do you accept that you\'re going to be late?', choices: [
                { text: 'Try to find a way to make the payphone work.', nextPage: 'phoneFix' },
                { text: 'Walk home and face the music.', nextPage: 'walkHome' }
            ]}
        ]
    },
    'phoneFix': {
        title: 'The Old Trick',
        steps: [
            { type: 'continue', text: 'Jaz, in a moment of genius, pulls out a tiny, silver butterfly clip and starts fiddling with the coin slot. "My dad taught me this trick!" she says. With a final pop, a coin drops out, and the dial tone hums to life.' },
            { type: 'choices', text: 'You quickly dial your home number, but your parents don\'t pick up. You just wasted precious time, and now you have to run!', choices: [
                { text: 'Run home as fast as you can.', nextPage: 'walkHome' }
            ]}
        ]
    },
    'glowingObject': {
        title: 'A Shiny Distraction',
        steps: [
            { type: 'continue', text: 'You lean down to pick up the glowing object, a small, disc-shaped thing that looks like a CD. It has a glittery, holographic sticker on it that says, "Cyber Mix Vol. 1." Jaz gasps. "Dude, this is a limited edition! We have to listen to it!"' },
            { type: 'choices', text: 'You know you\'re late, but the temptation is real. Do you take a moment to listen to the new tunes, or do you leave it behind and keep running?', choices: [
                { text: 'Take a listen.', nextPage: 'tunes' },
                { text: 'Leave it behind and run.', nextPage: 'walkHome' }
            ]}
        ]
    },
    'tunes': {
        title: 'Groovin\' on the Street',
        steps: [
            { type: 'continue', text: 'You and Jaz find a portable CD player and pop in the CD. The beats are awesome, and you can\'t help but dance a little. You are so lost in the music that you don\'t even notice the streetlights turning on.' },
            { type: 'choices', text: 'By the time you get home, you\'re way past curfew, and your parents are furious. They are not happy, but you got to listen to some sweet tunes, and you learned a valuable lesson about prioritizing responsibilities over fun. How do you cope with the consequences?', choices: [
                { text: 'Take responsibility for your actions.', nextPage: 'faceConsequences' }
            ]}
        ]
    },
    'vendingMachine': {
        title: 'The Rare Soda',
        steps: [
            { type: 'continue', text: 'You race over to the vending machine, your eyes locked on the rare, glittery "Cosmo Cola." Jaz tries to talk you out of it, but you are a man on a mission. You put in your coins, but the machine jams! You shake it and bang on it, but the soda is stuck.' },
            { type: 'choices', text: 'The streetlights start to buzz on, and you are so mad! You have to leave without the soda, and now you are late for no reason. How do you feel?', choices: [
                { text: 'Feel disappointed and accept the situation.', nextPage: 'disappointed' }
            ]}
        ]
    },
    'disappointed': {
        title: 'Bummer, Dude!',
        steps: [
            { type: 'continue', text: 'You get home, frustrated and empty-handed. Your parents are mad, but you explain the whole vending machine ordeal. They are not happy with your choices, and you are grounded for a week.' },
            { type: 'choices', text: 'But you feel a sense of clarity. You learned that sometimes you make bad choices, and you have to accept the consequences. It\'s not a fun lesson, but it\'s an important one.', choices: [
                { text: 'Start a new adventure!', nextPage: 'start' }
            ]}
        ]
    },
    'splitRide': {
        title: 'A Calculated Risk',
        steps: [
            { type: 'continue', text: 'You tell the dude to drop you off a few blocks from home. You feel a little sneaky, but you want to avoid getting caught for taking a ride.' },
            { type: 'choices', text: 'You run the last few blocks, and you get home just as your parents are walking outside to look for you. They are relieved, and you tell them you just made it in time. You feel a little bad about not telling them the truth, but at least you\'re not grounded.', choices: [
                { text: 'Go with the secret and accept your bad choice.', nextPage: 'secret' }
            ]}
        ]
    }
};

const TechAdventure = ({ onClose }) => {
  const [pageKey, setPageKey] = useState('cover');
  const [stepIndex, setStepIndex] = useState(0);

  const renderPage = (key, step = 0) => {
    setPageKey(key);
    setStepIndex(step);
  };

  const currentPage = story[pageKey];
  const currentStep = currentPage?.steps ? currentPage.steps[stepIndex] : null;

  const handleNext = () => {
    if (pageKey === 'cover') {
      renderPage(currentPage.nextPage);
    } else if (currentStep) {
      if (currentStep.type === 'continue') {
        if (stepIndex < currentPage.steps.length - 1) {
          renderPage(pageKey, stepIndex + 1);
        } else {
          // End of story or transition to another page
        }
      }
    }
  };

  const handleChoice = (nextPage) => {
    renderPage(nextPage);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .font-vt323 { font-family: 'VT323', monospace; }
        .y2k-button {
          background: #00ffff;
          color: #000;
          border: 2px solid #000;
          text-shadow: 1px 1px #ff00ff;
          box-shadow: 4px 4px 0px #ff00ff;
          transition: all 0.1s ease-in-out;
        }
        .y2k-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #ff00ff;
        }
        .y2k-button:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px #ff00ff;
        }
      `}</style>
      <div 
        className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-[#1a1a2e] bg-cover bg-center"
        style={{ backgroundImage: "url('https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/an%20anime%20style%20cartoon%20version%20of%20a%20city%20street%20in%20a%20neighboorhood%20with%20apartments%20and%20homes,%20unlit%20streetlights%20lining%20the%20sidewalk,%20not%20yet%20ready%20to%20turn%20on,%20with%20dusk%20approaching%20on%20the%20horizon.webp')" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-50">
          <X size={24} />
        </button>
        
        <motion.main
          id="app"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl p-8 rounded-2xl shadow-xl border border-solid border-white/20"
          style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pageKey + stepIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {currentStep ? currentPage.title : currentPage.title}
              </h1>
              <p className="text-white text-lg mb-8" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                {currentStep ? currentStep.text : currentPage.text}
              </p>
              <div className="flex flex-col items-center gap-4">
                {pageKey === 'cover' && (
                  <button onClick={handleNext} className="y2k-button font-vt323 text-2xl px-8 py-2 rounded-md">
                    Start
                  </button>
                )}
                {currentStep?.type === 'continue' && (
                  <button onClick={handleNext} className="y2k-button font-vt323 text-2xl px-8 py-2 rounded-md">
                    Continue
                  </button>
                )}
                {currentStep?.type === 'choices' && currentStep.choices.map((choice, index) => (
                  <button key={index} onClick={() => handleChoice(choice.nextPage)} className="y2k-button font-vt323 text-2xl px-8 py-2 rounded-md w-full max-w-xs">
                    {choice.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </>
  );
};

export default TechAdventure;