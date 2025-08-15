import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KpiCard } from '@/components/ui/kpi-card';
import { SimpleChart } from '@/components/ui/simple-chart';
import { mockDataService, Transaction } from '@/services/mockService';
import { CreditCard, TrendingUp, CheckCircle, XCircle, Search, Eye, Download } from 'lucide-react';

export default function Transactions() {
  const { t } = useTranslation();
  const [transactions] = useState<Transaction[]>(mockDataService.getRecentTransactions(100));
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.location.county.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50);

  const getStatusVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'success': return 'default' as const;
      case 'pending': return 'secondary' as const;
      case 'failed': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getTypeVariant = (type: Transaction['type']) => {
    switch (type) {
      case 'P2P': return 'default' as const;
      case 'Merchant': return 'secondary' as const;
      case 'Bank': return 'outline' as const;
      case 'Bills': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successRate = (transactions.filter(t => t.status === 'success').length / transactions.length) * 100;
  const avgAmount = totalVolume / transactions.length;

  const [volumeData] = useState([
    { name: '6h ago', value: 2400 },
    { name: '5h ago', value: 1398 },
    { name: '4h ago', value: 9800 },
    { name: '3h ago', value: 3908 },
    { name: '2h ago', value: 4800 },
    { name: '1h ago', value: 3800 },
    { name: 'Now', value: 4300 }
  ]);

  const transactionKpis = [
    {
      title: 'Total Volume',
      value: `KES ${mockDataService.formatLargeNumber(totalVolume)}`,
      icon: TrendingUp,
      change: { value: 12.5, period: 'today' }
    },
    {
      title: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      icon: CheckCircle,
      variant: 'success' as const,
      change: { value: 2.1, period: 'yesterday' }
    },
    {
      title: 'Failed Transactions',
      value: transactions.filter(t => t.status === 'failed').length.toString(),
      icon: XCircle,
      variant: 'warning' as const
    },
    {
      title: 'Average Amount',
      value: `KES ${avgAmount.toLocaleString()}`,
      icon: CreditCard,
      change: { value: 5.8, period: 'last hour' }
    }
  ];

  const handleAction = (transactionId: string, action: string) => {
    console.log(`${action} transaction ${transactionId}`);
  };

  const handleExport = () => {
    console.log('Exporting transactions...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">Monitor all payment transactions</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {transactionKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Volume Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Volume (Last 6 Hours)</h3>
        <SimpleChart
          data={volumeData}
          height={200}
          color="hsl(var(--primary))"
        />
      </div>

      {/* Transaction Types Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['P2P', 'Merchant', 'Bank', 'Bills'].map((type) => {
          const typeTransactions = transactions.filter(t => t.type === type);
          const typeVolume = typeTransactions.reduce((sum, t) => sum + t.amount, 0);
          
          return (
            <div key={type} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={getTypeVariant(type as Transaction['type'])}>{type}</Badge>
                <span className="text-sm text-muted-foreground">{typeTransactions.length}</span>
              </div>
              <p className="font-numbers font-semibold text-lg">
                KES {mockDataService.formatLargeNumber(typeVolume)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((typeTransactions.length / transactions.length) * 100).toFixed(1)}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline">{filteredTransactions.length} transactions</Badge>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-numbers">
                    {transaction.currency} {transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {transaction.from}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {transaction.to}
                  </TableCell>
                  <TableCell>{transaction.location.county}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(transaction.id, 'view')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
