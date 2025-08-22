'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Filter,
  Download,
  Search,
  Edit,
  Eye,
  Users,
  XCircle,
  Copy,
  BarChart3,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Minus,
  Send,
  CheckSquare,
  AlertTriangle,
  UserCheck,
  MoreHorizontal
} from 'lucide-react';

interface Agreement {
  id: string;
  nombre: string;
  area: string;
  contrapartida: string;
  estado: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  monto: string;
  tipo: string;
  tpvEstimado?: string;
  tpvActual?: string;
  usuariosActivos?: number;
  costoUtilizado?: string;
  roi?: string;
  aprobacion?: {
    estado: 'pendiente' | 'aprobado' | 'rechazado' | 'en_revision';
    fecha?: string;
    aprobadoPor?: string;
    comentarios?: string;
  };
}

interface InternalAgreementsDashboardProps {
  onViewDetail?: (agreement: Agreement) => void;
  onEditAgreement?: (agreement: Agreement) => void;
  onViewPerformance?: (agreement: Agreement) => void;
  onManageAudience?: (agreement: Agreement) => void;
  onViewApprovalStatus?: (agreement: Agreement) => void;
  onCreateAgreement?: () => void;
  onBack?: () => void;
}

export default function InternalAgreementsDashboard({ 
  onViewDetail, 
  onEditAgreement, 
  onViewPerformance, 
  onManageAudience,
  onViewApprovalStatus,
  onCreateAgreement,
  onBack 
}: InternalAgreementsDashboardProps) {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockData: Agreement[] = [
    {
      id: 'AGR-001',
      nombre: 'Acuerdo Fintech - Mercado Envíos',
      area: 'Fintech',
      contrapartida: 'Mercado Envíos',
      estado: 'Activo',
      fechaCreacion: '2024-01-15',
      fechaVencimiento: '2024-12-31',
      monto: '$125.000.000',
      tipo: 'Prestación de servicios',
      tpvEstimado: '$50.000.000',
      tpvActual: '$35.250.000',
      usuariosActivos: 1250,
      costoUtilizado: '$8.750.000',
      roi: '15.2%',
      aprobacion: {
        estado: 'aprobado',
        fecha: '2024-01-20',
        aprobadoPor: 'Juan Pérez',
        comentarios: 'Aprobado sin observaciones'
      }
    },
    {
      id: 'AGR-002',
      nombre: 'Acuerdo Marketplace - Ads',
      area: 'Marketplace',
      contrapartida: 'Mercado Ads',
      estado: 'Pendiente',
      fechaCreacion: '2024-02-01',
      fechaVencimiento: '2024-11-30',
      monto: '$89.500.000',
      tipo: 'Compartición de ingresos',
      tpvEstimado: '$30.000.000',
      tpvActual: '$18.500.000',
      usuariosActivos: 850,
      costoUtilizado: '$12.200.000',
      roi: '8.7%',
      aprobacion: {
        estado: 'en_revision',
        fecha: '2024-02-05',
        comentarios: 'En revisión por el comité financiero'
      }
    },
    {
      id: 'AGR-003',
      nombre: 'Acuerdo Créditos - Pago',
      area: 'Créditos',
      contrapartida: 'Mercado Pago',
      estado: 'Activo',
      fechaCreacion: '2024-01-10',
      fechaVencimiento: '2024-10-15',
      monto: '$200.000.000',
      tipo: 'Servicios financieros',
      tpvEstimado: '$80.000.000',
      tpvActual: '$92.500.000',
      usuariosActivos: 2150,
      costoUtilizado: '$15.750.000',
      roi: '22.1%',
      aprobacion: {
        estado: 'aprobado',
        fecha: '2024-01-12',
        aprobadoPor: 'María González',
        comentarios: 'Aprobado con métricas excepcionales'
      }
    },
  ];

  const stats = [
    { label: 'Acuerdos Activos', value: '24', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pendientes de Aprobación', value: '8', icon: Clock, color: 'text-yellow-600' },
    { label: 'Próximos a Vencer', value: '3', icon: AlertCircle, color: 'text-red-600' },
    { label: 'Valor Total', value: '$2.8B', icon: TrendingUp, color: 'text-blue-600' },
  ];

  const handleAction = async (action: string, agreement: Agreement) => {
    setIsLoading(true);
    
    try {
      switch (action) {
        case 'detail':
          onViewDetail?.(agreement);
          break;
        case 'edit':
          onEditAgreement?.(agreement);
          break;
        case 'performance':
          onViewPerformance?.(agreement);
          break;
        case 'audience':
          onManageAudience?.(agreement);
          break;
        case 'approval':
          onViewApprovalStatus?.(agreement);
          break;
        case 'expire':
          // Simular expiración
          await new Promise(resolve => setTimeout(resolve, 1000));
          alert(`Acuerdo ${agreement.id} marcado como expirado`);
          break;
        case 'clone':
          // Simular clonación
          await new Promise(resolve => setTimeout(resolve, 1000));
          alert(`Acuerdo ${agreement.id} clonado exitosamente`);
          break;
        case 'send-approval':
          // Simular envío a aprobación
          await new Promise(resolve => setTimeout(resolve, 1000));
          alert(`Acuerdo ${agreement.id} enviado a aprobación`);
          break;
        default:
          console.log(`Acción ${action} no implementada`);
      }
    } catch (error) {
      console.error('Error ejecutando acción:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getApprovalStatusBadge = (aprobacion?: Agreement['aprobacion']) => {
    if (!aprobacion) return null;

    const statusConfig = {
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      aprobado: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rechazado: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      en_revision: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle }
    };

    const config = statusConfig[aprobacion.estado];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3" />
        <span className="capitalize">{aprobacion.estado.replace('_', ' ')}</span>
      </div>
    );
  };

  const getPerformanceIndicator = (agreement: Agreement) => {
    if (!agreement.tpvEstimado || !agreement.tpvActual) return null;

    const estimado = parseFloat(agreement.tpvEstimado.replace(/[$,]/g, ''));
    const actual = parseFloat(agreement.tpvActual.replace(/[$,]/g, ''));
    const percentage = ((actual - estimado) / estimado) * 100;

    if (percentage > 5) {
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    } else if (percentage < -5) {
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderActionsMenu = (agreement: Agreement) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MPButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </MPButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Acciones principales */}
          <DropdownMenuItem
            onClick={() => handleAction('detail', agreement)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-600" />
            Ver detalle
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleAction('edit', agreement)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-green-600" />
            Editar y enviar a aprobación
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Estado y gestión */}
          <DropdownMenuItem
            onClick={() => handleAction('approval', agreement)}
            className="cursor-pointer"
          >
            <CheckSquare className="mr-2 h-4 w-4 text-purple-600" />
            Ver estado de aprobación
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction('audience', agreement)}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4 text-indigo-600" />
            Gestionar audiencia
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction('performance', agreement)}
            className="cursor-pointer"
          >
            <BarChart3 className="mr-2 h-4 w-4 text-orange-600" />
            Ver performance
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Acciones adicionales */}
          <DropdownMenuItem
            onClick={() => handleAction('clone', agreement)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4 text-gray-600" />
            Clonar
          </DropdownMenuItem>

          {agreement.estado === 'Pendiente' && (
            <DropdownMenuItem
              onClick={() => handleAction('send-approval', agreement)}
              className="cursor-pointer"
            >
              <Send className="mr-2 h-4 w-4 text-blue-600" />
              Enviar a aprobación
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => handleAction('expire', agreement)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Expirar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <MPButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </MPButton>
          )}
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Acuerdos Internos</h1>
        </div>
        <div className="flex items-center space-x-3">
          <MPButton 
            variant="secondary" 
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </MPButton>
          <MPButton 
            variant="secondary" 
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </MPButton>
          <MPButton 
            variant="primary" 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={onCreateAgreement}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Nuevo Acuerdo
          </MPButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <MPCard key={index} variant="outlined" className="hover:shadow-md transition-shadow">
            <MPCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>
        ))}
      </div>

      {/* Search and Filters */}
      <MPCard variant="outlined">
        <MPCardHeader>
          <MPCardTitle>Buscar Acuerdos</MPCardTitle>
        </MPCardHeader>
        <MPCardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, área, contrapartida..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todas las áreas</option>
              <option value="fintech">Fintech</option>
              <option value="marketplace">Marketplace</option>
              <option value="creditos">Créditos</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        </MPCardContent>
      </MPCard>

      {/* Agreements Table */}
      <MPCard variant="outlined">
        <MPCardHeader>
          <MPCardTitle>Acuerdos Registrados</MPCardTitle>
        </MPCardHeader>
        <MPCardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Área</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vencimiento</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((agreement) => (
                  <tr key={agreement.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{agreement.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{agreement.nombre}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{agreement.area}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        agreement.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {agreement.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getPerformanceIndicator(agreement)}
                        <span className="text-sm text-gray-600">{agreement.roi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{agreement.fechaVencimiento}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {renderActionsMenu(agreement)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MPCardContent>
      </MPCard>
    </div>
  );
} 