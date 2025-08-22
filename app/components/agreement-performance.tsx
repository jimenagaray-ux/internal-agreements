'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface Agreement {
  id: string;
  nombre: string;
  area: string;
  estado: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  monto: string;
  tpvEstimado?: string;
  tpvActual?: string;
  usuariosActivos?: number;
  costoUtilizado?: string;
  roi?: string;
}

interface PerformanceData {
  tpvProgreso: {
    fechas: string[];
    estimado: number[];
    actual: number[];
  };
  usuariosProgreso: {
    fechas: string[];
    usuarios: number[];
  };
  costoProgreso: {
    fechas: string[];
    costo: number[];
  };
  roiProgreso: {
    fechas: string[];
    roi: number[];
  };
  metricas: {
    tpvCompletion: number;
    usuariosObjetivo: number;
    presupuestoUtilizado: number;
    roiActual: number;
  };
}

interface AgreementPerformanceProps {
  agreement: Agreement;
  onBack: () => void;
}

export default function AgreementPerformance({ agreement, onBack }: AgreementPerformanceProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para los gráficos
  const performanceData: PerformanceData = {
    tpvProgreso: {
      fechas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      estimado: [8000000, 16000000, 24000000, 32000000, 40000000, 50000000],
      actual: [6500000, 14200000, 21800000, 28500000, 35250000, 42100000]
    },
    usuariosProgreso: {
      fechas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      usuarios: [200, 450, 680, 920, 1120, 1250]
    },
    costoProgreso: {
      fechas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      costo: [1200000, 2800000, 4100000, 6200000, 7500000, 8750000]
    },
    roiProgreso: {
      fechas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      roi: [5.2, 8.1, 11.3, 13.8, 14.9, 15.2]
    },
    metricas: {
      tpvCompletion: 84.2,
      usuariosObjetivo: 83.3,
      presupuestoUtilizado: 70.0,
      roiActual: 15.2
    }
  };

  const getPerformanceIndicator = (actual: number, estimado: number) => {
    const percentage = ((actual - estimado) / estimado) * 100;
    if (percentage > 5) {
      return { icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-100' };
    } else if (percentage < -5) {
      return { icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-100' };
    } else {
      return { icon: Minus, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    // Simular exportación
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Reporte de performance exportado exitosamente');
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  // Componente simple para gráfico de líneas (mockup)
  const LineChart = ({ data, title, color = 'blue' }: { data: any, title: string, color?: string }) => (
    <div className="h-64 flex items-end space-x-2 p-4 bg-white rounded-lg border">
      {data.fechas.map((fecha: string, index: number) => {
        const estimadoHeight = data.estimado ? (data.estimado[index] / Math.max(...data.estimado)) * 200 : 0;
        const actualHeight = data.actual ? (data.actual[index] / Math.max(...data.actual)) * 200 : 
                            data.usuarios ? (data.usuarios[index] / Math.max(...data.usuarios)) * 200 :
                            data.costo ? (data.costo[index] / Math.max(...data.costo)) * 200 :
                            (data.roi[index] / Math.max(...data.roi)) * 200;
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative w-full h-48 flex items-end justify-center space-x-1">
              {data.estimado && (
                <div 
                  className="bg-gray-300 w-3 rounded-t"
                  style={{ height: `${estimadoHeight}px` }}
                  title={`Estimado: ${data.estimado[index].toLocaleString()}`}
                />
              )}
              <div 
                className={`bg-${color}-500 w-3 rounded-t`}
                style={{ height: `${actualHeight}px` }}
                title={`Actual: ${
                  data.actual ? data.actual[index].toLocaleString() :
                  data.usuarios ? data.usuarios[index].toLocaleString() :
                  data.costo ? data.costo[index].toLocaleString() :
                  data.roi[index] + '%'
                }`}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2">{fecha}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
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
              <h1 className="text-3xl font-bold text-gray-900">Performance - {agreement.nombre}</h1>
              <p className="text-gray-600 mt-1">Análisis detallado de métricas y rendimiento</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="all">Todo el período</option>
            </select>
            <MPButton
              variant="secondary"
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </MPButton>
            <MPButton
              variant="primary"
              onClick={handleExport}
              disabled={isLoading}
              className="px-4 py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </MPButton>
          </div>
        </div>

        {/* KPIs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">TPV Completion</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceData.metricas.tpvCompletion}%</p>
                  <p className="text-sm text-gray-500">
                    {agreement.tpvActual} / {agreement.tpvEstimado}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{agreement.usuariosActivos?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{performanceData.metricas.usuariosObjetivo}% del objetivo</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Costo Utilizado</p>
                  <p className="text-2xl font-bold text-gray-900">{agreement.costoUtilizado}</p>
                  <p className="text-sm text-gray-500">{performanceData.metricas.presupuestoUtilizado}% del presupuesto</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>

          <MPCard>
            <MPCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ROI Actual</p>
                  <p className="text-2xl font-bold text-gray-900">{agreement.roi}</p>
                  <div className="flex items-center mt-1">
                    {(() => {
                      const indicator = getPerformanceIndicator(15.2, 12.0);
                      const IconComponent = indicator.icon;
                      return (
                        <>
                          <IconComponent className={`w-4 h-4 ${indicator.color} mr-1`} />
                          <span className={`text-sm ${indicator.color}`}>vs objetivo</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </MPCardContent>
          </MPCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* TPV Progress Chart */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                TPV Procesado vs Estimado
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <div className="mb-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Estimado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Actual</span>
                </div>
              </div>
              <LineChart 
                data={performanceData.tpvProgreso} 
                title="TPV Progress" 
                color="blue"
              />
            </MPCardContent>
          </MPCard>

          {/* Users Progress Chart */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Crecimiento de Usuarios
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <LineChart 
                data={performanceData.usuariosProgreso} 
                title="User Growth" 
                color="green"
              />
            </MPCardContent>
          </MPCard>

          {/* Cost Progress Chart */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Evolución de Costos
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <LineChart 
                data={performanceData.costoProgreso} 
                title="Cost Evolution" 
                color="orange"
              />
            </MPCardContent>
          </MPCard>

          {/* ROI Progress Chart */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Evolución del ROI
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <LineChart 
                data={performanceData.roiProgreso} 
                title="ROI Evolution" 
                color="purple"
              />
            </MPCardContent>
          </MPCard>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Insights */}
          <MPCard className="lg:col-span-2">
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                Insights de Performance
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Rendimiento Positivo</h4>
                </div>
                <p className="text-sm text-green-700">
                  El TPV actual está siguiendo una tendencia positiva, alcanzando el 84.2% del objetivo estimado.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Crecimiento de Usuario</h4>
                </div>
                <p className="text-sm text-blue-700">
                  La adquisición de usuarios está en línea con las proyecciones, con {agreement.usuariosActivos?.toLocaleString()} usuarios activos.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-orange-800">Eficiencia de Costos</h4>
                </div>
                <p className="text-sm text-orange-700">
                  El uso del presupuesto está optimizado, utilizando solo el 70% del presupuesto asignado.
                </p>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Key Metrics */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-600" />
                Métricas Clave
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">TPV Completion</span>
                  <span className="text-sm font-bold text-gray-900">{performanceData.metricas.tpvCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${performanceData.metricas.tpvCompletion}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Usuarios Objetivo</span>
                  <span className="text-sm font-bold text-gray-900">{performanceData.metricas.usuariosObjetivo}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${performanceData.metricas.usuariosObjetivo}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Presupuesto Utilizado</span>
                  <span className="text-sm font-bold text-gray-900">{performanceData.metricas.presupuestoUtilizado}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${performanceData.metricas.presupuestoUtilizado}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">ROI vs Objetivo</span>
                  <span className="text-sm font-bold text-green-600">{performanceData.metricas.roiActual}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (performanceData.metricas.roiActual / 20) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </p>
              </div>
            </MPCardContent>
          </MPCard>
        </div>
      </div>
    </div>
  );
} 