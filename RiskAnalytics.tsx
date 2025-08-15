import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KpiCard } from '@/components/ui/kpi-card';
import { SimpleChart } from '@/components/ui/simple-chart';
import { Badge } from '@/components/ui/badge';
import { mockDataService } from '@/services/mockService';
import { TrendingUp, AlertTriangle, Shield, BarChart3 } from 'lucide-react';

export default function RiskAnalytics() {
  const { t } = useTranslation();
  
  const [riskDistributionData] = useState([
    { name: 'Low', value: 65, color: 'hsl(var(--success))' },
    { name: 'Medium', value: 25, color: 'hsl(var(--warning))' },
    { name: 'High', value: 8, color: 'hsl(var(--destructive))' },
    { name: 'Critical', value: 2, color: 'hsl(var(--destructive))' }
  ]);

  const [trendData] = useState([
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 19 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 25 },
    { name: 'May', value: 22 },
    { name: 'Jun', value: 18 }
  ]);

  const riskKpis = [
    {
      title: 'Risk Score Average',
      value: '23.4',
      icon: BarChart3,
      change: { value: -5.2, period: 'last month' }
    },
    {
      title: 'High Risk Accounts',
      value: '1,247',
      icon: AlertTriangle,
      variant: 'warning' as const,
      change: { value: 8.1, period: 'last week' }
    },
    {
      title: 'Risk Incidents',
      value: '89',
      icon: Shield,
      variant: 'danger' as const,
      change: { value: -12.3, period: 'last month' }
    },
    {
      title: 'Mitigation Rate',
      value: '94.2%',
      icon: Shield,
      variant: 'success' as const,
      change: { value: 2.1, period: 'last week' }
    }
  ];

  const riskSegments = [
    { segment: 'New Customers', risk: 'Medium', accounts: 2456, percentage: 15.2 },
    { segment: 'High Volume', risk: 'High', accounts: 892, percentage: 8.3 },
    { segment: 'Cross Border', risk: 'High', accounts: 1234, percentage: 12.1 },
    { segment: 'Mobile Only', risk: 'Low', accounts: 8932, percentage: 45.6 },
    { segment: 'Bank Linked', risk: 'Low', accounts: 5643, percentage: 18.8 }
  ];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'default' as const;
      case 'medium': return 'secondary' as const;
      case 'high': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Risk Analytics</h1>
        <p className="text-muted-foreground">Monitor risk patterns and account scoring</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Score Distribution</h3>
          <SimpleChart
            data={riskDistributionData}
            type="pie"
            height={300}
            color="hsl(var(--primary))"
          />
        </div>

        {/* Risk Trend */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Incidents Trend</h3>
          <SimpleChart
            data={trendData}
            height={300}
            color="hsl(var(--destructive))"
          />
        </div>
      </div>

      {/* Risk Segments */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Risk by Customer Segments</h3>
        <div className="space-y-4">
          {riskSegments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium">{segment.segment}</h4>
                  <p className="text-sm text-muted-foreground">
                    {segment.accounts.toLocaleString()} accounts ({segment.percentage}%)
                  </p>
                </div>
              </div>
              <Badge variant={getRiskBadgeVariant(segment.risk)}>
                {segment.risk} Risk
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Heatmap */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Regional Risk Heatmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale'].map((region) => {
            const riskLevel = Math.random();
            const riskLabel = riskLevel > 0.7 ? 'High' : riskLevel > 0.4 ? 'Medium' : 'Low';
            const riskColor = riskLevel > 0.7 ? 'bg-destructive' : riskLevel > 0.4 ? 'bg-warning' : 'bg-success';
            
            return (
              <div key={region} className="p-4 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{region}</span>
                  <div className={`w-3 h-3 rounded-full ${riskColor}`}></div>
                </div>
                <p className="text-sm text-muted-foreground">{riskLabel} Risk</p>
                <p className="font-numbers text-lg">{Math.floor(riskLevel * 100)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
