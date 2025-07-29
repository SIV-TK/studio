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
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-destructive" />
                <CardTitle>Heart Rate</CardTitle>
              </div>
              <div className="text-2xl font-bold text-destructive">
                {currentHeartRate} BPM
              </div>
            </div>
            <CardDescription>
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
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bed className="h-6 w-6 text-primary" />
              <CardTitle>Sleep Patterns</CardTitle>
            </div>
            <CardDescription>
              Your sleep duration over the last week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={sleepChartConfig}
              className="h-[200px] w-full"
            >
              <BarChart data={sleepData} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}h`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="hours"
                  fill="hsl(var(--primary))"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-accent-foreground" />
              <CardTitle>Activity Levels</CardTitle>
            </div>
            <CardDescription>
              Your step count over the last week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={activityChartConfig}
              className="h-[200px] w-full"
            >
              <BarChart data={activityData} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="steps"
                  fill="hsl(var(--accent))"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
