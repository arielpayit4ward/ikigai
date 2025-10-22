import { useState } from 'react';
import type { CareerRecommendation } from '../types';

interface CareerCardProps {
  career: CareerRecommendation;
  delay?: number;
}

export default function CareerCard({ career, delay = 0 }: CareerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeColors = {
    traditional: 'bg-blue-100 text-blue-800 border-blue-300',
    entrepreneurial: 'bg-purple-100 text-purple-800 border-purple-300',
    hybrid: 'bg-green-100 text-green-800 border-green-300',
  };

  const typeEmojis = {
    traditional: '🏢',
    entrepreneurial: '🚀',
    hybrid: '🌟',
  };

  return (
    <div
      className="card hover:shadow-2xl cursor-pointer animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{typeEmojis[career.type]}</span>
            <h3 className="text-xl font-bold text-gray-800">{career.title}</h3>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${typeColors[career.type]}`}>
            {career.type.charAt(0).toUpperCase() + career.type.slice(1)}
          </span>
        </div>
        <div className="flex flex-col items-center ml-4">
          <div className="text-3xl font-bold text-purple-600">{career.matchScore}%</div>
          <div className="text-xs text-gray-500">Match</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">{career.description}</p>

      {/* Aligned Dimensions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {career.alignedDimensions.map(dimension => {
          const emojis: Record<string, string> = {
            love: '❤️',
            good_at: '⭐',
            world_needs: '🌍',
            paid_for: '💼',
          };
          return (
            <span
              key={dimension}
              className="text-lg"
              title={dimension}
            >
              {emojis[dimension]}
            </span>
          );
        })}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t pt-4 mt-4 space-y-4 animate-fade-in">
          {/* Key Skills */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Key Skills Needed</h4>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Next Steps to Explore</h4>
            <ul className="space-y-2">
              {career.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <span className="mr-2 text-purple-600">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources (if available) */}
          {career.resources && career.resources.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Helpful Resources</h4>
              <ul className="space-y-1">
                {career.resources.map((resource, i) => (
                  <li key={i} className="text-sm text-blue-600 underline">
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse Indicator */}
      <div className="flex justify-center mt-4 pt-4 border-t">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Show More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
