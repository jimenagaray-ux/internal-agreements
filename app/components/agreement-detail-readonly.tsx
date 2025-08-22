'use client'

import React from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Target,
  TrendingUp,
  Eye
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
  descripcion?: string;
  objetivos?: string[];
  audiencia?: {
    tipo: string;
    descripcion: string;
    criterios: string[];
  };
  condiciones?: {
    processingDiscount?: string;
    liberationDays?: string;
    financingImprovement?: string;
  };
  configuracion?: {
    site: string;
    team: string[];
    businessUnit: string[];
    startDate: string;
    endDate?: string;
  };
}

interface AgreementDetailReadonlyProps {
  agreement: Agreement;
  onBack: () => void;
}

export default function AgreementDetailReadonly({ agreement, onBack }: AgreementDetailReadonlyProps) {
  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      'Activo': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'Pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'Expirado': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'En_revision': { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle }
    };

    const config = statusConfig[estado as keyof typeof statusConfig] || statusConfig['Pendiente'];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        <IconComponent className="w-4 h-4" />
        <span className="font-medium">{estado}</span>
      </div>
    );
  };

  const getApprovalStatusBadge = (aprobacion?: Agreement['aprobacion']) => {
    if (!aprobacion) return null;

    const statusConfig = {
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pendiente' },
      aprobado: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Aprobado' },
      rechazado: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rechazado' },
      en_revision: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle, label: 'En Revisión' }
    };

    const config = statusConfig[aprobacion.estado];
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        <IconComponent className="w-4 h-4" />
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <MPButton
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </MPButton>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agreement.nombre}</h1>
              <p className="text-gray-600 mt-1">Detalle del Internal Agreement</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(agreement.estado)}
            <Badge variant="outline" className="px-3 py-1">
              <Eye className="w-4 h-4 mr-1" />
              Solo lectura
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Información Básica
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID del Acuerdo</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{agreement.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Área</label>
                    <p className="text-sm text-gray-900">{agreement.area}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contrapartida</label>
                    <p className="text-sm text-gray-900">{agreement.contrapartida}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Acuerdo</label>
                    <p className="text-sm text-gray-900">{agreement.tipo}</p>
                  </div>
                </div>
                
                {agreement.descripcion && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Descripción</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{agreement.descripcion}</p>
                  </div>
                )}
              </MPCardContent>
            </MPCard>

            {/* Fechas y Montos */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Fechas y Montos
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
                      <p className="text-sm text-gray-900">{agreement.fechaCreacion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Vencimiento</label>
                      <p className="text-sm text-gray-900">{agreement.fechaVencimiento}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Monto del Acuerdo</label>
                      <p className="text-lg font-bold text-gray-900">{agreement.monto}</p>
                    </div>
                    {agreement.tpvEstimado && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">TPV Estimado</label>
                        <p className="text-sm text-gray-900">{agreement.tpvEstimado}</p>
                      </div>
                    )}
                  </div>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Configuración */}
            {agreement.configuracion && (
              <MPCard>
                <MPCardHeader>
                  <MPCardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                    Configuración
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sitio de Aplicación</label>
                      <p className="text-sm text-gray-900">{agreement.configuracion.site}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Inicio</label>
                      <p className="text-sm text-gray-900">{agreement.configuracion.startDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Equipos</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agreement.configuracion.team.map((team, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Unidades de Negocio</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agreement.configuracion.businessUnit.map((unit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {unit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </MPCardContent>
              </MPCard>
            )}

            {/* Audiencia */}
            {agreement.audiencia && (
              <MPCard>
                <MPCardHeader>
                  <MPCardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Configuración de Audiencia
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Audiencia</label>
                    <p className="text-sm text-gray-900">{agreement.audiencia.tipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Descripción</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{agreement.audiencia.descripcion}</p>
                  </div>
                  {agreement.audiencia.criterios.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Criterios</label>
                      <ul className="text-sm text-gray-900 space-y-1 mt-2">
                        {agreement.audiencia.criterios.map((criterio, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            {criterio}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </MPCardContent>
              </MPCard>
            )}

            {/* Condiciones de Precios */}
            {agreement.condiciones && (
              <MPCard>
                <MPCardHeader>
                  <MPCardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Condiciones de Precios
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {agreement.condiciones.processingDiscount && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-blue-700">Descuento Processing</label>
                        <p className="text-lg font-bold text-blue-900">{agreement.condiciones.processingDiscount}%</p>
                      </div>
                    )}
                    {agreement.condiciones.liberationDays && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-purple-700">Días de Liberación</label>
                        <p className="text-lg font-bold text-purple-900">{agreement.condiciones.liberationDays} días</p>
                      </div>
                    )}
                    {agreement.condiciones.financingImprovement && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-orange-700">Mejora Financing</label>
                        <p className="text-lg font-bold text-orange-900">{agreement.condiciones.financingImprovement}%</p>
                      </div>
                    )}
                  </div>
                </MPCardContent>
              </MPCard>
            )}
          </div>

          {/* Sidebar - Estado y Métricas */}
          <div className="space-y-6">
            {/* Estado de Aprobación */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Estado de Aprobación
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                <div className="text-center">
                  {getApprovalStatusBadge(agreement.aprobacion)}
                </div>
                
                {agreement.aprobacion && (
                  <div className="space-y-3 text-sm">
                    {agreement.aprobacion.fecha && (
                      <div>
                        <label className="font-medium text-gray-600">Fecha:</label>
                        <p className="text-gray-900">{agreement.aprobacion.fecha}</p>
                      </div>
                    )}
                    {agreement.aprobacion.aprobadoPor && (
                      <div>
                        <label className="font-medium text-gray-600">Aprobado por:</label>
                        <p className="text-gray-900">{agreement.aprobacion.aprobadoPor}</p>
                      </div>
                    )}
                    {agreement.aprobacion.comentarios && (
                      <div>
                        <label className="font-medium text-gray-600">Comentarios:</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded text-xs">{agreement.aprobacion.comentarios}</p>
                      </div>
                    )}
                  </div>
                )}
              </MPCardContent>
            </MPCard>

            {/* Métricas de Performance */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Métricas de Performance
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                {agreement.tpvActual && agreement.tpvEstimado && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">TPV Actual vs Estimado</label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Actual: {agreement.tpvActual}</span>
                        <span>Estimado: {agreement.tpvEstimado}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (parseFloat(agreement.tpvActual.replace(/[$,]/g, '')) / parseFloat(agreement.tpvEstimado.replace(/[$,]/g, ''))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {agreement.usuariosActivos && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Usuarios Activos</label>
                    <p className="text-2xl font-bold text-gray-900">{agreement.usuariosActivos.toLocaleString()}</p>
                  </div>
                )}

                {agreement.roi && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">ROI</label>
                    <p className="text-2xl font-bold text-green-600">{agreement.roi}</p>
                  </div>
                )}

                {agreement.costoUtilizado && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Costo Utilizado</label>
                    <p className="text-lg font-semibold text-gray-900">{agreement.costoUtilizado}</p>
                  </div>
                )}
              </MPCardContent>
            </MPCard>

            {/* Objetivos */}
            {agreement.objetivos && agreement.objetivos.length > 0 && (
              <MPCard>
                <MPCardHeader>
                  <MPCardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-600" />
                    Objetivos
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <ul className="space-y-2">
                    {agreement.objetivos.map((objetivo, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-900">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </MPCardContent>
              </MPCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 