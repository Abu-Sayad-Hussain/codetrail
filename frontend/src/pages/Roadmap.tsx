import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Play, 
  BookOpen, 
  Code, 
  ExternalLink,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { useRoadmapStore } from '../store/roadmapStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { RoadmapMilestone, Project } from '../types';
import toast from 'react-hot-toast';

export const Roadmap: React.FC = () => {
  const { 
    currentRoadmap, 
    updateMilestoneStatus, 
    updateProjectStatus, 
    loadRoadmaps 
  } = useRoadmapStore();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  if (!currentRoadmap) {
    return (
      <div className="text-center py-20">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">No Roadmap Generated</h1>
        <p className="text-gray-400 mb-6">
          Take the assessment to generate your personalized learning roadmap
        </p>
        <Button>Start Assessment</Button>
      </div>
    );
  }

  const completedMilestones = currentRoadmap.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = currentRoadmap.milestones.length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const handleMilestoneClick = (milestoneId: string) => {
    setSelectedMilestone(selectedMilestone === milestoneId ? null : milestoneId);
  };

  const handleMilestoneStatusChange = async (milestoneId: string, currentStatus: RoadmapMilestone['status']) => {
    const newStatus = currentStatus === 'not-started' ? 'in-progress' :
                     currentStatus === 'in-progress' ? 'completed' :
                     'not-started';
    
    try {
      await updateMilestoneStatus(milestoneId, newStatus);
      toast.success(`Milestone ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      toast.error('Failed to update milestone');
    }
  };

  const handleProjectStatusChange = async (projectId: string, currentStatus: Project['status']) => {
    const newStatus = currentStatus === 'not-started' ? 'in-progress' :
                     currentStatus === 'in-progress' ? 'completed' :
                     'not-started';
    
    try {
      await updateProjectStatus(projectId, newStatus);
      toast.success(`Project ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const getStatusIcon = (status: RoadmapMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentRoadmap.title}
            </h1>
            <p className="text-gray-400">
              {currentRoadmap.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {completedMilestones}/{totalMilestones}
            </div>
            <div className="text-sm text-gray-400">Milestones</div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card gradient>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Overall Progress</h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
            <Progress value={progress} showPercentage color="success" />
            <div className="flex flex-wrap gap-2 mt-4">
              {currentRoadmap.techStack.map((tech) => (
                <Badge key={tech} variant="primary" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white">Learning Milestones</h2>
        
        <div className="space-y-4">
          {currentRoadmap.milestones.map((milestone, index) => (
            <Card key={milestone.i} gradient>
              <div className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleMilestoneClick(milestone.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-400">
                        {index + 1}
                      </span>
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {milestone.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{milestone.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{milestone.skills.length} skills</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Code className="w-3 h-3" />
                          <span>{milestone.projects.length} projects</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        milestone.status === 'completed' ? 'success' :
                        milestone.status === 'in-progress' ? 'warning' :
                        'secondary'
                      }
                    >
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMilestoneStatusChange(milestone.id, milestone.status);
                      }}
                    >
                      {milestone.status === 'not-started' ? 'Start' :
                       milestone.status === 'in-progress' ? 'Complete' :
                       'Reset'}
                    </Button>
                  </div>
                </div>

                {/* Expanded Content */}
                {selectedMilestone === milestone.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-gray-700"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Skills */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">
                          Skills to Learn
                        </h4>
                        <div className="space-y-2">
                          {milestone.skills.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-300">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">
                          Projects to Build
                        </h4>
                        <div className="space-y-3">
                          {milestone.projects.map((project) => (
                            <div key={project.id} className="p-4 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white">{project.title}</h5>
                                <Badge
                                  variant={
                                    project.status === 'completed' ? 'success' :
                                    project.status === 'in-progress' ? 'warning' :
                                    'secondary'
                                  }
                                  size="sm"
                                >
                                  {project.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-3">
                                {project.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {project.techStack.slice(0, 3).map((tech) => (
                                    <Badge key={tech} variant="secondary" size="sm">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleProjectStatusChange(project.id, project.status)}
                                  >
                                    {project.status === 'not-started' ? 'Start' :
                                     project.status === 'in-progress' ? 'Complete' :
                                     'Reset'}
                                  </Button>
                                  {project.githubTemplate && (
                                    <Button variant="ghost" size="sm">
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};