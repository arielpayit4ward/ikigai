import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IkigaiResults } from '../types';
import { storage } from '../utils/storage';
import IkigaiVisualization from '../components/IkigaiVisualization';
import CareerCard from '../components/CareerCard';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState<IkigaiResults | null>(null);
  const [showShareMessage, setShowShareMessage] = useState(false);

  useEffect(() => {
    const loadedResults = storage.loadResults();
    if (!loadedResults) {
      navigate('/');
      return;
    }
    setResults(loadedResults);
  }, [navigate]);

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will clear your current results.')) {
      storage.clearAll();
      navigate('/');
    }
  };

  const handleShare = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setShowShareMessage(true);
    setTimeout(() => setShowShareMessage(false), 3000);
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
            Your Ikigai Journey
          </h1>
          <p className="text-xl text-gray-600">
            Here's what we discovered about your path to meaningful work
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="card mb-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white animate-slide-up">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{results.ikigaiScore}</div>
            <div className="text-xl mb-4">Your Ikigai Score</div>
            <p className="text-purple-100 max-w-2xl mx-auto">
              {results.summary}
            </p>
          </div>
        </div>

        {/* Ikigai Visualization */}
        <div className="card mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Your Ikigai Balance
          </h2>
          <IkigaiVisualization dimensionScores={results.dimensionScores} />
        </div>

        {/* Dimension Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {results.dimensionScores.map((score, index) => {
            const info = getDimensionInfo(score.dimension);
            return (
              <div
                key={score.dimension}
                className="card hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{info.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {info.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${score.score}%`,
                            backgroundColor: info.color,
                          }}
                        />
                      </div>
                      <span className="font-bold text-lg" style={{ color: info.color }}>
                        {score.score}%
                      </span>
                    </div>
                    {score.insights.length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        {score.insights[0]}
                      </div>
                    )}
                    {score.topAnswers.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-500 mb-1">
                          Key themes:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {score.topAnswers.slice(0, 3).map((answer, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {answer.length > 30 ? answer.substring(0, 30) + '...' : answer}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Career Recommendations */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Career Paths to Explore
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Based on your unique combination of passions, skills, values, and goals
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {results.careerRecommendations.map((career, index) => (
              <CareerCard
                key={index}
                career={career}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleShare}
            className="btn-secondary relative"
          >
            {showShareMessage ? (
              <>
                <span className="mr-2">✓</span>
                Link Copied!
              </>
            ) : (
              <>
                <span className="mr-2">🔗</span>
                Share This Tool
              </>
            )}
          </button>
          <button
            onClick={handleStartOver}
            className="btn-secondary"
          >
            Start Over
          </button>
        </div>

        {/* Footer Message */}
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Your Journey Continues
          </h3>
          <p className="text-gray-600 mb-4">
            These results are a starting point, not a destination. Use them as a compass to guide
            your exploration, experimentation, and growth. Your ikigai will evolve as you do.
          </p>
          <p className="text-sm text-gray-500">
            Remember: The goal isn't to find perfect alignment overnight, but to move steadily
            toward work that feels more meaningful and fulfilling.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get dimension info
function getDimensionInfo(dimension: string) {
  const info: Record<string, { emoji: string; title: string; color: string }> = {
    love: { emoji: '❤️', title: 'What You Love', color: '#FF6B9D' },
    good_at: { emoji: '⭐', title: 'What You\'re Good At', color: '#FFE66D' },
    world_needs: { emoji: '🌍', title: 'What the World Needs', color: '#4ECDC4' },
    paid_for: { emoji: '💼', title: 'What You Can Be Paid For', color: '#95E1D3' },
  };
  return info[dimension] || { emoji: '❓', title: dimension, color: '#999' };
}
