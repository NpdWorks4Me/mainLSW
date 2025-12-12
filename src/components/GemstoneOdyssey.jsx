import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const GemstoneOdyssey = ({ onClose }) => {
  const [gameState, setGameState] = useState('initial');
  const [modal, setModal] = useState({ isOpen: false, title: '', imageUrl: '', logText: '' });
  const storyTextRef = useRef(null);

  const gameStates = {
    'initial': {
      text: "Click to start your adventure...",
      choices: [{ text: "Start Mission", nextState: 'start' }]
    },
    'start': {
      text: "You open your eyes. The world is a swirling kaleidoscope of purple pink and blue. You are <span id='elara-link' class='clickable-link'>Elara</span>, and you are in a cavern of giant, glowing gemstones. Your brother, <span id='leo-link' class='clickable-link'>Leo</span>, is nearby, taking in the sights. You both realize your most precious belongings are gone: your baby doll, and his stuffed bear. A narrow, <span id='map-link' class='clickable-link'>shimmering path</span> beckons you forward.",
      choices: [{ text: "Venture deeper into the unknown", nextState: 'explore' }]
    },
    'explore': {
      text: "The path forks into two. To the left, a trail of beautiful blue opals sparkles. To the right, a series of fiery orange crystals pulsates with a warm glow. The air hums with a magical energy.",
      choices: [
        { text: "Follow the shimmering opals to the left", nextState: 'left_path' },
        { text: "Investigate the pulsing crystals to the right", nextState: 'right_path' }
      ]
    },
    'left_path': {
      text: "You and Leo step onto the shiny opal path. As you walk, the blue gems light up! A trail of light, like a constellation, leads you deeper into the amazing cavern.",
      image: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/dense%20beautiful%20blue%20opals%20sparkles.webp',
      choices: [{ text: "Continue down the path", nextState: 'found_bow' }]
    },
    'right_path': {
      text: "You and Leo choose the crystal path. The orange crystals pulse with a warm, happy glow! A gentle humming sound guides you forward.",
      image: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/fiery%20orange%20crystals%20pulsates%20with%20a%20warm%20glow%20(1).webp',
      choices: [{ text: "Continue down the path", nextState: 'found_button' }]
    },
    'found_bow': {
      text: "You spot a tiny, velvet bow—it's from your doll! The trail of light now feels like a familiar friend.",
      image: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/kawaii%20cartoon%20style%20loose%20blue%20bow%20for%20a%20baby%20doll%20on%20the%20floor%20of%20a%20glowing%20gemstone%20space%20cavern.webp',
      choices: [{ text: "Follow the trail", nextState: 'mid_journey' }]
    },
    'found_button': {
      text: "Near a large, humming crystal, you find a small, worn button. It's from Leo's stuffed bear! The gentle humming now feels like a guiding melody.",
      image: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/kawaii%20cartoon%20style%20worn%20button%20from%20a%20teddy%20bear%20on%20the%20floor%20of%20a%20glowing%20gemstone%20space%20cavern.webp',
      choices: [{ text: "Follow the sound", nextState: 'mid_journey' }]
    },
    'mid_journey': {
      text: "The paths lead you and Leo to a hidden alcove. Inside, you discover a whimsical, glowing telescope! It's made of shiny crystals, and its lens shows distant, magical lights. It seems to show a map to your toys!",
      choices: [{ text: "Look through the telescope", nextState: 'follow_trail' }]
    },
    'follow_trail': {
      text: "Both paths meet in a magnificent, glowing chamber. Right in the middle, safe and sound, are your baby doll and the stuffed bear! You've found them just in time to start exploring this incredible, glowing place.",
      image: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/kawaii%20cartoon%20style%20futuristic%20high%20powered%20telescope.webp',
      choices: [{ text: "Mission complete! The end.", nextState: 'end_game' }]
    },
    'end_game': {
      text: "You and Leo hug your magical toys. A soft, warm light surrounds you, and you feel the familiar pull of home. Your mission is over, and your adventure is just beginning... to be continued.",
      image: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/a%20little%20kawaii%20princess%20doll%20baby%20and%20a%20little%20stuffed%20teddy%20bear%20with%20one%20button%20eye,%20sitting%20together%20in%20a%20glowing,%20space%20cavern%20with%20crystals%20of%20all%20colors%20in%20the%20background.webp',
      choices: [{ text: "Play Again", nextState: 'start' }]
    }
  };

  const showModal = (title, imageUrl, logText = '') => {
    setModal({ isOpen: true, title, imageUrl, logText });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', imageUrl: '', logText: '' });
  };

  const handleChoice = (nextStateId) => {
    const nextState = gameStates[nextStateId];
    if (nextState && nextState.image) {
      let title = 'You found something!';
      if (nextStateId === 'follow_trail') title = 'A New Discovery!';
      if (nextStateId === 'end_game') title = 'Mission Accomplished!';

      showModal(title, nextState.image);
      // Set a timeout to change state after modal is seen
      const timer = setTimeout(() => {
        closeModal();
        setGameState(nextStateId);
      }, 4000); // Show modal for 4 seconds
      return () => clearTimeout(timer);
    } else {
      setGameState(nextStateId);
    }
  };

  useEffect(() => {
    if (gameState === 'start' && storyTextRef.current) {
      const elaraLink = storyTextRef.current.querySelector('#elara-link');
      const leoLink = storyTextRef.current.querySelector('#leo-link');
      const mapLink = storyTextRef.current.querySelector('#map-link');

      const elaraHandler = () => showModal('Elara\'s Space Log', 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/A%20hyper-detailed%20ray-traced%20scene%20of%20a%20cute,%20adorable,%20kawaii%20cartoon%20Asian%20astronaut%20girl%20with%20large,%20expressive%20eyes,%20wearing%20a%20stylized,%20form-fitting%20white%20and%20pink%20spacesuit,%20standing%20at%20the%20illuminated%20entrance%20of%20a%20shimmering%20crystal.webp', '"These gems are so pretty! This must be the most beautiful place in the whole universe. I hope we find my baby doll and Leo\'s bear soon."');
      const leoHandler = () => showModal('Leo\'s Space Log', 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/cute%20adorable%20little%20kawaii%20cartoon%20astronaut%20boy%20sitting%20on%20the%20floor%20of%20a%20glowing%20crystal%20space%20cavern.webp', '"These gems are so shiny! I hope we find my bear soon."');
      const mapHandler = () => showModal('Mission Map Log', 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/a%20narrow,%20obstacle%20ridden%20shimmery%20pathway%20of%20glowing%20gemstones%20in%20a%20space%20cavern.webp', 'This shimmering path is the only way forward. Be careful; the cavern\'s twists and turns can be tricky!');

      if (elaraLink) elaraLink.addEventListener('click', elaraHandler);
      if (leoLink) leoLink.addEventListener('click', leoHandler);
      if (mapLink) mapLink.addEventListener('click', mapHandler);

      return () => {
        if (elaraLink) elaraLink.removeEventListener('click', elaraHandler);
        if (leoLink) leoLink.removeEventListener('click', leoHandler);
        if (mapLink) mapLink.removeEventListener('click', mapHandler);
      };
    }
  }, [gameState]);

  const current = gameStates[gameState];

  return (
    <>
      <style>{`
        .gemstone-odyssey-font-inter { font-family: 'Inter', sans-serif; }
        .gemstone-odyssey-clickable-link { text-decoration: underline; cursor: pointer; color: #fde047; transition: all 0.2s ease-in-out; }
        .gemstone-odyssey-clickable-link:hover { 
            color: #fbbf24;
            text-shadow: 0 0 8px #fde047, 0 0 12px #fbbf24;
        }
      `}</style>
      <div className="fixed inset-0 bg-[#14081c] z-50 flex justify-center items-center p-4" style={{ backgroundImage: "url('https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/space%20cavern%20made%20of%20glowing%20radiant%20crystals%20and%20gemstones,%20high%20saturation,%20high%20resolution.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-50">
          <X size={24} />
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-2xl min-h-[80vh] bg-gradient-to-br from-[rgba(76,5,25,0.8)] to-[rgba(131,24,67,0.8)] border-4 border-purple-300 rounded-3xl p-8 shadow-lg text-center flex flex-col justify-between gemstone-odyssey-font-inter">
          <div>
            <h1 className="text-3xl md:text-5xl my-4 text-pink-300 uppercase">Gemstone Odyssey</h1>
            <p ref={storyTextRef} className="text-2xl leading-relaxed text-purple-200 text-shadow-md" dangerouslySetInnerHTML={{ __html: current.text }}></p>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            {current.choices.map(choice => (
              <button
                key={choice.text}
                onClick={() => handleChoice(choice.nextState)}
                className="w-full py-3 px-5 text-lg font-bold rounded-full bg-yellow-300 text-lime-900 shadow-[0_5px_#a16207] transition-all hover:bg-amber-400 active:translate-y-0.5 active:shadow-[0_3px_#a16207] uppercase gemstone-odyssey-font-inter"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-purple-900 border-4 border-yellow-300 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center relative gemstone-odyssey-font-inter"
            >
              <button onClick={closeModal} className="absolute -top-4 -right-4 bg-yellow-500 text-stone-800 font-bold rounded-full w-9 h-9 flex items-center justify-center border-2 border-yellow-700 text-xl">X</button>
              <h2 className="text-pink-300 text-3xl font-bold mb-4">{modal.title}</h2>
              <img src={modal.imageUrl} alt="Illustration" className="w-full h-auto border-2 border-dashed border-yellow-300 mb-4 rounded-lg" />
              {modal.logText && <p className="mt-4 text-purple-200 text-xl">{modal.logText}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GemstoneOdyssey;