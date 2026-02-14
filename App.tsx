import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components/Button';
import { HeartModal } from './components/HeartModal';
import { OrangePhase, NoButtonPhase } from './types';

export default function App() {
  const [showHeart, setShowHeart] = useState(false);
  const [orangePhase, setOrangePhase] = useState<OrangePhase>(OrangePhase.Initial);
  const [noPhase, setNoPhase] = useState<NoButtonPhase>(NoButtonPhase.Visible);
  const [timerText, setTimerText] = useState("");
  
  // To handle the specific timer animation text without changing the main phase immediately logic-wise
  // or to support the text update sequence.
  const [orangeTextOverride, setOrangeTextOverride] = useState<string | null>(null);

  // Initial Logic: "Will you 🐝 my valentine?"
  // Green "Yes" -> Heart
  // Red "No" -> Disappears on hover. 
  
  // Orange Logic:
  // 0: "Let me think about it"
  // 1: "I'm your husband..."
  // 2: Timer sequence
  // 3: "Actually I'm starting to lean no"
  // 4: ":(..."
  // 5: "Okay, I'll bring the no back..."

  const handleNoHover = () => {
    if (noPhase === NoButtonPhase.Visible) {
      setNoPhase(NoButtonPhase.Hidden);
    }
  };

  const handleNoClick = () => {
    if (noPhase === NoButtonPhase.Restored) {
      setNoPhase(NoButtonPhase.ClickedSike);
      setShowHeart(true);
    }
  };

  const handleYesClick = () => {
    setShowHeart(true);
  };

  const runTimerSequence = () => {
    // Sequence: "Okay, here you go. 3...2...1... How about you? \n Actually, I'm starting to lean towards no."
    setOrangePhase(OrangePhase.TimerActive);
    
    const sequence = [
      { text: "Okay, here you go...", delay: 0 },
      { text: "3...", delay: 1500 },
      { text: "2...", delay: 2500 },
      { text: "1...", delay: 3500 },
      { text: "How about you?", delay: 4500 },
      { text: "Actually, I’m starting to lean towards no.", delay: 6000 } // Final state text
    ];

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach(({ text, delay }, index) => {
      const id = setTimeout(() => {
        setOrangeTextOverride(text);
        if (index === sequence.length - 1) {
           setOrangePhase(OrangePhase.LeaningNo); // Transition to interactive state
           setOrangeTextOverride(null); // Clear override to use phase-based text
        }
      }, delay);
      timeoutIds.push(id);
    });

    return () => timeoutIds.forEach(clearTimeout);
  };

  const handleOrangeClick = () => {
    switch (orangePhase) {
      case OrangePhase.Initial:
        setOrangePhase(OrangePhase.Husband);
        break;
      case OrangePhase.Husband:
        runTimerSequence();
        break;
      case OrangePhase.LeaningNo:
        // Logic: "If that is clicked, it changes to ':(...'" 
        // AND "If the 'No' has disappeared, change the Orange button to 'Okay, I’ll bring the no back…'"
        if (noPhase === NoButtonPhase.Hidden) {
           setOrangePhase(OrangePhase.RestoreNo);
        } else {
           setOrangePhase(OrangePhase.Sad);
        }
        break;
      case OrangePhase.Sad:
        // If we are sad, but No is hidden, maybe give a chance to restore?
        if (noPhase === NoButtonPhase.Hidden) {
          setOrangePhase(OrangePhase.RestoreNo);
        }
        break;
      case OrangePhase.RestoreNo:
        setNoPhase(NoButtonPhase.Restored);
        setOrangePhase(OrangePhase.Initial); // Reset orange or keep it? 
        // Prompt says: "If the user clicks on 'No' now, it changes to a green 'Yes — Sike!'"
        // It doesn't specify what happens to Orange button after restoring. 
        // Let's reset it to Initial to clean up the UI or disable it. 
        // Let's reset to "Let me think about it" to be safe.
        break;
      default:
        break;
    }
  };

  // Helper to get Orange Button Text
  const getOrangeText = () => {
    if (orangeTextOverride) return orangeTextOverride;

    switch (orangePhase) {
      case OrangePhase.Initial:
        return "Let me think about it";
      case OrangePhase.Husband:
        return (
          <>
            I'm your husband. There’s really nothing to think about.
            <br />
            <span className="text-sm opacity-90 mt-1 block font-normal">I still want to think about it.</span>
          </>
        );
      case OrangePhase.TimerActive:
        return "Okay, here you go..."; // Should be covered by override usually
      case OrangePhase.LeaningNo:
        return (
          <>
            How about you?
            <br />
            Actually, I’m starting to lean towards no.
          </>
        );
      case OrangePhase.Sad:
        return ":(...";
      case OrangePhase.RestoreNo:
        return "Okay, I’ll bring the no back…";
      default:
        return "Let me think about it";
    }
  };

  // Check if we need to update Sad -> Restore dynamically if No disappears while in Sad state
  useEffect(() => {
    if (orangePhase === OrangePhase.Sad && noPhase === NoButtonPhase.Hidden) {
      setOrangePhase(OrangePhase.RestoreNo);
    }
  }, [orangePhase, noPhase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background decoration */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce delay-700">🐝</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-bounce">🐝</div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 text-center border border-white/50 fade-in">
        <h1 className="text-4xl md:text-6xl font-pacifico text-pink-600 mb-12 leading-relaxed drop-shadow-sm">
          Will you <span className="inline-block hover:scale-125 transition-transform cursor-default">🐝</span> my valentine?
        </h1>

        <div className="flex flex-col gap-4 md:flex-row md:justify-center items-center md:items-stretch w-full">
          
          {/* YES BUTTON */}
          <div className="w-full md:w-auto flex-1 min-w-[120px]">
            <Button variant="green" onClick={handleYesClick} className="w-full h-full text-lg">
              Yes
            </Button>
          </div>

          {/* NO BUTTON */}
          <div className={`w-full md:w-auto flex-1 min-w-[120px] transition-all duration-500 ease-in-out ${
            noPhase === NoButtonPhase.Hidden ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
          }`}>
             <Button 
               variant={noPhase === NoButtonPhase.Restored || noPhase === NoButtonPhase.ClickedSike ? "green" : "red"} // Changes to Green if Sike
               onMouseEnter={handleNoHover}
               onClick={handleNoClick}
               className="w-full h-full text-lg transition-colors duration-300"
             >
               {noPhase === NoButtonPhase.Restored ? "No" : 
                noPhase === NoButtonPhase.ClickedSike ? "Yes — Sike!" : "No"}
             </Button>
          </div>

          {/* ORANGE BUTTON */}
          <div className="w-full md:w-auto flex-[2]">
            <Button 
              variant="orange" 
              onClick={handleOrangeClick} 
              className="w-full h-full text-lg whitespace-pre-line leading-tight"
              disabled={orangePhase === OrangePhase.TimerActive}
            >
              {getOrangeText()}
            </Button>
          </div>

        </div>
      </div>

      <HeartModal isOpen={showHeart} onClose={() => setShowHeart(false)} />
      
      <div className="absolute bottom-4 text-pink-400 text-sm font-semibold opacity-60">
        Made with ❤️ for my Valentine
      </div>
    </div>
  );
}