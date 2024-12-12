// src/dashboard/WorkflowChart.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Workflows Complétés', value: 7 },
  { name: 'Workflows En Cours', value: 5 },
];

const COLORS = ['#00C49F', '#FFBB28'];

const WorkflowChart = () => {
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={100}
        cy={100}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default WorkflowChart;
