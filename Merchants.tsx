import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KpiCard } from '@/components/ui/kpi-card';
import { mockDataService, Merchant } from '@/services/mockService';
import { Building2, TrendingUp, AlertTriangle, Search, Eye, Settings } from 'lucide-react';

export default function Merchants() {
  const { t } = useTranslation();
  const [merchants] = useState<Merchant[]>(mockDataService.getTopMerchants(50));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: Merchant['status']) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'inactive': return 'secondary' as const;
      case 'suspended': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const merchantKpis = [
    {
      title: 'Active Merchants',
      value: merchants.filter(m => m.status === 'active').length.toString(),
      icon: Building2,
      change: { value: 5.2, period: 'this month' }
    },
    {
      title: 'Total Volume',
      value: `KES ${mockDataService.formatLargeNumber(merchants.reduce((sum, m) => sum + m.volume, 0))}`,
      icon: TrendingUp,
      variant: 'success' as const,
      change: { value: 12.8, period: 'last month' }
    },
    {
      title: 'Suspended',
      value: merchants.filter(m => m.status === 'suspended').length.toString(),
      icon: AlertTriangle,
      variant: 'warning' as const
    },
    {
      title: 'Avg. Transaction',
      value: `KES ${Math.floor(merchants.reduce((sum, m) => sum + m.volume, 0) / merchants.reduce((sum, m) => sum + m.transactions, 0)).toLocaleString()}`,
      icon: TrendingUp,
      change: { value: 8.1, period: 'last week' }
    }
  ];

  const handleAction = (merchantId: string, action: string) => {
    console.log(`${action} merchant ${merchantId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Merchants</h1>
        <p className="text-muted-foreground">Manage merchant accounts and performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {merchantKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {merchants.slice(0, 3).map((merchant, index) => (
          <div key={merchant.id} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{merchant.name}</h4>
                  <p className="text-sm text-muted-foreground">{merchant.category}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(merchant.status)}>{merchant.status}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-numbers font-semibold">KES {mockDataService.formatLargeNumber(merchant.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transactions</span>
                <span className="font-numbers">{merchant.transactions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Merchant Management */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline">{filteredMerchants.length} merchants</Badge>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Avg. Transaction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{merchant.name}</p>
                        <p className="text-sm text-muted-foreground">{merchant.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{merchant.category}</Badge>
                  </TableCell>
                  <TableCell className="font-numbers">
                    KES {mockDataService.formatLargeNumber(merchant.volume)}
                  </TableCell>
                  <TableCell className="font-numbers">
                    {merchant.transactions.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-numbers">
                    KES {Math.floor(merchant.volume / merchant.transactions).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(merchant.status)}>
                      {merchant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(merchant.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(merchant.id, 'settings')}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
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
