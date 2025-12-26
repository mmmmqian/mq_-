
import React, { useId } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { MetricPoint } from '../../types';

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
  data: MetricPoint[];
}

interface MonitoringChartProps {
  data?: MetricPoint[]; // For backward compatibility with single series
  series?: SeriesConfig[]; // For multi-series support
  color?: string;
  height?: number;
  label?: string;
  unit?: string;
  showLegend?: boolean;
}

const MonitoringChart: React.FC<MonitoringChartProps> = ({ 
  data, 
  series,
  color = "#1B58F4", 
  height = 200, 
  label = "Utilization",
  unit = "%",
  showLegend = false
}) => {
  // Use unique ID to prevent SVG gradient ID collisions between multiple charts on the same page
  const chartId = useId().replace(/:/g, '');
  
  // If single data is provided, wrap it into the series format
  const activeSeries = series || [
    { key: 'value', name: label, color: color, data: data || [] }
  ];

  // Merge data for multiple series by time key
  const mergedData = React.useMemo(() => {
    if (series && series.length > 0) {
      const timeMap: Record<string, any> = {};
      series.forEach(s => {
        s.data.forEach(p => {
          if (!timeMap[p.time]) timeMap[p.time] = { time: p.time };
          timeMap[p.time][s.key] = p.value;
        });
      });
      return Object.values(timeMap).sort((a, b) => a.time.localeCompare(b.time));
    }
    return data || [];
  }, [data, series]);

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <AreaChart data={mergedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {activeSeries.map(s => (
              <linearGradient key={`grad-${s.key}`} id={`color-${chartId}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
            minTickGap={40}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.98)', 
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '12px'
            }}
            itemStyle={{ padding: '2px 0' }}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            formatter={(value: any, name: string) => [`${Math.round(value)}${unit}`, name]}
          />
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            />
          )}
          {activeSeries.map(s => (
            <Area 
              key={s.key}
              name={s.name}
              type="monotone" 
              dataKey={s.key} 
              stroke={s.color} 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill={`url(#color-${chartId}-${s.key})`} 
              animationDuration={1500}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonitoringChart;
