import { Assessment } from '../models/Assessment.js';

export const seedAssessments = async () => {
  try {
    // Check if assessments already exist
    const existingAssessments = await Assessment.countDocuments();
    if (existingAssessments > 0) {
      console.log('Assessments already seeded');
      return;
    }

    const assessments = [
      {
        title: 'Frontend Development Fundamentals',
        description: 'Test your knowledge of HTML, CSS, and JavaScript basics',
        category: 'Frontend',
        questions: [
          {
            text: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlink and Text Markup Language'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.'
          },
          {
            text: 'Which CSS property is used to change the text color?',
            options: ['font-color', 'text-color', 'color', 'foreground-color'],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'The color property in CSS is used to set the color of text.'
          },
          {
            text: 'What is the correct way to declare a JavaScript variable?',
            options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
            correctAnswer: 0,
            difficulty: 'easy'
          },
          {
            text: 'Which method is used to add an element to the end of an array in JavaScript?',
            options: ['append()', 'push()', 'add()', 'insert()'],
            correctAnswer: 1,
            difficulty: 'medium'
          },
          {
            text: 'What is the purpose of the CSS box model?',
            options: [
              'To create boxes on the page',
              'To define how elements are displayed and spaced',
              'To add borders to elements',
              'To create responsive layouts'
            ],
            correctAnswer: 1,
            difficulty: 'medium'
          }
        ],
        timeLimit: 15,
        passingScore: 60
      },
      {
        title: 'React Fundamentals',
        description: 'Assess your understanding of React concepts and patterns',
        category: 'Frontend',
        questions: [
          {
            text: 'What is JSX?',
            options: [
              'A JavaScript library',
              'A syntax extension for JavaScript',
              'A database query language',
              'A CSS framework'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
          },
          {
            text: 'Which hook is used to manage state in functional components?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
            difficulty: 'easy'
          },
          {
            text: 'What is the virtual DOM?',
            options: [
              'A real DOM element',
              'A JavaScript representation of the real DOM',
              'A CSS property',
              'A React component'
            ],
            correctAnswer: 1,
            difficulty: 'medium'
          },
          {
            text: 'When does the useEffect hook run?',
            options: [
              'Only on component mount',
              'Only on component unmount',
              'After every render by default',
              'Only when state changes'
            ],
            correctAnswer: 2,
            difficulty: 'medium'
          },
          {
            text: 'What is prop drilling?',
            options: [
              'A way to optimize React performance',
              'Passing props through multiple component layers',
              'A method to create new components',
              'A debugging technique'
            ],
            correctAnswer: 1,
            difficulty: 'hard'
          }
        ],
        timeLimit: 20,
        passingScore: 70
      },
      {
        title: 'Backend Development Basics',
        description: 'Test your knowledge of server-side development concepts',
        category: 'Backend',
        questions: [
          {
            text: 'What does API stand for?',
            options: [
              'Application Programming Interface',
              'Advanced Programming Interface',
              'Application Process Interface',
              'Automated Programming Interface'
            ],
            correctAnswer: 0,
            difficulty: 'easy'
          },
          {
            text: 'Which HTTP method is used to retrieve data?',
            options: ['POST', 'PUT', 'GET', 'DELETE'],
            correctAnswer: 2,
            difficulty: 'easy'
          },
          {
            text: 'What is middleware in Express.js?',
            options: [
              'A database connection',
              'Functions that execute during the request-response cycle',
              'A templating engine',
              'A routing mechanism'
            ],
            correctAnswer: 1,
            difficulty: 'medium'
          },
          {
            text: 'What is the purpose of environment variables?',
            options: [
              'To store configuration data securely',
              'To improve application performance',
              'To handle user authentication',
              'To manage database connections'
            ],
            correctAnswer: 0,
            difficulty: 'medium'
          }
        ],
        timeLimit: 15,
        passingScore: 65
      }
    ];

    await Assessment.insertMany(assessments);
    console.log('✅ Assessments seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding assessments:', error);
  }
};