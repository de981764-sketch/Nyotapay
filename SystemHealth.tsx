import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/ui/kpi-card';
import { SimpleChart } from '@/components/ui/simple-chart';
import { mockDataService, SystemHealth } from '@/services/mockService';
import { Server, Activity, Zap, Database, RefreshCw, Settings } from 'lucide-react';

export default function SystemHealthPage() {
  const { t } = useTranslation();
  const [services] = useState<SystemHealth[]>(mockDataService.getSystemHealth());

  const getStatusVariant = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return 'default' as const;
      case 'degraded': return 'secondary' as const;
      case 'down': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getServiceIcon = (service: string) => {
    if (service.toLowerCase().includes('database')) return Database;
    if (service.toLowerCase().includes('api')) return Zap;
    return Server;
  };

  const healthyServices = services.filter(s => s.status === 'healthy').length;
  const degradedServices = services.filter(s => s.status === 'degraded').length;
  const downServices = services.filter(s => s.status === 'down').length;
  const avgResponseTime = services.reduce((sum, s) => sum + s.responseTime, 0) / services.length;
  const avgUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;

  const [performanceData] = useState([
    { name: '00:00', cpu: 45, memory: 62, network: 23 },
    { name: '04:00', cpu: 38, memory: 58, network: 28 },
    { name: '08:00', cpu: 72, memory: 71, network: 45 },
    { name: '12:00', cpu: 89, memory: 83, network: 67 },
    { name: '16:00', cpu: 76, memory: 79, network: 52 },
    { name: '20:00', cpu: 68, memory: 74, network: 43 },
    { name: '23:59', cpu: 52, memory: 66, network: 31 }
  ]);

  const systemKpis = [
    {
      title: 'Healthy Services',
      value: `${healthyServices}/${services.length}`,
      icon: Server,
      variant: 'success' as const,
      change: { value: 100 * (healthyServices / services.length), period: 'uptime' }
    },
    {
      title: 'Avg Response Time',
      value: `${avgResponseTime.toFixed(0)}ms`,
      icon: Zap,
      change: { value: -12.3, period: 'last hour' }
    },
    {
      title: 'System Uptime',
      value: `${(avgUptime * 100).toFixed(1)}%`,
      icon: Activity,
      variant: 'success' as const
    },
    {
      title: 'Services Down',
      value: downServices.toString(),
      icon: Server,
      variant: downServices > 0 ? 'danger' as const : 'success' as const
    }
  ];

  const handleAction = (serviceId: string, action: string) => {
    console.log(`${action} service ${serviceId}`);
  };

  const handleRefreshAll = () => {
    console.log('Refreshing all services...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">System Health</h1>
          <p className="text-muted-foreground">Monitor system performance and service status</p>
        </div>
        <Button onClick={handleRefreshAll} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh All
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* System Performance Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">System Performance (24h)</h3>
        <SimpleChart
          data={performanceData}
          height={300}
          color="hsl(var(--primary))"
        />
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>CPU Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Memory Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Network Usage</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status Grid */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Service Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {services.slice(0, 8).map((service) => {
              const ServiceIcon = getServiceIcon(service.service);
              return (
                <div key={service.service} className="p-3 border border-border rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ServiceIcon className="w-4 h-4 text-primary" />
                    </div>
                    <Badge variant={getStatusVariant(service.status)} className="text-xs">
                      {service.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{service.service}</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span>{(service.uptime * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response:</span>
                      <span>{service.responseTime}ms</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Rates */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Error Rates</h3>
          <div className="space-y-4">
            {services.slice(0, 6).map((service) => (
              <div key={service.service} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div>
                  <p className="font-medium text-sm">{service.service}</p>
                  <p className="text-xs text-muted-foreground">
                    Last check: {service.lastCheck.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          service.errorRate > 0.01 ? 'bg-destructive' : 
                          service.errorRate > 0.005 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${Math.max(5, service.errorRate * 5000)}%` }}
                      />
                    </div>
                    <span className="text-xs font-numbers">
                      {(service.errorRate * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Service Table */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">All Services</h3>
          <div className="flex gap-2">
            <Badge variant="outline">{services.length} services</Badge>
            <Badge variant={downServices > 0 ? 'destructive' : 'default'}>
              {healthyServices} healthy
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Error Rate</TableHead>
                <TableHead>Last Check</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const ServiceIcon = getServiceIcon(service.service);
                
                return (
                  <TableRow key={service.service}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ServiceIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{service.service}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(service.status)}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success"
                            style={{ width: `${service.uptime * 100}%` }}
                          />
                        </div>
                        <span className="font-numbers text-sm">
                          {(service.uptime * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-numbers">
                      {service.responseTime}ms
                    </TableCell>
                    <TableCell>
                      <span className={`font-numbers ${
                        service.errorRate > 0.01 ? 'text-destructive' :
                        service.errorRate > 0.005 ? 'text-warning' : 'text-success'
                      }`}>
                        {(service.errorRate * 100).toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {service.lastCheck.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(service.service, 'restart')}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(service.service, 'settings')}
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
