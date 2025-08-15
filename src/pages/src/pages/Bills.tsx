import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/ui/kpi-card';
import { SimpleChart } from '@/components/ui/simple-chart';
import { mockDataService, Biller } from '@/services/mockService';
import { Receipt, TrendingUp, CheckCircle, AlertTriangle, Settings, Eye } from 'lucide-react';

export default function Bills() {
  const { t } = useTranslation();
  const [billers] = useState<Biller[]>(mockDataService.getBillers());

  const getStatusVariant = (status: Biller['status']) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'maintenance': return 'secondary' as const;
      case 'down': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getCategoryIcon = (category: Biller['category']) => {
    // Return same icon for now, could be enhanced with specific icons
    return Receipt;
  };

  const totalVolume = billers.reduce((sum, b) => sum + b.totalVolume, 0);
  const totalTransactions = billers.reduce((sum, b) => sum + b.transactionCount, 0);
  const avgSuccessRate = billers.reduce((sum, b) => sum + b.successRate, 0) / billers.length;

  const [volumeData] = useState([
    { name: 'Utilities', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Telecom', value: 30, color: 'hsl(var(--success))' },
    { name: 'Government', value: 15, color: 'hsl(var(--warning))' },
    { name: 'Insurance', value: 7, color: 'hsl(var(--destructive))' },
    { name: 'Education', value: 3, color: 'hsl(var(--muted-foreground))' }
  ]);

  const billKpis = [
    {
      title: 'Total Volume',
      value: `KES ${mockDataService.formatLargeNumber(totalVolume)}`,
      icon: TrendingUp,
      change: { value: 15.2, period: 'this month' }
    },
    {
      title: 'Active Billers',
      value: billers.filter(b => b.status === 'active').length.toString(),
      icon: Receipt,
      variant: 'success' as const
    },
    {
      title: 'Success Rate',
      value: `${(avgSuccessRate * 100).toFixed(1)}%`,
      icon: CheckCircle,
      variant: 'success' as const,
      change: { value: 2.1, period: 'last week' }
    },
    {
      title: 'Issues',
      value: billers.filter(b => b.status !== 'active').length.toString(),
      icon: AlertTriangle,
      variant: 'warning' as const
    }
  ];

  const handleAction = (billerId: string, action: string) => {
    console.log(`${action} biller ${billerId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Bills & Utilities</h1>
        <p className="text-muted-foreground">Manage utility payments and biller integrations</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume by Category */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Volume by Category</h3>
          <SimpleChart
            data={volumeData}
            type="pie"
            height={300}
            color="hsl(var(--primary))"
          />
        </div>

        {/* SLA Compliance */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">SLA Compliance</h3>
          <div className="space-y-4">
            {billers.slice(0, 5).map((biller) => (
              <div key={biller.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{biller.name}</p>
                    <p className="text-sm text-muted-foreground">{biller.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-numbers font-semibold">
                    {(biller.slaCompliance * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">compliance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Biller Management */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Biller Directory</h3>
          <div className="flex gap-2">
            <Badge variant="outline">{billers.length} billers</Badge>
            <Badge variant={billers.some(b => b.status !== 'active') ? 'destructive' : 'default'}>
              {billers.filter(b => b.status === 'active').length} active
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>SLA Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billers.map((biller) => {
                const CategoryIcon = getCategoryIcon(biller.category);
                
                return (
                  <TableRow key={biller.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{biller.name}</p>
                          <p className="text-sm text-muted-foreground">{biller.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {biller.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-numbers">
                      KES {mockDataService.formatLargeNumber(biller.totalVolume)}
                    </TableCell>
                    <TableCell className="font-numbers">
                      {biller.transactionCount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success"
                            style={{ width: `${biller.successRate * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-numbers">
                          {(biller.successRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${biller.slaCompliance * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-numbers">
                          {(biller.slaCompliance * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(biller.status)}>
                        {biller.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(biller.id, 'view')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(biller.id, 'settings')}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
