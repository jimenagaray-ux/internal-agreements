'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  MessageCircle,
  Send,
  FileText,
  Download,
  Eye,
  Edit,
  CheckSquare,
  UserCheck,
  AlertTriangle,
  History,
  RefreshCw
} from 'lucide-react';

interface Agreement {
  id: string;
  nombre: string;
  area: string;
  estado: string;
}

interface ApprovalStep {
  id: string;
  etapa: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'en_revision';
  aprobador: string;
  fecha?: string;
  comentarios?: string;
  orden: number;
}

interface ApprovalHistory {
  id: string;
  accion: string;
  usuario: string;
  fecha: string;
  comentario?: string;
  estado: 'aprobado' | 'rechazado' | 'enviado' | 'modificado';
}

interface ApprovalStatusProps {
  agreement: Agreement;
  onBack: () => void;
}

export default function ApprovalStatus({ agreement, onBack }: ApprovalStatusProps) {
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para el proceso de aprobación
  const approvalSteps: ApprovalStep[] = [
    {
      id: 'step1',
      etapa: 'Revisión Técnica',
      estado: 'aprobado',
      aprobador: 'Juan Pérez - Tech Lead',
      fecha: '2024-01-20',
      comentarios: 'Configuración técnica revisada y aprobada sin observaciones.',
      orden: 1
    },
    {
      id: 'step2',
      etapa: 'Revisión Financiera',
      estado: 'aprobado',
      aprobador: 'María González - Finance Manager',
      fecha: '2024-01-22',
      comentarios: 'Presupuesto y proyecciones financieras validadas.',
      orden: 2
    },
    {
      id: 'step3',
      etapa: 'Revisión Legal',
      estado: 'en_revision',
      aprobador: 'Carlos Rodríguez - Legal Counsel',
      fecha: undefined,
      comentarios: undefined,
      orden: 3
    },
    {
      id: 'step4',
      etapa: 'Aprobación Final',
      estado: 'pendiente',
      aprobador: 'Ana Martín - Director',
      fecha: undefined,
      comentarios: undefined,
      orden: 4
    }
  ];

  const approvalHistory: ApprovalHistory[] = [
    {
      id: '1',
      accion: 'Acuerdo enviado a aprobación',
      usuario: 'Sistema',
      fecha: '2024-01-15 14:30',
      estado: 'enviado'
    },
    {
      id: '2',
      accion: 'Revisión técnica aprobada',
      usuario: 'Juan Pérez',
      fecha: '2024-01-20 09:15',
      comentario: 'Configuración técnica revisada y aprobada sin observaciones.',
      estado: 'aprobado'
    },
    {
      id: '3',
      accion: 'Revisión financiera aprobada',
      usuario: 'María González',
      fecha: '2024-01-22 16:45',
      comentario: 'Presupuesto y proyecciones financieras validadas.',
      estado: 'aprobado'
    },
    {
      id: '4',
      accion: 'Enviado a revisión legal',
      usuario: 'Sistema',
      fecha: '2024-01-23 08:00',
      estado: 'enviado'
    }
  ];

  const getStatusConfig = (estado: string) => {
    const configs = {
      pendiente: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: Clock, 
        label: 'Pendiente' 
      },
      aprobado: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: CheckCircle, 
        label: 'Aprobado' 
      },
      rechazado: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: XCircle, 
        label: 'Rechazado' 
      },
      en_revision: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        icon: AlertCircle, 
        label: 'En Revisión' 
      }
    };
    return configs[estado as keyof typeof configs] || configs.pendiente;
  };

  const getActionIcon = (estado: string) => {
    const icons = {
      aprobado: CheckCircle,
      rechazado: XCircle,
      enviado: Send,
      modificado: Edit
    };
    return icons[estado as keyof typeof icons] || MessageCircle;
  };

  const getCurrentStepIndex = () => {
    return approvalSteps.findIndex(step => 
      step.estado === 'en_revision' || step.estado === 'pendiente'
    );
  };

  const getOverallProgress = () => {
    const completedSteps = approvalSteps.filter(step => step.estado === 'aprobado').length;
    return (completedSteps / approvalSteps.length) * 100;
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    // Simular envío de comentario
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Comentario enviado exitosamente');
    setNewComment('');
    setIsLoading(false);
  };

  const handleRequestUpdate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Solicitud de actualización enviada');
    setIsLoading(false);
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
              <h1 className="text-3xl font-bold text-gray-900">Estado de Aprobación</h1>
              <p className="text-gray-600 mt-1">{agreement.nombre} - {agreement.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MPButton
              variant="secondary"
              onClick={handleRequestUpdate}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Solicitar Actualización
            </MPButton>
            <MPButton variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Estado
            </MPButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Proceso de Aprobación */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progreso General */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Progreso de Aprobación
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Progreso General</span>
                    <span className="text-sm font-bold text-gray-900">{getOverallProgress().toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${getOverallProgress()}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {approvalSteps.filter(s => s.estado === 'aprobado').length} de {approvalSteps.length} etapas completadas
                  </p>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Etapas de Aprobación */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                  Etapas de Aprobación
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                <div className="space-y-4">
                  {approvalSteps.map((step, index) => {
                    const config = getStatusConfig(step.estado);
                    const IconComponent = config.icon;
                    const isActive = index === getCurrentStepIndex();

                    return (
                      <div
                        key={step.id}
                        className={`relative p-4 rounded-lg border-2 ${
                          isActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Línea conectora */}
                        {index < approvalSteps.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300" />
                        )}

                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${config.bg}`}>
                            <IconComponent className={`w-6 h-6 ${config.text}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {step.etapa}
                              </h3>
                              <Badge className={`${config.bg} ${config.text} border-none`}>
                                {config.label}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                {step.aprobador}
                              </div>
                              {step.fecha && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {step.fecha}
                                </div>
                              )}
                            </div>

                            {step.comentarios && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                <div className="flex items-start">
                                  <MessageCircle className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                                  <p className="text-sm text-gray-700">{step.comentarios}</p>
                                </div>
                              </div>
                            )}

                            {isActive && step.estado === 'en_revision' && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex items-center">
                                  <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                                  <p className="text-sm text-blue-700 font-medium">
                                    Actualmente en revisión
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </MPCardContent>
            </MPCard>

            {/* Historial de Aprobación */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-purple-600" />
                  Historial de Actividad
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                <div className="space-y-4">
                  {approvalHistory.map((item) => {
                    const IconComponent = getActionIcon(item.estado);
                    
                    return (
                      <div key={item.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          item.estado === 'aprobado' ? 'bg-green-100' :
                          item.estado === 'rechazado' ? 'bg-red-100' :
                          item.estado === 'enviado' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            item.estado === 'aprobado' ? 'text-green-600' :
                            item.estado === 'rechazado' ? 'text-red-600' :
                            item.estado === 'enviado' ? 'text-blue-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {item.accion}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.fecha}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            por {item.usuario}
                          </p>
                          {item.comentario && (
                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                              {item.comentario}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </MPCardContent>
            </MPCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumen del Estado */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                  Resumen del Estado
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Estado Actual</p>
                  <div className="mt-1">
                    {(() => {
                      const currentStep = approvalSteps[getCurrentStepIndex()];
                      if (currentStep) {
                        const config = getStatusConfig(currentStep.estado);
                        const IconComponent = config.icon;
                        return (
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
                            <IconComponent className="w-4 h-4" />
                            <span className="font-medium">{config.label}</span>
                          </div>
                        );
                      }
                      return <span className="text-gray-500">Completado</span>;
                    })()}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Etapa Actual</p>
                  <p className="text-sm font-medium text-gray-900">
                    {approvalSteps[getCurrentStepIndex()]?.etapa || 'Proceso Completado'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Responsable Actual</p>
                  <p className="text-sm text-gray-900">
                    {approvalSteps[getCurrentStepIndex()]?.aprobador || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tiempo en Etapa</p>
                  <p className="text-sm text-gray-900">3 días</p>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Agregar Comentario */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                  Agregar Comentario
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                <Textarea
                  placeholder="Escribe un comentario o pregunta sobre el proceso de aprobación..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
                <MPButton
                  variant="primary"
                  onClick={handleSendComment}
                  disabled={!newComment.trim() || isLoading}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? 'Enviando...' : 'Enviar Comentario'}
                </MPButton>
              </MPCardContent>
            </MPCard>

            {/* Información del Acuerdo */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="text-sm font-medium text-gray-700">
                  Información del Acuerdo
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ID</p>
                  <p className="text-sm font-mono text-gray-900">{agreement.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="text-sm text-gray-900">{agreement.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado del Acuerdo</p>
                  <Badge variant={agreement.estado === 'Activo' ? 'default' : 'secondary'}>
                    {agreement.estado}
                  </Badge>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Acciones Disponibles */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="text-sm font-medium text-gray-700">
                  Acciones Disponibles
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-2">
                <MPButton variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalle Completo
                </MPButton>
                <MPButton variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Reporte
                </MPButton>
                <MPButton variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalar Proceso
                </MPButton>
              </MPCardContent>
            </MPCard>
          </div>
        </div>
      </div>
    </div>
  );
} 