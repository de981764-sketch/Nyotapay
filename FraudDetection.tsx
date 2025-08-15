import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/ui/kpi-card';
import { mockDataService, FraudCase } from '@/services/mockService';
import { Shield, AlertTriangle, Eye, Ban, Flag } from 'lucide-react';

export default function FraudDetection() {
  const { t } = useTranslation();
  const [fraudCases] = useState<FraudCase[]>(mockDataService.getFraudCases());

  const getSeverityVariant = (severity: FraudCase['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive' as const;
      case 'high': return 'destructive' as const;
      case 'medium': return 'secondary' as const;
      case 'low': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const getStatusVariant = (status: FraudCase['status']) => {
    switch (status) {
      case 'open': return 'destructive' as const;
      case 'investigating': return 'secondary' as const;
      case 'resolved': return 'default' as const;
      case 'false_positive': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const fraudKpis = [
    {
      title: 'Active Cases',
      value: fraudCases.filter(c => c.status === 'open').length,
      icon: AlertTriangle,
      variant: 'danger' as const
    },
    {
      title: 'Fraud Rate',
      value: '0.12%',
      icon: Shield,
      change: { value: -5, period: 'last week' }
    },
    {
      title: 'Amount at Risk',
      value: `KES ${mockDataService.formatLargeNumber(fraudCases.reduce((sum, c) => sum + c.amount, 0))}`,
      icon: AlertTriangle,
      variant: 'warning' as const
    },
    {
      title: 'Resolved Today',
      value: fraudCases.filter(c => c.status === 'resolved').length,
      icon: Shield,
      variant: 'success' as const,
      change: { value: 23, period: 'yesterday' }
    }
  ];

  const handleAction = (caseId: string, action: string) => {
    console.log(`${action} case ${caseId}`);
    // Mock action - in real app would update case status
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Fraud Detection</h1>
        <p className="text-muted-foreground">Monitor and investigate suspicious activities</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fraudKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Fraud Cases Table */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Fraud Cases</h3>
          <div className="flex gap-2">
            <Badge variant="destructive">{fraudCases.filter(c => c.status === 'open').length} Open</Badge>
            <Badge variant="secondary">{fraudCases.filter(c => c.status === 'investigating').length} Investigating</Badge>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraudCases.map((fraudCase) => (
                <TableRow key={fraudCase.id}>
                  <TableCell className="font-mono">{fraudCase.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{fraudCase.accountName}</p>
                      <p className="text-sm text-muted-foreground">{fraudCase.accountId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {fraudCase.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-numbers">
                    KES {fraudCase.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(fraudCase.severity)}>
                      {fraudCase.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(fraudCase.status)}>
                      {fraudCase.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{fraudCase.region}</TableCell>
                  <TableCell>{fraudCase.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAction(fraudCase.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAction(fraudCase.id, 'flag')}
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAction(fraudCase.id, 'freeze')}
                      >
                        <Ban className="w-4 h-4" />
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
