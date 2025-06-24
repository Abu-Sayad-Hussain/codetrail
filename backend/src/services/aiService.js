import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export const callGemini = async (prompt) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = result.text;
    return raw;
  } catch (err) {
    console.error("Google Gemini Error:", err);
    throw err;
  }
};



export const generateRoadmapWithAI = async ({ careerGoal, techStack, skillLevel, assessmentScore }) => {
  try {
    const prompt = `
Generate a comprehensive learning roadmap for a ${skillLevel} developer who wants to become a ${careerGoal} developer.

Tech Stack: ${techStack.join(', ')}
Assessment Score: ${assessmentScore ?? 'Not provided'}

Please provide a structured roadmap with:
1. A compelling title and description
2. 4–6 learning milestones in logical order
3. For each milestone:
   - Clear title and description
   - 3–5 specific skills to learn
   - 1–2 hands-on projects with descriptions
   - Estimated time to complete
   - Appropriate difficulty level

✅ Respond only with valid strict JSON.
✅ All keys must be double-quoted.
✅ Do not include markdown, text, or explanation—only the JSON object.

Format example:
{
  "title": "Learning Path Title",
  "description": "Brief description of the roadmap",
  "estimatedDuration": "Total estimated time",
  "tags": ["relevant", "tags"],
  "milestones": [
    {
      "title": "Milestone Title",
      "description": "What this milestone covers",
      "skills": ["skill1", "skill2", "skill3"],
      "projects": [
        {
          "title": "Project Title",
          "description": "What the project involves",
          "techStack": ["tech1", "tech2"],
          "difficulty": "beginner|intermediate|advanced",
          "estimatedTime": "1-2 weeks"
        }
      ],
      "estimatedTime": "2-4 weeks",
      "order": 1
    }
  ]
}

Make it practical, engaging, and tailored to the ${skillLevel} level.
`;

    const raw = await callGemini(prompt);

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const jsonString = raw.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('AI roadmap generation error:', error);
    return generateFallbackRoadmap(careerGoal, techStack, skillLevel);
  }
};

export const getChatResponse = async (message, context, user) => {
  try {
    const systemPrompt = `
You are CodeTrail AI, a helpful learning assistant for developers. You help users with:
- Learning guidance and study tips
- Technology explanations and comparisons
- Project ideas and implementation advice
- Career development suggestions
- Resource recommendations

User context:
- Name: ${user.name}
- Current learning focus: ${context?.currentRoadmap || 'General development'}

Be encouraging, practical, and provide actionable advice. Keep responses concise but helpful.

User: ${message}
`;

    const response = await callGemini(systemPrompt);
    return response.trim();
  } catch (error) {
    console.error('AI chat error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
};

export const generateProjectSuggestions = async ({ skillLevel, techStack, interests, user }) => {
  try {
    const prompt = `
Generate 3 project suggestions for a ${skillLevel} developer.

Tech Stack: ${techStack?.join(', ') || 'Any'}
Interests: ${interests?.join(', ') || 'General development'}

For each project, provide:
- Title
- Description (2–3 sentences)
- Key features (3–4 bullet points)
- Tech stack recommendations
- Difficulty level
- Estimated time to complete

✅ Respond only with a valid JSON array of project objects.
`;

    const raw = await callGemini(prompt);
    const jsonStart = raw.indexOf('[');
    const response = raw.slice(jsonStart).trim();

    return JSON.parse(response);
  } catch (error) {
    console.error('AI project suggestions error:', error);
    return generateFallbackProjects(skillLevel, techStack);
  }
};


// Fallback functions for when AI is unavailable
const generateFallbackRoadmap = (careerGoal, techStack, skillLevel) => {
  const milestones = [
    {
      title: 'Foundation & Setup',
      description: 'Set up your development environment and learn the basics',
      skills: ['Git', 'Terminal', 'Package Managers'],
      projects: [
        {
          title: 'Personal Portfolio Website',
          description: 'Create a responsive portfolio showcasing your skills',
          techStack: techStack.slice(0, 3),
          difficulty: 'beginner',
          estimatedTime: '1-2 weeks'
        }
      ],
      estimatedTime: '2-3 weeks',
      order: 1
    },
    {
      title: 'Core Framework',
      description: `Master ${techStack[0]} fundamentals and best practices`,
      skills: techStack.slice(0, 2),
      projects: [
        {
          title: 'Task Management App',
          description: 'Build a full-featured task management application',
          techStack: techStack.slice(0, 3),
          difficulty: 'intermediate',
          estimatedTime: '3-4 weeks'
        }
      ],
      estimatedTime: '4-6 weeks',
      order: 2
    }
  ];

  return {
    title: `${careerGoal} Learning Path`,
    description: `Comprehensive roadmap for becoming a ${careerGoal} developer`,
    estimatedDuration: '3-6 months',
    tags: [careerGoal.toLowerCase(), ...techStack.slice(0, 3)],
    milestones
  };
};

const generateFallbackProjects = (skillLevel, techStack) => {
  return [
    {
      title: 'Todo List App',
      description: 'A simple task management application with CRUD operations',
      features: ['Add/edit/delete tasks', 'Mark as complete', 'Filter by status'],
      techStack: techStack || ['HTML', 'CSS', 'JavaScript'],
      difficulty: skillLevel === 'absolute-beginner' ? 'beginner' : 'intermediate',
      estimatedTime: '1-2 weeks'
    },
    {
      title: 'Weather Dashboard',
      description: 'Display weather information using external APIs',
      features: ['Current weather', 'Forecast', 'Location search'],
      techStack: techStack || ['React', 'API Integration'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks'
    }
  ];
};