// src/components/WorkflowDiagram.js
import React from 'react';
import ReactFlow from 'react-flow-renderer';

// Define your nodes and edges here
const nodes = [
  { id: '1', data: { label: 'Début' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Étape 1' }, position: { x: 250, y: 100 } },
  { id: '3', data: { label: 'Étape 2' }, position: { x: 250, y: 200 } },
  { id: '4', data: { label: 'Fin' }, position: { x: 250, y: 300 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

const WorkflowDiagram = () => {
  return (
    <div style={{ height: '500px' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
};

export default WorkflowDiagram;
