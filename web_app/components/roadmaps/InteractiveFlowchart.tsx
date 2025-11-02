'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RoadmapNode } from '@/types';
import { BookOpen, Link as LinkIcon, FileText, CheckCircle, Circle, Target } from 'lucide-react';

interface InteractiveFlowchartProps {
  nodes: RoadmapNode[];
  onNodeClick?: (node: RoadmapNode) => void;
  completedNodeIds?: Set<string>;
}

// Custom node component
const CustomNode = ({ data }: unknown) => {
  const isCompleted = data.isCompleted;
  const nodeType = data.nodeType;
  
  const getNodeIcon = () => {
    switch (nodeType) {
      case 'roadmap_link':
        return <LinkIcon className="w-4 h-4" />;
      case 'article_link':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getNodeStyles = () => {
    if (isCompleted) {
      return 'bg-green-50 border-green-500 shadow-green-200';
    }
    switch (nodeType) {
      case 'roadmap_link':
        return 'bg-purple-50 border-purple-400 shadow-purple-200';
      case 'article_link':
        return 'bg-orange-50 border-orange-400 shadow-orange-200';
      default:
        return 'bg-blue-50 border-blue-400 shadow-blue-200';
    }
  };

  const getIconColor = () => {
    if (isCompleted) return 'text-green-600';
    switch (nodeType) {
      case 'roadmap_link':
        return 'text-purple-600';
      case 'article_link':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 shadow-lg ${getNodeStyles()} min-w-[220px] max-w-[280px] cursor-pointer hover:shadow-xl transition-all duration-200`}
      style={{ borderColor: data.color || undefined }}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : getNodeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 leading-tight break-words">
            {data.label}
          </div>
        </div>
      </div>
      {data.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{data.description}</p>
      )}
      {data.estimatedTime && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Target className="w-3 h-3" />
          <span>{data.estimatedTime}</span>
        </div>
      )}
      {data.icon && (
        <div className="absolute -top-2 -right-2 text-2xl bg-white rounded-full p-1 shadow-md">
          {data.icon}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function InteractiveFlowchart({
  nodes: roadmapNodes,
  onNodeClick,
  completedNodeIds = new Set(),
}: InteractiveFlowchartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Convert roadmap nodes to ReactFlow format
  useEffect(() => {
    if (roadmapNodes && roadmapNodes.length > 0) {
      const flowNodes: Node[] = roadmapNodes.map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: node.position_x || 0, y: node.position_y || 0 },
        data: {
          label: node.title,
          description: node.description,
          estimatedTime: node.estimated_time,
          nodeType: node.node_type || 'content',
          content: node.content,
          color: node.color,
          icon: node.icon,
          isCompleted: completedNodeIds.has(node.id),
          nodeData: node,
        },
      }));

      const flowEdges: Edge[] = [];
      roadmapNodes.forEach((node) => {
        node.child_nodes?.forEach((childId) => {
          const isCompleted =
            completedNodeIds.has(node.id) && completedNodeIds.has(childId);
          flowEdges.push({
            id: `${node.id}-${childId}`,
            source: node.id,
            target: childId,
            type: 'smoothstep',
            animated: !isCompleted,
            style: {
              stroke: isCompleted ? '#10b981' : '#94a3b8',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isCompleted ? '#10b981' : '#94a3b8',
            },
          });
        });
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [roadmapNodes, completedNodeIds, setNodes, setEdges]);

  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      if (onNodeClick && node.data.nodeData) {
        onNodeClick(node.data.nodeData);
      }
    },
    [onNodeClick]
  );

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (roadmapNodes.length === 0) return 0;
    return Math.round((completedNodeIds.size / roadmapNodes.length) * 100);
  }, [roadmapNodes, completedNodeIds]);

  return (
    <div className="w-full h-[700px] border-2 border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 shadow-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls className="bg-white border-2 border-gray-300 rounded-lg shadow-lg" />
        <MiniMap
          className="bg-white border-2 border-gray-300 rounded-lg shadow-lg"
          nodeColor={(node) => {
            if (completedNodeIds.has(node.id)) return '#10b981';
            return node.data.color || '#3b82f6';
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />

        {/* Legend Panel */}
        <Panel position="top-right" className="bg-white p-4 rounded-xl shadow-xl border-2 border-gray-200">
          <div className="text-sm space-y-3">
            <div className="font-bold text-gray-900 text-base mb-3">Legend</div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Content Node</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700">Roadmap Link</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <span className="text-gray-700">Article Link</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Progress</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-green-600">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Instructions Panel */}
        <Panel position="bottom-left" className="bg-white p-3 rounded-xl shadow-xl border-2 border-gray-200 max-w-xs">
          <div className="text-xs text-gray-600">
            <p className="font-semibold text-gray-900 mb-2">💡 Quick Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Click nodes to view details</li>
              <li>Drag to move around</li>
              <li>Scroll to zoom in/out</li>
              <li>Follow arrows for learning path</li>
            </ul>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
