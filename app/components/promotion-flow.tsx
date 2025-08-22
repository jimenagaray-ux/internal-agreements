'use client'

import React, { useState } from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calculator,
  Target,
  Users,
  Calendar,
  Percent,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Clock,
  Zap,
  Shield,
  Eye
} from 'lucide-react';

interface PromotionFlowProps {
  onBack: () => void;
  onComplete?: (data: any) => void;
  promotionType?: string;
}

export default function PromotionFlow({ onBack, onComplete, promotionType }: PromotionFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Carga de promoción
    name: '',
    description: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    discount: '',
    targetAudience: '',
    budget: '',
    // Paso 2: Evaluación técnica y económica
    technicalViability: '',
    economicImpact: '',
    riskLevel: '',
    systemComplexity: '',
    // Paso 3: Simulación (automática)
    // Paso 4: Aprobación
    approverNotes: '',
    priority: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPromotionTypeName = (type?: string) => {
    switch (type) {
      case 'terceros':
        return 'Promoción de Terceros';
      case 'seasonal':
        return 'Seasonal';
      case 'campana':
        return 'Campaña';
      case 'propia':
        return 'Promoción Propia';
      default:
        return 'Nueva Promoción';
    }
  };

  const steps = [
    { number: 1, title: 'Carga de Promoción', icon: FileText },
    { number: 2, title: 'Evaluación Técnica y Económica', icon: Shield },
    { number: 3, title: 'Simulación', icon: Calculator },
    { number: 4, title: 'Aprobación', icon: CheckCircle }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: any = {};
    
    switch (step) {
      case 1:
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.description) newErrors.description = 'La descripción es requerida';
        if (!formData.type) newErrors.type = 'El tipo es requerido';
        if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
        if (!formData.endDate) newErrors.endDate = 'La fecha de fin es requerida';
        if (!formData.discount) newErrors.discount = 'El descuento es requerido';
        if (!formData.budget) newErrors.budget = 'El presupuesto es requerido';
        break;
      case 2:
        if (!formData.technicalViability) newErrors.technicalViability = 'La viabilidad técnica es requerida';
        if (!formData.economicImpact) newErrors.economicImpact = 'El impacto económico es requerido';
        break;
      case 3:
        if (!formData.riskLevel) newErrors.riskLevel = 'El nivel de riesgo es requerido';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        // Simular evaluación automática
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1500);
      } else if (currentStep === 3) {
        // Ejecutar simulación
        runSimulation();
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 2000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const runSimulation = () => {
    // Simular cálculos automáticos basados en los datos de la promoción
    const discountPercent = parseFloat(formData.discount) || 0;
    const budget = parseFloat(formData.budget) || 0;
    
    // Estimaciones automáticas basadas en el tipo de promoción y presupuesto
    const estimatedUsers = Math.round(budget * 0.1); // 10% del presupuesto como usuarios
    const projectedRevenue = budget * 3.5; // Estimación de 3.5x el presupuesto

    const results = {
      totalUsers: estimatedUsers,
      expectedRevenue: projectedRevenue,
      discountCost: (projectedRevenue * discountPercent) / 100,
      netRevenue: projectedRevenue - ((projectedRevenue * discountPercent) / 100),
      roi: ((projectedRevenue - budget) / budget) * 100,
      costPerAcquisition: estimatedUsers > 0 ? budget / estimatedUsers : 0,
      conversionRate: Math.min((estimatedUsers / 10000) * 100, 15), // Max 15%
      riskScore: formData.riskLevel === 'high' ? 85 : formData.riskLevel === 'medium' ? 60 : 35
    };

    setSimulationResults(results);
  };

  const handleComplete = () => {
    setIsSubmitting(true);
    
    // Simular el envío a aprobación
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          ...formData,
          simulationResults,
          status: 'pending_approval',
          createdAt: new Date().toISOString()
        });
      }
      setIsSubmitting(false);
    }, 1500); // Simular tiempo de procesamiento
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Información Básica de la Promoción
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre de la Promoción *</Label>
              <Input
                id="name"
                placeholder="Ej: Black Friday 2024"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="type">Tipo de Promoción *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Descuento Porcentual</SelectItem>
                  <SelectItem value="fixed">Descuento Fijo</SelectItem>
                  <SelectItem value="bogo">2x1 / BOGO</SelectItem>
                  <SelectItem value="cashback">Cashback</SelectItem>
                  <SelectItem value="free-shipping">Envío Gratis</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe los detalles de la promoción..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <Label htmlFor="discount">Descuento *</Label>
              <div className="relative">
                <Input
                  id="discount"
                  placeholder="25"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  className={errors.discount ? 'border-red-500 pr-8' : 'pr-8'}
                />
                <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar audiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  <SelectItem value="new">Usuarios nuevos</SelectItem>
                  <SelectItem value="returning">Usuarios recurrentes</SelectItem>
                  <SelectItem value="premium">Usuarios premium</SelectItem>
                  <SelectItem value="inactive">Usuarios inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Presupuesto Total *</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="budget"
                  placeholder="50000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className={errors.budget ? 'border-red-500 pl-8' : 'pl-8'}
                />
              </div>
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>
        </MPCardContent>
      </MPCard>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Evaluación Técnica y Económica
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Viabilidad Técnica *
            </Label>
            <RadioGroup 
              value={formData.technicalViability} 
              onValueChange={(value) => handleInputChange('technicalViability', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="tech-high" />
                <Label htmlFor="tech-high" className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Alta - Sin complejidad técnica
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="tech-medium" />
                <Label htmlFor="tech-medium" className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Media - Requiere desarrollo menor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="tech-low" />
                <Label htmlFor="tech-low" className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Baja - Requiere desarrollo complejo
                </Label>
              </div>
            </RadioGroup>
            {errors.technicalViability && <p className="text-red-500 text-sm mt-1">{errors.technicalViability}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Impacto Económico Esperado *
            </Label>
            <RadioGroup 
              value={formData.economicImpact} 
              onValueChange={(value) => handleInputChange('economicImpact', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="positive" id="eco-positive" />
                <Label htmlFor="eco-positive" className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Positivo - Incremento de ingresos esperado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="eco-neutral" />
                <Label htmlFor="eco-neutral" className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-yellow-600" />
                  Neutral - Mantiene ingresos actuales
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investment" id="eco-investment" />
                <Label htmlFor="eco-investment" className="text-sm flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                  Inversión - Costo a corto plazo, beneficio a largo plazo
                </Label>
              </div>
            </RadioGroup>
            {errors.economicImpact && <p className="text-red-500 text-sm mt-1">{errors.economicImpact}</p>}
          </div>



          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Evaluación Automática</h4>
                <p className="text-sm text-blue-800">
                  El sistema evaluará automáticamente la viabilidad técnica y económica 
                  basándose en las respuestas proporcionadas y datos históricos.
                </p>
              </div>
            </div>
          </div>
        </MPCardContent>
      </MPCard>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">

      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Evaluación de Riesgo
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Nivel de Riesgo *
            </Label>
            <RadioGroup 
              value={formData.riskLevel} 
              onValueChange={(value) => handleInputChange('riskLevel', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="risk-low" />
                <Label htmlFor="risk-low" className="text-sm">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Bajo - Promoción estándar sin riesgos
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="risk-medium" />
                <Label htmlFor="risk-medium" className="text-sm">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Medio - Requiere monitoreo
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="risk-high" />
                <Label htmlFor="risk-high" className="text-sm">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Alto - Requiere aprobación especial
                  </span>
                </Label>
              </div>
            </RadioGroup>
            {errors.riskLevel && <p className="text-red-500 text-sm mt-1">{errors.riskLevel}</p>}
          </div>
        </MPCardContent>
      </MPCard>

      {simulationResults && (
        <MPCard>
          <MPCardHeader>
            <MPCardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Resultados de la Simulación
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 mb-1">Ingresos Netos</p>
                    <p className="text-xl font-bold text-green-900">
                      ${simulationResults.netRevenue?.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">ROI Estimado</p>
                    <p className="text-xl font-bold text-blue-900">
                      {simulationResults.roi?.toFixed(1)}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 mb-1">Costo por Usuario</p>
                    <p className="text-xl font-bold text-purple-900">
                      ${simulationResults.costPerAcquisition?.toFixed(2)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 mb-1">Tasa de Conversión</p>
                    <p className="text-xl font-bold text-orange-900">
                      {simulationResults.conversionRate?.toFixed(1)}%
                    </p>
                  </div>
                  <Percent className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 mb-1">Costo del Descuento</p>
                    <p className="text-xl font-bold text-yellow-900">
                      ${simulationResults.discountCost?.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className={`${simulationResults.riskScore > 70 ? 'bg-red-50 border-red-200' : simulationResults.riskScore > 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm mb-1 ${simulationResults.riskScore > 70 ? 'text-red-600' : simulationResults.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                      Puntuación de Riesgo
                    </p>
                    <p className={`text-xl font-bold ${simulationResults.riskScore > 70 ? 'text-red-900' : simulationResults.riskScore > 40 ? 'text-yellow-900' : 'text-green-900'}`}>
                      {simulationResults.riskScore}/100
                    </p>
                  </div>
                  <AlertTriangle className={`w-8 h-8 ${simulationResults.riskScore > 70 ? 'text-red-600' : simulationResults.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`} />
                </div>
              </div>
            </div>
          </MPCardContent>
        </MPCard>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {isSubmitting && (
        <MPCard className="border-green-200 bg-green-50">
          <MPCardContent className="pt-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <div>
                <p className="text-green-800 font-medium">Enviando promoción para aprobación...</p>
                <p className="text-green-600 text-sm">Redirigiendo al dashboard de promociones</p>
              </div>
            </div>
          </MPCardContent>
        </MPCard>
      )}
      
      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Solicitud de Aprobación
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Resumen de la Promoción</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <span className="ml-2 font-medium">{formData.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-2 font-medium">{formData.type}</span>
              </div>
              <div>
                <span className="text-gray-600">Descuento:</span>
                <span className="ml-2 font-medium">{formData.discount}%</span>
              </div>
              <div>
                <span className="text-gray-600">Presupuesto:</span>
                <span className="ml-2 font-medium">${parseFloat(formData.budget).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Periodo:</span>
                <span className="ml-2 font-medium">{formData.startDate} - {formData.endDate}</span>
              </div>
              <div>
                <span className="text-gray-600">ROI Estimado:</span>
                <span className="ml-2 font-medium text-green-600">
                  {simulationResults?.roi?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Prioridad de Aprobación
            </Label>
            <RadioGroup 
              value={formData.priority} 
              onValueChange={(value) => handleInputChange('priority', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="priority-urgent" />
                <Label htmlFor="priority-urgent" className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Urgente - Requiere aprobación inmediata
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" />
                <Label htmlFor="priority-high" className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Alta - Dentro de 24 horas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="priority-normal" />
                <Label htmlFor="priority-normal" className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Normal - Proceso estándar (3-5 días)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="approverNotes">Notas para el Aprobador</Label>
            <Textarea
              id="approverNotes"
              placeholder="Información adicional relevante para la aprobación..."
              value={formData.approverNotes}
              onChange={(e) => handleInputChange('approverNotes', e.target.value)}
              rows={4}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Próximos Pasos</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Una vez enviada, la promoción será revisada por el equipo de aprobaciones:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>• Revisión técnica y económica</li>
                  <li>• Validación de presupuesto</li>
                  <li>• Aprobación final</li>
                  <li>• Programación y activación</li>
                </ul>
              </div>
            </div>
          </div>
        </MPCardContent>
      </MPCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4 shadow-lg">
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
              <h1 className="text-xl font-semibold">{getPromotionTypeName(promotionType)}</h1>
              <p className="text-sm text-green-100">Paso {currentStep} de 4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    } ${isCurrent ? 'ring-2 ring-green-300' : ''}`}>
                      {isActive && currentStep > step.number ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-medium hidden md:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${isActive ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <MPButton
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </MPButton>
          
          {currentStep < 4 ? (
            <MPButton
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {currentStep === 2 ? 'Evaluar' : currentStep === 3 ? 'Simular' : 'Siguiente'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </MPButton>
          ) : (
            <MPButton
              onClick={handleComplete}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar para Aprobación
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </MPButton>
          )}
        </div>
      </div>
    </div>
  );
}
