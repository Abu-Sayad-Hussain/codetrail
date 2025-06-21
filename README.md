# 🧭 CodeTrail - AI-Powered Learning Navigator

> **Transform your developer journey with personalized AI-generated learning roadmaps, skill assessments, and intelligent guidance.**

CodeTrail is a comprehensive full-stack application that helps developers create personalized learning paths, track progress, and get AI-powered guidance throughout their coding journey.

![CodeTrail Dashboard](https://via.placeholder.com/800x400/1f2937/ffffff?text=CodeTrail+Dashboard)

## ✨ Features

### 🎯 **Personalized Learning Roadmaps**
- AI-generated roadmaps based on career goals and skill level
- Milestone-based learning with clear objectives
- Project recommendations for hands-on experience

### 🧪 **Skill Assessment System**
- Interactive quizzes to evaluate current knowledge
- Adaptive difficulty based on performance
- Detailed feedback and skill level categorization

### 🤖 **AI Learning Assistant**
- Real-time chat support for learning questions
- Project suggestions tailored to your progress
- Resource recommendations and explanations

### 📊 **Progress Tracking**
- Visual dashboard with learning statistics
- Achievement system and streak tracking
- Daily activity logging and goal setting

### 👤 **User Management**
- Secure authentication with JWT
- Customizable user profiles
- Learning preferences and history

## 🏗️ Architecture

```
codetrail/
├── frontend/          # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── store/         # Zustand state management
│   │   ├── services/      # API integration
│   │   └── types/         # TypeScript definitions
│   └── public/
├── backend/           # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # Database schemas
│   │   ├── middleware/    # Authentication & validation
│   │   ├── services/      # Business logic & AI integration
│   │   └── utils/         # Helper functions
│   └── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **OpenAI API Key** (for AI features)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd codetrail

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

#### Backend Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/codetrail

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# AI Integration
OPENAI_API_KEY=your-openai-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Configuration
```bash
# Copy environment template
cp frontend/.env.example frontend/.env

# Edit frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in backend/.env

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only (http://localhost:5173)
npm run dev:backend   # Backend only (http://localhost:5000)
```

### 5. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create your account at `http://localhost:5173/signup`
2. **Take Assessment**: Complete the skill assessment to determine your level
3. **Generate Roadmap**: Get your personalized learning path
4. **Start Learning**: Follow milestones and track your progress
5. **Get AI Help**: Use the chat assistant for guidance

### API Documentation

#### Authentication Endpoints
```
POST /api/auth/register     # Create new account
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
```

#### Roadmap Endpoints
```
POST /api/roadmaps/generate # Generate new roadmap
GET  /api/roadmaps         # Get user roadmaps
GET  /api/roadmaps/:id     # Get specific roadmap
PUT  /api/roadmaps/:id/milestones/:milestoneId # Update milestone
```

#### Assessment Endpoints
```
GET  /api/assessments      # Get available assessments
POST /api/assessments/:id/submit # Submit assessment
GET  /api/assessments/results    # Get user results
```

## 🛠️ Development

### Project Structure

#### Frontend (`/frontend`)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls

#### Backend (`/backend`)
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **OpenAI API** integration
- **Express Validator** for input validation
- **Helmet** for security headers

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build           # Build both applications
npm run build:frontend  # Build frontend only
npm run build:backend   # Build backend only

# Production
npm start              # Start production server

# Utilities
npm run install:all    # Install all dependencies
npm run clean         # Remove all node_modules
npm run lint          # Run ESLint on frontend
```

### Environment Variables

#### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ✅ |
| `PORT` | Server port (default: 5000) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ |

#### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ✅ |

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Set environment variables in hosting platform
# Deploy with npm start command
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add proper error handling
- Include JSDoc comments for functions

## 📄 API Reference

### Authentication Flow
```javascript
// Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Roadmap Generation
```javascript
// Generate personalized roadmap
POST /api/roadmaps/generate
{
  "careerGoal": "Frontend Developer",
  "techStack": ["React", "TypeScript", "Tailwind CSS"],
  "skillLevel": "intermediate",
  "assessmentScore": 75
}
```

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/codetrail
```

#### OpenAI API Errors
```bash
# Verify API key is set correctly
echo $OPENAI_API_KEY

# Check API quota and billing
```

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

## 📊 Performance

- **Frontend**: Optimized with Vite bundling and code splitting
- **Backend**: Express.js with compression and rate limiting
- **Database**: MongoDB with indexed queries
- **Caching**: Redis integration ready for production

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Security headers with Helmet

## 📈 Roadmap

### Version 1.1
- [ ] Real-time chat with WebSocket
- [ ] GitHub integration for project tracking
- [ ] Advanced analytics dashboard
- [ ] Mobile PWA support

### Version 2.0
- [ ] Multi-language support
- [ ] Team collaboration features
- [ ] Advanced AI tutoring
- [ ] Integration with learning platforms

## 📞 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@codetrail.dev

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the CodeTrail Team**

*Empowering developers to learn, grow, and succeed in their coding journey.*