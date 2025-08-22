'use client'

import { useState, useEffect } from "react"
import { MPButton } from "@/components/ui/mp-button"
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle } from "@/components/ui/mp-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle, 
  Users, 
  DollarSign, 
  Calculator, 
  AlertCircle, 
  Settings,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
  Target,
  Zap,
  Shield,
  AlertTriangle,
  MapPin,
  Calendar,
  Upload,
  Edit,
  Trash2,
  Plus,
  CreditCard,
  BarChart3,
  Globe,
  Building2,
  Star,
  Info
} from "lucide-react"


interface CreateAgreementFlowImprovedProps {
  onBack: () => void
  onNavigateToInternalAgreements?: () => void
  preselectedType?: string
}

interface FormData {
  // Información básica
  type: string  // Tipo de acuerdo seleccionado
  name: string
  description: string
  
  // Configuración
  site: string
  team: string[]
  businessUnit: string[]
  businessUnitSubunits: { [businessUnitId: string]: string[] } // Subunits por business unit
  budget: string
  expectedTPV: string
  startDate: string
  endDate: string
  targetAudience: string
  expectedResults: string
  
  // Audiencia (paso 2)
  audienceType: string
  audienceRules: any[]
  sellerFile?: File
  selectedGroups?: string[]
  minTPV?: string
  maxTPV?: string
  businessCategory?: string
  region?: string
  
  // Aplicabilidad (paso 3)
  applicationConditions?: string
  marketplace?: string
  paymentMethods?: string[]
  timeLimitDays?: string
  tpnLimit?: string
  tpvLimit?: string
  tpvCurrency?: string
  
  // Precios (paso 4)
  processingDiscount?: string
  liberationDays?: string
  financingImprovement?: string
  
  // Otros campos existentes
  commission: string
  threshold: string
  approved: boolean
  pricingScales: PricingScale[]
  
  // Recálculo (paso 3 - PxE)
  recalculationPeriod?: string
  recalculationUnit?: string
  recalculationOptions: any[]
}

interface ValidationErrors {
  [key: string]: string
}



interface PricingScale {
  id: string
  name: string
  minAmount: string
  maxAmount: string
  type: string
  validation: string
}

export function CreateAgreementFlowImproved({ onBack, onNavigateToInternalAgreements, preselectedType }: CreateAgreementFlowImprovedProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  
  // Estados para configuración de métodos de pago
  const [activePaymentTab, setActivePaymentTab] = useState("point")
  const [activePointSubtab, setActivePointSubtab] = useState("processing")
  const [paymentMethodConfig, setPaymentMethodConfig] = useState({
    point: { 
      processing: { tasas: "" },
      financing: { tasas: "" }
    },
    codigoQR: { porCobro: "", porOfrecerCuotas: "" },
    checkout: { porCobro: "", porOfrecerCuotas: "" },
    linkDePago: { porCobro: "", porOfrecerCuotas: "" },
    pointTap: { porCobro: "", porOfrecerCuotas: "" }
  })

  // Estado para escalas de processing
  const [processingScales, setProcessingScales] = useState([
    {
      id: crypto.randomUUID(),
      escala: "",
      tpvMinimo: "",
      tpvMaximo: "",
      tasasAplicadas: "",
      escalaDefault: false
    }
  ])

  // Estado para errores de validación de escalas
  const [processingScaleErrors, setProcessingScaleErrors] = useState<{[key: string]: {[field: string]: string}}>({})

  // Estado para matriz de tasas popup
  const [ratesMatrixPopup, setRatesMatrixPopup] = useState<{
    isOpen: boolean
    scaleId: string | null
    scaleName: string
  }>({
    isOpen: false,
    scaleId: null,
    scaleName: ''
  })

  // Estado para matriz de tasas por escala
  const [ratesMatrix, setRatesMatrix] = useState<{[scaleId: string]: {[paymentMethod: string]: {[liberationDays: string]: string}}}>({})

  // Definir medios de pago y días de liberación
  const paymentMethods = [
    { id: 'debit_card', name: 'Tarjeta de débito' },
    { id: 'credit_card', name: 'Tarjeta de crédito' },
    { id: 'prepaid_card', name: 'Tarjeta prepaga' },
    { id: 'pix', name: 'PIX' }
  ]

  const liberationDays = [
    { id: 'instant', name: 'Al instante' },
    { id: '2_days', name: '2 días' },
    { id: '3_days', name: '3 días' },
    { id: '10_days', name: '10 días' },
    { id: '15_days', name: '15 días' }
  ]
  
  const [formData, setFormData] = useState<FormData>({
    type: preselectedType || "",
    name: "",
    description: "",
    site: "",
    team: [],
    businessUnit: [],
    businessUnitSubunits: {},
    budget: "",
    expectedTPV: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    expectedResults: "",
    audienceType: "",
    audienceRules: [],
    processingDiscount: "",
    liberationDays: "",
    financingImprovement: "",
    commission: "",
    threshold: "",
    approved: false,
    pricingScales: [],
    recalculationOptions: [],
  })

  const steps = [
    { 
      number: 1, 
      title: "Configuración", 
      subtitle: "Información básica y configuración",
      icon: Settings,
      color: "text-blue-600"
    },
    { 
      number: 2, 
      title: "Audiencia", 
      subtitle: "Define quién será elegible",
      icon: Users,
      color: "text-purple-600"
    },
    { 
      number: 3, 
      title: "Aplicabilidad", 
      subtitle: "Condiciones y restricciones",
      icon: Shield,
      color: "text-green-600"
    },
    { 
      number: 4, 
      title: "Precios", 
      subtitle: "Condiciones de precios",
      icon: DollarSign,
      color: "text-orange-600"
    },
    { 
      number: 5, 
      title: "Simulación", 
      subtitle: "Proyecciones y métricas",
      icon: Calculator,
      color: "text-indigo-600"
    },
    { 
      number: 6, 
      title: "Aprobación", 
      subtitle: "Revisión final y envío",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
  ]

  const campaignTypes = [
    { id: "adquisicion", label: "Adquisición", color: "text-blue-600" },
    { id: "retencion", label: "Retención", color: "text-green-600" },
    { id: "pricing-escalas", label: "Pricing por Escalas", color: "text-purple-600" },
    { id: "precios-mcc", label: "Precios por MCC", color: "text-orange-600" },
    { id: "precios-longtail", label: "Precios Longtail", color: "text-red-600" },
  ]

  const countries = [
    { id: "AR", label: "Argentina" },
    { id: "BR", label: "Brasil" },
    { id: "CL", label: "Chile" },
    { id: "CO", label: "Colombia" },
    { id: "MX", label: "México" },
    { id: "PE", label: "Perú" },
    { id: "UY", label: "Uruguay" },
  ]

  const teams = [
    { id: "cx", label: "CX" },
    { id: "fdv-adquisicion", label: "FDV adquisición" },
    { id: "fast", label: "Fast" },
    { id: "circle", label: "Circle" },
  ]

  const businessUnits = [
    { id: "op-checkout", label: "OP-Checkout" },
    { id: "op-link-pago", label: "OP-link de pago" },
    { id: "qr", label: "QR" },
    { id: "point", label: "Point" },
  ]



  const agreementTypes = [
    {
      id: "ISCA",
      title: "ISCA",
      description: "Incentivos por volumen de transacciones",
      features: ["Comisiones escalonadas", "Metas mensuales", "Bonificaciones"],
    },
    {
      id: "PxE",
      title: "Pricing por Escala",
      description: "Precios basados en volumen de negocio",
      features: ["Umbrales de TPV", "Descuentos progresivos", "Revisión trimestral"],
    },
    {
      id: "audience",
      title: "Audiencia Específica",
      description: "Precios personalizados para segmentos",
      features: ["Targeting avanzado", "Precios fijos", "Duración flexible"],
    },
    {
      id: "always-on",
      title: "Always-On",
      description: "Campañas permanentes sin fecha de fin",
      features: ["Sin vencimiento", "Activación automática", "Monitoreo continuo"],
    },
  ]

  // Validación en tiempo real
  useEffect(() => {
    const errors: ValidationErrors = {}
    
    if (currentStep === 1) {
      if (!formData.name.trim()) errors.name = "El título es requerido"
      if (formData.name.length > 100) errors.name = "El título debe tener menos de 100 caracteres"
      
      if (!formData.description.trim()) errors.description = "La descripción es requerida"
      if (formData.description.length < 10) errors.description = "La descripción debe tener al menos 10 caracteres"
      
      if (!formData.site) errors.site = "Selecciona un país"
      if (!formData.team || formData.team.length === 0) errors.team = "Selecciona al menos un equipo"
      if (!formData.businessUnit || formData.businessUnit.length === 0) errors.businessUnit = "Selecciona al menos una unidad de negocio"
      if (!formData.type) errors.type = "Selecciona un tipo de campaña"
      
      // Para PxE estos campos no son requeridos
      if (formData.type !== "PxE") {
        if (!formData.budget) errors.budget = "El presupuesto es requerido"
        if (formData.budget && parseFloat(formData.budget) <= 0) errors.budget = "El presupuesto debe ser mayor a 0"
        
        if (!formData.expectedTPV) errors.expectedTPV = "El TPV esperado es requerido"
        if (formData.expectedTPV && parseFloat(formData.expectedTPV) <= 0) errors.expectedTPV = "El TPV debe ser mayor a 0"
      }
      
      if (!formData.startDate) errors.startDate = "La fecha de inicio es requerida"
      
      // Fecha de fin es opcional, pero si se proporciona debe ser válida
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        errors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
      
      if (!formData.targetAudience.trim()) errors.targetAudience = "La audiencia objetivo es requerida"
      
      // Para PxE este campo no es requerido
      if (formData.type !== "PxE") {
        if (!formData.expectedResults.trim()) errors.expectedResults = "Los resultados esperados son requeridos"
      }
    }
    
    if (currentStep === 2) {
      if (!formData.audienceType) errors.audienceType = "Selecciona un tipo de audiencia"
    }
    

    
    setValidationErrors(errors)
  }, [formData, currentStep])

  const isStepValid = (step: number) => {
    // Campos base para el paso 1 (endDate ya no es requerida)
    let step1Fields = ['name', 'description', 'site', 'team', 'businessUnit', 'startDate', 'targetAudience']
    
    // Agregar campos adicionales solo si NO es PxE
    if (formData.type !== "PxE") {
      step1Fields = [...step1Fields, 'budget', 'expectedTPV', 'expectedResults']
    }
    
    const stepFields = {
      1: step1Fields,
      2: ['audienceType'],
      3: [], // Validación especial para PxE
      4: [], // Validación especial para el paso 4
      5: [],
      6: []
    }
    
    // Validación especial para el paso 3 (Escalas)
    if (step === 3) {
      // Verificar que haya al menos una escala
      if (formData.pricingScales.length === 0) {
        return false
      }
      
      // Verificar que cada escala tenga datos básicos válidos
      return formData.pricingScales.every(scale => {
        const hasBasicData = scale.name.trim() !== '' && scale.minAmount !== '' && scale.maxAmount !== ''
        const hasValidRange = parseFloat(scale.minAmount) < parseFloat(scale.maxAmount)
        return hasBasicData && hasValidRange
      })
    }
    
    // Validación especial para el paso 4
    if (step === 4) {
      // El paso 4 es solo de simulación, no requiere validaciones adicionales
      return true
    }
    
    const requiredFields = stepFields[step as keyof typeof stepFields] || []
    return requiredFields.every(field => {
      const fieldValue = formData[field as keyof FormData]
      const hasNoError = !validationErrors[field]
      
      // Para strings, verificar que no estén vacíos
      if (typeof fieldValue === 'string') {
        return hasNoError && fieldValue.trim() !== ''
      }
      
      // Para otros tipos, verificar que tengan valor
      return hasNoError && fieldValue
    })
  }

  const nextStep = () => {
    setHasAttemptedNext(true)
    
    if (currentStep < 6 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
      setHasAttemptedNext(false) // Reset para el siguiente paso
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setHasAttemptedNext(false) // Reset para el paso anterior
    }
  }

  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName))
  }

  const shouldShowError = (fieldName: string) => {
    return hasAttemptedNext || touchedFields.has(fieldName)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    
    // Navegar al dashboard de internal agreements después de enviar a aprobación
    if (onNavigateToInternalAgreements) {
      onNavigateToInternalAgreements()
    } else {
      onBack()
    }
  }

  const handlePricingAssistantComplete = (scales: any[]) => {
    setFormData({ ...formData, pricingScales: scales })
    // El asistente de precios ha sido eliminado
    setCurrentStep(5)
  }



  // Funciones para manejar las escalas de pricing
  const addPricingScale = () => {
    const newScale: PricingScale = {
      id: `scale-${Date.now()}`,
      name: `Escala ${formData.pricingScales.length + 1}`,
      minAmount: formData.pricingScales.length === 0 ? "0" : "",
      maxAmount: "",
      type: "default",
      validation: "pending"
    }
    setFormData({
      ...formData,
      pricingScales: [...formData.pricingScales, newScale]
    })
  }

  const updatePricingScale = (scaleId: string, updates: Partial<PricingScale>) => {
    setFormData({
      ...formData,
      pricingScales: formData.pricingScales.map(scale =>
        scale.id === scaleId ? { ...scale, ...updates } : scale
      )
    })
  }

  const deletePricingScale = (scaleId: string) => {
    setFormData({
      ...formData,
      pricingScales: formData.pricingScales.filter(scale => scale.id !== scaleId)
    })
  }





  // Funciones para manejar las opciones de recálculo
  const addRecalculationOption = () => {
    if (!formData.recalculationPeriod || !formData.recalculationUnit) {
      return // No agregar si no hay datos
    }

    const today = new Date()
    const nextRecalculation = new Date(today)
    
    if (formData.recalculationUnit === "meses") {
      nextRecalculation.setMonth(today.getMonth() + parseInt(formData.recalculationPeriod))
    }

    const newOption = {
      id: `recalc-${Date.now()}`,
      period: formData.recalculationPeriod,
      unit: formData.recalculationUnit,
      startDate: today.toLocaleDateString('es-ES'),
      nextDate: nextRecalculation.toLocaleDateString('es-ES'),
      type: "default"
    }

    setFormData({
      ...formData,
      recalculationOptions: [...formData.recalculationOptions, newOption],
      recalculationPeriod: "",
      recalculationUnit: "meses"
    })
  }

  const deleteRecalculationOption = (optionId: string) => {
    setFormData({
      ...formData,
      recalculationOptions: formData.recalculationOptions.filter(option => option.id !== optionId)
    })
  }

  // Funciones para manejar escalas de processing
  const addProcessingScale = () => {
    setProcessingScales(prev => [...prev, {
      id: crypto.randomUUID(),
      escala: "",
      tpvMinimo: "",
      tpvMaximo: "",
      tasasAplicadas: "",
      escalaDefault: false
    }])
  }

  const removeProcessingScale = (id: string) => {
    setProcessingScales(prev => prev.filter(scale => scale.id !== id))
  }

  // Función de validación para escalas de processing
  const validateProcessingScale = (scale: any, allScales: any[]) => {
    const errors: {[field: string]: string} = {}

    // Validar nombre de escala
    if (!scale.escala.trim()) {
      errors.escala = "El nombre de la escala es requerido"
    } else {
      const duplicates = allScales.filter(s => s.id !== scale.id && s.escala.trim().toLowerCase() === scale.escala.trim().toLowerCase())
      if (duplicates.length > 0) {
        errors.escala = "Ya existe una escala con este nombre"
      }
    }

    // Validar TPV mínimo
    if (!scale.tpvMinimo.trim()) {
      errors.tpvMinimo = "TPV mínimo es requerido"
    } else if (isNaN(Number(scale.tpvMinimo)) || Number(scale.tpvMinimo) < 0) {
      errors.tpvMinimo = "Debe ser un número mayor o igual a 0"
    }

    // Validar TPV máximo
    if (!scale.tpvMaximo.trim()) {
      errors.tpvMaximo = "TPV máximo es requerido"
    } else if (isNaN(Number(scale.tpvMaximo)) || Number(scale.tpvMaximo) < 0) {
      errors.tpvMaximo = "Debe ser un número mayor o igual a 0"
    } else if (scale.tpvMinimo.trim() && Number(scale.tpvMaximo) <= Number(scale.tpvMinimo)) {
      errors.tpvMaximo = "TPV máximo debe ser mayor que TPV mínimo"
    }

    // Validar tasas aplicadas
    if (!scale.tasasAplicadas.trim()) {
      errors.tasasAplicadas = "La tasa es requerida"
    } else if (isNaN(Number(scale.tasasAplicadas)) || Number(scale.tasasAplicadas) < 0 || Number(scale.tasasAplicadas) > 100) {
      errors.tasasAplicadas = "Debe ser un número entre 0 y 100"
    }

    return errors
  }

  const updateProcessingScale = (id: string, field: string, value: string | boolean) => {
    setProcessingScales(prev => {
      const updated = prev.map(scale => {
        if (scale.id === id) {
          // Si estamos marcando como default, desmarcar los demás
          if (field === 'escalaDefault' && value === true) {
            setProcessingScales(current => current.map(s => 
              s.id === id ? { ...s, [field]: value } : { ...s, escalaDefault: false }
            ))
            return { ...scale, [field]: value }
          }
          return { ...scale, [field]: value }
        }
        return scale
      })

      // Validar la escala actualizada
      const updatedScale = updated.find(s => s.id === id)
      if (updatedScale) {
        const errors = validateProcessingScale(updatedScale, updated)
        setProcessingScaleErrors(prev => ({
          ...prev,
          [id]: errors
        }))
      }

      return updated
    })
  }

  // Funciones para manejar la matriz de tasas
  const openRatesMatrix = (scaleId: string, scaleName: string) => {
    // Inicializar matriz si no existe
    if (!ratesMatrix[scaleId]) {
      const initialMatrix: {[paymentMethod: string]: {[liberationDays: string]: string}} = {}
      paymentMethods.forEach(pm => {
        initialMatrix[pm.id] = {}
        liberationDays.forEach(ld => {
          initialMatrix[pm.id][ld.id] = ''
        })
      })
      setRatesMatrix(prev => ({ ...prev, [scaleId]: initialMatrix }))
    }

    setRatesMatrixPopup({
      isOpen: true,
      scaleId,
      scaleName
    })
  }

  const closeRatesMatrix = () => {
    setRatesMatrixPopup({
      isOpen: false,
      scaleId: null,
      scaleName: ''
    })
  }

  const updateRateInMatrix = (scaleId: string, paymentMethod: string, liberationDay: string, rate: string) => {
    setRatesMatrix(prev => ({
      ...prev,
      [scaleId]: {
        ...prev[scaleId],
        [paymentMethod]: {
          ...prev[scaleId]?.[paymentMethod],
          [liberationDay]: rate
        }
      }
    }))
  }

  // Función para obtener resumen de tasas de una escala
  const getRatesSummary = (scaleId: string) => {
    const matrix = ratesMatrix[scaleId]
    if (!matrix) return 'Configurar tasas'
    
    const filledRates = Object.values(matrix).flatMap(pm => 
      Object.values(pm).filter(rate => rate && rate.trim() !== '')
    )
    
    if (filledRates.length === 0) return 'Configurar tasas'
    return `${filledRates.length} tasas configuradas`
  }



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Configuración</h2>
              <p className="text-gray-600">Configura los detalles básicos de tu campaña de marketing.</p>
            </div>

            <div className="space-y-6">
              {/* Nota informativa para PxE */}
              {formData.type === "PxE" && (
                <MPCard className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Configuración para Pricing por Escalas</h4>
                      <p className="text-sm text-blue-700">
                        Para este modelo, algunos campos como presupuesto, TPV esperado y resultados esperados no son requeridos, 
                        ya que el enfoque está en definir las escalas de pricing.
                      </p>
                    </div>
                  </div>
                </MPCard>
              )}

              {/* Configuración */}
              <MPCard variant="outlined" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre del acuerdo *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ej: Campaña Bienvenida Q4 2024"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onBlur={() => markFieldAsTouched("name")}
                      className={shouldShowError("name") && validationErrors.name ? "border-red-500" : ""}
                    />
                    {shouldShowError("name") && validationErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Descripción *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe el objetivo y alcance del acuerdo..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      onBlur={() => markFieldAsTouched("description")}
                      className={shouldShowError("description") && validationErrors.description ? "border-red-500" : ""}
                    />
                    {shouldShowError("description") && validationErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                    )}
                  </div>

                  {/* Periodo de Vigencia */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-sm font-medium">
                        Fecha de inicio *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        onBlur={() => markFieldAsTouched("startDate")}
                        className={shouldShowError("startDate") && validationErrors.startDate ? "border-red-500" : ""}
                      />
                      {shouldShowError("startDate") && validationErrors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.startDate}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-sm font-medium">
                        Fecha de fin (opcional)
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        onBlur={() => markFieldAsTouched("endDate")}
                        className={shouldShowError("endDate") && validationErrors.endDate ? "border-red-500" : ""}
                      />
                      {shouldShowError("endDate") && validationErrors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.endDate}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="site" className="text-sm font-medium">
                      Sitio de aplicación *
                    </Label>
                    <Select
                      value={formData.site}
                      onValueChange={(value) => setFormData({ ...formData, site: value })}
                    >
                      <SelectTrigger className={shouldShowError("site") && validationErrors.site ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecciona el site" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {shouldShowError("site") && validationErrors.site && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.site}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="team" className="text-sm font-medium">
                      Equipo/Iniciativa *
                    </Label>
                    <div className="relative">
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (value && !formData.team.includes(value)) {
                            setFormData({ 
                              ...formData, 
                              team: [...formData.team, value] 
                            });
                          }
                        }}
                      >
                        <SelectTrigger className={shouldShowError("team") && validationErrors.team ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona equipos/iniciativas" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem 
                              key={team.id} 
                              value={team.id}
                              disabled={formData.team.includes(team.id)}
                            >
                              {team.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Mostrar selecciones actuales */}
                      {formData.team.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.team.map((teamId) => {
                            const team = teams.find(t => t.id === teamId);
                            return (
                              <div
                                key={teamId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                              >
                                {team?.label}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ 
                                      ...formData, 
                                      team: formData.team.filter(id => id !== teamId) 
                                    });
                                  }}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {formData.team.length === 0 && (
                        <p className="text-sm text-gray-500 italic mt-1">Selecciona al menos un equipo/iniciativa</p>
                      )}
                    </div>
                    {shouldShowError("team") && validationErrors.team && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.team}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessUnit" className="text-sm font-medium">
                      Unidad de negocio que acumulará TPV *
                    </Label>
                    <div className="relative">
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (value && !formData.businessUnit.includes(value)) {
                            setFormData({ 
                              ...formData, 
                              businessUnit: [...formData.businessUnit, value] 
                            });
                          }
                        }}
                      >
                        <SelectTrigger className={shouldShowError("businessUnit") && validationErrors.businessUnit ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona unidades de negocio" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessUnits.map((unit) => (
                            <SelectItem 
                              key={unit.id} 
                              value={unit.id}
                              disabled={formData.businessUnit.includes(unit.id)}
                            >
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Mostrar selecciones actuales */}
                      {formData.businessUnit.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.businessUnit.map((unitId) => {
                            const unit = businessUnits.find(u => u.id === unitId);
                            return (
                              <div
                                key={unitId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                              >
                                {unit?.label}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ 
                                      ...formData, 
                                      businessUnit: formData.businessUnit.filter(id => id !== unitId) 
                                    });
                                  }}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {formData.businessUnit.length === 0 && (
                        <p className="text-sm text-gray-500 italic mt-1">Selecciona al menos una unidad de negocio</p>
                      )}
                    </div>
                    {shouldShowError("businessUnit") && validationErrors.businessUnit && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.businessUnit}</p>
                    )}
                  </div>

                  {/* Campos que NO se muestran para PxE */}
                  {formData.type !== "PxE" && (
                    <>
                      <div>
                        <Label htmlFor="budget" className="text-sm font-medium">
                          Presupuesto de campaña *
                        </Label>
                        <Input
                          id="budget"
                          placeholder="Ingresa el presupuesto"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          onBlur={() => markFieldAsTouched("budget")}
                          className={shouldShowError("budget") && validationErrors.budget ? "border-red-500" : ""}
                        />
                        {shouldShowError("budget") && validationErrors.budget && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="expectedTPV" className="text-sm font-medium">
                          TPV Esperado *
                        </Label>
                        <Input
                          id="expectedTPV"
                          placeholder="Ingresa el TPV esperado"
                          value={formData.expectedTPV}
                          onChange={(e) => setFormData({ ...formData, expectedTPV: e.target.value })}
                          onBlur={() => markFieldAsTouched("expectedTPV")}
                          className={shouldShowError("expectedTPV") && validationErrors.expectedTPV ? "border-red-500" : ""}
                        />
                        {shouldShowError("expectedTPV") && validationErrors.expectedTPV && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.expectedTPV}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="targetAudience" className="text-sm font-medium">
                      Audiencia objetivo *
                    </Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="Describe la audiencia objetivo"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      onBlur={() => markFieldAsTouched("targetAudience")}
                      className={shouldShowError("targetAudience") && validationErrors.targetAudience ? "border-red-500" : ""}
                    />
                    {shouldShowError("targetAudience") && validationErrors.targetAudience && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.targetAudience}</p>
                    )}
                  </div>

                  {/* Campo que NO se muestra para PxE */}
                  {formData.type !== "PxE" && (
                    <div>
                      <Label htmlFor="expectedResults" className="text-sm font-medium">
                        Resultados esperados *
                      </Label>
                      <Textarea
                        id="expectedResults"
                        placeholder="Describe los resultados esperados"
                        value={formData.expectedResults}
                        onChange={(e) => setFormData({ ...formData, expectedResults: e.target.value })}
                        onBlur={() => markFieldAsTouched("expectedResults")}
                        className={shouldShowError("expectedResults") && validationErrors.expectedResults ? "border-red-500" : ""}
                      />
                      {shouldShowError("expectedResults") && validationErrors.expectedResults && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.expectedResults}</p>
                      )}
                    </div>
                  )}
                </div>
              </MPCard>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Configuración de Audiencia</h2>
              <p className="text-gray-600">Especifica el tipo de audiencia para este acuerdo</p>
            </div>

            <RadioGroup
              value={formData.audienceType}
              onValueChange={(value) => setFormData({ ...formData, audienceType: value })}
            >
              <div className="space-y-4">
                <MPCard 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    formData.audienceType === "defined-sellers" 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setFormData({ ...formData, audienceType: "defined-sellers" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defined-sellers" id="defined-sellers" />
                    <Label htmlFor="defined-sellers" className="font-medium">
                      Audiencia definida (lista de sellers)
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Subir archivo CSV con IDs de sellers específicos</p>
                </MPCard>

                <MPCard 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    formData.audienceType === "defined-group" 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setFormData({ ...formData, audienceType: "defined-group" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defined-group" id="defined-group" />
                    <Label htmlFor="defined-group" className="font-medium">
                      Audiencia definida (grupo)
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Seleccionar grupos predefinidos de sellers</p>
                </MPCard>

                <MPCard 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    formData.audienceType === "dynamic" 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setFormData({ ...formData, audienceType: "dynamic" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dynamic" id="dynamic" />
                    <Label htmlFor="dynamic" className="font-medium">
                      Audiencia dinámica
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Definir criterios que se evalúan automáticamente</p>
                </MPCard>

                <MPCard 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    formData.audienceType === "no-audience" 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setFormData({ ...formData, audienceType: "no-audience" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-audience" id="no-audience" />
                    <Label htmlFor="no-audience" className="font-medium">
                      Sin audiencia inicial
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Se completará la audiencia luego de la creación del internal agreements</p>
                </MPCard>
              </div>
            </RadioGroup>

            {/* Contenido específico según el tipo de audiencia seleccionado */}
            {formData.audienceType === "defined-sellers" && (
              <MPCard className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Cargar lista de sellers</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="mb-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Arrastra y suelta tu archivo CSV aquí</p>
                      <p className="text-xs text-gray-500 mt-1">o haz clic para seleccionar</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      id="seller-csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, sellerFile: file });
                        }
                      }}
                    />
                    <label htmlFor="seller-csv" className="cursor-pointer">
                      <MPButton variant="secondary" className="mt-2">
                        Seleccionar archivo CSV
                      </MPButton>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    El archivo debe contener una columna "seller_id" con los IDs de los sellers
                  </p>
                </div>
              </MPCard>
            )}

            {formData.audienceType === "defined-group" && (
              <MPCard className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Seleccionar grupos de sellers</h3>
                <div className="space-y-3">
                  {["Sellers Premium", "Sellers Nuevos", "Sellers Alto Volumen", "Sellers Categoría A", "Sellers Región Norte"].map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={group}
                        checked={formData.selectedGroups?.includes(group) || false}
                        onCheckedChange={(checked) => {
                          const selectedGroups = formData.selectedGroups || [];
                          if (checked) {
                            setFormData({ 
                              ...formData, 
                              selectedGroups: [...selectedGroups, group] 
                            });
                          } else {
                            setFormData({ 
                              ...formData, 
                              selectedGroups: selectedGroups.filter((g: string) => g !== group) 
                            });
                          }
                        }}
                      />
                      <Label htmlFor={group} className="text-sm">
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </MPCard>
            )}

            {formData.audienceType === "dynamic" && (
              <MPCard className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Configurar reglas dinámicas</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minTPV" className="text-sm font-medium">
                        TPV mínimo mensual
                      </Label>
                      <Input
                        id="minTPV"
                        type="number"
                        placeholder="100000"
                        value={formData.minTPV || ""}
                        onChange={(e) => setFormData({ ...formData, minTPV: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxTPV" className="text-sm font-medium">
                        TPV máximo mensual
                      </Label>
                      <Input
                        id="maxTPV"
                        type="number"
                        placeholder="5000000"
                        value={formData.maxTPV || ""}
                        onChange={(e) => setFormData({ ...formData, maxTPV: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Categoría de negocio
                    </Label>
                    <Select
                      value={formData.businessCategory || ""}
                      onValueChange={(value) => setFormData({ ...formData, businessCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="food">Comida y Bebidas</SelectItem>
                        <SelectItem value="services">Servicios</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region" className="text-sm font-medium">
                      Región geográfica
                    </Label>
                    <Select
                      value={formData.region || ""}
                      onValueChange={(value) => setFormData({ ...formData, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">Norte</SelectItem>
                        <SelectItem value="south">Sur</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="east">Este</SelectItem>
                        <SelectItem value="west">Oeste</SelectItem>
                        <SelectItem value="all">Todo el país</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </MPCard>
            )}

            {formData.audienceType === "no-audience" && (
              <MPCard className="p-6 mt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Acuerdo sin audiencia inicial</h3>
                  <p className="text-gray-600 text-sm">
                    La configuración de audiencia se definirá después de crear el acuerdo interno.
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Podrás especificar los criterios de audiencia una vez que el acuerdo esté creado.
                  </p>
                </div>
              </MPCard>
            )}
          </div>
        )

            case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Configuración de Escalas</h2>
              <p className="text-gray-600">
                Define las escalas de pricing para el acuerdo
              </p>
            </div>

            <div className="space-y-6">
              {/* Descripción */}
              <div className="text-center">
                <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                  Configura los costos por método de pago según el plazo elegido para recibir el dinero.
                </p>
              </div>

              {/* Configuración de métodos de pago con pestañas */}
              <MPCard className="p-0 overflow-hidden">
                {/* Pestañas de métodos de pago */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { id: "point", name: "Point", icon: CreditCard },
                      { id: "codigoQR", name: "Código QR", icon: BarChart3 },
                      { id: "checkout", name: "Checkout", icon: Globe },
                      { id: "linkDePago", name: "Link de pago", icon: Building2 },
                      { id: "pointTap", name: "Point Tap", icon: Star }
                    ].map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActivePaymentTab(tab.id)}
                          className={`${
                            activePaymentTab === tab.id
                              ? 'border-blue-500 text-blue-600 bg-blue-50'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.name}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Contenido de cada pestaña */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Contenido específico para Point con subtabs */}
                    {activePaymentTab === "point" ? (
                      <div className="space-y-6">
                        {/* Subtabs para Point */}
                        <div className="border-b border-gray-200">
                          <nav className="flex space-x-8" aria-label="Point Subtabs">
                            {[
                              { id: "processing", name: "Tasas de processing" },
                              { id: "financing", name: "Tasas de financing" }
                            ].map((subtab) => (
                              <button
                                key={subtab.id}
                                onClick={() => setActivePointSubtab(subtab.id)}
                                className={`${
                                  activePointSubtab === subtab.id
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                              >
                                {subtab.name}
                              </button>
                            ))}
                          </nav>
                        </div>

                        {/* Contenido de los subtabs */}
                        <div className="space-y-4">
                          {activePointSubtab === "processing" && (
                            <div className="space-y-6">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <h4 className="font-medium text-gray-900">Configuración de Escalas de TPV</h4>
                              </div>
                              <p className="text-sm text-gray-600">
                                Define las escalas de TPV y sus tasas de procesamiento correspondientes.
                              </p>

                              {/* Tabla de escalas de processing */}
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Escala
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          TPV Mínimo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          TPV Máximo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Tasas Aplicadas (%)
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Default
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Acciones
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {processingScales.map((scale, index) => (
                                        <tr key={scale.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="space-y-1">
                                              <Input
                                                value={scale.escala}
                                                onChange={(e) => updateProcessingScale(scale.id, 'escala', e.target.value)}
                                                placeholder="Ej: Escala 1"
                                                className={`w-full text-sm ${processingScaleErrors[scale.id]?.escala ? 'border-red-500 focus:ring-red-500' : ''}`}
                                              />
                                              {processingScaleErrors[scale.id]?.escala && (
                                                <p className="text-xs text-red-600">{processingScaleErrors[scale.id].escala}</p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="space-y-1">
                                              <Input
                                                value={scale.tpvMinimo}
                                                onChange={(e) => updateProcessingScale(scale.id, 'tpvMinimo', e.target.value)}
                                                placeholder="Ej: 0"
                                                type="number"
                                                min="0"
                                                className={`w-full text-sm ${processingScaleErrors[scale.id]?.tpvMinimo ? 'border-red-500 focus:ring-red-500' : ''}`}
                                              />
                                              {processingScaleErrors[scale.id]?.tpvMinimo && (
                                                <p className="text-xs text-red-600">{processingScaleErrors[scale.id].tpvMinimo}</p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="space-y-1">
                                              <Input
                                                value={scale.tpvMaximo}
                                                onChange={(e) => updateProcessingScale(scale.id, 'tpvMaximo', e.target.value)}
                                                placeholder="Ej: 10000"
                                                type="number"
                                                min="0"
                                                className={`w-full text-sm ${processingScaleErrors[scale.id]?.tpvMaximo ? 'border-red-500 focus:ring-red-500' : ''}`}
                                              />
                                              {processingScaleErrors[scale.id]?.tpvMaximo && (
                                                <p className="text-xs text-red-600">{processingScaleErrors[scale.id].tpvMaximo}</p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                              onClick={() => openRatesMatrix(scale.id, scale.escala || `Escala ${index + 1}`)}
                                              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                            >
                                              <div className="flex items-center justify-between">
                                                <span>{getRatesSummary(scale.id)}</span>
                                                <Edit className="w-4 h-4 ml-2 text-gray-400" />
                                              </div>
                                            </button>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <input
                                              type="checkbox"
                                              checked={scale.escalaDefault}
                                              onChange={(e) => updateProcessingScale(scale.id, 'escalaDefault', e.target.checked)}
                                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                              onClick={() => removeProcessingScale(scale.id)}
                                              disabled={processingScales.length <= 1}
                                              className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                                            >
                                              Eliminar
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Validación global y botón para agregar nueva escala */}
                              <div className="space-y-4">
                                {/* Validación de escala default */}
                                {processingScales.length > 0 && !processingScales.some(s => s.escalaDefault) && (
                                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    <p className="text-sm text-amber-700">
                                      Debe marcar al menos una escala como default
                                    </p>
                                  </div>
                                )}

                                <div className="flex justify-start">
                                  <button
                                    onClick={addProcessingScale}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Escala
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Modal de Matriz de Tasas */}
                          {ratesMatrixPopup.isOpen && ratesMatrixPopup.scaleId && (
                            <Dialog open={ratesMatrixPopup.isOpen} onOpenChange={closeRatesMatrix}>
                              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    Configurar Tasas - {ratesMatrixPopup.scaleName}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Configure las tasas específicas por medio de pago y días de liberación para esta escala.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 rounded-lg">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                                            Medio de Pago
                                          </th>
                                          {liberationDays.map(day => (
                                            <th key={day.id} className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                                              {day.name}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white">
                                        {paymentMethods.map((pm, pmIndex) => (
                                          <tr key={pm.id} className={pmIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
                                              {pm.name}
                                            </td>
                                            {liberationDays.map(day => (
                                              <td key={day.id} className="px-4 py-3 border-r border-gray-200 last:border-r-0">
                                                <Input
                                                  value={ratesMatrix[ratesMatrixPopup.scaleId!]?.[pm.id]?.[day.id] || ''}
                                                  onChange={(e) => updateRateInMatrix(ratesMatrixPopup.scaleId!, pm.id, day.id, e.target.value)}
                                                  placeholder="0.00"
                                                  type="number"
                                                  min="0"
                                                  max="100"
                                                  step="0.01"
                                                  className="w-full text-sm text-center"
                                                />
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <Info className="w-4 h-4 text-blue-600" />
                                    <p className="text-sm text-blue-700">
                                      Ingrese las tasas en porcentaje (%). Ejemplo: 2.5 para 2.5%
                                    </p>
                                  </div>
                                </div>

                                <DialogFooter>
                                  <MPButton
                                    variant="secondary"
                                    onClick={closeRatesMatrix}
                                  >
                                    Cancelar
                                  </MPButton>
                                  <MPButton onClick={closeRatesMatrix}>
                                    Guardar Tasas
                                  </MPButton>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}

                          {activePointSubtab === "financing" && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <h4 className="font-medium text-gray-900">Configuración de Tasas de Financing</h4>
                              </div>
                              <p className="text-sm text-gray-600">
                                Define las tasas de financiamiento para ofertas de cuotas Point.
                              </p>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm text-gray-700">Tasa de financing (%)</Label>
                                  <Input
                                    value={paymentMethodConfig.point.financing.tasas}
                                    onChange={(e) => {
                                      setPaymentMethodConfig(prev => ({
                                        ...prev,
                                        point: {
                                          ...prev.point,
                                          financing: {
                                            ...prev.point.financing,
                                            tasas: e.target.value
                                          }
                                        }
                                      }))
                                    }}
                                    placeholder="Ej: 1.8"
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Contenido para otros métodos de pago (mantener lógica original) */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Por cobro */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <h4 className="font-medium text-gray-900">Por cobro</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Los costos por cobro varían según el plazo elegido para recibir el dinero.
                        </p>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-gray-700">Costo procesamiento (%)</Label>
                            <Input
                                value={(paymentMethodConfig[activePaymentTab as keyof typeof paymentMethodConfig] as any)?.porCobro || ""}
                              onChange={(e) => {
                                setPaymentMethodConfig(prev => ({
                                  ...prev,
                                  [activePaymentTab]: {
                                      ...(prev[activePaymentTab as keyof typeof prev] as any),
                                    porCobro: e.target.value
                                  }
                                }))
                              }}
                              placeholder="Ej: 2.5"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Por ofrecer cuotas */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <h4 className="font-medium text-gray-900">Por ofrecer cuotas</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Configuración adicional para ofertas de financiamiento.
                        </p>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-gray-700">Costo financiamiento (%)</Label>
                            <Input
                                value={(paymentMethodConfig[activePaymentTab as keyof typeof paymentMethodConfig] as any)?.porOfrecerCuotas || ""}
                              onChange={(e) => {
                                setPaymentMethodConfig(prev => ({
                                  ...prev,
                                  [activePaymentTab]: {
                                      ...(prev[activePaymentTab as keyof typeof prev] as any),
                                    porOfrecerCuotas: e.target.value
                                  }
                                }))
                              }}
                              placeholder="Ej: 1.8"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Información adicional específica del método de pago */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">
                            Información sobre {
                              activePaymentTab === "point" ? "Point" :
                              activePaymentTab === "codigoQR" ? "Código QR" :
                              activePaymentTab === "checkout" ? "Checkout" :
                              activePaymentTab === "linkDePago" ? "Link de pago" :
                              "Point Tap"
                            }
                          </h5>
                          <p className="text-sm text-gray-600">
                            {activePaymentTab === "point" && "Configura los costos para transacciones realizadas con Point físico."}
                            {activePaymentTab === "codigoQR" && "Configura los costos para pagos mediante código QR."}
                            {activePaymentTab === "checkout" && "Configura los costos para pagos online mediante Checkout."}
                            {activePaymentTab === "linkDePago" && "Configura los costos para pagos mediante links de pago."}
                            {activePaymentTab === "pointTap" && "Configura los costos para pagos contactless con Point Tap."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MPCard>

              {/* Sección de Recálculo */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Configuración de Recálculo</h3>
                
                {/* Pregunta y configuración */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      ¿Después de cuánto tiempo comienza el recálculo?
                    </Label>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="3"
                          value={formData.recalculationPeriod || ""}
                          onChange={(e) => setFormData({ ...formData, recalculationPeriod: e.target.value })}
                          className="text-center"
                          min="1"
                        />
                      </div>
                      <div className="flex-1">
                        <Select
                          value={formData.recalculationUnit || "meses"}
                          onValueChange={(value) => setFormData({ ...formData, recalculationUnit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Meses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meses">Meses</SelectItem>
                            <SelectItem value="días">Días</SelectItem>
                            <SelectItem value="años">Años</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <MPButton
                        type="button"
                        onClick={addRecalculationOption}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                        disabled={!formData.recalculationPeriod || !formData.recalculationUnit}
                      >
                        Adicionar
                      </MPButton>
                    </div>
                  </div>

                  {/* Opciones de recálculo */}
                  {formData.recalculationOptions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-base font-semibold mb-3">Opciones de recálculo</h4>
                      <div className="space-y-3">
                        {formData.recalculationOptions.map((option, index) => (
                          <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">
                                En {option.period} {option.unit === "meses" ? (option.period === "1" ? "Mes" : "Meses") : option.unit}:
                              </span>
                              <span className="text-gray-600 text-sm">
                                Ej: Hoy {option.startDate} - Siguiente recálculo {option.nextDate}
                              </span>
                              <Select
                                value={option.type}
                                onValueChange={(value) => {
                                  const updatedOptions = formData.recalculationOptions.map(opt =>
                                    opt.id === option.id ? { ...opt, type: value } : opt
                                  )
                                  setFormData({ ...formData, recalculationOptions: updatedOptions })
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <MPButton
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecalculationOption(option.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </MPButton>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </MPCard>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Simulación y Métricas</h2>
              <p className="text-gray-600">Revisa el impacto proyectado y las métricas clave</p>
            </div>

            <div className="space-y-6">
              {/* Resumen del Acuerdo */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                  Resumen del Acuerdo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Título de la Campaña:</p>
                      <p className="font-medium">{formData.name || "Sin definir"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Campaña:</p>
                      <p className="font-medium">{agreementTypes.find(t => t.id === formData.type)?.title || "Sin definir"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">País/Site:</p>
                      <p className="font-medium">{countries.find(c => c.id === formData.site)?.label || "Sin definir"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Audiencia:</p>
                      <p className="font-medium">
                        {formData.audienceType === "defined-sellers" && "Audiencia definida (lista de sellers)"}
                        {formData.audienceType === "defined-group" && "Audiencia definida (grupo)"}
                        {formData.audienceType === "dynamic" && "Audiencia dinámica"}
                        {formData.audienceType === "no-audience" && "Sin audiencia inicial"}
                        {!formData.audienceType && "Sin definir"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Presupuesto de Campaña:</p>
                      <p className="font-medium text-lg">${formData.budget ? parseFloat(formData.budget).toLocaleString() : "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">TPV Esperado:</p>
                      <p className="font-medium text-lg">${formData.expectedTPV ? parseFloat(formData.expectedTPV).toLocaleString() : "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duración:</p>
                      <p className="font-medium">
                        {formData.startDate && formData.endDate 
                          ? `${formData.startDate} - ${formData.endDate}`
                          : "Sin definir"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Marketplace:</p>
                      <p className="font-medium">{formData.marketplace || "Sin definir"}</p>
                    </div>
                  </div>
                </div>
              </MPCard>

              {/* Escalas Configuradas */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Escalas Configuradas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {formData.pricingScales.length}
                      </div>
                      <p className="text-sm text-blue-700 font-medium">Escalas</p>
                      <p className="text-xs text-blue-600 mt-1">Configuradas</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {formData.pricingScales.length > 0 ? formData.pricingScales[0].minAmount : "0"}
                      </div>
                      <p className="text-sm text-purple-700 font-medium">Monto Mínimo</p>
                      <p className="text-xs text-purple-600 mt-1">Primera escala</p>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {formData.pricingScales.length > 0 ? formData.pricingScales[formData.pricingScales.length - 1].maxAmount : "0"}
                      </div>
                      <p className="text-sm text-orange-700 font-medium">Monto Máximo</p>
                      <p className="text-xs text-orange-600 mt-1">Última escala</p>
                    </div>
                  </div>
                </div>
              </MPCard>

              {/* Proyecciones de Escalas */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Proyecciones de Escalas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">TPV Objetivo</h4>
                      <div className="text-2xl font-bold text-green-600">
                        ${formData.expectedTPV ? parseFloat(formData.expectedTPV).toLocaleString() : "0"}
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Volumen esperado de transacciones
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-2">Rango Total</h4>
                      <div className="text-2xl font-bold text-indigo-600">
                        {formData.pricingScales.length > 0 
                          ? `$${formData.pricingScales[0].minAmount} - $${formData.pricingScales[formData.pricingScales.length - 1].maxAmount}`
                          : "$0 - $0"
                        }
                      </div>
                      <p className="text-sm text-indigo-700 mt-1">
                        Rango completo de todas las escalas
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">Inversión</h4>
                      <div className="text-2xl font-bold text-yellow-600">
                        ${formData.budget ? parseFloat(formData.budget).toLocaleString() : "0"}
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Presupuesto asignado al acuerdo
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Eficiencia</h4>
                      <div className="text-2xl font-bold text-purple-600">
                        {formData.budget && formData.expectedTPV
                          ? `${Math.round((parseFloat(formData.expectedTPV) / parseFloat(formData.budget)) * 100) / 100}x`
                          : "0x"
                        }
                      </div>
                      <p className="text-sm text-purple-700 mt-1">
                        Ratio TPV esperado vs inversión
                      </p>
                    </div>
                  </div>
                </div>
              </MPCard>

              {/* Métricas de Impacto */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Métricas de Impacto Estimadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-700 mb-1">
                      {formData.audienceType === "no-audience" 
                        ? "Inicial" 
                        : formData.audienceType === "defined-sellers" 
                        ? "Lista"
                        : formData.audienceType === "defined-group"
                        ? "Grupos"
                        : "Dinámico"
                      }
                    </div>
                    <p className="text-sm text-gray-600">Alcance de Audiencia</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-700 mb-1">
                      {formData.timeLimitDays || "30"}
                    </div>
                    <p className="text-sm text-gray-600">Días de Campaña</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-700 mb-1">
                      {formData.paymentMethods?.length || "0"}
                    </div>
                    <p className="text-sm text-gray-600">Medios de Pago</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-700 mb-1">
                      {formData.tpvCurrency || "USD"}
                    </div>
                    <p className="text-sm text-gray-600">Moneda Base</p>
                  </div>
                </div>
              </MPCard>

              {/* Resumen Ejecutivo */}
              <MPCard className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Resumen Ejecutivo
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Campaña:</strong> {formData.name || "Sin definir"} con un presupuesto de ${formData.budget ? parseFloat(formData.budget).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Alcance:</strong> {formData.audienceType === "no-audience" ? "Sin audiencia inicial" : "Audiencia segmentada"} con TPV esperado de ${formData.expectedTPV ? parseFloat(formData.expectedTPV).toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Escalas:</strong> {formData.pricingScales.length} escalas configuradas con rangos de volumen definidos
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-700">
                      <strong>Eficiencia:</strong> Ratio de {formData.budget && formData.expectedTPV
                        ? `${Math.round((parseFloat(formData.expectedTPV) / parseFloat(formData.budget)) * 100) / 100}x`
                        : "0x"
                      } entre TPV esperado e inversión con duración de {formData.timeLimitDays || "30"} días
                    </p>
                  </div>
                </div>
              </MPCard>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold">Flujo completado</h2>
            <p>El acuerdo se ha enviado a aprobación.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Paso {currentStep} de 4</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <MPButton
            variant="secondary"
            onClick={onBack}
            className="px-6 font-medium border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Cancelar
          </MPButton>
          
          <div className="flex gap-3 items-center">
            {currentStep > 1 && (
              <MPButton
                variant="ghost"
                onClick={prevStep}
                className="px-6 font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </MPButton>
            )}
            
            {/* Indicador de campos faltantes */}
            {!isStepValid(currentStep) && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                <AlertCircle className="w-4 h-4" />
                <span>Completa todos los campos requeridos</span>
              </div>
            )}
            
            {/* Debug: Mostrar estado de validación */}
            {false && (
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded max-w-xs">
                Válido: {isStepValid(currentStep) ? 'Sí' : 'No'}
                {currentStep === 1 && (
                  <div className="mt-1 text-xs max-h-32 overflow-y-auto">
                    {(() => {
                      // Campos base para validar (endDate ya no es requerida)
                      let fieldsToValidate = ['name', 'description', 'site', 'team', 'businessUnit', 'type', 'startDate', 'targetAudience']
                      
                      // Agregar campos adicionales solo si NO es PxE
                      if (formData.type !== "PxE") {
                        fieldsToValidate = [...fieldsToValidate, 'budget', 'expectedTPV', 'expectedResults']
                      }
                      
                      return fieldsToValidate.map(field => {
                        const fieldValue = formData[field as keyof FormData]
                        const hasError = validationErrors[field]
                        const hasValue = fieldValue && String(fieldValue).trim()
                        const isValid = !hasError && hasValue
                        
                        return (
                          <div key={field} className={`${isValid ? 'text-green-500' : 'text-red-500'}`}>
                            {field}: {isValid ? '✓' : '✗'} {hasError ? '(error)' : hasValue ? '(ok)' : '(vacío)'}
                          </div>
                        )
                      })
                    })()}
                  </div>
                )}
              </div>
            )}
            
            {currentStep < 4 ? (
              <MPButton
                variant="primary"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`px-6 font-medium ${
                  isStepValid(currentStep) 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200" 
                    : "bg-gray-400 text-gray-600 cursor-not-allowed shadow-sm"
                }`}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-1" />
              </MPButton>
            ) : (
              <MPButton
                variant="primary"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={!isStepValid(currentStep)}
                className={`px-6 font-medium ${
                  isStepValid(currentStep) 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200" 
                    : "bg-gray-400 text-gray-600 cursor-not-allowed shadow-sm"
                }`}
              >
                Enviar a aprobación
              </MPButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 