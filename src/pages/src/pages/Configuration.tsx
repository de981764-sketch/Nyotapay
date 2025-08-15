import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { KpiCard } from '@/components/ui/kpi-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Users, 
  Shield, 
  DollarSign, 
  Globe, 
  Save, 
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export default function Configuration() {
  const { t } = useTranslation();
  
  // Mock configuration data
  const [feeConfig, setFeeConfig] = useState({
    p2pFeePercent: 1.5,
    merchantFeePercent: 2.0,
    bankFeeFlat: 25,
    billsFeePercent: 0.5
  });

  const [limits, setLimits] = useState({
    dailyTransactionLimit: 100000,
    monthlyLimit: 1000000,
    singleTransactionLimit: 50000
  });

  const [features, setFeatures] = useState({
    autoSettlement: true,
    fraudDetection: true,
    smsNotifications: true,
    emailAlerts: true,
    multiCurrency: false,
    advancedReporting: true
  });

  const [auditLogs] = useState([
    {
      id: '1',
      action: 'Fee Configuration Updated',
      user: 'admin@nyotapay.com',
      timestamp: new Date(Date.now() - 300000),
      details: 'P2P fee changed from 1.2% to 1.5%'
    },
    {
      id: '2',
      action: 'User Role Modified',
      user: 'manager@nyotapay.com',
      timestamp: new Date(Date.now() - 1800000),
      details: 'Added Risk Analyst role to user john.doe@nyotapay.com'
    },
    {
      id: '3',
      action: 'Feature Toggle',
      user: 'admin@nyotapay.com',
      timestamp: new Date(Date.now() - 3600000),
      details: 'Enabled Advanced Reporting feature'
    }
  ]);

  const [systemUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@nyotapay.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 1800000)
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@nyotapay.com',
      role: 'Risk Analyst',
      status: 'active',
      lastLogin: new Date(Date.now() - 7200000)
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@nyotapay.com',
      role: 'Operations',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 86400000)
    }
  ]);

  const configKpis = [
    {
      title: 'Active Users',
      value: systemUsers.filter(u => u.status === 'active').length.toString(),
      icon: Users,
      variant: 'success' as const
    },
    {
      title: 'System Uptime',
      value: '99.97%',
      icon: Settings,
      variant: 'success' as const,
      change: { value: 0.02, period: 'this month' }
    },
    {
      title: 'Config Changes',
      value: '12',
      icon: Shield,
      change: { value: 15, period: 'this month' }
    },
    {
      title: 'Revenue Impact',
      value: `KES 2.4M`,
      icon: DollarSign,
      change: { value: 8.7, period: 'fee changes' }
    }
  ];

  const handleSaveConfig = (section: string) => {
    console.log(`Saving ${section} configuration...`);
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`);
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'destructive' as const;
      case 'Risk Analyst': return 'secondary' as const;
      case 'Operations': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'default' as const : 'secondary' as const;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Configuration</h1>
        <p className="text-muted-foreground">System settings and administrative controls</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {configKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <Tabs defaultValue="fees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fees">Fee Management</TabsTrigger>
          <TabsTrigger value="limits">Limits & Controls</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Fee Configuration */}
        <TabsContent value="fees" className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Fee Configuration</h3>
              </div>
              <Button onClick={() => handleSaveConfig('fees')} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="p2p-fee">P2P Transaction Fee (%)</Label>
                  <Input
                    id="p2p-fee"
                    type="number"
                    step="0.1"
                    value={feeConfig.p2pFeePercent}
                    onChange={(e) => setFeeConfig({...feeConfig, p2pFeePercent: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="merchant-fee">Merchant Transaction Fee (%)</Label>
                  <Input
                    id="merchant-fee"
                    type="number"
                    step="0.1"
                    value={feeConfig.merchantFeePercent}
                    onChange={(e) => setFeeConfig({...feeConfig, merchantFeePercent: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bank-fee">Bank Transfer Fee (KES)</Label>
                  <Input
                    id="bank-fee"
                    type="number"
                    value={feeConfig.bankFeeFlat}
                    onChange={(e) => setFeeConfig({...feeConfig, bankFeeFlat: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bills-fee">Bills Payment Fee (%)</Label>
                  <Input
                    id="bills-fee"
                    type="number"
                    step="0.1"
                    value={feeConfig.billsFeePercent}
                    onChange={(e) => setFeeConfig({...feeConfig, billsFeePercent: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-xl">
              <h4 className="font-medium mb-2">Revenue Impact Projection</h4>
              <p className="text-sm text-muted-foreground">
                Current fee configuration is projected to generate KES 2.4M in monthly revenue 
                based on historical transaction patterns.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Limits & Controls */}
        <TabsContent value="limits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Transaction Limits</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="daily-limit">Daily Transaction Limit (KES)</Label>
                  <Input
                    id="daily-limit"
                    type="number"
                    value={limits.dailyTransactionLimit}
                    onChange={(e) => setLimits({...limits, dailyTransactionLimit: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="monthly-limit">Monthly Limit (KES)</Label>
                  <Input
                    id="monthly-limit"
                    type="number"
                    value={limits.monthlyLimit}
                    onChange={(e) => setLimits({...limits, monthlyLimit: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="single-limit">Single Transaction Limit (KES)</Label>
                  <Input
                    id="single-limit"
                    type="number"
                    value={limits.singleTransactionLimit}
                    onChange={(e) => setLimits({...limits, singleTransactionLimit: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveConfig('limits')} className="w-full mt-6">
                <Save className="w-4 h-4 mr-2" />
                Save Limits
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Feature Toggles</h3>
              </div>

              <div className="space-y-4">
                {Object.entries(features).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                    <Switch
                      id={key}
                      checked={enabled}
                      onCheckedChange={(checked) => setFeatures({...features, [key]: checked})}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={() => handleSaveConfig('features')} className="w-full mt-6">
                <Save className="w-4 h-4 mr-2" />
                Save Features
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">System Users</h3>
              </div>
              <Button className="gap-2">
                <Users className="w-4 h-4" />
                Add User
              </Button>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin.toLocaleDateString()}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {user.lastLogin.toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user.id, 'view')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user.id, 'edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user.id, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Audit Trail</h3>
              </div>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 border border-border rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{log.action}</h4>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {log.user}</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.timestamp.toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button variant="outline">Load More Logs</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
