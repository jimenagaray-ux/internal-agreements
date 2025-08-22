'use client'

import React, { useState } from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter
} from 'lucide-react';

interface SellerDetailProps {
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    registrationDate: string;
    status: 'active' | 'inactive' | 'pending';
    totalSales: number;
    products: number;
    rating: number;
    category: string;
  };
  onBack: () => void;
  onViewAgreementDetail?: () => void;
  onViewTransactionalQuery?: () => void;
}

export default function SellerDetail({ seller, onBack, onViewAgreementDetail, onViewTransactionalQuery }: SellerDetailProps) {
  const [activePromotionsTab, setActivePromotionsTab] = useState('activas');
  const [activePricesTab, setActivePricesTab] = useState('historial');

  // Mock data para promociones y campañas
  const promotions = {
    activas: [
      {
        id: 1,
        title: 'Día del Padre 2025',
        description: '15% de descuento en Línea Blanca.',
        validity: '01/06/2025 - 20/06/2025',
        status: 'active'
      },
      {
        id: 2,
        title: 'CyberMonday',
        description: 'Hasta 40% OFF en productos seleccionados.',
        validity: '28/10/2024 - 04/11/2024',
        status: 'active'
      },
      {
        id: 3,
        title: 'Campaña de Verano',
        description: '20% en Aires Acondicionados y Ventiladores.',
        validity: '01/12/2024 - 28/02/2025',
        status: 'active'
      }
    ],
    inactivas: [
      {
        id: 4,
        title: 'Black Friday 2024',
        description: 'Descuentos especiales hasta 50% OFF.',
        validity: '25/11/2024 - 02/12/2024',
        status: 'inactive'
      },
      {
        id: 5,
        title: 'Hot Sale Mayo',
        description: 'Ofertas en electrónicos y hogar.',
        validity: '15/05/2024 - 25/05/2024',
        status: 'inactive'
      }
    ],
    proximasVencer: [
      {
        id: 6,
        title: 'Liquidación Enero',
        description: 'Últimas unidades con descuentos especiales.',
        validity: '15/01/2025 - 31/01/2025',
        status: 'expiring'
      }
    ]
  };

  // Mock data para acuerdo base
  const baseAgreement = {
    listName: 'Base Mayorista 2024',
    agreementType: 'Revendedor Gold',
    currency: 'ARS (Peso Argentino)',
    baseDiscount: '12% sobre PVP',
    paymentCondition: '60 días fecha factura',
    agreementValidity: 'Hasta 31/12/2025'
  };

  // Mock data para historial de precios
  const priceHistory = [
    {
      id: 1,
      date: '15 de Enero, 2023',
      title: 'Inicio de Operaciones',
      description: 'Se asigna la lista de precios "Base Mayorista 2023".',
      status: 'completed',
      type: 'start'
    },
    {
      id: 2,
      date: '24 de Noviembre, 2023',
      title: 'Campaña "Black Friday"',
      description: 'Se aplica un descuento del 30% sobre la lista base.',
      status: 'completed',
      type: 'campaign'
    },
    {
      id: 3,
      date: '01 de Enero, 2024',
      title: 'Actualización Anual',
      description: 'Cambio a la lista de precios "Base Mayorista 2024" con un incremento del 25%.',
      status: 'completed',
      type: 'update'
    },
    {
      id: 4,
      date: '20 de Mayo, 2024',
      title: 'Campaña "Hot Sale"',
      description: 'Se aplica un descuento temporal del 15%.',
      status: 'completed',
      type: 'campaign'
    },
    {
      id: 5,
      date: '01 de Enero, 2026',
      title: 'Actualización Futura Programada',
      description: 'Cambio programado a "Base Mayorista 2026".',
      status: 'scheduled',
      type: 'future'
    }
  ];

  // Mock data para precios vigentes
  const currentPrices = [
    {
      id: 1,
      title: 'Base Mayorista 2024',
      type: 'Revendedor Gold',
      priority: 1,
      status: 'Activo',
      discount: '12% sobre PVP',
      currency: 'ARS',
      validity: 'Hasta 31/12/2025',
      paymentCondition: '60 días fecha factura',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    },
    {
      id: 2,
      title: 'Campaña Día del Padre 2025',
      type: 'Promocional',
      priority: 2,
      status: 'Prioritario',
      discount: '15% adicional en Línea Blanca',
      currency: 'ARS',
      validity: 'Hasta 20/06/2025',
      paymentCondition: '60 días fecha factura',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      id: 3,
      title: 'Descuento por Volumen Q2',
      type: 'Por Volumen',
      priority: 3,
      status: 'Activo',
      discount: '3% adicional sobre 100 unidades',
      currency: 'ARS',
      validity: 'Hasta 30/06/2025',
      paymentCondition: '45 días fecha factura',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    },
    {
      id: 4,
      title: 'Lista Backup Estándar',
      type: 'Respaldo',
      priority: 4,
      status: 'Respaldo',
      discount: '8% sobre PVP',
      currency: 'ARS',
      validity: 'Hasta 31/12/2024',
      paymentCondition: '30 días fecha factura',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-600'
    }
  ];

  const getPromotionCount = (type: string) => {
    return promotions[type as keyof typeof promotions]?.length || 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-blue-600';
      case 'campaign':
        return 'bg-gray-600';
      case 'update':
        return 'bg-green-600';
      case 'future':
        return 'bg-purple-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MPButton
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </MPButton>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visor 360 del Vendedor</h1>
                <p className="text-gray-600">Vendedor: <span className="font-medium">{seller.name.toUpperCase()}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Promociones, Campañas y seasonals - Columna Izquierda */}
          <div className="lg:col-span-2">
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="text-xl font-semibold text-gray-900">
                  Promociones, Campañas y seasonals
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 border-b">
                  <button
                    onClick={() => setActivePromotionsTab('activas')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activePromotionsTab === 'activas'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Activas
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {getPromotionCount('activas')}
                    </span>
                  </button>
                  <button
                    onClick={() => setActivePromotionsTab('inactivas')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activePromotionsTab === 'inactivas'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Inactivas
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {getPromotionCount('inactivas')}
                    </span>
                  </button>
                  <button
                    onClick={() => setActivePromotionsTab('proximasVencer')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activePromotionsTab === 'proximasVencer'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Próximas a Vencer
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      {getPromotionCount('proximasVencer')}
                    </span>
                  </button>
                </div>

                {/* Promociones Content */}
                <div className="space-y-4">
                  {promotions[activePromotionsTab as keyof typeof promotions]?.map((promotion) => (
                    <div key={promotion.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-1">{promotion.title}</h3>
                      <p className="text-green-700 mb-2 text-sm">{promotion.description}</p>
                      <p className="text-green-600 text-sm">
                        <span className="font-medium">Vigencia:</span> {promotion.validity}
                      </p>
                    </div>
                  ))}
                </div>
              </MPCardContent>
            </MPCard>

            {/* Gestión de Precios */}
            <MPCard className="mt-6">
              <MPCardHeader>
                <MPCardTitle className="text-xl font-semibold text-gray-900">
                  Gestión de Precios
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                {/* Tabs para Gestión de Precios */}
                <div className="flex space-x-1 mb-6 border-b">
                  <button
                    onClick={() => setActivePricesTab('historial')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activePricesTab === 'historial'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Historial Cronológico
                  </button>
                  <button
                    onClick={() => setActivePricesTab('vigentes')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activePricesTab === 'vigentes'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Precios Vigentes
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {currentPrices.length}
                    </span>
                  </button>
                </div>

                {activePricesTab === 'historial' ? (
                  <div className="space-y-4">
                    {priceHistory.map((item, index) => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(item.type)}`}></div>
                          {index < priceHistory.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getStatusIcon(item.status)}
                            <p className="text-sm text-gray-500">{item.date}</p>
                          </div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header con información de acuerdos priorizados */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Acuerdos Priorizados - Vigentes Hoy</h4>
                      <p className="text-blue-700 text-sm">
                        Los acuerdos se aplican según su prioridad. El sistema selecciona automáticamente el mejor precio disponible.
                      </p>
                    </div>

                    {/* Lista de acuerdos vigentes */}
                    <div className="space-y-3">
                      {currentPrices.map((agreement) => (
                        <div 
                          key={agreement.id} 
                          className={`p-4 rounded-lg border ${agreement.bgColor} ${agreement.borderColor}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className={`font-semibold ${agreement.textColor}`}>
                                  {agreement.title}
                                </h3>
                                <Badge 
                                  className={`text-xs px-2 py-1 ${
                                    agreement.status === 'Prioritario' 
                                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                      : agreement.status === 'Activo'
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : 'bg-gray-100 text-gray-600 border-gray-200'
                                  }`}
                                >
                                  {agreement.status}
                                </Badge>
                              </div>
                              <p className={`text-sm ${agreement.textColor} mb-2`}>
                                {agreement.type}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                Prioridad #{agreement.priority}
                              </span>
                            </div>
                          </div>

                          {/* Detalles del acuerdo */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Descuento</p>
                              <p className={`font-semibold ${agreement.textColor}`}>
                                {agreement.discount}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Vigencia</p>
                              <p className={`font-semibold ${agreement.textColor}`}>
                                {agreement.validity}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Moneda</p>
                              <p className={`font-semibold ${agreement.textColor}`}>
                                {agreement.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Condición de Pago</p>
                              <p className={`font-semibold ${agreement.textColor}`}>
                                {agreement.paymentCondition}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </MPCardContent>
            </MPCard>
          </div>

          {/* Acuerdo Base - Columna Derecha */}
          <div>
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="text-xl font-semibold text-gray-900">
                  Acuerdo Base
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre de la Lista</p>
                  <p className="font-semibold text-gray-900">{baseAgreement.listName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Tipo de Acuerdo</p>
                  <p className="font-semibold text-gray-900">{baseAgreement.agreementType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Moneda</p>
                  <p className="font-semibold text-gray-900">{baseAgreement.currency}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Descuento Base</p>
                  <p className="font-semibold text-gray-900">{baseAgreement.baseDiscount}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Condición de Pago</p>
                  <p className="font-semibold text-gray-900">{baseAgreement.paymentCondition}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Vigencia del Acuerdo</p>
                  <p className="font-semibold text-gray-900">{baseAgreement.agreementValidity}</p>
                </div>

                <div className="pt-4 space-y-3">
                  <MPButton 
                    variant="primary" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={onViewAgreementDetail}
                  >
                    Ver Detalle Completo
                  </MPButton>
                  <MPButton 
                    variant="secondary" 
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    onClick={onViewTransactionalQuery}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Consulta Transaccional
                  </MPButton>
                </div>
              </MPCardContent>
            </MPCard>
          </div>
        </div>
      </div>
    </div>
  );
}
