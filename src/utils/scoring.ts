import type {
  UserResponse,
  DimensionScore,
  IkigaiResults,
  CareerRecommendation,
} from '../types';
import { IkigaiDimension, QuestionType } from '../types';
import { questions } from '../data/questions';

// Calculate score for a single dimension
export function calculateDimensionScore(
  dimension: IkigaiDimension,
  responses: UserResponse[]
): DimensionScore {
  const dimensionResponses = responses.filter(r => r.dimension === dimension);
  const dimensionQuestions = questions.filter(q => q.dimension === dimension);

  if (dimensionResponses.length === 0) {
    return {
      dimension,
      score: 0,
      insights: [],
      topAnswers: [],
    };
  }

  let totalScore = 0;
  let maxPossibleScore = 0;
  const insights: string[] = [];
  const topAnswers: string[] = [];

  dimensionResponses.forEach(response => {
    const question = dimensionQuestions.find(q => q.id === response.questionId);
    if (!question) return;

    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.MULTIPLE_CHOICE:
        if (Array.isArray(response.value)) {
          // Multiple choice
          response.value.forEach(optionId => {
            const option = question.options?.find(o => o.id === optionId);
            if (option) {
              totalScore += option.value;
              topAnswers.push(option.text);
            }
          });
          maxPossibleScore += 10 * (question.options?.length || 1);
        } else {
          // Single choice
          const option = question.options?.find(o => o.id === response.value);
          if (option) {
            totalScore += option.value;
            topAnswers.push(option.text);
          }
          maxPossibleScore += 10;
        }
        break;

      case QuestionType.SCALE:
        const scaleValue = Number(response.value);
        const scaleMax = question.scaleMax || 5;
        const normalizedScore = (scaleValue / scaleMax) * 10;
        totalScore += normalizedScore;
        maxPossibleScore += 10;
        break;

      case QuestionType.RANKING:
        // For ranking, inverse the rank (1st = highest score)
        if (Array.isArray(response.value)) {
          const numOptions = question.options?.length || 5;
          response.value.forEach((optionId, index) => {
            const rankScore = ((numOptions - index) / numOptions) * 10;
            totalScore += rankScore;
            if (index < 2) {
              // Top 2 ranked items
              const option = question.options?.find(o => o.id === optionId);
              if (option) topAnswers.push(option.text);
            }
          });
          maxPossibleScore += 10 * numOptions;
        }
        break;

      case QuestionType.TEXT:
        // Text responses don't contribute to numeric score but are captured
        if (typeof response.value === 'string' && response.value.length > 10) {
          totalScore += 10; // Give full points for thoughtful text responses
        }
        maxPossibleScore += 10;
        break;
    }
  });

  // Normalize to 0-100 scale
  const normalizedScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

  // Generate insights based on score
  if (normalizedScore >= 80) {
    insights.push('Strong clarity and alignment in this area');
  } else if (normalizedScore >= 60) {
    insights.push('Good foundation with room for deeper exploration');
  } else if (normalizedScore >= 40) {
    insights.push('Emerging awareness - continue discovering');
  } else {
    insights.push('Opportunity for significant growth and discovery');
  }

  return {
    dimension,
    score: Math.round(normalizedScore),
    insights,
    topAnswers: topAnswers.slice(0, 5), // Top 5 answers
  };
}

// Calculate overall ikigai score
export function calculateIkigaiScore(dimensionScores: DimensionScore[]): number {
  if (dimensionScores.length === 0) return 0;

  const average = dimensionScores.reduce((sum, ds) => sum + ds.score, 0) / dimensionScores.length;

  // Bonus for balance (all dimensions relatively close)
  const scores = dimensionScores.map(ds => ds.score);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const balanceRange = maxScore - minScore;
  const balanceBonus = balanceRange < 20 ? 5 : balanceRange < 40 ? 2 : 0;

  return Math.min(100, Math.round(average + balanceBonus));
}

// Generate career recommendations based on responses
export function generateCareerRecommendations(
  dimensionScores: DimensionScore[],
  responses: UserResponse[]
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  // Get dimension scores as object for easy access
  const scores = dimensionScores.reduce((acc, ds) => {
    acc[ds.dimension] = ds.score;
    return acc;
  }, {} as Record<IkigaiDimension, number>);

  // Analyze patterns
  const lovesCreativity = hasKeyword(responses, IkigaiDimension.LOVE, ['creating', 'creative', 'design', 'art']);
  const lovesTech = hasKeyword(responses, IkigaiDimension.LOVE, ['technology', 'software', 'coding', 'tech']);
  const lovesHelping = hasKeyword(responses, IkigaiDimension.LOVE, ['helping', 'teaching', 'support', 'mentor']);

  const goodAtTech = hasKeyword(responses, IkigaiDimension.GOOD_AT, ['software', 'coding', 'technical', 'data']);
  const goodAtCommunication = hasKeyword(responses, IkigaiDimension.GOOD_AT, ['communication', 'writing', 'explaining', 'presenting']);

  const caresAboutEnvironment = hasKeyword(responses, IkigaiDimension.WORLD_NEEDS, ['climate', 'environment', 'sustainability']);
  const caresAboutEducation = hasKeyword(responses, IkigaiDimension.WORLD_NEEDS, ['education', 'learning', 'teaching']);
  const caresAboutHealth = hasKeyword(responses, IkigaiDimension.WORLD_NEEDS, ['health', 'mental health', 'wellness']);

  const wantsEntrepreneurship = hasKeyword(responses, IkigaiDimension.PAID_FOR, ['business', 'entrepreneurship', 'own business']);
  const wantsFlexibility = hasKeyword(responses, IkigaiDimension.PAID_FOR, ['freelance', 'remote', 'flexibility', 'portfolio']);

  // Traditional roles based on strong alignments
  if (lovesTech && goodAtTech && scores[IkigaiDimension.LOVE] > 60) {
    recommendations.push({
      title: 'Software Developer / Engineer',
      type: 'traditional',
      description: 'Build applications and systems that solve real-world problems through code',
      matchScore: Math.round((scores[IkigaiDimension.LOVE] + scores[IkigaiDimension.GOOD_AT]) / 2),
      alignedDimensions: [IkigaiDimension.LOVE, IkigaiDimension.GOOD_AT, IkigaiDimension.PAID_FOR],
      skills: ['Programming', 'Problem-solving', 'System design', 'Testing'],
      nextSteps: [
        'Build a portfolio of projects on GitHub',
        'Contribute to open source',
        'Learn in-demand frameworks',
        'Practice coding challenges',
      ],
    });
  }

  if (lovesCreativity && scores[IkigaiDimension.LOVE] > 60) {
    recommendations.push({
      title: 'UX/UI Designer',
      type: 'traditional',
      description: 'Create intuitive and beautiful digital experiences that delight users',
      matchScore: Math.round((scores[IkigaiDimension.LOVE] + scores[IkigaiDimension.GOOD_AT]) / 2),
      alignedDimensions: [IkigaiDimension.LOVE, IkigaiDimension.GOOD_AT],
      skills: ['Design thinking', 'Prototyping', 'User research', 'Visual design'],
      nextSteps: [
        'Build a design portfolio',
        'Learn Figma or Adobe XD',
        'Study UX principles',
        'Do design challenges',
      ],
    });
  }

  if (lovesHelping && caresAboutEducation) {
    recommendations.push({
      title: 'Learning Experience Designer',
      type: 'traditional',
      description: 'Design educational programs and courses that transform how people learn',
      matchScore: Math.round((scores[IkigaiDimension.LOVE] + scores[IkigaiDimension.WORLD_NEEDS]) / 2),
      alignedDimensions: [IkigaiDimension.LOVE, IkigaiDimension.WORLD_NEEDS, IkigaiDimension.PAID_FOR],
      skills: ['Instructional design', 'Curriculum development', 'Educational technology'],
      nextSteps: [
        'Create a sample online course',
        'Study learning science',
        'Learn an LMS platform',
        'Get instructional design certification',
      ],
    });
  }

  // Entrepreneurial opportunities
  if (wantsEntrepreneurship || wantsFlexibility) {
    if (goodAtCommunication && lovesHelping) {
      recommendations.push({
        title: 'Coaching or Consulting Practice',
        type: 'entrepreneurial',
        description: 'Help others achieve their goals through personalized guidance and expertise',
        matchScore: Math.round((scores[IkigaiDimension.LOVE] + scores[IkigaiDimension.GOOD_AT] + scores[IkigaiDimension.PAID_FOR]) / 3),
        alignedDimensions: [IkigaiDimension.LOVE, IkigaiDimension.GOOD_AT, IkigaiDimension.WORLD_NEEDS, IkigaiDimension.PAID_FOR],
        skills: ['Active listening', 'Problem-solving', 'Business development', 'Marketing'],
        nextSteps: [
          'Define your niche and ideal client',
          'Offer free discovery sessions',
          'Build social media presence',
          'Create a simple website',
          'Get coaching certification',
        ],
      });
    }

    if (lovesCreativity) {
      recommendations.push({
        title: 'Creative Services Business',
        type: 'entrepreneurial',
        description: 'Offer design, writing, or creative services to businesses and individuals',
        matchScore: Math.round((scores[IkigaiDimension.LOVE] + scores[IkigaiDimension.PAID_FOR]) / 2),
        alignedDimensions: [IkigaiDimension.LOVE, IkigaiDimension.GOOD_AT, IkigaiDimension.PAID_FOR],
        skills: ['Creative skills', 'Client management', 'Pricing', 'Portfolio building'],
        nextSteps: [
          'Create an online portfolio',
          'Join freelance platforms',
          'Network in your niche',
          'Set competitive rates',
        ],
      });
    }
  }

  // Hybrid opportunities
  if (caresAboutEnvironment && scores[IkigaiDimension.WORLD_NEEDS] > 70) {
    recommendations.push({
      title: 'Sustainability Consultant',
      type: 'hybrid',
      description: 'Help organizations reduce their environmental impact while building a purposeful career',
      matchScore: Math.round((scores[IkigaiDimension.WORLD_NEEDS] + scores[IkigaiDimension.PAID_FOR]) / 2),
      alignedDimensions: [IkigaiDimension.WORLD_NEEDS, IkigaiDimension.GOOD_AT, IkigaiDimension.PAID_FOR],
      skills: ['Environmental science', 'Data analysis', 'Consulting', 'Change management'],
      nextSteps: [
        'Get sustainability certification',
        'Start with small businesses',
        'Join sustainability networks',
        'Build case studies',
      ],
    });
  }

  if (goodAtTech && caresAboutHealth) {
    recommendations.push({
      title: 'Health Tech Product Manager',
      type: 'hybrid',
      description: 'Bridge technology and healthcare to create products that improve lives',
      matchScore: Math.round((scores[IkigaiDimension.GOOD_AT] + scores[IkigaiDimension.WORLD_NEEDS] + scores[IkigaiDimension.PAID_FOR]) / 3),
      alignedDimensions: [IkigaiDimension.GOOD_AT, IkigaiDimension.WORLD_NEEDS, IkigaiDimension.PAID_FOR],
      skills: ['Product management', 'Healthcare knowledge', 'User research', 'Agile'],
      nextSteps: [
        'Learn about health tech trends',
        'Take PM courses',
        'Network in health tech',
        'Build relevant side projects',
      ],
    });
  }

  // General recommendations based on dimension balance
  if (scores[IkigaiDimension.LOVE] > 70 && scores[IkigaiDimension.WORLD_NEEDS] > 70) {
    recommendations.push({
      title: 'Social Impact Career Path',
      type: 'hybrid',
      description: 'Work in the nonprofit or social enterprise sector aligning passion with purpose',
      matchScore: Math.round((scores[IkigaiDimension.LOVE] + scores[IkigaiDimension.WORLD_NEEDS]) / 2),
      alignedDimensions: [IkigaiDimension.LOVE, IkigaiDimension.WORLD_NEEDS],
      skills: ['Program management', 'Fundraising', 'Community organizing', 'Impact measurement'],
      nextSteps: [
        'Research organizations aligned with your values',
        'Volunteer to build experience',
        'Connect with sector leaders',
        'Consider B-Corp or social enterprises',
      ],
    });
  }

  // Sort by match score
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  // Return top 6 recommendations
  return recommendations.slice(0, 6);
}

// Helper function to check for keywords in responses
function hasKeyword(responses: UserResponse[], dimension: IkigaiDimension, keywords: string[]): boolean {
  const dimensionResponses = responses.filter(r => r.dimension === dimension);

  return dimensionResponses.some(response => {
    const value = response.value.toString().toLowerCase();
    return keywords.some(keyword => value.includes(keyword.toLowerCase()));
  });
}

// Generate complete results
export function generateResults(responses: UserResponse[]): IkigaiResults {
  // Calculate dimension scores
  const dimensionScores = Object.values(IkigaiDimension).map(dimension =>
    calculateDimensionScore(dimension, responses)
  );

  // Calculate overall ikigai score
  const ikigaiScore = calculateIkigaiScore(dimensionScores);

  // Generate career recommendations
  const careerRecommendations = generateCareerRecommendations(dimensionScores, responses);

  // Generate summary
  const summary = generateSummary(dimensionScores, ikigaiScore);

  return {
    dimensionScores,
    ikigaiScore,
    careerRecommendations,
    summary,
    completedAt: new Date(),
  };
}

function generateSummary(dimensionScores: DimensionScore[], ikigaiScore: number): string {
  const sortedScores = [...dimensionScores].sort((a, b) => b.score - a.score);
  const strongest = sortedScores[0];
  const weakest = sortedScores[sortedScores.length - 1];

  let summary = `Your ikigai score is ${ikigaiScore}/100. `;

  if (ikigaiScore >= 80) {
    summary += 'You have exceptional clarity across all dimensions of ikigai. ';
  } else if (ikigaiScore >= 60) {
    summary += 'You have good awareness of your ikigai with room for deeper exploration. ';
  } else {
    summary += 'You\'re at the beginning of an exciting journey of self-discovery. ';
  }

  summary += `Your strongest dimension is "${strongest.dimension}" (${strongest.score}/100), `;
  summary += `while "${weakest.dimension}" offers the most opportunity for growth (${weakest.score}/100). `;

  const balanced = Math.max(...sortedScores.map(s => s.score)) - Math.min(...sortedScores.map(s => s.score)) < 25;
  if (balanced) {
    summary += 'Your dimensions are well-balanced, indicating holistic self-awareness.';
  } else {
    summary += 'Focus on developing your weaker dimensions to achieve greater balance and fulfillment.';
  }

  return summary;
}
