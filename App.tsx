import React, { useState, useEffect } from "react";
import { Button } from "./components/Button";
import { HeartModal } from "./components/HeartModal";
import { OrangePhase, NoButtonPhase } from "./types";

export default function App() {
  const [showHeart, setShowHeart] = useState(false);
  const [orangePhase, setOrangePhase] = useState<OrangePhase>(
    OrangePhase.Initial,
  );
  const [noPhase, setNoPhase] = useState<NoButtonPhase>(NoButtonPhase.Visible);

  // To handle the specific timer animation text overrides
  const [orangeTextOverride, setOrangeTextOverride] = useState<string | null>(
    null,
  );

  // Initial Logic: "Will you 🐝 my valentine?"
  // Green "Yes" -> Heart
  // Red "No" -> Disappears on hover.

  // Orange Logic & Conversation:
  // Phase 0: Button "Let me think about it" (No text above)
  // Phase 1: Text "I'm your husband..." -> Button "I still want to think about it"
  // Phase 2: Timer text above -> Ends with "How about now?" -> Button "Actually, I'm starting to lean towards no."
  // Phase 3: Text ":( ... Okay, I'll bring the no back" -> No button reappears immediately -> Button "Thanks..." -> Disappears

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
    setOrangePhase(OrangePhase.TimerActive);

    const sequence = [
      { text: "Okay, here you go...", delay: 0 },
      { text: "3...", delay: 1500 },
      { text: "2...", delay: 2500 },
      { text: "1...", delay: 3500 },
      { text: "How about now?", delay: 4500 },
    ];

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach(({ text, delay }, index) => {
      const id = setTimeout(() => {
        setOrangeTextOverride(text);
        if (index === sequence.length - 1) {
          setOrangePhase(OrangePhase.LeaningNo);
          setOrangeTextOverride(null); // Clear override to use phase-based message
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
        // Transition to Sad state and bring back No if No is gone
        setOrangePhase(
          noPhase === NoButtonPhase.Hidden
            ? OrangePhase.RestoreNo
            : OrangePhase.Sad,
        );

        setNoPhase(NoButtonPhase.Restored);
        break;
      case OrangePhase.Sad:
      case OrangePhase.RestoreNo:
        // Hide the orange button
        setOrangePhase(OrangePhase.Hidden);
        break;
      default:
        break;
    }
  };

  // Helper to get the conversational message displayed ABOVE the buttons
  const getOrangeMessage = () => {
    if (orangeTextOverride) return orangeTextOverride;

    switch (orangePhase) {
      case OrangePhase.Husband:
        return "I'm your husband. There’s really nothing to think about.";
      case OrangePhase.LeaningNo:
        return "How about now?";
      case OrangePhase.Sad:
        return ":( ...";
      case OrangePhase.RestoreNo:
        return ":( ... Okay, I'll bring the no back....";
      default:
        return null;
    }
  };

  // Helper to get the text INSIDE the Orange button
  const getOrangeButtonText = () => {
    switch (orangePhase) {
      case OrangePhase.Initial:
        return "Let me think about it";
      case OrangePhase.Husband:
        return "I still want to think about it";
      case OrangePhase.TimerActive:
        return "...";
      case OrangePhase.LeaningNo:
        return "Actually, I’m starting to lean towards no.";
      case OrangePhase.Sad:
        return "Sorry...";
      case OrangePhase.RestoreNo:
        return "Thanks";
      default:
        return "Let me think about it";
    }
  };

  const orangeMessage = getOrangeMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce delay-700">
        🐝
      </div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-bounce">
        🐝
      </div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 text-center border border-white/50 fade-in flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl/[5rem] font-pacifico text-pink-600 mb-8 leading-relaxed drop-shadow-sm">
          Farah{" "}
          <span className="inline-block hover:scale-125 transition-transform cursor-default">
            🍯
          </span>
          sah Gaffney<br></br>Will you{" "}
          <span className="inline-block hover:scale-125 transition-transform cursor-default">
            🐝
          </span>{" "}
          my valentine?
        </h1>

        {/* Conversational Text Area - Fixed height to minimize layout shifts or growing naturally */}
        <div
          className={`mb-6 h-16 flex items-end justify-center transition-all duration-300 ${orangeMessage ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-xl text-gray-700 font-semibold italic">
            {orangeMessage || "..."}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:justify-center items-center md:items-stretch w-full">
          {/* YES BUTTON */}
          <div className="w-full md:w-auto flex-1 min-w-[120px]">
            <Button
              variant="green"
              onClick={handleYesClick}
              className="w-full h-full text-lg"
            >
              Yes
            </Button>
          </div>

          {/* NO BUTTON */}
          <div
            className={`w-full md:w-auto flex-1 min-w-[120px] transition-all duration-500 ease-in-out ${
              noPhase === NoButtonPhase.Hidden
                ? "opacity-0 pointer-events-none scale-90"
                : "opacity-100 scale-100"
            }`}
          >
            <Button
              // Restored "No" is green, Original "No" is red
              variant={noPhase === NoButtonPhase.ClickedSike ? "green" : "red"}
              onMouseEnter={handleNoHover}
              onClick={handleNoClick}
              className="w-full h-full text-lg transition-colors duration-300"
            >
              {noPhase === NoButtonPhase.Restored
                ? "No"
                : noPhase === NoButtonPhase.ClickedSike
                  ? "Yes — Sike!"
                  : "No"}
            </Button>
          </div>

          {/* ORANGE BUTTON */}
          {orangePhase !== OrangePhase.Hidden && (
            <div className="w-full md:w-auto flex-[2]">
              <Button
                variant="orange"
                onClick={handleOrangeClick}
                className="w-full h-full text-lg whitespace-pre-line leading-tight"
                disabled={orangePhase === OrangePhase.TimerActive}
              >
                {getOrangeButtonText()}
              </Button>
            </div>
          )}
        </div>
      </div>

      <HeartModal isOpen={showHeart} onClose={() => setShowHeart(false)} />

      <div className="absolute bottom-4 text-pink-400 text-sm font-semibold opacity-60">
        Made with ❤️ for my Valentine
      </div>
    </div>
  );
}
