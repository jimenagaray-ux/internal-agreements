'use client'

import React, { useState } from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardContent } from '@/components/ui/mp-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft,
  Tag,
  Calendar,
  Package,
  DollarSign,
  Search,
  MoreHorizontal,
  Plus,
  Eye,
  Edit,
  CheckSquare,
  Users,
  BarChart3,
  Copy,
  Send,
  XCircle
} from 'lucide-react';

interface PromotionsDashboardProps {
  onBack: () => void;
  onNewPromotion?: () => void;
}

export default function PromotionsDashboard({ onBack, onNewPromotion }: PromotionsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todas');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para el listado de promociones
  const promotions = [
    {
      id: 1,
      name: 'Descuento de Verano 2024',
      description: '20% de descuento en todos los productos...',
      type: 'Descuento',
      status: 'Activa',
      startDate: '31/5/2024',
      endDate: '31/8/2024',
      uses: 145
    },
    {
      id: 2,
      name: '2x1 en Zapatos',
      description: 'Lleva 2 pares de zapatos y paga solo...',
      type: '2x1',
      status: 'Programada',
      startDate: '14/7/2024',
      endDate: '30/7/2024',
      uses: 0
    },
    {
      id: 3,
      name: 'Cupón Primera Compra',
      description: 'Descuento de $50 en tu primera compra...',
      type: 'Cupón',
      status: 'Activa',
      startDate: '31/12/2023',
      endDate: '31/12/2024',
      uses: 326
    },
    {
      id: 4,
      name: 'Pack Productos Belleza',
      description: 'Regalo especial al comprar 2 productos...',
      type: 'Paquete',
      status: 'Borrador',
      startDate: '31/8/2024',
      endDate: '15/10/2024',
      uses: 0
    }
  ];

  const handleAction = async (action: string, promotion: any) => {
    setIsLoading(true);
    
    try {
      switch (action) {
        case 'detail':
          console.log('Ver detalle de promoción:', promotion);
          // Aquí se implementaría la navegación al detalle
          break;
        case 'edit':
          console.log('Editar promoción:', promotion);
          // Aquí se implementaría la navegación a edición
          break;
        case 'approval':
          console.log('Ver estado de aprobación:', promotion);
          // Aquí se implementaría la vista de aprobación
          break;
        case 'audience':
          console.log('Gestionar audiencia:', promotion);
          // Aquí se implementaría la gestión de audiencia
          break;
        case 'performance':
          console.log('Ver performance:', promotion);
          // Aquí se implementaría la vista de performance
          break;
        case 'clone':
          console.log('Clonar promoción:', promotion);
          // Aquí se implementaría la clonación
          break;
        case 'send-approval':
          console.log('Enviar a aprobación:', promotion);
          // Aquí se implementaría el envío a aprobación
          break;
        case 'expire':
          console.log('Expirar promoción:', promotion);
          // Aquí se implementaría la expiración
          break;
        default:
          console.log('Acción no reconocida:', action);
      }
    } catch (error) {
      console.error('Error ejecutando acción:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const tabs = ['Todas', 'Activas', 'Programadas', 'Borradores', 'Expiradas'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">Activa</Badge>;
      case 'Programada':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1">Programada</Badge>;
      case 'Borrador':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-2 py-1">Borrador</Badge>;
      case 'Expirada':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs px-2 py-1">Expirada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-1">{status}</Badge>;
    }
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Todas' || 
      (activeTab === 'Activas' && promotion.status === 'Activa') ||
      (activeTab === 'Programadas' && promotion.status === 'Programada') ||
      (activeTab === 'Borradores' && promotion.status === 'Borrador') ||
      (activeTab === 'Expiradas' && promotion.status === 'Expirada');
    return matchesSearch && matchesTab;
  });

  const renderActionsMenu = (promotion: any) => {
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
            onClick={() => handleAction('detail', promotion)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-600" />
            Ver detalle
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleAction('edit', promotion)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-green-600" />
            Editar y enviar a aprobación
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Estado y gestión */}
          <DropdownMenuItem
            onClick={() => handleAction('approval', promotion)}
            className="cursor-pointer"
          >
            <CheckSquare className="mr-2 h-4 w-4 text-purple-600" />
            Ver estado de aprobación
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction('audience', promotion)}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4 text-indigo-600" />
            Gestionar audiencia
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction('performance', promotion)}
            className="cursor-pointer"
          >
            <BarChart3 className="mr-2 h-4 w-4 text-orange-600" />
            Ver performance
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Acciones adicionales */}
          <DropdownMenuItem
            onClick={() => handleAction('clone', promotion)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4 text-gray-600" />
            Clonar
          </DropdownMenuItem>

          {(promotion.status === 'Borrador' || promotion.status === 'Programada') && (
            <DropdownMenuItem
              onClick={() => handleAction('send-approval', promotion)}
              className="cursor-pointer"
            >
              <Send className="mr-2 h-4 w-4 text-blue-600" />
              Enviar a aprobación
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => handleAction('expire', promotion)}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 shadow-lg">
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
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-purple-100">Bienvenido al sistema de gestión de promociones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Promociones Activas */}
          <MPCard className="bg-white shadow-sm">
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Promociones Activas</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-500">Campañas en curso</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Programadas */}
          <MPCard className="bg-white shadow-sm">
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Programadas</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-500">Próximas a iniciar</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Usos Totales */}
          <MPCard className="bg-white shadow-sm">
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Usos Totales</p>
                  <p className="text-3xl font-bold text-gray-900">1363</p>
                  <p className="text-sm text-gray-500">De todas las promociones</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Presupuesto Gastado */}
          <MPCard className="bg-white shadow-sm">
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Presupuesto Gastado</p>
                  <p className="text-3xl font-bold text-gray-900">80%</p>
                  <p className="text-sm text-gray-500">$67.850 de $85.000</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Activas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Activas</h3>
              <span className="text-sm text-gray-500">2 promociones</span>
            </div>
            
            <div className="space-y-4">
              {/* Descuento de Verano 2024 */}
              <MPCard className="bg-white shadow-sm border border-gray-200">
                <MPCardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Descuento de Verano 2024</h4>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      discount
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">20% de descuento en todos los productos ...</p>
                </MPCardContent>
              </MPCard>

              {/* Cupón Primera Compra */}
              <MPCard className="bg-white shadow-sm border border-gray-200">
                <MPCardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Cupón Primera Compra</h4>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      coupon
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Descuento de $50 en tu primera compra</p>
                </MPCardContent>
              </MPCard>
            </div>
          </div>

          {/* Programadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Programadas</h3>
              <span className="text-sm text-gray-500">2 promociones</span>
            </div>
            
            <div className="space-y-4">
              {/* Descuento Día del Padre */}
              <MPCard className="bg-white shadow-sm border border-gray-200">
                <MPCardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Descuento Día del Padre</h4>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      discount
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">15% en productos seleccionados</p>
                </MPCardContent>
              </MPCard>

              {/* 2x1 en Zapatos */}
              <MPCard className="bg-white shadow-sm border border-gray-200">
                <MPCardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">2x1 en Zapatos</h4>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                      bogo
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Lleva 2 pares de zapatos y paga solo 1</p>
                </MPCardContent>
              </MPCard>
            </div>
          </div>

          {/* Resumen General */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Resumen General</h3>
              <span className="text-sm text-gray-500">Estado de las promociones</span>
            </div>
            
            <div className="space-y-3">
              {/* Estado Activas */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Activas</span>
                </div>
                <span className="text-lg font-bold text-gray-900">2</span>
              </div>

              {/* Estado Programadas */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Programadas</span>
                </div>
                <span className="text-lg font-bold text-gray-900">2</span>
              </div>

              {/* Estado Borradores */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Borradores</span>
                </div>
                <span className="text-lg font-bold text-gray-900">1</span>
              </div>

              {/* Estado Expiradas */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Expiradas</span>
                </div>
                <span className="text-lg font-bold text-gray-900">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listado de promociones */}
        <div className="mt-12">
          {/* Barra de búsqueda y botón Nueva Promoción */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar promociones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border border-gray-300 rounded-lg"
              />
            </div>
            <MPButton 
              className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 rounded-lg font-medium"
              onClick={onNewPromotion}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Promoción
            </MPButton>
          </div>

          {/* Tabs de filtrado */}
          <div className="flex items-center space-x-6 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tabla de promociones */}
          <MPCard className="bg-white shadow-sm">
            <MPCardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Nombre</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Tipo</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Estado</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Inicio</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Fin</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Usos</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPromotions.map((promotion, index) => (
                      <tr key={promotion.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="py-4 px-6">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{promotion.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{promotion.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-700">{promotion.type}</span>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(promotion.status)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-900">{promotion.startDate}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-900">{promotion.endDate}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-900">{promotion.uses}</span>
                        </td>
                        <td className="py-4 px-6">
                          {renderActionsMenu(promotion)}
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
    </div>
  );
}