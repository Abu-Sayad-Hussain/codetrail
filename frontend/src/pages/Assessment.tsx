import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Target,
  Code,
  Server,
  Smartphone,
  Database,
  Brain,
  Clock
} from 'lucide-react';
import { useRoadmapStore } from '../store/roadmapStore';
import { assessmentAPI } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

type AssessmentStep = 'goals' | 'stack' | 'experience' | 'quiz' | 'generating';

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  techStacks: string[][];
}

const careerGoals: CareerGoal[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Build beautiful, interactive user interfaces',
    icon: Smartphone,
    techStacks: [
      ['React', 'TypeScript', 'Tailwind CSS'],
      ['Vue.js', 'JavaScript', 'Sass'],
      ['Angular', 'TypeScript', 'Material UI']
    ]
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Create robust server-side applications and APIs',
    icon: Server,
    techStacks: [
      ['Node.js', 'Express', 'MongoDB'],
      ['Python', 'Django', 'PostgreSQL'],
      ['Java', 'Spring Boot', 'MySQL']
    ]
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend development',
    icon: Code,
    techStacks: [
      ['React', 'Node.js', 'PostgreSQL'],
      ['Next.js', 'TypeScript', 'Prisma'],
      ['Vue.js', 'Express', 'MongoDB']
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile Developer',
    description: 'Build native and cross-platform mobile apps',
    icon: Smartphone,
    techStacks: [
      ['React Native', 'TypeScript', 'Expo'],
      ['Flutter', 'Dart', 'Firebase'],
      ['Swift', 'iOS', 'Xcode']
    ]
  }
];

const experienceLevels = [
  {
    id: 'absolute-beginner',
    title: 'Absolute Beginner',
    description: 'New to programming, ready to start learning',
    duration: '6–9 months'
  },
  {
    id: 'some-experience',
    title: 'Some Experience',
    description: 'Basic programming knowledge, learning new technologies',
    duration: '4–6 months'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Comfortable with programming, seeking specialization',
    duration: '2–4 months'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced developer looking to level up',
    duration: '1–2 months'
  }
];

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { generateRoadmap, isLoading } = useRoadmapStore();
  
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('goals');
  const [selectedGoal, setSelectedGoal] = useState<CareerGoal | null>(null);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [availableAssessments, setAvailableAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (currentStep === 'quiz' && !selectedAssessment) {
      loadAssessments();
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 'quiz' && selectedAssessment && !startTime) {
      setStartTime(new Date());
    }
  }, [currentStep, selectedAssessment]);

  const loadAssessments = async () => {
    try {
      const response = await assessmentAPI.getAll(selectedGoal?.id);
      setAvailableAssessments(response.data.assessments);
      if (response.data.assessments.length > 0) {
        setSelectedAssessment(response.data.assessments[0]);
      }
    } catch (error) {
      console.error('Failed to load assessments:', error);
      toast.error('Failed to load assessments');
    }
  };

  const handleGoalSelect = (goal: CareerGoal) => {
    setSelectedGoal(goal);
    setCurrentStep('stack');
  };

  const handleStackSelect = (stack: string[]) => {
    setSelectedStack(stack);
    setCurrentStep('experience');
  };

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < selectedAssessment.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers: number[]) => {
    if (!selectedAssessment || !startTime) return;

    const endTime = new Date();
    const totalTimeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    try {
      const answersWithTime = finalAnswers.map((answer, index) => ({
        selectedAnswer: answer,
        timeSpent: Math.round(totalTimeSpent / finalAnswers.length)
      }));

      const response = await assessmentAPI.submit(
        selectedAssessment._id,
        answersWithTime,
        totalTimeSpent
      );

      setAssessmentResult(response.data.result);
      setTimeSpent(totalTimeSpent);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      toast.error('Failed to submit assessment');
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedGoal || !selectedStack.length || !selectedExperience) return;

    setCurrentStep('generating');
    try {
      await generateRoadmap(
        selectedGoal.title, 
        selectedStack, 
        selectedExperience,
        assessmentResult?.score
      );
      toast.success('Roadmap generated successfully!');
      navigate('/roadmap');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate roadmap');
      setCurrentStep('quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                What's Your Career Goal?
              </h1>
              <p className="text-gray-400">
                Choose your desired career path to get a personalized roadmap
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerGoals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <Card
                    key={goal.id}
                    hover
                    gradient
                    className="cursor-pointer"
                    onClick={() => handleGoalSelect(goal)}
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg">
                          <Icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                          <p className="text-gray-400 text-sm">{goal.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {goal.techStacks.length} stack options
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentStep === 'stack' && selectedGoal && (
          <motion.div
            key="stack"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <Code className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Choose Your Tech Stack
              </h1>
              <p className="text-gray-400">
                Select the technologies you want to learn for {selectedGoal.title}
              </p>
            </div>

            <div className="space-y-4">
              {selectedGoal.techStacks.map((stack, index) => (
                <Card
                  key={index}
                  hover
                  gradient
                  className="cursor-pointer"
                  onClick={() => handleStackSelect(stack)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {stack.map((tech) => (
                          <Badge key={tech} variant="primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('goals')}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'experience' && (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <Brain className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                What's Your Experience Level?
              </h1>
              <p className="text-gray-400">
                This helps us customize the roadmap difficulty and timeline
              </p>
            </div>

            <div className="space-y-4">
              {experienceLevels.map((level) => (
                <Card
                  key={level.id}
                  hover
                  gradient
                  className="cursor-pointer"
                  onClick={() => handleExperienceSelect(level.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {level.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {level.description}
                        </p>
                        <Badge variant="secondary" size="sm">
                          {level.duration} timeline
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('stack')}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'quiz' && selectedAssessment && !showResult && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">
                  {currentQuestion + 1}/{selectedAssessment.questions.length}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {selectedAssessment.title}
              </h1>
              <p className="text-gray-400">
                {selectedAssessment.description}
              </p>
              {selectedAssessment.timeLimit && (
                <div className="flex items-center justify-center mt-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedAssessment.timeLimit} minutes
                </div>
              )}
            </div>

            <Card gradient className="max-w-2xl mx-auto">
              <div className="p-8">
                <div className="mb-6">
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / selectedAssessment.questions.length) * 100}%` }}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    {selectedAssessment.questions[currentQuestion]?.text}
                  </h2>
                </div>

                <div className="space-y-3">
                  {selectedAssessment.questions[currentQuestion]?.options.map((option: string, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className="w-full p-4 text-left bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-600 hover:border-indigo-500"
                    >
                      <span className="text-white">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'quiz' && showResult && assessmentResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">{assessmentResult.score}%</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Assessment Complete!
              </h1>
              <p className="text-gray-400">
                You scored {assessmentResult.score}% and achieved {assessmentResult.skillLevel.replace('-', ' ')} level
              </p>
            </div>

            <Card gradient className="max-w-2xl mx-auto">
              <div className="p-8 text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Your Learning Path Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Career Goal:</span>
                      <span className="text-white">{selectedGoal?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tech Stack:</span>
                      <span className="text-white">{selectedStack.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Experience Level:</span>
                      <span className="text-white">
                        {experienceLevels.find(l => l.id === selectedExperience)?.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Assessment Score:</span>
                      <span className="text-white">{assessmentResult.score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Skill Level:</span>
                      <span className="text-white capitalize">
                        {assessmentResult.skillLevel.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateRoadmap}
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Generate My Roadmap
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Generating Your Roadmap...
            </h1>
            <p className="text-gray-400 mb-8">
              AI is creating a personalized learning path based on your responses
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};