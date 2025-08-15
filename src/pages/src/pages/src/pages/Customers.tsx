import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KpiCard } from '@/components/ui/kpi-card';
import { mockDataService, Customer } from '@/services/mockService';
import { Users, UserCheck, UserX, Search, Eye, Ban, Flag } from 'lucide-react';

export default function Customers() {
  const { t } = useTranslation();
  const [customers] = useState<Customer[]>(mockDataService.getCustomers());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50); // Show first 50 results

  const getKycStatusVariant = (status: Customer['kycStatus']) => {
    switch (status) {
      case 'verified': return 'default' as const;
      case 'pending': return 'secondary' as const;
      case 'rejected': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getRiskVariant = (level: Customer['riskLevel']) => {
    switch (level) {
      case 'low': return 'default' as const;
      case 'medium': return 'secondary' as const;
      case 'high': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getStatusVariant = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'suspended': return 'secondary' as const;
      case 'blocked': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const customerKpis = [
    {
      title: 'Total Customers',
      value: customers.length.toLocaleString(),
      icon: Users,
      change: { value: 12.5, period: 'this month' }
    },
    {
      title: 'KYC Verified',
      value: customers.filter(c => c.kycStatus === 'verified').length.toLocaleString(),
      icon: UserCheck,
      variant: 'success' as const,
      change: { value: 8.2, period: 'this week' }
    },
    {
      title: 'High Risk',
      value: customers.filter(c => c.riskLevel === 'high').length.toString(),
      icon: UserX,
      variant: 'warning' as const
    },
    {
      title: 'Active Today',
      value: Math.floor(customers.length * 0.65).toLocaleString(),
      icon: Users,
      variant: 'success' as const,
      change: { value: 15.3, period: 'yesterday' }
    }
  ];

  const handleAction = (customerId: string, action: string) => {
    console.log(`${action} customer ${customerId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Customers</h1>
        <p className="text-muted-foreground">Manage customer accounts and KYC status</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{filteredCustomers.length} results</Badge>
          </div>
        </div>

        {/* Customer Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Total Volume</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">{customer.phone}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.region}</TableCell>
                  <TableCell>
                    <Badge variant={getKycStatusVariant(customer.kycStatus)}>
                      {customer.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskVariant(customer.riskLevel)}>
                      {customer.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-numbers">
                    {customer.totalTransactions.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-numbers">
                    KES {customer.totalVolume.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {customer.lastActive.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(customer.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(customer.id, 'flag')}
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(customer.id, 'suspend')}
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
