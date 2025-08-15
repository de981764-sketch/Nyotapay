import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KpiCard } from '@/components/ui/kpi-card';
import { LiveActivityFeed } from '@/components/dashboard/LiveActivityFeed';
import { SimpleChart } from '@/components/ui/simple-chart';
import { mockDataService } from '@/services/mockService';
import { Activity, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

export default function LiveActivity() {
  const { t } = useTranslation();
  const [kpis, setKpis] = useState(mockDataService.getKPIs());
  const [transactions, setTransactions] = useState(mockDataService.getRecentTransactions(20));
  const [chartData] = useState([
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 }
  ]);

  useEffect(() => {
    const cleanup = mockDataService.startLiveUpdates((data) => {
      setKpis(data.kpis);
      setTransactions(data.recentTransactions);
    });
    
    return cleanup;
  }, []);

  const activityKpis = [
    {
      title: 'Transactions/Second',
      value: kpis.transactionsPerSecond,
      icon: Activity,
      change: { value: 12, period: 'last hour' }
    },
    {
      title: 'Volume Today',
      value: `KES ${mockDataService.formatLargeNumber(kpis.totalVolume)}`,
      icon: TrendingUp,
      variant: 'success' as const,
      change: { value: 8.5, period: 'yesterday' }
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      icon: CheckCircle,
      variant: 'success' as const,
      change: { value: 0.3, period: 'last hour' }
    },
    {
      title: 'Failed Transactions',
      value: '127',
      icon: AlertTriangle,
      variant: 'warning' as const,
      change: { value: -15, period: 'last hour' }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Live Activity</h1>
        <p className="text-muted-foreground">Real-time transaction monitoring and activity feed</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <LiveActivityFeed transactions={transactions} />
        </div>

        {/* Activity Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Volume Trend</h3>
          <SimpleChart 
            data={chartData}
            height={300}
            color="hsl(var(--primary))"
          />
        </div>
      </div>

      {/* Regional Activity */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Regional Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map((region) => (
            <div key={region} className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{region}</span>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-numbers font-bold">{Math.floor(Math.random() * 500 + 100)}</p>
              <p className="text-sm text-muted-foreground">TPS</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
