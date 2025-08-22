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
  Plus
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
    { id: "commercial", label: "Equipo Comercial" },
    { id: "marketing", label: "Equipo Marketing" },
    { id: "product", label: "Equipo Producto" },
    { id: "partnerships", label: "Equipo Partnerships" },
  ]

  const businessUnits = [
    { 
      id: "online-payments", 
      label: "Online Payments",
      subunits: [
        { id: "op-checkout", label: "Checkout" },
        { id: "op-api", label: "API Payments" },
        { id: "op-wallet", label: "Wallet" },
        { id: "op-subscriptions", label: "Suscripciones" }
      ]
    },
    { 
      id: "point", 
      label: "Point",
      subunits: [
        { id: "point-smart", label: "Point Smart" },
        { id: "point-pro", label: "Point Pro" },
        { id: "point-mini", label: "Point Mini" },
        { id: "point-plus", label: "Point Plus" }
      ]
    },
    { 
      id: "qr", 
      label: "QR",
      subunits: [
        { id: "qr-dynamic", label: "QR Dinámico" },
        { id: "qr-static", label: "QR Estático" },
        { id: "qr-pos", label: "QR en POS" },
        { id: "qr-integration", label: "QR Integración" }
      ]
    },
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
                      Equipo *
                    </Label>
                    <div className={`space-y-3 p-3 border rounded-md ${shouldShowError("team") && validationErrors.team ? "border-red-500" : "border-gray-200"}`}>
                      {teams.map((team) => (
                        <div key={team.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={team.id}
                            checked={formData.team.includes(team.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({ 
                                  ...formData, 
                                  team: [...formData.team, team.id] 
                                });
                              } else {
                                setFormData({ 
                                  ...formData, 
                                  team: formData.team.filter(id => id !== team.id) 
                                });
                              }
                            }}
                          />
                          <Label htmlFor={team.id} className="text-sm font-normal">
                            {team.label}
                          </Label>
                        </div>
                      ))}
                      {formData.team.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Selecciona al menos un equipo</p>
                      )}
                    </div>
                    {shouldShowError("team") && validationErrors.team && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.team}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessUnit" className="text-sm font-medium">
                      Unidad de negocio que aplicará *
                    </Label>
                    <div className={`space-y-4 p-4 border rounded-md ${shouldShowError("businessUnit") && validationErrors.businessUnit ? "border-red-500" : "border-gray-200"}`}>
                      {businessUnits.map((unit) => (
                        <div key={unit.id} className="space-y-3">
                          {/* Business Unit Principal */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={unit.id}
                              checked={formData.businessUnit.includes(unit.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({ 
                                    ...formData, 
                                    businessUnit: [...formData.businessUnit, unit.id] 
                                  });
                                } else {
                                  // Al desmarcar la business unit, también desmarcar todas sus subunits
                                  const newBusinessUnitSubunits = { ...formData.businessUnitSubunits };
                                  delete newBusinessUnitSubunits[unit.id];
                                  setFormData({ 
                                    ...formData, 
                                    businessUnit: formData.businessUnit.filter(id => id !== unit.id),
                                    businessUnitSubunits: newBusinessUnitSubunits
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={unit.id} className="text-sm font-semibold text-gray-900">
                              {unit.label}
                            </Label>
                          </div>
                          
                          {/* Subunits - Solo mostrar si la business unit está seleccionada */}
                          {formData.businessUnit.includes(unit.id) && (
                            <div className="ml-6 space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <div className="text-xs font-medium text-gray-600 mb-2">
                                Selecciona las subunidades específicas:
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {unit.subunits.map((subunit) => (
                                  <div key={subunit.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={subunit.id}
                                      checked={formData.businessUnitSubunits[unit.id]?.includes(subunit.id) || false}
                                      onCheckedChange={(checked) => {
                                        const currentSubunits = formData.businessUnitSubunits[unit.id] || [];
                                        const newBusinessUnitSubunits = { ...formData.businessUnitSubunits };
                                        
                                        if (checked) {
                                          newBusinessUnitSubunits[unit.id] = [...currentSubunits, subunit.id];
                                        } else {
                                          newBusinessUnitSubunits[unit.id] = currentSubunits.filter(id => id !== subunit.id);
                                          // Si no hay subunits seleccionadas, eliminar la entrada
                                          if (newBusinessUnitSubunits[unit.id].length === 0) {
                                            delete newBusinessUnitSubunits[unit.id];
                                          }
                                        }
                                        
                                        setFormData({ 
                                          ...formData, 
                                          businessUnitSubunits: newBusinessUnitSubunits
                                        });
                                      }}
                                    />
                                    <Label htmlFor={subunit.id} className="text-xs font-normal text-gray-700">
                                      {subunit.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Botones de selección rápida */}
                              <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
                                <button
                                  type="button"
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  onClick={() => {
                                    const newBusinessUnitSubunits = { ...formData.businessUnitSubunits };
                                    newBusinessUnitSubunits[unit.id] = unit.subunits.map(s => s.id);
                                    setFormData({ 
                                      ...formData, 
                                      businessUnitSubunits: newBusinessUnitSubunits
                                    });
                                  }}
                                >
                                  Seleccionar todas
                                </button>
                                <span className="text-xs text-gray-400">|</span>
                                <button
                                  type="button"
                                  className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                                  onClick={() => {
                                    const newBusinessUnitSubunits = { ...formData.businessUnitSubunits };
                                    delete newBusinessUnitSubunits[unit.id];
                                    setFormData({ 
                                      ...formData, 
                                      businessUnitSubunits: newBusinessUnitSubunits
                                    });
                                  }}
                                >
                                  Limpiar selección
                                </button>
                              </div>
                              
                              {/* Contador de seleccionadas */}
                              {formData.businessUnitSubunits[unit.id] && formData.businessUnitSubunits[unit.id].length > 0 && (
                                <div className="text-xs text-green-600 font-medium mt-2">
                                  {formData.businessUnitSubunits[unit.id].length} de {unit.subunits.length} subunidades seleccionadas
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {formData.businessUnit.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Selecciona al menos una unidad de negocio</p>
                      )}
                      
                      {/* Resumen de selección */}
                      {formData.businessUnit.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="text-sm font-medium text-blue-800 mb-2">Resumen de selección:</div>
                          <div className="space-y-1">
                            {formData.businessUnit.map((unitId) => {
                              const unit = businessUnits.find(u => u.id === unitId);
                              const selectedSubunits = formData.businessUnitSubunits[unitId] || [];
                              return (
                                <div key={unitId} className="text-xs text-blue-700">
                                  <strong>{unit?.label}:</strong> {
                                    selectedSubunits.length > 0 
                                      ? `${selectedSubunits.length} subunidades seleccionadas`
                                      : "Sin subunidades específicas"
                                  }
                                </div>
                              );
                            })}
                          </div>
                        </div>
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
                  Configura las escalas de pricing que se aplicarán según los rangos de volumen.
                </p>
              </div>

              {/* Tabla de escalas */}
              <MPCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Escalas de Pricing</h3>
                  <MPButton 
                    variant="primary" 
                    onClick={addPricingScale}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Escala
                  </MPButton>
                </div>

                {formData.pricingScales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Escala</TableHead>
                          <TableHead className="w-[150px]">Desde</TableHead>
                          <TableHead className="w-[150px]">Hasta</TableHead>
                          <TableHead className="w-[100px]">Tipo</TableHead>
                          <TableHead className="w-[120px]">Validación</TableHead>
                          <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.pricingScales.map((scale, index) => (
                          <TableRow key={scale.id}>
                            <TableCell className="font-medium">
                              <Input
                                value={scale.name}
                                onChange={(e) => updatePricingScale(scale.id, { name: e.target.value })}
                                placeholder={`Escala ${index + 1}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={scale.minAmount}
                                onChange={(e) => updatePricingScale(scale.id, { minAmount: e.target.value })}
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={scale.maxAmount}
                                onChange={(e) => updatePricingScale(scale.id, { maxAmount: e.target.value })}
                                placeholder="999.999.999"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={scale.type}
                                onValueChange={(value) => updatePricingScale(scale.id, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Default" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={scale.validation === "valid" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {scale.validation === "valid" ? "Válido" : "Validación"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <MPButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deletePricingScale(scale.id)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Eliminar escala"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </MPButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="font-medium mb-2">No hay escalas configuradas</h4>
                    <p className="text-sm">Agrega tu primera escala de pricing para comenzar</p>
                  </div>
                )}

                {/* Indicador de estado de validación para escalas */}
                {formData.pricingScales.length > 0 && (
                  <div className="mt-4">
                    {formData.pricingScales.some(scale => {
                      const hasBasicData = scale.name.trim() !== '' && scale.minAmount !== '' && scale.maxAmount !== ''
                      const hasValidRange = parseFloat(scale.minAmount) < parseFloat(scale.maxAmount)
                      return !hasBasicData || !hasValidRange
                    }) ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">Escalas incompletas</p>
                            <p className="text-xs text-amber-700 mt-1">
                              Asegúrate de que todas las escalas tengan nombre, monto mínimo y máximo válidos.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800">Escalas configuradas correctamente</p>
                            <p className="text-xs text-green-700 mt-1">
                              {formData.pricingScales.length} escala{formData.pricingScales.length !== 1 ? 's' : ''} lista{formData.pricingScales.length !== 1 ? 's' : ''} para usar.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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