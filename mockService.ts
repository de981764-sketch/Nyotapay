// Mock data service for NyotaPay admin dashboard
// Simulates real-time data updates for demo purposes

import numeral from 'numeral';

export interface KPIData {
  totalVolume: number;
  feesToday: number; 
  activeUsers: number;
  transactionsPerSecond: number;
  walletFloat: number;
  systemHealth: number;
}

export interface Transaction {
  id: string;
  type: 'P2P' | 'Merchant' | 'Bank' | 'Bills';
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: Date;
  from: string;
  to: string;
  location: {
    county: string;
    lat: number;
    lng: number;
  };
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  volume: number;
  transactions: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Alert {
  id: string;
  type: 'fraud' | 'system' | 'settlement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  region: string;
  totalTransactions: number;
  totalVolume: number;
  lastActive: Date;
  status: 'active' | 'suspended' | 'blocked';
}

export interface FraudCase {
  id: string;
  accountId: string;
  accountName: string;
  type: 'account_takeover' | 'suspicious_pattern' | 'velocity_check' | 'duplicate_device';
  severity: 'low' | 'medium' | 'high' | 'critical';
  amount: number;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  createdAt: Date;
  region: string;
}

export interface Settlement {
  id: string;
  bankName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  scheduledAt: Date;
  completedAt?: Date;
  transactionCount: number;
  fees: number;
}

export interface SystemHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastCheck: Date;
}

export interface Biller {
  id: string;
  name: string;
  category: 'utilities' | 'telecom' | 'government' | 'insurance' | 'education';
  totalVolume: number;
  transactionCount: number;
  successRate: number;
  slaCompliance: number;
  status: 'active' | 'maintenance' | 'down';
}

// Kenya counties for location simulation
const kenyaCounties = [
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
  { name: 'Kisumu', lat: -0.0917, lng: 34.7680 },
  { name: 'Nakuru', lat: -0.3031, lng: 36.0800 },
  { name: 'Eldoret', lat: 0.5143, lng: 35.2698 },
  { name: 'Thika', lat: -1.0332, lng: 37.0692 },
  { name: 'Malindi', lat: -3.2167, lng: 40.1167 },
  { name: 'Kitale', lat: 1.0167, lng: 35.0000 },
];

// Sample merchant names and categories
const merchantData = [
  { name: 'Safaricom', category: 'Telecom' },
  { name: 'Equity Bank', category: 'Banking' },
  { name: 'Kenya Power', category: 'Utilities' },
  { name: 'Naivas Supermarket', category: 'Retail' },
  { name: 'Shell Kenya', category: 'Fuel' },
  { name: 'Java House', category: 'Restaurant' },
  { name: 'Nakumatt', category: 'Retail' },
  { name: 'KCB Bank', category: 'Banking' },
  { name: 'Total Kenya', category: 'Fuel' },
  { name: 'Tuskys', category: 'Retail' },
];

class MockDataService {
  private kpiData: KPIData = {
    totalVolume: 2450000000,
    feesToday: 12300000,
    activeUsers: 1250000,
    transactionsPerSecond: 145,
    walletFloat: 890000000,
    systemHealth: 98.5,
  };

  private transactions: Transaction[] = [];
  private merchants: Merchant[] = [];
  private alerts: Alert[] = [];
  private customers: Customer[] = [];
  private fraudCases: FraudCase[] = [];
  private settlements: Settlement[] = [];
  private systemServices: SystemHealth[] = [];
  private billers: Biller[] = [];

  constructor() {
    this.generateInitialData();
  }

  private generateInitialData() {
    // Generate initial transactions
    for (let i = 0; i < 100; i++) {
      this.transactions.push(this.generateTransaction());
    }

    // Generate merchants
    merchantData.forEach((merchant, index) => {
      this.merchants.push({
        id: `merchant_${index}`,
        name: merchant.name,
        category: merchant.category,
        volume: Math.floor(Math.random() * 50000000) + 5000000,
        transactions: Math.floor(Math.random() * 10000) + 1000,
        status: Math.random() > 0.1 ? 'active' : 'suspended',
      });
    });

    // Generate alerts
    this.generateAlerts();
    
    // Generate additional data
    this.generateCustomers();
    this.generateFraudCases();
    this.generateSettlements();
    this.generateSystemHealth();
    this.generateBillers();
  }

  private generateTransaction(): Transaction {
    const types: Transaction['type'][] = ['P2P', 'Merchant', 'Bank', 'Bills'];
    const currencies = ['KES', 'UGX', 'TZS'];
    const statuses: Transaction['status'][] = ['success', 'pending', 'failed'];
    const location = kenyaCounties[Math.floor(Math.random() * kenyaCounties.length)];

    return {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.floor(Math.random() * 50000) + 100,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Last 24 hours
      from: `user_${Math.floor(Math.random() * 10000)}`,
      to: `user_${Math.floor(Math.random() * 10000)}`,
      location: {
        county: location.name,
        lat: location.lat + (Math.random() - 0.5) * 0.1,
        lng: location.lng + (Math.random() - 0.5) * 0.1,
      },
    };
  }

  private generateAlerts() {
    const alertTypes: Alert['type'][] = ['fraud', 'system', 'settlement'];
    const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const sampleAlerts = [
      {
        type: 'fraud',
        title: 'Suspicious Transaction Pattern Detected',
        description: 'Multiple high-value transactions from single account in Nairobi region',
      },
      {
        type: 'system',
        title: 'High API Latency',
        description: 'Payment processing API showing increased response times',
      },
      {
        type: 'settlement',
        title: 'Bank Settlement Delay',
        description: 'KCB settlement batch delayed by 15 minutes',
      },
    ];

    sampleAlerts.forEach((alert, index) => {
      this.alerts.push({
        id: `alert_${index}`,
        type: alert.type as Alert['type'],
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: alert.title,
        description: alert.description,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
      });
    });
  }

  // Simulate real-time updates
  private updateKPIs() {
    this.kpiData.totalVolume += Math.floor(Math.random() * 100000);
    this.kpiData.feesToday += Math.floor(Math.random() * 1000);
    this.kpiData.activeUsers += Math.floor((Math.random() - 0.5) * 100);
    this.kpiData.transactionsPerSecond = Math.floor(Math.random() * 50) + 120;
    this.kpiData.walletFloat += Math.floor((Math.random() - 0.5) * 10000);
    this.kpiData.systemHealth = Math.min(99.9, Math.max(95, this.kpiData.systemHealth + (Math.random() - 0.5) * 0.5));
  }

  // Public API methods
  getKPIs(): KPIData {
    return { ...this.kpiData };
  }

  getRecentTransactions(limit = 10): Transaction[] {
    return this.transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getTopMerchants(limit = 10): Merchant[] {
    return this.merchants
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit);
  }

  getAlerts(limit = 5): Alert[] {
    return this.alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getHeatmapData(): Array<{ location: string; lat: number; lng: number; value: number }> {
    return kenyaCounties.map(county => ({
      location: county.name,
      lat: county.lat,
      lng: county.lng,
      value: Math.floor(Math.random() * 1000) + 100,
    }));
  }

  // Simulate live updates
  startLiveUpdates(callback: (data: any) => void) {
    const interval = setInterval(() => {
      this.updateKPIs();
      
      // Add new transaction occasionally
      if (Math.random() < 0.3) {
        this.transactions.unshift(this.generateTransaction());
        this.transactions = this.transactions.slice(0, 1000); // Keep only last 1000
      }

      callback({
        kpis: this.getKPIs(),
        recentTransactions: this.getRecentTransactions(5),
        alerts: this.getAlerts(3),
      });
    }, 2000);

    return () => clearInterval(interval);
  }

  // Utility functions
  formatCurrency(amount: number, currency = 'KES'): string {
    return `${currency} ${numeral(amount).format('0,0')}`;
  }

  formatNumber(num: number): string {
    return numeral(num).format('0,0');
  }

  formatLargeNumber(num: number): string {
    return numeral(num).format('0.0a').toUpperCase();
  }

  private generateCustomers() {
    const firstNames = ['John', 'Mary', 'Peter', 'Grace', 'David', 'Sarah', 'James', 'Jane', 'Michael', 'Elizabeth'];
    const lastNames = ['Mwangi', 'Kamau', 'Njoroge', 'Wanjiku', 'Kiprotich', 'Achieng', 'Muthoni', 'Otieno'];
    
    for (let i = 0; i < 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const county = kenyaCounties[Math.floor(Math.random() * kenyaCounties.length)];
      
      this.customers.push({
        id: `cust_${i}`,
        name: `${firstName} ${lastName}`,
        phone: `+254${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        kycStatus: Math.random() > 0.3 ? 'verified' : Math.random() > 0.5 ? 'pending' : 'rejected',
        riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
        region: county.name,
        totalTransactions: Math.floor(Math.random() * 500 + 10),
        totalVolume: Math.floor(Math.random() * 5000000 + 50000),
        lastActive: new Date(Date.now() - Math.random() * 86400000 * 30),
        status: Math.random() > 0.95 ? 'suspended' : Math.random() > 0.98 ? 'blocked' : 'active'
      });
    }
  }

  private generateFraudCases() {
    const types: FraudCase['type'][] = ['account_takeover', 'suspicious_pattern', 'velocity_check', 'duplicate_device'];
    const descriptions = [
      'Multiple failed login attempts from different locations',
      'Unusual transaction pattern detected - high frequency transactions',
      'Transaction velocity exceeded normal limits',
      'Same device used for multiple accounts',
      'Large transactions outside normal behavior',
      'Suspicious geographic activity pattern'
    ];

    for (let i = 0; i < 25; i++) {
      const county = kenyaCounties[Math.floor(Math.random() * kenyaCounties.length)];
      this.fraudCases.push({
        id: `fraud_${i}`,
        accountId: `cust_${Math.floor(Math.random() * 100)}`,
        accountName: `Account ${Math.floor(Math.random() * 1000)}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        amount: Math.floor(Math.random() * 500000 + 10000),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        status: Math.random() > 0.6 ? 'open' : Math.random() > 0.3 ? 'investigating' : 'resolved',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
        region: county.name
      });
    }
  }

  private generateSettlements() {
    const banks = ['KCB Bank', 'Equity Bank', 'Cooperative Bank', 'NCBA Bank', 'Absa Bank', 'Standard Chartered'];
    
    for (let i = 0; i < 20; i++) {
      this.settlements.push({
        id: `settlement_${i}`,
        bankName: banks[Math.floor(Math.random() * banks.length)],
        amount: Math.floor(Math.random() * 50000000 + 1000000),
        currency: 'KES',
        status: Math.random() > 0.8 ? 'pending' : Math.random() > 0.9 ? 'failed' : 'completed',
        scheduledAt: new Date(Date.now() - Math.random() * 86400000 * 3),
        completedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000) : undefined,
        transactionCount: Math.floor(Math.random() * 1000 + 100),
        fees: Math.floor(Math.random() * 100000 + 5000)
      });
    }
  }

  private generateSystemHealth() {
    const services = [
      'Payment API', 'User Service', 'Notification Service', 'Settlement Engine',
      'Fraud Detection', 'Core Banking', 'Mobile App API', 'USSD Gateway',
      'SMS Service', 'Database Cluster', 'Cache Layer', 'Load Balancer'
    ];

    services.forEach((service, i) => {
      this.systemServices.push({
        service,
        status: Math.random() > 0.95 ? 'down' : Math.random() > 0.85 ? 'degraded' : 'healthy',
        uptime: Math.random() * 0.05 + 0.95, // 95-100%
        responseTime: Math.floor(Math.random() * 150 + 50), // 50-200ms
        errorRate: Math.random() * 0.02, // 0-2%
        lastCheck: new Date(Date.now() - Math.random() * 300000) // last 5 minutes
      });
    });
  }

  private generateBillers() {
    const billerData = [
      { name: 'Kenya Power', category: 'utilities' },
      { name: 'Nairobi Water', category: 'utilities' },
      { name: 'Safaricom', category: 'telecom' },
      { name: 'Airtel Kenya', category: 'telecom' },
      { name: 'KRA', category: 'government' },
      { name: 'NHIF', category: 'government' },
      { name: 'NSSF', category: 'government' },
      { name: 'UAP Insurance', category: 'insurance' },
      { name: 'University of Nairobi', category: 'education' }
    ];

    billerData.forEach((biller, i) => {
      this.billers.push({
        id: `biller_${i}`,
        name: biller.name,
        category: biller.category as Biller['category'],
        totalVolume: Math.floor(Math.random() * 100000000 + 5000000),
        transactionCount: Math.floor(Math.random() * 50000 + 1000),
        successRate: Math.random() * 0.05 + 0.95, // 95-100%
        slaCompliance: Math.random() * 0.1 + 0.90, // 90-100%
        status: Math.random() > 0.95 ? 'down' : Math.random() > 0.9 ? 'maintenance' : 'active'
      });
    });
  }

  // Additional getters
  getCustomers(limit?: number): Customer[] {
    return limit ? this.customers.slice(0, limit) : this.customers;
  }

  getFraudCases(limit?: number): FraudCase[] {
    return this.fraudCases
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit || 20);
  }

  getSettlements(limit?: number): Settlement[] {
    return this.settlements
      .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime())
      .slice(0, limit || 15);
  }

  getSystemHealth(): SystemHealth[] {
    return this.systemServices;
  }

  getBillers(limit?: number): Biller[] {
    return this.billers
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, limit || 10);
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
export default mockDataService;
