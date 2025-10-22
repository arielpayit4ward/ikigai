import type { DimensionScore } from '../types';
import { IkigaiDimension } from '../types';
import { dimensionInfo } from '../data/questions';

interface IkigaiVisualizationProps {
  dimensionScores: DimensionScore[];
}

export default function IkigaiVisualization({ dimensionScores }: IkigaiVisualizationProps) {
  // Create a map of dimension scores
  const scoreMap = dimensionScores.reduce((acc, score) => {
    acc[score.dimension] = score.score;
    return acc;
  }, {} as Record<IkigaiDimension, number>);

  // Calculate center strength (ikigai alignment)
  const avgScore = dimensionScores.reduce((sum, s) => sum + s.score, 0) / dimensionScores.length;
  const balance = 100 - (Math.max(...dimensionScores.map(s => s.score)) - Math.min(...dimensionScores.map(s => s.score)));

  return (
    <div className="py-8">
      {/* SVG Visualization */}
      <div className="flex justify-center mb-8">
        <svg
          viewBox="0 0 400 400"
          className="w-full max-w-md"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
        >
          {/* Define gradients */}
          <defs>
            <radialGradient id="loveGradient">
              <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FF6B9D" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="goodAtGradient">
              <stop offset="0%" stopColor="#FFE66D" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFE66D" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="needsGradient">
              <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="paidGradient">
              <stop offset="0%" stopColor="#95E1D3" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#95E1D3" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* Four overlapping circles - positioned to create Venn diagram */}
          {/* Top: Love (Passion) */}
          <circle
            cx="200"
            cy="120"
            r={70 + (scoreMap[IkigaiDimension.LOVE] || 0) * 0.3}
            fill="url(#loveGradient)"
            stroke="#FF6B9D"
            strokeWidth="2"
            className="transition-all duration-1000"
          />

          {/* Bottom: World Needs (Mission) */}
          <circle
            cx="200"
            cy="280"
            r={70 + (scoreMap[IkigaiDimension.WORLD_NEEDS] || 0) * 0.3}
            fill="url(#needsGradient)"
            stroke="#4ECDC4"
            strokeWidth="2"
            className="transition-all duration-1000"
          />

          {/* Left: Good At (Profession) */}
          <circle
            cx="130"
            cy="200"
            r={70 + (scoreMap[IkigaiDimension.GOOD_AT] || 0) * 0.3}
            fill="url(#goodAtGradient)"
            stroke="#FFE66D"
            strokeWidth="2"
            className="transition-all duration-1000"
          />

          {/* Right: Paid For (Vocation) */}
          <circle
            cx="270"
            cy="200"
            r={70 + (scoreMap[IkigaiDimension.PAID_FOR] || 0) * 0.3}
            fill="url(#paidGradient)"
            stroke="#95E1D3"
            strokeWidth="2"
            className="transition-all duration-1000"
          />

          {/* Center circle - ikigai sweet spot */}
          <circle
            cx="200"
            cy="200"
            r={20 + (avgScore * 0.2)}
            fill="#8B5CF6"
            opacity={balance / 100}
            className="transition-all duration-1000"
          />

          {/* Labels */}
          <text
            x="200"
            y="80"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-700"
          >
            ❤️ Love
          </text>
          <text
            x="200"
            y="340"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-700"
          >
            🌍 World Needs
          </text>
          <text
            x="60"
            y="205"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-700"
          >
            ⭐ Good At
          </text>
          <text
            x="340"
            y="205"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-700"
          >
            💼 Paid For
          </text>

          {/* Center label */}
          <text
            x="200"
            y="205"
            textAnchor="middle"
            className="text-xs font-bold fill-white"
          >
            生き甲斐
          </text>
        </svg>
      </div>

      {/* Score Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {dimensionScores.map(score => {
          const info = dimensionInfo[score.dimension];
          return (
            <div key={score.dimension} className="text-center">
              <div className="text-3xl mb-1">{info.emoji}</div>
              <div className="text-sm font-semibold text-gray-700">{info.subtitle}</div>
              <div
                className="text-2xl font-bold"
                style={{ color: info.color }}
              >
                {score.score}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance Indicator */}
      <div className="mt-8 text-center max-w-md mx-auto">
        <div className="text-sm font-semibold text-gray-600 mb-2">
          Alignment Balance
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${balance}%` }}
            />
          </div>
          <span className="font-bold text-purple-600">{Math.round(balance)}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {balance > 75
            ? 'Excellent balance across all dimensions'
            : balance > 50
            ? 'Good balance with room for alignment'
            : 'Focus on developing weaker dimensions'}
        </p>
      </div>
    </div>
  );
}
