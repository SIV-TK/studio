'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { HeartPulse, Bed, Zap } from 'lucide-react';

const initialHeartRateData = [
  { time: '12:00', value: 72 },
  { time: '12:05', value: 75 },
  { time: '12:10', value: 78 },
  { time: '12:15', value: 74 },
  { time: '12:20', value: 80 },
  { time: '12:25', value: 79 },
  { time: '12:30', value: 82 },
];

const sleepData = [
  { day: 'Mon', hours: 6.5 },
  { day: 'Tue', hours: 7 },
  { day: 'Wed', hours: 8 },
  { day: 'Thu', hours: 6 },
  { day: 'Fri', hours: 7.5 },
  { day: 'Sat', hours: 9 },
  { day: 'Sun', hours: 7 },
];

const activityData = [
  { day: 'Mon', steps: 8000 },
  { day: 'Tue', steps: 9500 },
  { day: 'Wed', steps: 11000 },
  { day: 'Thu', steps: 7500 },
  { day: 'Fri', steps: 12000 },
  { day: 'Sat', steps: 15000 },
  { day: 'Sun', steps: 8500 },
];

const heartRateChartConfig = {
  value: {
    label: 'Heart Rate',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const sleepChartConfig = {
  hours: {
    label: 'Sleep',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const activityChartConfig = {
  steps: {
    label: 'Steps',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function AnalyticsDashboard() {
  const [heartRateData, setHeartRateData] = useState(initialHeartRateData);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newValue = 65 + Math.floor(Math.random() * 20);

      setHeartRateData((prevData) => [...prevData.slice(1), { time: newTime, value: newValue }]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const currentHeartRate = useMemo(() => {
    return heartRateData[heartRateData.length -1].value;
  }, [heartRateData]);

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          Real-Time Health Analytics
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Your live health dashboard.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-full">
                <Bed className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-indigo-900">Sleep Patterns</CardTitle>
            </div>
            <CardDescription className="text-indigo-700">
              Your sleep duration over the last week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={sleepChartConfig}
              className="h-[200px] w-full"
            >
              <BarChart data={sleepData} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#e0e7ff" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#4f46e5' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}h`}
                  tick={{ fill: '#4f46e5' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="hours"
                  fill="url(#sleepGradient)"
                  radius={4}
                />
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <HeartPulse className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-900">Heart Rate</CardTitle>
              </div>
              <div className="text-2xl font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                {currentHeartRate} BPM
              </div>
            </div>
            <CardDescription className="text-red-700">
              Live monitoring of your heart rate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={heartRateChartConfig}
              className="h-[200px] w-full"
            >
              <LineChart
                data={heartRateData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#fecaca" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#dc2626' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tick={{ fill: '#dc2626' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#dc2626' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-emerald-900">Activity Levels</CardTitle>
            </div>
            <CardDescription className="text-emerald-700">
              Your step count over the last week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={activityChartConfig}
              className="h-[200px] w-full"
            >
              <BarChart data={activityData} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#d1fae5" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#059669' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value / 1000}k`}
                  tick={{ fill: '#059669' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="steps"
                  fill="url(#activityGradient)"
                  radius={4}
                />
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
