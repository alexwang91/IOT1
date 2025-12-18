import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SpectrumBand } from '../types';

interface SpectrumChartProps {
  data: SpectrumBand[];
}

const SpectrumChart: React.FC<SpectrumChartProps> = ({ data }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          <XAxis 
            dataKey="band" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            domain={[0, 100]}
          />
          <Tooltip 
            cursor={{ fill: '#F1F5F9', radius: 8 }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #E2E8F0', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 600
            }}
          />
          <Bar 
            dataKey="coverage" 
            name="Coverage" 
            radius={[4, 4, 0, 0]} 
            barSize={24}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#0052FF" />
            ))}
          </Bar>
          <Bar 
            dataKey="capacity" 
            name="Capacity" 
            radius={[4, 4, 0, 0]} 
            barSize={24}
          >
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#4D7CFF" opacity={0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumChart;