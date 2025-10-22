import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

export default function Welcome() {
  const navigate = useNavigate();
  const [hasExistingProgress, setHasExistingProgress] = useState(() => {
    return storage.loadProgress() !== null;
  });

  const handleStart = () => {
    // Clear any existing progress if starting fresh
    if (!hasExistingProgress) {
      storage.clearAll();
    }
    navigate('/quiz');
  };

  const handleResume = () => {
    navigate('/quiz');
  };

  const handleStartFresh = () => {
    storage.clearAll();
    setHasExistingProgress(false);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
            Hatarakigai Explorer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            働きがい - The Joy of Work
          </p>
          <p className="text-gray-500 text-lg">
            Discover meaningful work at the intersection of what you love, what you're good at,
            what the world needs, and what you can be paid for.
          </p>
        </div>

        {/* Ikigai Preview Card */}
        <div className="card mb-8 hover:shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Your Journey Awaits
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-3 text-2xl">❤️</span>
                  <span>Explore what brings you joy and passion</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-2xl">⭐</span>
                  <span>Identify your unique talents and strengths</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-2xl">🌍</span>
                  <span>Discover how to make meaningful impact</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-2xl">💼</span>
                  <span>Learn how to create sustainable value</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                {/* Simplified Ikigai circles preview */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-pink-300 rounded-full opacity-60"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-teal-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-24 h-24 bg-yellow-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-24 h-24 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  生き甲斐
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="card mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">What to Expect</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold text-gray-700">20-30 minutes</div>
              <div className="text-sm text-gray-600">Thoughtful exploration</div>
            </div>
            <div>
              <div className="text-3xl mb-2">📝</div>
              <div className="font-semibold text-gray-700">32 questions</div>
              <div className="text-sm text-gray-600">Across 4 dimensions</div>
            </div>
            <div>
              <div className="text-3xl mb-2">💾</div>
              <div className="font-semibold text-gray-700">Auto-saved</div>
              <div className="text-sm text-gray-600">Resume anytime</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {hasExistingProgress ? (
            <>
              <button
                onClick={handleResume}
                className="btn-primary"
              >
                Continue Your Journey
              </button>
              <button
                onClick={handleStartFresh}
                className="btn-secondary"
              >
                Start Fresh
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="btn-primary text-lg"
            >
              Begin Your Discovery
            </button>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          This is a journey of self-discovery, not a test. There are no right or wrong answers.
          Be honest with yourself and enjoy the process.
        </p>
      </div>
    </div>
  );
}
