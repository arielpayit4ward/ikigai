import { useState } from 'react';
import { IkigaiDimension } from '../types';
import { dimensionInfo } from '../data/questions';

interface ReflectionPauseProps {
  dimension: IkigaiDimension;
  onComplete: (content: string) => void;
  onSkip: () => void;
  isLastDimension: boolean;
}

export default function ReflectionPause({
  dimension,
  onComplete,
  onSkip,
  isLastDimension,
}: ReflectionPauseProps) {
  const [reflection, setReflection] = useState('');
  const info = dimensionInfo[dimension];

  const prompts = {
    [IkigaiDimension.LOVE]: [
      'What surprised you most about your answers?',
      'What patterns did you notice in what energizes you?',
      'What did you learn about yourself?',
    ],
    [IkigaiDimension.GOOD_AT]: [
      'Which skills or strengths do you want to develop further?',
      'What abilities do you take for granted?',
      'How do your strengths complement your passions?',
    ],
    [IkigaiDimension.WORLD_NEEDS]: [
      'What impact do you want to have on the world?',
      'Which causes or issues resonate most deeply?',
      'How can your unique perspective make a difference?',
    ],
    [IkigaiDimension.PAID_FOR]: [
      'What opportunities excite you most?',
      'What fears or concerns came up?',
      'What first step could you take today?',
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        {/* Completion Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl mb-4 animate-bounce">
            {info.emoji}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Section Complete!
          </h2>
          <p className="text-xl text-gray-600">
            {info.title} - {info.subtitle}
          </p>
        </div>

        {/* Reflection Card */}
        <div className="card mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Take a Moment to Reflect
          </h3>
          <p className="text-gray-600 mb-6">
            Before moving on, pause and capture any insights or thoughts that emerged.
            This is optional but can deepen your self-discovery.
          </p>

          {/* Reflection Prompts */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Consider these questions:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              {prompts[dimension].map((prompt, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reflection Text Area */}
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="Share your thoughts, insights, or 'aha' moments..."
            className="input-field min-h-[150px] resize-y mb-4"
            rows={6}
          />

          <div className="text-sm text-gray-500 mb-6">
            {reflection.length > 0
              ? `${reflection.length} characters`
              : 'Your reflections are private and saved only on your device'}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onComplete(reflection)}
              className="btn-primary flex-1"
            >
              {isLastDimension ? 'Complete & See Results' : 'Continue to Next Section'}
            </button>
            <button
              onClick={onSkip}
              className="btn-secondary"
            >
              Skip Reflection
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        {!isLastDimension && (
          <div className="text-center text-gray-500 text-sm">
            {Object.values(IkigaiDimension).indexOf(dimension) + 1} of 4 sections complete
          </div>
        )}

        {isLastDimension && (
          <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-lg font-semibold text-gray-800">
              You've completed all four dimensions!
            </p>
            <p className="text-gray-600 mt-2">
              Your personalized ikigai insights are ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
