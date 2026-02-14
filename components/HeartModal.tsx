import React from 'react';

interface HeartModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const HeartModal: React.FC<HeartModalProps> = ({ isOpen, onClose, message = "Yay! Happy Valentine's Day! ❤️" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100 relative overflow-hidden">
        {/* Confetti-ish background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 text-4xl text-pink-500">❤️</div>
          <div className="absolute bottom-10 right-10 text-4xl text-red-500">💖</div>
          <div className="absolute top-1/2 left-1/4 text-2xl text-pink-300">💕</div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-8xl mb-6 animate-heartbeat drop-shadow-lg">
            💖
          </div>
          <h2 className="text-3xl font-pacifico text-pink-600 mb-4">
            {message}
          </h2>
          <p className="text-gray-600 mb-8 font-semibold">
            You've made the right choice! 
            <br/>
            (Eventually 😉)
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};