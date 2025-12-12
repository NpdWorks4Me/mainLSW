import React, { useState, useCallback } from 'react';
import { Sparkles, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const quizData = [
  {
    question: "When you feel the need for comfort, what is the main hard feeling you want to stop or escape from?",
    options: [
      { text: "A. I want a break from all the grown-up jobs and rules I have to follow.", weights: { r: 3 }, u_r: "This isn’t laziness — it’s parentified child recovery. Many regressors were forced into emotional or practical adulthood too early. Your nervous system is intelligently rebelling against decades of forced hyper-independence." },
      { text: "B. I feel a wave of worry, stress, or very strong feelings that feel too big to handle right now.", weights: { t: 3 }, u_r: "This is classic emotional flooding. Your comfort space functions as an external nervous-system regulator when the prefrontal cortex goes offline — exactly what secure attachment figures are supposed to do for children." },
      { text: "C. My brain feels full or tired because of too much noise, too many lights, or too many confusing choices.", weights: { c: 3 }, u_r: "This points to sensory-processing sensitivity or neurodivergence (common in ADHD/autistic regressors). Your comfort space is a deliberate sensory deprivation chamber that lowers arousal to a tolerable baseline." },
      { text: "D. A sudden, strong feeling or memory popped up that reminds me of an old, painful time.", weights: { t: 3 }, u_r: "This is a trauma trigger response. Regression here is an embodied flashback intervention — your younger parts are stepping forward to protect the adult self from re-experiencing the full intensity of the original wound." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "High dissociation or emotional amnesia is itself a trauma response. Not knowing the ‘why’ often means the mind is still keeping the original pain at a safe distance — that’s protective intelligence, not failure." }
    ]
  },
  {
    question: "When you are in your comfort space, how does it mostly feel?",
    options: [
      { text: "A. It feels fun, light, and full of play, like I can be silly and creative.", weights: { r: 3 }, u_r: "This is restorative play — the exact developmental stage many high-achieving or parentified regressors were forced to skip. Your brain is catching up on missed joy-based neuroplasticity." },
      { text: "B. It's a safe place to let out sad feelings, like crying or feeling grief about the past.", weights: { t: 3 }, u_r: "This is somatic emotional processing. The regressed state lowers psychological defenses, allowing previously dissociated grief to surface in a container that feels safe enough to tolerate it." },
      { text: "C. It feels peaceful, calm, and simple.", weights: { c: 3 }, u_r: "You’re achieving a state of low cognitive load that most neurotypical people take for granted. For brains with executive-function differences, this simplicity is medicine, not indulgence." },
      { text: "D. Sometimes it feels like I am watching myself and can't quite control it.", weights: { t: 3 }, u_r: "This is structural dissociation in action — a younger part has taken executive control to protect the adult self from overwhelm. It’s not ‘losing time,’ it’s an incredibly sophisticated survival strategy." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Alexithymia (difficulty identifying feelings) is extremely common in chronic trauma and neurodivergence. Your comfort space may be working perfectly even if you can’t yet name what it’s fixing." }
    ]
  },
  {
    question: "What is the most important good feeling you want to have when you are in your comfort space?",
    options: [
      { text: "A. Feeling completely protected and physically safe from any danger or harm.", weights: { t: 3 }, u_r: "This is the repair of an insecure or disorganized attachment template. Your body is attempting to create the felt sense of safety that was inconsistently or never provided in early life." },
      { text: "B. Feeling accepted, understood, and cared for no matter what.", weights: { t: 3 }, u_r: "You’re seeking earned secure attachment in real time. The regressed state allows you to receive the unconditional positive regard that rewires old ‘I am unlovable’ neural pathways." },
      { text: "C. Feeling light, happy, and confident, without grown-up worries.", weights: { r: 3 }, u_r: "This is reclaiming the ‘childhood schema’ of inherent worthiness. Many perfectionists regress specifically to access the version of themselves that existed before shame-based over-achievement took over." },
      { text: "D. Feeling that everything is ordered, predictable, and simple.", weights: { c: 3 }, u_r: "Predictability = safety for neurodivergent nervous systems. Your comfort space is creating the reliable structure that chaotic early environments or sensory differences made impossible." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "When core needs were chronically unmet, the mind often deletes the memory of wanting them — it hurts less that way. Not knowing what you need is a common aftermath of neglect." }
    ]
  },
  {
    question: "How important are special comfort items (blanket, stuffie, paci, etc.)?",
    options: [
      { text: "A. Super important — they feel like a real anchor.", weights: { t: 3 }, u_r: "These are transitional objects in the purest Winnicottian sense — they hold the soothing presence of an attuned caregiver when no human was reliably available. They literally become co-regulators." },
      { text: "B. Nice to have — they help me get playful.", weights: { r: 2 }, u_r: "They act as ‘play cues’ that rapidly shift your psyche into a lower-stress developmental mode — think of them as psychological ‘off-switches’ for adult responsibility." },
      { text: "C. I use them for sensory reasons (texture, weight, etc.).", weights: { c: 2 }, u_r: "This is sensory self-regulation via proprioceptive and tactile input. Weighted items especially activate the parasympathetic response in ways similar to deep-pressure therapy used in occupational therapy." },
      { text: "D. I don't really need them.", weights: { c: 1, r: 1 }, u_r: "Purely internal regulation is possible but rare — it usually indicates either very mild regression or significant practice at mental state-shifting without props." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Many people only discover the power of comfort objects after trying them as adults. Early environments that shamed ‘babyish’ things can suppress this need until later." }
    ]
  },
  {
    question: "As a grown-up, which way of dealing with tough relationship feelings sounds most like you?",
    options: [
      { text: "A. I pull away and try to handle everything alone.", weights: { r: 2 }, u_r: "Classic avoidant/dismissive attachment strategy born from early messages that needing others = burden. Regression becomes a safe way to need without risking rejection." },
      { text: "B. I get very worried people will leave me.", weights: { t: 3 }, u_r: "Anxious-preoccupied attachment pattern. Your comfort space provides the consistent availability that was missing, reducing clinging behaviors in real relationships over time." },
      { text: "C. My feelings go up and down quickly — close, then scared.", weights: { t: 3 }, u_r: "This is the hallmark of disorganized attachment (often from early trauma). Regression creates a predictable internal ‘caregiver’ when external ones were frightening." },
      { text: "D. I don't usually look for other people in comfort space.", weights: { c: 1, r: 1 }, u_r: "Solo comfort often correlates with either high self-regulation capacity or early experiences where relationships felt more dangerous than helpful." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Attachment patterns can be confusing when trauma and neurodivergence overlap — many regressors have mixed styles that don’t fit neatly into the four categories." }
    ]
  },
  {
    question: "When you think about your childhood, which difficulty stands out most?",
    options: [
      { text: "A. Too much pressure to be perfect and act grown-up too early.", weights: { r: 3 }, u_r: "Parentification or ‘gifted kid’ syndrome. Your regression is reparative play — giving yourself the childhood you had to sacrifice for adult approval." },
      { text: "B. Not enough emotional support or safety.", weights: { t: 3 }, u_r: "Classic developmental trauma. Your comfort space is re-parenting work in its most literal form." },
      { text: "C. Social rules, organization, or sensory differences were hard.", weights: { c: 3 }, u_r: "Likely undiagnosed or late-diagnosed neurodivergence. Regression lowers the cognitive and social demands that were chronically overwhelming." },
      { text: "D. I know bad things happened, but memories feel distant.", weights: { t: 3 }, u_r: "This is dissociative amnesia — a protective mechanism. Regression often happens precisely because the body remembers what the mind has hidden." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Memory suppression is extremely common in complex trauma. Many people only piece together their history years into healing." }
    ]
  },
  {
    question: "How do you feel about the way you use comfort in your life?",
    options: [
      { text: "A. It's a tool to heal the sad or hurt 'little me' inside.", weights: { t: 3 }, u_r: "This is textbook Internal Family Systems (IFS) language. You’re already doing parts work intuitively — regression is the bridge to Self-led healing." },
      { text: "B. It's a needed escape from stress and hard things.", weights: { r: 3 }, u_r: "This is adaptive coping, not avoidance. Chronic stress without recovery periods leads to burnout; scheduled regression is intelligent prevention." },
      { text: "C. It's a practical way to calm big feelings and my senses.", weights: { c: 3 }, u_r: "You’ve turned a neurobiological vulnerability into a superpower: deliberate down-regulation of an overactive stress response system." },
      { text: "D. It's a fun way to express myself and connect with others.", weights: { r: 2 }, u_r: "Community-based regression reduces shame through co-regulation and mirror neurons — seeing others do it safely makes your nervous system believe it’s allowed to as well." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Ambivalence is normal when society pathologizes comfort needs. Your body knows it’s helpful even when your mind hasn’t caught up yet." }
    ]
  },
  {
    question: "Which missing need from childhood does your comfort seem to fix the most?",
    options: [
      { text: "A. I missed having my feelings noticed and loved.", weights: { t: 3 }, u_r: "Emotional attunement deficit. Regression recreates the mirroring that builds emotional literacy and self-worth." },
      { text: "B. I missed feeling safe and in control.", weights: { t: 3 }, u_r: "Safety was inconsistent or absent. Your comfort space is building an internal secure base — the foundation of all future resilience." },
      { text: "C. I missed time to just play and have fun.", weights: { r: 3 }, u_r: "Joy was treated as non-essential. Reclaiming play is reclaiming your inherent right to pleasure and spontaneity." },
      { text: "D. I missed clear, easy rules and structure.", weights: { c: 3 }, u_r: "Unpredictable environments wire the brain for hypervigilance. Regression creates the reliable container your developing brain needed." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "When needs went chronically unmet, the mind often erases the longing to protect itself from pain. Not knowing is data, not deficit." }
    ]
  },
  {
    question: "How does your brain handle planning and anticipating what might go wrong?",
    options: [
      { text: "A. It makes my brain feel super tired or overwhelmed.", weights: { c: 3 }, u_r: "Executive function overload — common in ADHD, autism, and trauma. Regression bypasses the prefrontal cortex and lets older, more efficient brain systems take over." },
      { text: "B. I start feeling mean to myself, judging how good I am.", weights: { r: 3 }, u_r: "Perfectionism as trauma response. Regression interrupts the shame spiral by accessing pre-shame parts of self." },
      { text: "C. I cope by distracting quickly (substances, avoidance).", weights: { t: 3 }, u_r: "This is the addiction loop trauma survivors know too well. Regression offers a non-destructive alternative that still achieves emotional escape." },
      { text: "D. I mostly feel okay, but complex tasks are hard.", weights: { c: 2, r: 1 }, u_r: "Working memory or processing speed differences. Your comfort space reduces cognitive demand so the brain can function within its optimal zone." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Difficulty with future-oriented thinking is a hallmark of both trauma freeze states and certain neurotypes. Your regression may be the workaround your brain invented." }
    ]
  },
  {
    question: "How important is it that your comfort space is quiet, predictable, and simple?",
    options: [
      { text: "A. Essential — changes make it hard to feel safe.", weights: { c: 3 }, u_r: "This is a hallmark of complex PTSD or sensory processing disorder. Predictability literally lowers cortisol and allows the amygdala to stand down." },
      { text: "B. Helpful, but I can adjust.", weights: { c: 1, r: 2 }, u_r: "Moderate need for structure — common in ADHD where routines help but rigidity feels trapping." },
      { text: "C. Not necessary — comfort is about what I think and feel inside.", weights: { r: 3 }, u_r: "Your regression is primarily emotional/attachment focused rather than sensory. The internal state shift matters more than external conditions." },
      { text: "D. I look for active fun and creativity instead.", weights: { r: 3 }, u_r: "Dopamine-seeking regression — common in burnout recovery. Novelty and play are the medicine, not stillness." },
      { text: "E. Not Sure / Still Learning", weights: { u: 1 }, u_r: "Many people only realize how much sensory chaos affects them after experiencing true regulation for the first time." }
    ]
  }
];

const resultTexts = {
  t: { title: "The Inner Protector (Healing)", color: "text-fuchsia-400", border: "border-fuchsia-500", bg: "bg-fuchsia-900/20" },
  r: { title: "The Stress Breaker (Rest)", color: "text-cyan-400", border: "border-cyan-500", bg: "bg-cyan-900/20" },
  c: { title: "The Quiet Organizer (Calmness)", color: "text-yellow-400", border: "border-yellow-500", bg: "bg-yellow-900/20" }
};

const ComfortFunctionsQuiz = () => {
  const [gameState, setGameState] = useState('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ t: 0, r: 0, c: 0, u: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const progress = gameState === 'playing' ? ((currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)) / quizData.length) * 100 : 0;

  const handleStart = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setGameState('playing');
      setCurrentQuestionIndex(0);
      setIsFlipping(false);
    }, 300);
  };

  const handleAnswer = (option, index) => {
    if (selectedAnswer !== null) return;
    const newScores = { ...scores };
    newScores.t += option.weights.t || 0;
    newScores.r += option.weights.r || 0;
    newScores.c += option.weights.c || 0;
    newScores.u += option.weights.u || 0;
    setScores(newScores);
    setSelectedAnswer(index);

    // Correctly accessing u_r from the option object, not option.weights
    let feedbackText = option.u_r || '';
    if (option.weights.u === 1) {
      feedbackText = `<span class="font-extrabold text-fuchsia-400">If you felt 'Not Sure':</span> ${feedbackText}`;
    } else {
      feedbackText = `<span class="font-extrabold text-cyan-400">A little insight:</span> ${feedbackText}`;
    }
    setFeedback(feedbackText);
  };

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setFeedback('');
      } else {
        setGameState('results');
      }
      setIsFlipping(false);
    }, 300);
  };

  const getPrimaryResult = useCallback(() => {
    const ordered = [
      { key: 't', score: scores.t },
      { key: 'r', score: scores.r },
      { key: 'c', score: scores.c }
    ];
    return ordered.reduce((a, b) => (b.score > a.score ? b : a));
  }, [scores]);

  const resetQuiz = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setGameState('welcome');
      setCurrentQuestionIndex(0);
      setScores({ t: 0, r: 0, c: 0, u: 0 });
      setSelectedAnswer(null);
      setFeedback('');
      setIsFlipping(false);
    }, 300);
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .pixel-font { font-family: 'VT323', monospace; }
        .quiz-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          border: 2px solid;
          border-image: linear-gradient(45deg, #ff00ff, #00ffff) 1;
          box-shadow: 0 0 15px rgba(255,0,255,0.4), 0 0 15px rgba(0,255,255,0.4);
        }
        .option-button {
          transition: all 0.2s ease-out;
          background: #1e3a8a;
          color: #e0f2fe;
          border: 2px solid #00ffff;
          text-shadow: 1px 1px #ff00ff;
          box-shadow: 4px 4px 0px #ff00ff;
        }
        .option-button:hover:not(.selected):not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 6px 6px 0px #ff00ff;
          background: #00ffff;
          color: #0c0b2c;
        }
        .option-button.selected {
          background: #ff00ff;
          color: #0c0b2c;
          border-color: #00ffff;
          box-shadow: 0 0 10px rgba(255,255,255,0.9), 4px 4px 0px #00ffff;
        }
        .progress-bar {
          height: 12px;
          background: linear-gradient(90deg, #ff00ff, #00ffff);
          transition: width 0.6s ease-in-out;
          border-radius: 9999px;
          box-shadow: 0 0 8px rgba(255,0,255,0.6), 0 0 8px rgba(0,255,255,0.6);
        }
        .flip-out { animation: flipOut 0.6s forwards; }
        .flip-in { animation: flipIn 0.6s forwards; }
        @keyframes flipOut { from { transform: rotateY(0); opacity: 1; } to { transform: rotateY(180deg); opacity: 0; } }
        @keyframes flipIn { from { transform: rotateY(-180deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-4 bg-transparent z-50">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>

          {/* Exit Button */}
          {gameState === 'playing' && (
            <div className="fixed top-6 right-4 z-50">
              <Link to="/quizzes">
                <button className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white rounded-full backdrop-blur-sm border border-white/10 transition-all text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exit Quiz</span>
                </button>
              </Link>
            </div>
          )}

          {/* Welcome */}
          {gameState === 'welcome' && (
            <div className={`quiz-card p-12 text-center space-y-8 ${isFlipping ? 'flip-out' : 'flip-in'}`}>
              <h1 className="pixel-font text-5xl md:text-6xl font-extrabold text-white">
                <span className="text-cyan-400">Comfort Function</span> Quiz
              </h1>
              <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                A gentle, trauma-informed journey to understand <span className="font-bold text-yellow-300">why</span> your comfort space exists — and why it’s beautiful.
              </p>
              <button onClick={handleStart} className="option-button text-xl py-4 px-10 rounded-full font-bold hover:scale-105 transition">
                Begin Your Journey
              </button>
            </div>
          )}

          {/* Questions */}
          {gameState === 'playing' && (
            <div className={`quiz-card p-8 md:p-12 space-y-8 ${isFlipping ? 'flip-out' : 'flip-in'}`}>
              <div className="text-cyan-400 pixel-font text-xl font-bold">
                Question {currentQuestionIndex + 1} of {quizData.length}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{quizData[currentQuestionIndex].question}</h2>
              <div className="space-y-4">
                {quizData[currentQuestionIndex].options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const displayText = opt.text.includes("Not Sure") ? "Not Sure / Still Learning" : opt.text.slice(3); // Adjusted slice to account for "A. " format
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt, i)}
                      disabled={selectedAnswer !== null}
                      className={`option-button w-full text-left py-4 px-6 rounded-xl text-lg
                        ${selectedAnswer === i ? 'selected' : ''}
                        ${selectedAnswer !== null && selectedAnswer !== i ? 'opacity-30' : ''}
                      `}
                    >
                      <span className="font-bold mr-3">{letter}.</span> {displayText}
                    </button>
                  );
                })}
              </div>
              {feedback && (
                <div className="p-5 rounded-xl bg-black/30 border border-purple-400 text-gray-200 text-left" dangerouslySetInnerHTML={{ __html: feedback }} />
              )}
              {selectedAnswer !== null && (
                <div className="text-center">
                  <button onClick={handleNext} className="option-button text-xl py-4 px-10 rounded-full font-bold hover:scale-105 transition">
                    {currentQuestionIndex === quizData.length - 1 ? 'See My Result' : 'Next Question'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {gameState === 'results' && (
            <div className={`quiz-card p-12 text-center space-y-10 ${isFlipping ? 'flip-out' : 'flip-in'}`}>
              <h2 className="pixel-font text-5xl font-extrabold text-white">Your Comfort Function</h2>

              {scores.u >= 4 && (
                <div className="p-6 rounded-2xl border-4 border-fuchsia-400 bg-fuchsia-900/40">
                  <h3 className="text-2xl font-bold text-fuchsia-300">High "Not Sure" Answers ({scores.u})</h3>
                  <p className="text-gray-200 mt-3">Choosing "Not Sure" many times is often a protective response. Clarity comes with time and kindness.</p>
                </div>
              )}

              {(() => {
                const primary = getPrimaryResult();
                const result = resultTexts[primary.key];
                return (
                  <div className={`p-8 rounded-2xl border-4 ${result.border} ${result.bg}`}>
                    <h3 className={`text-4xl font-extrabold ${result.color}`}>{result.title}</h3>
                    <p className="mt-6 text-xl text-gray-200">
                      {primary.key === 't' && "Your comfort is primarily driven by a need for safety and gentle healing."}
                      {primary.key === 'r' && "Your comfort is primarily about getting a break and finding fun."}
                      {primary.key === 'c' && "Your comfort is primarily motivated by the need for calmness and structure."}
                    </p>
                  </div>
                );
              })()}

              <div className="flex flex-col gap-4">
                <button onClick={resetQuiz} className="option-button text-xl py-4 px-10 rounded-full font-bold">
                  Take Again
                </button>
                <button onClick={() => setShowModal(true)} className="text-yellow-300 hover:text-white text-lg font-bold underline">
                  What are the Comfort Types?
                </button>
                 <Link to="/quizzes" className="text-cyan-300 hover:text-white text-lg font-bold mt-4 block">
                    Back to Quizzes Menu
                 </Link>
              </div>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
              <div className="quiz-card p-10 max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white hover:text-fuchsia-400">
                  <X className="w-8 h-8" />
                </button>
                <h2 className="pixel-font text-4xl font-bold text-fuchsia-400 mb-8 text-center">Comfort Types Guide</h2>
                <div className="space-y-8 text-gray-300 text-left">
                  <div>
                    <h3 className="text-2xl font-bold text-fuchsia-400">Inner Protector (Healing)</h3>
                    <p className="mt-2">Used for healing old emotional wounds and finding the safety that was missing.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-400">Stress Breaker (Rest)</h3>
                    <p className="mt-2">Used for escaping grown-up pressure and reclaiming joy, play, and lightness.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-400">Quiet Organizer (Calmness)</h3>
                    <p className="mt-2">Used for calming sensory overload and making the world simple and predictable.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComfortFunctionsQuiz;