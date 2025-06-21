import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Star, 
  Award, 
  BookOpen, 
  Code, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRoadmapStore } from '../store/roadmapStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { format } from 'date-fns';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { currentRoadmap, progressStats, loadProgressStats } = useRoadmapStore();

  useEffect(() => {
    loadProgressStats();
  }, []);

  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first assessment',
      icon: Star,
      earned: true,
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Project Builder',
      description: 'Built your first project',
      icon: Code,
      earned: progressStats.completedProjects > 0,
      date: progressStats.completedProjects > 0 ? '2024-01-20' : null
    },
    {
      id: '3',
      title: 'Consistent Learner',
      description: 'Maintained a 7-day learning streak',
      icon: TrendingUp,
      earned: progressStats.streakDays >= 7,
      date: progressStats.streakDays >= 7 ? '2024-01-25' : null
    },
    {
      id: '4',
      title: 'Milestone Master',
      description: 'Completed 5 learning milestones',
      icon: Award,
      earned: false,
      date: null
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'project',
      title: 'Completed Task Management App',
      date: '2024-01-20',
      icon: Code
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Passed React Fundamentals Quiz',
      score: 85,
      date: '2024-01-18',
      icon: BookOpen
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Started Core Framework Milestone',
      date: '2024-01-15',
      icon: Star
    }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card gradient>
          <div className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-gray-400 mb-4">{user?.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(new Date(user?.createdAt || Date.now()), 'MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{progressStats.streakDays} day streak</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Progress Overview */}
          <Card gradient>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Learning Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Skills Mastered</span>
                    <span className="text-white font-medium">
                      {progressStats.completedSkills}/{progressStats.totalSkills}
                    </span>
                  </div>
                  <Progress 
                    value={progressStats.completedSkills} 
                    max={progressStats.totalSkills} 
                    color="primary"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Projects Completed</span>
                    <span className="text-white font-medium">
                      {progressStats.completedProjects}/{progressStats.totalProjects}
                    </span>
                  </div>
                  <Progress 
                    value={progressStats.completedProjects} 
                    max={progressStats.totalProjects} 
                    color="success"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Current Roadmap */}
          {currentRoadmap && (
            <Card gradient>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Current Roadmap</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {currentRoadmap.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{currentRoadmap.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentRoadmap.techStack.map((tech) => (
                        <Badge key={tech} variant="primary" size="sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {currentRoadmap.milestones.filter(m => m.status === 'completed').length} / {currentRoadmap.milestones.length} milestones
                      </span>
                    </div>
                    <Progress 
                      value={currentRoadmap.milestones.filter(m => m.status === 'completed').length} 
                      max={currentRoadmap.milestones.length} 
                      color="primary"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Achievements */}
          <Card gradient>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.earned
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30'
                          : 'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          achievement.earned ? 'bg-indigo-500/20' : 'bg-gray-700'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            achievement.earned ? 'text-indigo-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            achievement.earned ? 'text-white' : 'text-gray-400'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {achievement.description}
                          </p>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-indigo-400 mt-1">
                              Earned {format(new Date(achievement.date), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <Card hover gradient>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {progressStats.streakDays}
                </div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
            </Card>
            <Card hover gradient>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {progressStats.totalHours}
                </div>
                <div className="text-sm text-gray-400">Hours Learned</div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card gradient>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Icon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-400">
                            {format(new Date(activity.date), 'MMM d')}
                          </p>
                          {'score' in activity && (
                            <Badge variant="success" size="sm">
                              {activity.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};