import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BookOpen, 
  Target, 
  Clock, 
  Star, 
  CheckCircle,
  PlayCircle,
  Award
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRoadmapStore } from '../store/roadmapStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { currentRoadmap, progressStats, loadRoadmaps, loadProgressStats } = useRoadmapStore();

  useEffect(() => {
    loadRoadmaps();
    loadProgressStats();
  }, []);

  const stats = [
    {
      name: 'Skills Completed',
      value: progressStats.completedSkills,
      total: progressStats.totalSkills,
      icon: CheckCircle,
      color: 'success' as const
    },
    {
      name: 'Projects Built',
      value: progressStats.completedProjects,
      total: progressStats.totalProjects,
      icon: Award,
      color: 'primary' as const
    },
    {
      name: 'Learning Streak',
      value: progressStats.streakDays,
      total: null,
      suffix: 'days',
      icon: TrendingUp,
      color: 'warning' as const
    },
    {
      name: 'Total Hours',
      value: progressStats.totalHours,
      total: null,
      suffix: 'hrs',
      icon: Clock,
      color: 'secondary' as const
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'quiz',
      title: 'Completed React Fundamentals Quiz',
      score: 85,
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'project',
      title: 'Started Task Management App',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Completed Foundation & Setup',
      time: '3 days ago'
    }
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Complete React Hooks Assessment',
      type: 'Assessment',
      dueDate: 'Tomorrow',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Build Portfolio Website',
      type: 'Project',
      dueDate: 'Next Week',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Learn State Management',
      type: 'Topic',
      dueDate: '2 weeks',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-400">
              Ready to continue your learning journey? Let's make today count.
            </p>
          </div>
          {!currentRoadmap && (
            <Link to="/assessment">
              <Button size="lg" className="hidden sm:flex">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} hover gradient>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}{stat.suffix}
                      {stat.total && (
                        <span className="text-sm text-gray-400 ml-1">
                          / {stat.total}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                {stat.total && (
                  <div className="mt-4">
                    <Progress
                      value={stat.value}
                      max={stat.total}
                      color={stat.color}
                    />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Roadmap */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card gradient>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                  Current Roadmap
                </h2>
                {currentRoadmap && (
                  <Link to="/roadmap">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                )}
              </div>

              {currentRoadmap ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {currentRoadmap.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {currentRoadmap.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentRoadmap.techStack.map((tech) => (
                        <Badge key={tech} variant="primary" size="sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentRoadmap.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white font-medium">{milestone.title}</p>
                          <p className="text-sm text-gray-400">{milestone.estimatedTime}</p>
                        </div>
                        <Badge
                          variant={
                            milestone.status === 'completed' ? 'success' :
                            milestone.status === 'in-progress' ? 'warning' :
                            'secondary'
                          }
                          size="sm"
                        >
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Active Roadmap
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Take an assessment to generate your personalized learning path
                  </p>
                  <Link to="/assessment">
                    <Button>
                      Start Assessment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Recent Activity */}
          <Card gradient>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-400">{activity.time}</p>
                        {'score' in activity && (
                          <Badge variant="success" size="sm">
                            {activity.score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card gradient>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-white font-medium">
                        {task.title}
                      </p>
                      <Badge
                        variant={
                          task.priority === 'high' ? 'error' :
                          task.priority === 'medium' ? 'warning' :
                          'secondary'
                        }
                        size="sm"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{task.type}</span>
                      <span className="text-xs text-gray-400">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};