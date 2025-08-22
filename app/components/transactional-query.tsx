'use client'

import React, { useState } from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

interface TransactionalQueryProps {
  seller: {
    id: string;
    name: string;
    email: string;
  };
  onBack: () => void;
}

export default function TransactionalQuery({ seller, onBack }: TransactionalQueryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  // Mock data para transacciones
  const transactions = [
    {
      id: 'TXN-2024-001234',
      date: '2024-01-15 14:30:25',
      amount: 15600,
      status: 'approved',
      paymentMethod: 'credit_card',
      cardBrand: 'Visa',
      cardLastFour: '4532',
      customer: {
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        id: 'CUST-789123'
      },
      installments: 3,
      fee: 468,
      netAmount: 15132,
      authorizationCode: 'AUTH123456',
      reference: 'REF-001234'
    },
    {
      id: 'TXN-2024-001235',
      date: '2024-01-15 16:45:12',
      amount: 8900,
      status: 'pending',
      paymentMethod: 'debit_card',
      cardBrand: 'Mastercard',
      cardLastFour: '8765',
      customer: {
        name: 'María García',
        email: 'maria.garcia@email.com',
        id: 'CUST-456789'
      },
      installments: 1,
      fee: 267,
      netAmount: 8633,
      authorizationCode: 'PENDING',
      reference: 'REF-001235'
    },
    {
      id: 'TXN-2024-001236',
      date: '2024-01-14 09:15:33',
      amount: 23400,
      status: 'approved',
      paymentMethod: 'mercado_pago',
      cardBrand: null,
      cardLastFour: null,
      customer: {
        name: 'Carlos López',
        email: 'carlos.lopez@email.com',
        id: 'CUST-321654'
      },
      installments: 6,
      fee: 1170,
      netAmount: 22230,
      authorizationCode: 'AUTH789012',
      reference: 'REF-001236'
    },
    {
      id: 'TXN-2024-001237',
      date: '2024-01-14 11:22:45',
      amount: 5600,
      status: 'rejected',
      paymentMethod: 'credit_card',
      cardBrand: 'American Express',
      cardLastFour: '1234',
      customer: {
        name: 'Ana Rodríguez',
        email: 'ana.rodriguez@email.com',
        id: 'CUST-987321'
      },
      installments: 1,
      fee: 0,
      netAmount: 0,
      authorizationCode: 'REJECTED',
      reference: 'REF-001237'
    },
    {
      id: 'TXN-2024-001238',
      date: '2024-01-13 20:30:15',
      amount: 12800,
      status: 'refunded',
      paymentMethod: 'pix',
      cardBrand: null,
      cardLastFour: null,
      customer: {
        name: 'Roberto Silva',
        email: 'roberto.silva@email.com',
        id: 'CUST-654987'
      },
      installments: 1,
      fee: 0,
      netAmount: 0,
      authorizationCode: 'REFUNDED',
      reference: 'REF-001238'
    }
  ];

  // KPIs transaccionales
  const transactionKpis = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    approvedTransactions: transactions.filter(t => t.status === 'approved').length,
    totalFees: transactions.reduce((sum, t) => sum + t.fee, 0),
    averageTicket: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
    approvalRate: (transactions.filter(t => t.status === 'approved').length / transactions.length) * 100
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Aprobada
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rechazada
        </Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          <RefreshCw className="w-3 h-3 mr-1" />
          Reembolsada
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'mercado_pago':
        return 'Mercado Pago';
      case 'pix':
        return 'PIX';
      default:
        return method;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesPaymentMethod = filterPaymentMethod === 'all' || transaction.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MPButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </MPButton>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Consulta Transaccional</h1>
                <p className="text-sm text-indigo-100">Vendedor: {seller.name} (ID: {seller.id})</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 bg-white/20 text-white border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Último día</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
            <MPButton 
              variant="secondary"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </MPButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* KPIs Transaccionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transacciones</p>
                  <p className="text-2xl font-bold text-gray-900">{transactionKpis.totalTransactions}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {transactionKpis.approvedTransactions} aprobadas
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Volumen Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(transactionKpis.totalVolume)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasa de Aprobación</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transactionKpis.approvalRate.toFixed(1)}%
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+3.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>
        </div>

        {/* Filtros y búsqueda */}
        <MPCard>
          <MPCardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por ID, cliente o referencia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                    <SelectItem value="refunded">Reembolsada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los métodos</SelectItem>
                    <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="debit_card">Tarjeta de Débito</SelectItem>
                    <SelectItem value="mercado_pago">Mercado Pago</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
                <MPButton variant="secondary" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Más filtros
                </MPButton>
              </div>
            </div>
          </MPCardContent>
        </MPCard>

        {/* Tabla de transacciones */}
        <MPCard>
          <MPCardHeader>
            <MPCardTitle>Transacciones ({filteredTransactions.length})</MPCardTitle>
          </MPCardHeader>
          <MPCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID Transacción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha/Hora</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Método</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cuotas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Comisión</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.id}</p>
                          <p className="text-sm text-gray-500">{transaction.reference}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('es-AR')}
                          </p>
                          <p className="text-gray-500">
                            {new Date(transaction.date).toLocaleTimeString('es-AR')}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.customer.name}</p>
                          <p className="text-sm text-gray-500">{transaction.customer.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {getPaymentMethodLabel(transaction.paymentMethod)}
                          </p>
                          {transaction.cardBrand && (
                            <p className="text-xs text-gray-500">
                              {transaction.cardBrand} •••• {transaction.cardLastFour}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">{transaction.installments}x</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">{formatCurrency(transaction.fee)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <MPButton variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </MPButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MPCardContent>
        </MPCard>
      </div>
    </div>
  );
}
