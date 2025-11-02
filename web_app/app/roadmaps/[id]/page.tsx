'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import InteractiveFlowchart from '@/components/roadmaps/InteractiveFlowchart';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Circle,
  FileText,
  Link as LinkIcon,
  Play,
  Target,
  Sparkles
} from 'lucide-react';
import { Roadmap, RoadmapNode } from '@/types';
import { toast } from 'react-hot-toast';

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roadmapId = params?.id as string;
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [viewMode, setViewMode] = useState<'flowchart' | 'list'>('flowchart');

  const { data, isLoading, error } = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn: async () => {
      const response = await apiClient.getRoadmapById(roadmapId);
      return response;
    },
    enabled: !!roadmapId,
  });

  const roadmap: Roadmap | undefined = data?.data;

  const toggleNodeCompletion = (nodeId: string) => {
    const newCompleted = new Set(completedNodes);
    if (completedNodes.has(nodeId)) {
      newCompleted.delete(nodeId);
      toast.success('Marked as incomplete');
    } else {
      newCompleted.add(nodeId);
      toast.success('Marked as complete');
    }
    setCompletedNodes(newCompleted);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <FileText className="w-5 h-5" />;
      case 'roadmap_link':
        return <LinkIcon className="w-5 h-5" />;
      case 'article_link':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
  };

  const progress = useMemo(() => {
    if (!roadmap?.nodes || roadmap.nodes.length === 0) return 0;
    return (completedNodes.size / roadmap.nodes.length) * 100;
  }, [completedNodes, roadmap]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Roadmap not found</h2>
          <Button onClick={() => router.push('/roadmaps')}>Back to Roadmaps</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/roadmaps')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Roadmaps
        </Button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
                <h1 className="text-4xl font-bold text-gray-900">{roadmap.title}</h1>
              </div>
              <p className="text-gray-600 text-lg mb-6">{roadmap.description}</p>
              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {roadmap.estimated_time_hours || roadmap.estimated_duration}h
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {roadmap.nodes.length} steps
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  {roadmap.level || roadmap.difficulty_level}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-gray-700">Your Progress</span>
              <span className="text-gray-600">
                {completedNodes.size} / {roadmap.nodes.length} completed
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setViewMode('flowchart')}
            variant={viewMode === 'flowchart' ? 'default' : 'outline'}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Flowchart View
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'outline'}
            className="flex-1"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            List View
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flowchart or Nodes List */}
          <div className="lg:col-span-2">
            {viewMode === 'flowchart' ? (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Learning Path</h2>
                <InteractiveFlowchart
                  nodes={roadmap.nodes}
                  onNodeClick={handleNodeClick}
                  completedNodeIds={completedNodes}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Steps</h2>
                <div className="space-y-4">
                  {roadmap.nodes.map((node, index) => (
                    <Card
                      key={node.id}
                      className={`cursor-pointer transition-all ${
                        selectedNode?.id === node.id
                          ? 'ring-2 ring-blue-500 shadow-md'
                          : 'hover:shadow-md'
                      } ${
                        completedNodes.has(node.id)
                          ? 'bg-green-50 border-green-200'
                          : ''
                      }`}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className="p-5">
                        <div className="flex items-start">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNodeCompletion(node.id);
                                }}
                                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors hover:border-green-500"
                              >
                                {completedNodes.has(node.id) ? (
                                  <CheckCircle className="w-6 h-6 text-green-600 fill-green-100" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="text-indigo-600">{getNodeIcon(node.node_type)}</div>
                                <h3 className="font-semibold text-gray-900">{node.title}</h3>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{node.description}</p>
                              {node.estimated_time && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{node.estimated_time}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-medium text-gray-500 ml-3">
                            Step {index + 1}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Node Detail */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 border border-gray-200">
              {selectedNode ? (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="text-indigo-600">{getNodeIcon(selectedNode.node_type)}</div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedNode.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{selectedNode.description}</p>
                  
                  {selectedNode.content && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Content</h4>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        {selectedNode.content}
                      </div>
                    </div>
                  )}

                  {selectedNode.video_url && (
                    <div className="mb-4">
                      <Button className="w-full" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  )}

                  {selectedNode.resources && selectedNode.resources.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Resources</h4>
                      <div className="space-y-2">
                        {selectedNode.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline bg-blue-50 p-2 rounded"
                          >
                            \ud83d\udd17 {resource.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => toggleNodeCompletion(selectedNode.id)}
                    className={`w-full ${
                      completedNodes.has(selectedNode.id)
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {completedNodes.has(selectedNode.id) ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-semibold mb-2">Select a step</p>
                  <p className="text-sm">Click on any node to view details and resources</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}