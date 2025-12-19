
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
      <div className="bg-foreground text-white p-6 border-l-8 border-primary animate-none">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-12">
            <span className="font-black text-2xl italic tracking-tighter leading-none">{data.band}</span>
            <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">
              {data.technology}
            </span>
          </div>
          <div className="h-[2px] bg-white/10" />
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-black text-white/30 uppercase tracking-widest">Coverage</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black italic text-primary leading-none">{data.coverage}</span>
                <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-black text-white/30 uppercase tracking-widest">Capacity</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black italic text-white leading-none">{data.capacity}</span>
                <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">%</span>
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
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#E5E7EB" strokeWidth={2} />
          <XAxis 
            dataKey="band" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#111827', fontSize: 11, fontWeight: 900, fontFamily: 'Outfit', textAnchor: 'middle' }}
            dy={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#111827', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }} 
            domain={[0, 100]}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6', radius: 0 }}
            content={<CustomTooltip />}
            allowEscapeViewBox={{ x: true, y: true }}
            position={{ y: -100 }}
          />
          <Bar 
            dataKey="coverage" 
            name="Coverage" 
            radius={[0, 0, 0, 0]} 
            barSize={32}
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
            barSize={32}
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
