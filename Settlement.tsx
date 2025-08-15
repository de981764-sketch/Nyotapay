import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/ui/kpi-card';
import { SimpleChart } from '@/components/ui/simple-chart';
import { mockDataService, type Settlement } from '@/services/mockService';
import { Banknote, Clock, CheckCircle, AlertTriangle, RefreshCw, Eye } from 'lucide-react';

export default function Settlement() {
  const { t } = useTranslation();
  const [settlements] = useState<Settlement[]>(mockDataService.getSettlements());

  const getStatusVariant = (status: Settlement['status']) => {
    switch (status) {
      case 'completed': return 'default' as const;
      case 'pending': return 'secondary' as const;
      case 'failed': return 'destructive' as const;
      case 'processing': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const totalSettled = settlements
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const pendingAmount = settlements
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  const [settlementTrendData] = useState([
    { name: 'Mon', value: 2400000 },
    { name: 'Tue', value: 1398000 },
    { name: 'Wed', value: 9800000 },
    { name: 'Thu', value: 3908000 },
    { name: 'Fri', value: 4800000 },
    { name: 'Sat', value: 3800000 },
    { name: 'Sun', value: 4300000 }
  ]);

  const settlementKpis = [
    {
      title: 'Total Settled',
      value: `KES ${mockDataService.formatLargeNumber(totalSettled)}`,
      icon: CheckCircle,
      variant: 'success' as const,
      change: { value: 8.2, period: 'today' }
    },
    {
      title: 'Pending Amount',
      value: `KES ${mockDataService.formatLargeNumber(pendingAmount)}`,
      icon: Clock,
      variant: 'warning' as const
    },
    {
      title: 'Failed Settlements',
      value: settlements.filter(s => s.status === 'failed').length.toString(),
      icon: AlertTriangle,
      variant: 'danger' as const
    },
    {
      title: 'Total Fees',
      value: `KES ${mockDataService.formatLargeNumber(settlements.reduce((sum, s) => sum + s.fees, 0))}`,
      icon: Banknote,
      change: { value: 12.5, period: 'this week' }
    }
  ];

  const handleAction = (settlementId: string, action: string) => {
    console.log(`${action} settlement ${settlementId}`);
  };

  const handleRetrySettlement = (settlementId: string) => {
    console.log(`Retrying settlement ${settlementId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Settlement</h1>
        <p className="text-muted-foreground">Monitor bank settlements and reconciliation</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {settlementKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settlement Trend */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Settlement Trend</h3>
          <SimpleChart
            data={settlementTrendData}
            height={300}
            color="hsl(var(--success))"
          />
        </div>

        {/* Bank Status */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Bank Settlement Status</h3>
          <div className="space-y-4">
            {['KCB Bank', 'Equity Bank', 'Cooperative Bank', 'NCBA Bank', 'Absa Bank'].map((bank, index) => {
              const bankSettlements = settlements.filter(s => s.bankName === bank);
              const completedCount = bankSettlements.filter(s => s.status === 'completed').length;
              const pendingCount = bankSettlements.filter(s => s.status === 'pending').length;
              const failedCount = bankSettlements.filter(s => s.status === 'failed').length;
              
              return (
                <div key={bank} className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{bank}</h4>
                    <div className="flex gap-2">
                      {completedCount > 0 && (
                        <Badge variant="default" className="text-xs">
                          {completedCount} complete
                        </Badge>
                      )}
                      {pendingCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {pendingCount} pending
                        </Badge>
                      )}
                      {failedCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {failedCount} failed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Last settlement: 15 min ago</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settlement Transactions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Settlements</h3>
          <div className="flex gap-2">
            <Badge variant="outline">{settlements.length} settlements</Badge>
            <Button size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Settlement ID</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell className="font-mono text-sm">
                    {settlement.id}
                  </TableCell>
                  <TableCell>{settlement.bankName}</TableCell>
                  <TableCell className="font-numbers">
                    {settlement.currency} {settlement.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-numbers">
                    {settlement.transactionCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-numbers">
                    KES {settlement.fees.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {settlement.scheduledAt.toLocaleDateString()}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {settlement.scheduledAt.toLocaleTimeString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {settlement.completedAt ? (
                      <>
                        {settlement.completedAt.toLocaleDateString()}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {settlement.completedAt.toLocaleTimeString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(settlement.status)}>
                      {settlement.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(settlement.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {settlement.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRetrySettlement(settlement.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
