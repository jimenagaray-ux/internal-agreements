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

interface BaseAgreementDetailProps {
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
}

export default function BaseAgreementDetail({ seller, onBack }: BaseAgreementDetailProps) {
  const [activeTab, setActiveTab] = useState('vigentes');

  // Mock data para precios vigentes (igual que en seller-detail)
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
                <h1 className="text-2xl font-bold text-gray-900">Detalle del Acuerdo Base</h1>
                <p className="text-gray-600">Vendedor: <span className="font-medium">{seller.name.toUpperCase()}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          
          {/* Gestión de Precios - Full Width */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="text-xl font-semibold text-gray-900">
                Gestión de Precios
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              {/* Tabs para Gestión de Precios */}
              <div className="flex space-x-1 mb-6 border-b">
                <button
                  onClick={() => setActiveTab('historial')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'historial'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Historial Cronológico
                </button>
                <button
                  onClick={() => setActiveTab('vigentes')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'vigentes'
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

              {activeTab === 'vigentes' ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Historial cronológico disponible en la vista anterior</p>
                </div>
              )}
            </MPCardContent>
          </MPCard>
        </div>
      </div>
    </div>
  );
}
