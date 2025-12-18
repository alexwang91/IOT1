import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SpectrumBand } from '../types';

interface SpectrumChartProps {
  data: SpectrumBand[];
}

const SpectrumChart: React.FC<SpectrumChartProps> = ({ data }) => {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barGap={12}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(163, 177, 198, 0.3)" vertical={false} />
          <XAxis 
            dataKey="band" 
            stroke="#3D4852" 
            fontSize={12} 
            fontWeight={700}
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={11} 
            fontWeight={600}
            tickLine={false} 
            axisLine={false}
            domain={[0, 100]} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#E0E5EC', 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
              padding: '12px'
            }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '30px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            iconType="circle"
          />
          <Bar name="Coverage Score" dataKey="coverage" fill="#6C63FF" radius={[6, 6, 0, 0]} />
          <Bar name="Capacity Score" dataKey="capacity" fill="#38B2AC" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumChart;