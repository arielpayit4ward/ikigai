import { useState } from 'react';
import type { Question } from '../types';
import { QuestionType } from '../types';

interface QuestionDisplayProps {
  question: Question;
  value: string | number | string[];
  onChange: (value: string | number | string[]) => void;
}

export default function QuestionDisplay({ question, value, onChange }: QuestionDisplayProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const renderQuestion = () => {
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
        return renderSingleChoice();
      case QuestionType.MULTIPLE_CHOICE:
        return renderMultipleChoice();
      case QuestionType.SCALE:
        return renderScale();
      case QuestionType.TEXT:
        return renderText();
      case QuestionType.RANKING:
        return renderRanking();
      default:
        return null;
    }
  };

  const renderSingleChoice = () => {
    return (
      <div className="space-y-3">
        {question.options?.map(option => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              value === option.id
                ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
            }`}
          >
            <div className="flex items-center gap-3">
              {option.emoji && <span className="text-2xl">{option.emoji}</span>}
              <span className="flex-1 font-medium">{option.text}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  value === option.id ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                }`}
              >
                {value === option.id && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderMultipleChoice = () => {
    const selectedValues = Array.isArray(value) ? value : [];

    const toggleOption = (optionId: string) => {
      if (selectedValues.includes(optionId)) {
        onChange(selectedValues.filter(id => id !== optionId));
      } else {
        onChange([...selectedValues, optionId]);
      }
    };

    return (
      <div className="space-y-3">
        {question.options?.map(option => {
          const isSelected = selectedValues.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="flex items-center gap-3">
                {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                <span className="flex-1 font-medium">{option.text}</span>
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderScale = () => {
    const min = question.scaleMin || 1;
    const max = question.scaleMax || 5;
    const currentValue = typeof value === 'number' ? value : min;

    return (
      <div className="py-4">
        <div className="flex justify-between mb-4">
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(num => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 font-bold text-lg transition-all ${
                currentValue === num
                  ? 'border-purple-500 bg-purple-500 text-white scale-110 shadow-lg'
                  : 'border-gray-300 text-gray-600 hover:border-purple-400 hover:scale-105'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {question.scaleLabels && (
          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span className="text-left max-w-[45%]">{question.scaleLabels.min}</span>
            <span className="text-right max-w-[45%]">{question.scaleLabels.max}</span>
          </div>
        )}
      </div>
    );
  };

  const renderText = () => {
    return (
      <div>
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder || 'Type your answer here...'}
          className="input-field min-h-[150px] resize-y"
          rows={6}
        />
        <div className="text-sm text-gray-500 mt-2">
          {typeof value === 'string' && value.length > 0
            ? `${value.length} characters`
            : 'Take your time to reflect and write honestly'}
        </div>
      </div>
    );
  };

  const renderRanking = () => {
    const rankedItems = Array.isArray(value) && value.length > 0 ? value : question.options?.map(o => o.id) || [];

    const handleDragStart = (optionId: string) => {
      setDraggedItem(optionId);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (targetId: string) => {
      if (!draggedItem || draggedItem === targetId) return;

      const newRanking = [...rankedItems];
      const draggedIndex = newRanking.indexOf(draggedItem);
      const targetIndex = newRanking.indexOf(targetId);

      newRanking.splice(draggedIndex, 1);
      newRanking.splice(targetIndex, 0, draggedItem);

      onChange(newRanking);
      setDraggedItem(null);
    };

    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-4 bg-purple-50 p-3 rounded-lg">
          Drag and drop to reorder. Your top choice should be at #1.
        </div>
        {rankedItems.map((optionId, index) => {
          const option = question.options?.find(o => o.id === optionId);
          if (!option) return null;

          return (
            <div
              key={option.id}
              draggable
              onDragStart={() => handleDragStart(option.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(option.id)}
              className={`flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 cursor-move hover:border-purple-300 hover:shadow-md transition-all ${
                draggedItem === option.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center">
                {index + 1}
              </div>
              <div className="flex-1 font-medium">{option.text}</div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{question.question}</h3>
      {question.description && (
        <p className="text-gray-600 mb-6">{question.description}</p>
      )}
      {renderQuestion()}
    </div>
  );
}
