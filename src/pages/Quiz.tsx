import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  UserProgress,
  Question,
} from '../types';
import { IkigaiDimension, QuestionType } from '../types';
import { questions, questionsByDimension, dimensionInfo } from '../data/questions';
import { storage } from '../utils/storage';
import { generateResults } from '../utils/scoring';
import QuestionDisplay from '../components/QuestionDisplay';
import ProgressBar from '../components/ProgressBar';
import ReflectionPause from '../components/ReflectionPause';

export default function Quiz() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = storage.loadProgress();
    if (saved) return saved;

    return {
      currentDimension: IkigaiDimension.LOVE,
      currentQuestionIndex: 0,
      completedDimensions: [],
      responses: [],
      reflections: [],
      startedAt: new Date(),
      lastUpdated: new Date(),
    };
  });

  const [showReflection, setShowReflection] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | number | string[]>('');

  // Get current dimension's questions
  const dimensionQuestions = progress.currentDimension
    ? questionsByDimension[progress.currentDimension]
    : [];

  const currentQuestion: Question | undefined = dimensionQuestions[progress.currentQuestionIndex];
  const isLastQuestionInDimension = progress.currentQuestionIndex === dimensionQuestions.length - 1;
  const isLastDimension = progress.currentDimension === IkigaiDimension.PAID_FOR;

  // Calculate overall progress
  const totalQuestions = questions.length;
  const answeredQuestions = progress.responses.length;
  const overallProgress = (answeredQuestions / totalQuestions) * 100;

  // Save progress whenever it changes
  useEffect(() => {
    storage.saveProgress(progress);
  }, [progress]);

  // Load saved answer for current question
  useEffect(() => {
    if (currentQuestion) {
      const savedResponse = progress.responses.find(r => r.questionId === currentQuestion.id);
      if (savedResponse) {
        setCurrentAnswer(savedResponse.value);
      } else {
        setCurrentAnswer(
          currentQuestion.type === QuestionType.MULTIPLE_CHOICE ? [] : ''
        );
      }
    }
  }, [currentQuestion, progress.responses]);

  const handleAnswerChange = (value: string | number | string[]) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (!currentQuestion || !progress.currentDimension) return;

    // Validate answer
    if (currentQuestion.required && !currentAnswer) {
      alert('Please answer this question before continuing');
      return;
    }

    // Save or update response
    const newResponses = progress.responses.filter(r => r.questionId !== currentQuestion.id);
    newResponses.push({
      questionId: currentQuestion.id,
      dimension: progress.currentDimension,
      value: currentAnswer,
      timestamp: new Date(),
    });

    // Check if we need to show reflection
    if (isLastQuestionInDimension) {
      setProgress({
        ...progress,
        responses: newResponses,
        lastUpdated: new Date(),
      });
      setShowReflection(true);
      return;
    }

    // Move to next question
    setProgress({
      ...progress,
      currentQuestionIndex: progress.currentQuestionIndex + 1,
      responses: newResponses,
      lastUpdated: new Date(),
    });
  };

  const handlePrevious = () => {
    if (progress.currentQuestionIndex > 0) {
      setProgress({
        ...progress,
        currentQuestionIndex: progress.currentQuestionIndex - 1,
        lastUpdated: new Date(),
      });
    } else if (progress.completedDimensions.length > 0) {
      // Go back to previous dimension
      const prevDimension = getPreviousDimension(progress.currentDimension!);
      if (prevDimension) {
        const prevDimensionQuestions = questionsByDimension[prevDimension];
        setProgress({
          ...progress,
          currentDimension: prevDimension,
          currentQuestionIndex: prevDimensionQuestions.length - 1,
          completedDimensions: progress.completedDimensions.filter(d => d !== prevDimension),
          lastUpdated: new Date(),
        });
      }
    }
  };

  const handleReflectionComplete = (content: string) => {
    if (!progress.currentDimension) return;

    const newReflections = progress.reflections.filter(
      r => r.dimension !== progress.currentDimension
    );
    if (content.trim()) {
      newReflections.push({
        dimension: progress.currentDimension,
        content,
        timestamp: new Date(),
      });
    }

    const newCompletedDimensions = [...progress.completedDimensions, progress.currentDimension];

    if (isLastDimension) {
      // Quiz complete - generate results
      const results = generateResults(progress.responses);
      storage.saveResults(results);
      navigate('/results');
    } else {
      // Move to next dimension
      const nextDimension = getNextDimension(progress.currentDimension);
      setProgress({
        ...progress,
        currentDimension: nextDimension,
        currentQuestionIndex: 0,
        completedDimensions: newCompletedDimensions,
        reflections: newReflections,
        lastUpdated: new Date(),
      });
      setShowReflection(false);
    }
  };

  const handleSkipReflection = () => {
    handleReflectionComplete('');
  };

  if (showReflection && progress.currentDimension) {
    return (
      <ReflectionPause
        dimension={progress.currentDimension}
        onComplete={handleReflectionComplete}
        onSkip={handleSkipReflection}
        isLastDimension={isLastDimension}
      />
    );
  }

  if (!currentQuestion || !progress.currentDimension) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentDimensionInfo = dimensionInfo[progress.currentDimension];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with dimension info */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">{currentDimensionInfo.emoji}</span>
                {currentDimensionInfo.title}
              </h2>
              <p className="text-gray-600">{currentDimensionInfo.description}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 px-4 py-2"
            >
              Exit
            </button>
          </div>

          <ProgressBar
            current={answeredQuestions}
            total={totalQuestions}
            percentage={overallProgress}
          />
        </div>

        {/* Question Card */}
        <div className="card animate-slide-up">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">
              Question {progress.currentQuestionIndex + 1} of {dimensionQuestions.length}
            </div>
          </div>

          <QuestionDisplay
            question={currentQuestion}
            value={currentAnswer}
            onChange={handleAnswerChange}
          />

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={progress.currentQuestionIndex === 0 && progress.completedDimensions.length === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex-1"
            >
              {isLastQuestionInDimension ? 'Complete Section' : 'Next'}
            </button>
          </div>
        </div>

        {/* Dimension Progress Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {Object.values(IkigaiDimension).map(dimension => {
            const isCompleted = progress.completedDimensions.includes(dimension);
            const isCurrent = progress.currentDimension === dimension;
            const info = dimensionInfo[dimension];

            return (
              <div
                key={dimension}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                  isCompleted
                    ? 'bg-green-500 scale-110'
                    : isCurrent
                    ? 'bg-purple-500 scale-125 animate-pulse-slow'
                    : 'bg-gray-200'
                }`}
                title={info.title}
              >
                {info.emoji}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getNextDimension(current: IkigaiDimension): IkigaiDimension {
  const dimensions = Object.values(IkigaiDimension);
  const currentIndex = dimensions.indexOf(current);
  return dimensions[currentIndex + 1] || dimensions[0];
}

function getPreviousDimension(current: IkigaiDimension): IkigaiDimension | null {
  const dimensions = Object.values(IkigaiDimension);
  const currentIndex = dimensions.indexOf(current);
  return currentIndex > 0 ? dimensions[currentIndex - 1] : null;
}
