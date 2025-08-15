import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KpiCard } from '@/components/ui/kpi-card';
import { SimpleChart } from '@/components/ui/simple-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockDataService } from '@/services/mockService';
import { Brain, TrendingUp, Target, Lightbulb, AlertTriangle, DollarSign } from 'lucide-react';

export default function AIInsights() {
  const { t } = useTranslation();
  
  const [forecastData] = useState([
    { name: 'Week 1', value: 2400000, predicted: 2450000 },
    { name: 'Week 2', value: 1398000, predicted: 1420000 },
    { name: 'Week 3', value: 9800000, predicted: 9950000 },
    { name: 'Week 4', value: 3908000, predicted: 4100000 },
    { name: 'Week 5', predicted: 4200000 },
    { name: 'Week 6', predicted: 3800000 },
    { name: 'Week 7', predicted: 4500000 }
  ]);

  const [riskPredictionData] = useState([
    { name: 'Low Risk', value: 75, color: 'hsl(var(--success))' },
    { name: 'Medium Risk', value: 20, color: 'hsl(var(--warning))' },
    { name: 'High Risk', value: 5, color: 'hsl(var(--destructive))' }
  ]);

  const aiKpis = [
    {
      title: 'Fraud Detection Rate',
      value: '94.7%',
      icon: Brain,
      variant: 'success' as const,
      change: { value: 3.2, period: 'this month' }
    },
    {
      title: 'Revenue Prediction',
      value: `KES ${mockDataService.formatLargeNumber(15670000)}`,
      icon: TrendingUp,
      change: { value: 12.8, period: 'next month' }
    },
    {
      title: 'Optimization Score',
      value: '87%',
      icon: Target,
      variant: 'success' as const,
      change: { value: 5.1, period: 'last update' }
    },
    {
      title: 'Model Accuracy',
      value: '92.3%',
      icon: Brain,
      change: { value: 1.5, period: 'this week' }
    }
  ];

  const insights = [
    {
      type: 'opportunity',
      title: 'Fee Optimization Opportunity',
      description: 'Reducing P2P fees by 5% in Nairobi region could increase volume by 23% while maintaining 89% of current revenue.',
      impact: 'High',
      confidence: 92,
      icon: DollarSign
    },
    {
      type: 'risk',
      title: 'Fraud Pattern Alert',
      description: 'Detected emerging fraud pattern: Multiple accounts using similar device fingerprints in Mombasa region.',
      impact: 'Critical',
      confidence: 87,
      icon: AlertTriangle
    },
    {
      type: 'growth',
      title: 'Market Expansion',
      description: 'Nakuru region shows 45% month-over-month growth. Consider increasing merchant acquisition efforts.',
      impact: 'Medium',
      confidence: 78,
      icon: TrendingUp
    },
    {
      type: 'optimization',
      title: 'Peak Hour Strategy',
      description: 'Transaction success rate drops to 94% during 7-9 PM. Auto-scaling could improve performance.',
      impact: 'Medium',
      confidence: 85,
      icon: Lightbulb
    }
  ];

  const getInsightBadgeVariant = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'destructive' as const;
      case 'high': return 'secondary' as const;
      case 'medium': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const getInsightIconColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-success';
      case 'risk': return 'text-destructive';
      case 'growth': return 'text-primary';
      case 'optimization': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">AI Insights</h1>
        <p className="text-muted-foreground">Machine learning powered analytics and predictions</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Forecast (Next 7 Weeks)</h3>
          <SimpleChart
            data={forecastData}
            height={300}
            color="hsl(var(--primary))"
          />
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/50 rounded-full"></div>
              <span>Predicted</span>
            </div>
          </div>
        </div>

        {/* Risk Prediction */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution Prediction</h3>
          <SimpleChart
            data={riskPredictionData}
            type="pie"
            height={300}
            color="hsl(var(--primary))"
          />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
          <Button size="sm" variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className="p-4 border border-border rounded-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted/30 rounded-xl flex items-center justify-center">
                      <IconComponent className={`w-5 h-5 ${getInsightIconColor(insight.type)}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{insight.type}</p>
                    </div>
                  </div>
                  <Badge variant={getInsightBadgeVariant(insight.impact)}>
                    {insight.impact}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-numbers">{insight.confidence}%</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Performance */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Fraud Detection', accuracy: 94.7, lastTrained: '2 days ago' },
            { name: 'Revenue Prediction', accuracy: 87.3, lastTrained: '1 week ago' },
            { name: 'Risk Scoring', accuracy: 92.1, lastTrained: '3 days ago' }
          ].map((model, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{model.name}</h4>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="font-numbers font-semibold">{model.accuracy}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success"
                    style={{ width: `${model.accuracy}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Last trained: {model.lastTrained}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
