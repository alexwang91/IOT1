
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SpectrumBand } from '../types';

interface SpectrumChartProps {
  data: SpectrumBand[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SpectrumBand;
    return (
      <div className="bg-foreground text-white p-6 border-l-[10px] border-primary shadow-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-12">
            <span className="font-serif text-xl italic tracking-tighter leading-none">{data.band}</span>
            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold uppercase tracking-[0.2em]">
              {data.technology}
            </span>
          </div>
          <div className="h-[1px] bg-white/10" />
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest">Coverage</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif italic text-primary leading-none">{data.coverage}</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest">Capacity</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif italic text-white leading-none">{data.capacity}</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SpectrumChart: React.FC<SpectrumChartProps> = ({ data }) => {
  return (
    <div className="h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 90 }}
        >
          <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#E5E7EB" strokeWidth={1} />
          <XAxis 
            dataKey="band" 
            axisLine={false} 
            tickLine={false} 
            height={80}
            tick={{ fill: '#111827', fontSize: 10, fontWeight: 700, fontFamily: 'Inter', textAnchor: 'end' }}
            angle={-45}
            dx={-5}
            dy={10}
            interval={0}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#111827', fontSize: 9, fontWeight: 500, fontFamily: 'JetBrains Mono' }} 
            domain={[0, 100]}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6', opacity: 0.4 }}
            content={<CustomTooltip />}
            allowEscapeViewBox={{ x: true, y: true }}
          />
          <Bar 
            dataKey="coverage" 
            name="Coverage" 
            radius={[0, 0, 0, 0]} 
            barSize={18}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-cov-${index}`} fill="#3B82F6" className="hover:opacity-80 cursor-pointer" />
            ))}
          </Bar>
          <Bar 
            dataKey="capacity" 
            name="Capacity" 
            radius={[0, 0, 0, 0]} 
            barSize={18}
            isAnimationActive={false}
          >
             {data.map((entry, index) => (
              <Cell key={`cell-cap-${index}`} fill="#111827" className="hover:opacity-80 cursor-pointer" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumChart;
