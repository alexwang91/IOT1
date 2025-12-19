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
      <div className="bg-white border border-border p-4 rounded-2xl shadow-xl shadow-accent/5 backdrop-blur-md animate-fade-in-up">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-8">
            <span className="font-display text-lg text-foreground leading-none">{data.band}</span>
            <span className="px-2 py-1 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest rounded-md border border-accent/10">
              {data.technology}
            </span>
          </div>
          <div className="h-px bg-border/50" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Coverage</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display text-accent leading-none">{data.coverage}</span>
                <span className="text-[10px] text-muted-foreground font-bold">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Capacity</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display text-accent-secondary leading-none">{data.capacity}</span>
                <span className="text-[10px] text-muted-foreground font-bold">%</span>
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
            cursor={{ fill: 'rgba(0, 82, 255, 0.05)', radius: 12 }}
            content={<CustomTooltip />}
            allowEscapeViewBox={{ x: false, y: true }}
          />
          <Bar 
            dataKey="coverage" 
            name="Coverage" 
            radius={[6, 6, 0, 0]} 
            barSize={28}
            isAnimationActive={true}
            animationDuration={1500}
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-cov-${index}`} fill="#0052FF" className="hover:opacity-80 transition-opacity cursor-pointer" />
            ))}
          </Bar>
          <Bar 
            dataKey="capacity" 
            name="Capacity" 
            radius={[6, 6, 0, 0]} 
            barSize={28}
            isAnimationActive={true}
            animationDuration={1500}
            animationBegin={500}
          >
             {data.map((entry, index) => (
              <Cell key={`cell-cap-${index}`} fill="#4D7CFF" opacity={0.4} className="hover:opacity-60 transition-opacity cursor-pointer" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpectrumChart;