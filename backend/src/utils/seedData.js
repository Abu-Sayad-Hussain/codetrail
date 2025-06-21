import { Assessment } from '../models/Assessment.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetrail');
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  }
};

export const seedAssessments = async () => {
  try {
    // Check if assessments already exist
    const existingAssessments = await Assessment.countDocuments();
    if (existingAssessments > 0) {
      console.log('Assessments already seeded');
      process.exit(1)
      return;
    }

    const assessments = [
      {
        title: 'Frontend Developer Path Assessment',
        description: 'Assess your knowledge of HTML, CSS, and React fundamentals',
        category: 'frontend',
        timeLimit: 20,
        passingScore: 70,
        questions: [
          {
            text: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlink Text Marking', 'High Text Markup Logic'],
            correctAnswer: 0,
            difficulty: 'easy'
          },
          {
            text: 'Which CSS property changes text color?',
            options: ['text-style', 'color', 'font-color', 'text-color'],
            correctAnswer: 1,
            difficulty: 'easy'
          },
          {
            text: 'What is JSX in React?',
            options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Expression', 'JSON Syntax Exchange'],
            correctAnswer: 0,
            difficulty: 'medium'
          },
          {
            text: 'Which hook is used for side effects in React?',
            options: ['useState', 'useEffect', 'useRef', 'useCallback'],
            correctAnswer: 1,
            difficulty: 'medium'
          },
          {
            text: 'What is prop drilling?',
            options: [
              'Passing props through multiple levels of components',
              'A debugging technique',
              'Performance bottleneck in APIs',
              'A tool for inspecting props'
            ],
            correctAnswer: 0,
            difficulty: 'hard'
          }
        ]
      },
      {
        title: 'Backend Developer Path Assessment',
        description: 'Evaluate your understanding of backend fundamentals and Node.js',
        category: 'backend',
        timeLimit: 20,
        passingScore: 70,
        questions: [
          {
            text: 'What does API stand for?',
            options: ['Application Programming Interface', 'Advanced Processing Interface', 'Applied Protocol Interface', 'Application Parameter Instruction'],
            correctAnswer: 0,
            difficulty: 'easy'
          },
          {
            text: 'Which HTTP method is used to fetch data?',
            options: ['POST', 'GET', 'PUT', 'DELETE'],
            correctAnswer: 1,
            difficulty: 'easy'
          },
          {
            text: 'What is middleware in Express.js?',
            options: [
              'A function in the request-response cycle',
              'An API endpoint',
              'A database driver',
              'A backend library'
            ],
            correctAnswer: 0,
            difficulty: 'medium'
          },
          {
            text: 'How does async/await help in Node.js?',
            options: [
              'Improves CSS styling',
              'Makes synchronous code asynchronous',
              'Helps write promise-based code in a cleaner way',
              'Creates WebSocket connections'
            ],
            correctAnswer: 2,
            difficulty: 'medium'
          },
          {
            text: 'What is the purpose of environment variables?',
            options: [
              'To store sensitive configuration',
              'To format code automatically',
              'To enhance frontend styling',
              'To manage API documentation'
            ],
            correctAnswer: 0,
            difficulty: 'hard'
          }
        ]
      },
      {
        title: 'Full Stack Developer Assessment',
        description: 'Assess your understanding across frontend and backend technologies',
        category: 'fullstack',
        timeLimit: 25,
        passingScore: 75,
        questions: [
          {
            text: 'What is the main responsibility of a full stack developer?',
            options: [
              'Only frontend development',
              'Only backend development',
              'Building both client and server-side of applications',
              'Creating mobile applications'
            ],
            correctAnswer: 2,
            difficulty: 'easy'
          },
          {
            text: 'What does REST stand for?',
            options: [
              'Representational State Transfer',
              'Remote Execution Standard Tool',
              'Rendered Server Templates',
              'Resilient Endpoint Service Transaction'
            ],
            correctAnswer: 0,
            difficulty: 'medium'
          },
          {
            text: 'Which database is best for relational data?',
            options: ['MongoDB', 'PostgreSQL', 'Redis', 'Neo4j'],
            correctAnswer: 1,
            difficulty: 'medium'
          },
          {
            text: 'What does SSR stand for in Next.js?',
            options: ['Server Side Rendering', 'State Style Resource', 'Structured Server Resource', 'Software Script Runtime'],
            correctAnswer: 0,
            difficulty: 'hard'
          },
          {
            text: 'How do you pass data from a child to parent component in React?',
            options: ['useRef', 'useState', 'Callback props', 'React context'],
            correctAnswer: 2,
            difficulty: 'hard'
          }
        ]
      },
      {
        title: 'Mobile Developer Path Assessment',
        description: 'Test your mobile development knowledge including React Native and Flutter',
        category: 'mobile',
        timeLimit: 20,
        passingScore: 70,
        questions: [
          {
            text: 'What is React Native primarily used for?',
            options: ['Building websites', 'Creating desktop applications', 'Developing mobile apps', 'Managing cloud resources'],
            correctAnswer: 2,
            difficulty: 'easy'
          },
          {
            text: 'Which language is used with Flutter?',
            options: ['JavaScript', 'Dart', 'Swift', 'Kotlin'],
            correctAnswer: 1,
            difficulty: 'easy'
          },
          {
            text: 'What is Expo in React Native?',
            options: [
              'A UI component library',
              'A toolchain for faster React Native development',
              'A cloud backend service',
              'A design system'
            ],
            correctAnswer: 1,
            difficulty: 'medium'
          },
          {
            text: 'Which platform is Swift used for?',
            options: ['Android', 'Windows', 'iOS', 'Linux'],
            correctAnswer: 2,
            difficulty: 'medium'
          },
          {
            text: 'What’s the main difference between native and cross-platform development?',
            options: [
              'Native uses single codebase for all platforms',
              'Cross-platform is faster and uses device-specific APIs',
              'Cross-platform allows shared code across iOS & Android',
              'Native works only for web'
            ],
            correctAnswer: 2,
            difficulty: 'hard'
          }
        ]
      }
    ];

    await Assessment.insertMany(assessments);
    console.log('✅ Assessments seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding assessments:', error);
  }
};

const run = async () => {
  await connectDB();
  await seedAssessments();
  process.exit(1)
};

run();