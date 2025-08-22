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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Info,
  Star,
  Globe,
  Building2,
  CreditCard,
  BarChart3
} from "lucide-react"


interface CreateAgreementFlowImprovedProps {
  onBack: () => void
  onNavigateToInternalAgreements?: () => void
  preselectedType?: string
}

// Interfaces para configuración por business unit
interface PaymentMethodConfig {
  id: string
  name: string
  processing: string
  financing: string
  installments?: InstallmentConfig[]
}

interface InstallmentConfig {
  range: string // e.g., "1-3", "4-6", "7-12"
  processing: string
  financing: string
}

interface TPVScale {
  id: string
  minTPV: string
  maxTPV: string
  paymentMethods: PaymentMethodConfig[]
}

interface BusinessUnitConfig {
  id: string
  name: string
  enabled: boolean
  scales: TPVScale[]
}

interface BusinessUnitScales {
  [key: string]: BusinessUnitConfig
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
  
  // Audiencia dinámica
  tpvTope?: string
  plazo?: string
  tpnTope?: string
  
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
  pricingScales: any[]
  businessUnitScales: BusinessUnitScales
  defaultScale: string | null // ID de la escala por defecto
  
  // Recálculo (paso 3 - PxE)
  recalculationPeriod: string
  recalculationUnit: string
  recalculationOptions: any[]
}

export function CreateAgreementFlowImproved({ 
  onBack, 
  onNavigateToInternalAgreements, 
  preselectedType 
}: CreateAgreementFlowImprovedProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    type: preselectedType || "",
    name: "",
    description: "",
    site: "",
    team: [],
    businessUnit: [],
    budget: "",
    expectedTPV: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    expectedResults: "",
    audienceType: "",
    audienceRules: [],
    selectedGroups: [],
    tpvTope: "",
    plazo: "",
    tpnTope: "",
    commission: "",
    threshold: "",
    approved: false,
    pricingScales: [],
    businessUnitScales: {},
    defaultScale: null,
    recalculationPeriod: "",
    recalculationUnit: "months",
    recalculationOptions: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showRatesPopup, setShowRatesPopup] = useState(false)
  const [selectedScaleId, setSelectedScaleId] = useState<string | null>(null)
  
  // Estados para unidades de negocio y escalas
  const [activeBusinessUnits, setActiveBusinessUnits] = useState<string[]>([])
  const [currentBusinessUnitTab, setCurrentBusinessUnitTab] = useState<string>("")

  // Configuraciones
  const countries = [
    { id: "AR", label: "MLA - Argentina" },
    { id: "BR", label: "MLB - Brasil" },
    { id: "MX", label: "MLM - México" },
    { id: "CO", label: "MCO - Colombia" },
    { id: "CL", label: "MLC - Chile" }
  ]

  const teams = [
    { id: "fuerza-venta-adquisicion", label: "Fuerza de venta adquisición" },
    { id: "cx-one", label: "Cx One" },
    { id: "fast", label: "Fast" },
    { id: "televenta", label: "Televenta" },
    { id: "admin-pricing-models", label: "Admin Pricing Models" }
  ]

  const businessUnits = [
    { id: "online-payments", label: "Online Payments" },
    { id: "point", label: "Point" },
    { id: "qr", label: "QR" }
  ]

  const predefinedGroups = [
    {
      id: "grupo-1",
      name: "Sellers Premium",
      description: "Sellers con alto volumen de transacciones",
      sellerCount: 1250,
      criteria: "TPV > $50,000 mensual",
      lastUpdate: "2024-01-15"
    },
    {
      id: "grupo-2", 
      name: "Nuevos Sellers",
      description: "Sellers registrados en los últimos 6 meses",
      sellerCount: 890,
      criteria: "Fecha registro < 6 meses",
      lastUpdate: "2024-01-10"
    },
    {
      id: "grupo-3",
      name: "E-commerce",
      description: "Sellers especializados en comercio electrónico",
      sellerCount: 2100,
      criteria: "Categoría = E-commerce",
      lastUpdate: "2024-01-12"
    }
  ]

  // Validaciones
  useEffect(() => {
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 1) {
      if (touched.name && !formData.name.trim()) {
        newErrors.name = "El nombre es requerido"
      }
      if (touched.description && !formData.description.trim()) {
        newErrors.description = "La descripción es requerida"
      }
      if (touched.site && !formData.site) {
        newErrors.site = "El sitio de aplicación es requerido"
      }
      if (!formData.team || formData.team.length === 0) {
        newErrors.team = "Debe seleccionar al menos un equipo/iniciativa"
      }
      if (touched.businessUnit && formData.businessUnit.length === 0) {
        newErrors.businessUnit = "Debe seleccionar al menos una unidad de negocio"
      }
      
      // Validaciones específicas para tipos que no sean PxE
      if (formData.type !== "PxE") {
        if (touched.budget && !formData.budget.trim()) {
          newErrors.budget = "El presupuesto de campaña es requerido"
        }
        if (touched.expectedTPV && !formData.expectedTPV.trim()) {
          newErrors.expectedTPV = "El TPV esperado es requerido"
        }
        if (touched.expectedResults && !formData.expectedResults.trim()) {
          newErrors.expectedResults = "Los resultados esperados son requeridos"
        }
      }
      
      if (touched.startDate && !formData.startDate) {
        newErrors.startDate = "La fecha de inicio es requerida"
      }
    }

    if (currentStep === 2) {
      if (!formData.audienceType) {
        newErrors.audienceType = "Debe seleccionar un tipo de audiencia"
      }
      
      // Validaciones específicas por tipo de audiencia
      if (formData.audienceType === "defined-sellers") {
        if (!formData.sellerFile) {
          newErrors.sellerFile = "Debe cargar un archivo de sellers"
        }
      }
      
      if (formData.audienceType === "defined-group") {
        if (!formData.selectedGroups || formData.selectedGroups.length === 0) {
          newErrors.selectedGroups = "Debe seleccionar al menos un grupo"
        }
      }
      

    }

    if (currentStep === 4) {
      // Para tipos que no sean PxE, validar comisión y umbral
      if (formData.type !== "PxE") {
        if (!formData.commission) {
          newErrors.commission = "Comisión es requerida"
        }
        if (!formData.threshold) {
          newErrors.threshold = "Umbral es requerido"
        }
      }
    }

    setErrors(newErrors)
  }, [formData, touched, currentStep])

  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      const requiredFields = ['name', 'description', 'site', 'startDate']
      const requiredArrays = ['team', 'businessUnit']
      
      // Campos adicionales para tipos que no sean PxE
      if (formData.type !== "PxE") {
        requiredFields.push('budget', 'expectedTPV', 'expectedResults')
      }
      
      const fieldsValid = requiredFields.every(field => 
        formData[field as keyof FormData] && 
        String(formData[field as keyof FormData]).trim() !== ""
      )
      
      const arraysValid = requiredArrays.every(field => {
        const value = formData[field as keyof FormData] as string[]
        return Array.isArray(value) && value.length > 0
      })
      
      return fieldsValid && arraysValid
    }

    if (step === 2) {
      if (!formData.audienceType) return false
      
      // "Sin audiencia inicial" no requiere campos adicionales
      if (formData.audienceType === "initial") {
        return true
      }
      
      if (formData.audienceType === "defined-sellers") {
        return !!formData.sellerFile
      }
      
      if (formData.audienceType === "defined-group") {
        return !!(formData.selectedGroups && formData.selectedGroups.length > 0)
      }
      

      
      return true
    }

    if (step === 3) {
      // Para PxE, validar que todas las escalas tengan pricing configurado
      if (formData.type === "PxE") {
        return validatePricingConfiguration()
      }
      return true
    }

    if (step === 4) {
      // Para PxE, permitir continuar sin validar precios
      if (formData.type === "PxE") {
        return true
      }
      return !!(formData.commission && formData.threshold)
    }

    return true
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof FormData] as string[] || []
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value)
      return { ...prev, [field]: newArray }
    })
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (onNavigateToInternalAgreements) {
      onNavigateToInternalAgreements()
      }
    } catch (error) {
      console.error('Error submitting agreement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Funciones para escalas de pricing (PxE)
  const addNewPricingScale = () => {
    setFormData(prev => ({
      ...prev,
      pricingScales: [
        ...prev.pricingScales,
        { 
          id: Date.now().toString(), 
          minTPV: "", 
          maxTPV: "", 
          discount: "",
          description: "",
          isEditing: true,
          hasPricingConfigured: false // Trackear si tiene pricing configurado
        }
      ]
    }))
  }

  const addPricingScale = () => {
    setFormData(prev => ({
      ...prev,
      pricingScales: [
        ...prev.pricingScales,
        { 
          id: Date.now(), 
          minTPV: "", 
          maxTPV: "", 
          discount: "",
          description: "",
          hasPricingConfigured: false // Trackear si tiene pricing configurado
        }
      ]
    }))
  }

  const updatePricingScale = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricingScales: prev.pricingScales.map(scale => 
        scale.id === id ? { ...scale, [field]: value } : scale
      )
    }))
  }

  const deletePricingScale = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricingScales: prev.pricingScales.filter(scale => scale.id !== id),
      // Si se elimina la escala default, resetear
      defaultScale: prev.defaultScale === id ? null : prev.defaultScale
    }))
  }

  const setDefaultScale = (id: string) => {
    setFormData(prev => ({
      ...prev,
      defaultScale: prev.defaultScale === id ? null : id // Toggle: si ya es default, lo quita
    }))
  }

  const toggleScaleEdit = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricingScales: prev.pricingScales.map(scale => 
        scale.id === id ? { ...scale, isEditing: !scale.isEditing } : scale
      )
    }))
  }

  const cancelScaleEdit = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricingScales: prev.pricingScales.map(scale => 
        scale.id === id ? { ...scale, isEditing: false } : scale
      )
    }))
  }

  const openRatesPopup = (scaleId: string) => {
    setSelectedScaleId(scaleId)
    setShowRatesPopup(true)
  }

  const closeRatesPopup = () => {
    setShowRatesPopup(false)
    setSelectedScaleId(null)
  }

  const saveRatesConfiguration = () => {
    // Marcar la escala como configurada
    if (selectedScaleId) {
      setFormData(prev => ({
        ...prev,
        pricingScales: prev.pricingScales.map(scale => 
          scale.id === selectedScaleId 
            ? { ...scale, hasPricingConfigured: true }
            : scale
        )
      }))
    }
    
    // Cerrar el popup
    setShowRatesPopup(false)
    setSelectedScaleId(null)
  }

  // Validación para verificar que todas las escalas tengan pricing configurado
  const validatePricingConfiguration = () => {
    if (formData.type === "PxE" && formData.pricingScales.length > 0) {
      const unconfiguredScales = formData.pricingScales.filter(scale => !scale.hasPricingConfigured)
      return unconfiguredScales.length === 0
    }
    return true
  }

  // Obtener escalas sin configurar para mostrar en el mensaje
  const getUnconfiguredScales = () => {
    if (formData.type === "PxE") {
      return formData.pricingScales
        .map((scale, index) => ({ ...scale, index: index + 1 }))
        .filter(scale => !scale.hasPricingConfigured)
    }
    return []
  }

  // Funciones para configuración por business unit
  const businessUnitsForScales = [
    { id: "point", name: "Point" },
    { id: "qr", name: "QR" },
    { id: "online-payments", name: "Online Payments" }
  ]

  // Funciones para manejar unidades de negocio
  const addBusinessUnit = (businessUnitId: string) => {
    if (!activeBusinessUnits.includes(businessUnitId)) {
      const newActiveUnits = [...activeBusinessUnits, businessUnitId]
      setActiveBusinessUnits(newActiveUnits)
      
      // Si es la primera unidad, establecerla como activa
      if (currentBusinessUnitTab === "") {
        setCurrentBusinessUnitTab(businessUnitId)
      }
      
      // Inicializar escalas para esta unidad de negocio si no existen
      if (!formData.businessUnitScales[businessUnitId]) {
        setFormData(prev => ({
          ...prev,
          businessUnitScales: {
            ...prev.businessUnitScales,
            [businessUnitId]: {
              id: businessUnitId,
              name: businessUnitsForScales.find(bu => bu.id === businessUnitId)?.name || businessUnitId,
              enabled: true,
              scales: [] as TPVScale[]
            } as BusinessUnitConfig
          }
        }))
      }
    }
  }

  const removeBusinessUnit = (businessUnitId: string) => {
    const newActiveUnits = activeBusinessUnits.filter(id => id !== businessUnitId)
    setActiveBusinessUnits(newActiveUnits)
    
    // Si era la pestaña activa, cambiar a otra o vacío
    if (currentBusinessUnitTab === businessUnitId) {
      setCurrentBusinessUnitTab(newActiveUnits[0] || "")
    }
    
    // Remover las escalas de esta unidad
    setFormData(prev => {
      const { [businessUnitId]: removed, ...remainingUnits } = prev.businessUnitScales
      return {
        ...prev,
        businessUnitScales: remainingUnits
      }
    })
  }

  const paymentMethods = [
    { id: "credit-card", name: "Tarjeta de Crédito" },
    { id: "debit-card", name: "Tarjeta de Débito" },
    { id: "cash", name: "Efectivo" },
    { id: "bank-transfer", name: "Transferencia Bancaria" }
  ]

  const installmentRanges = [
    { id: "1-3", name: "1-3 cuotas" },
    { id: "4-6", name: "4-6 cuotas" },
    { id: "7-12", name: "7-12 cuotas" },
    { id: "13-18", name: "13-18 cuotas" },
    { id: "19-24", name: "19-24 cuotas" }
  ]

  const toggleBusinessUnit = (unitId: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]?.enabled) {
        // Deshabilitar business unit
        newBusinessUnitScales[unitId] = {
          ...newBusinessUnitScales[unitId],
          enabled: false
        }
    } else {
        // Habilitar business unit con configuración por defecto
        newBusinessUnitScales[unitId] = {
          id: unitId,
          name: businessUnitsForScales.find(bu => bu.id === unitId)?.name || unitId,
          enabled: true,
          scales: []
        }
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const addTPVScale = (unitId: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      const newScale: TPVScale = {
        id: Date.now().toString(),
        minTPV: "",
        maxTPV: "",
        paymentMethods: []
      }
      
      if (newBusinessUnitScales[unitId]) {
        newBusinessUnitScales[unitId].scales.push(newScale)
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const updateTPVScale = (unitId: string, scaleId: string, field: string, value: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        newBusinessUnitScales[unitId].scales = newBusinessUnitScales[unitId].scales.map(scale =>
          scale.id === scaleId ? { ...scale, [field]: value } : scale
        )
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const deleteTPVScale = (unitId: string, scaleId: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        newBusinessUnitScales[unitId].scales = newBusinessUnitScales[unitId].scales.filter(
          scale => scale.id !== scaleId
        )
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const addPaymentMethod = (unitId: string, scaleId: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        const scaleIndex = newBusinessUnitScales[unitId].scales.findIndex(s => s.id === scaleId)
        if (scaleIndex !== -1) {
          const newPaymentMethod: PaymentMethodConfig = {
            id: Date.now().toString(),
            name: "",
            processing: "",
            financing: "",
            installments: []
          }
          newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods.push(newPaymentMethod)
        }
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const updatePaymentMethod = (unitId: string, scaleId: string, pmId: string, field: string, value: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        const scaleIndex = newBusinessUnitScales[unitId].scales.findIndex(s => s.id === scaleId)
        if (scaleIndex !== -1) {
          newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods = 
            newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods.map(pm =>
              pm.id === pmId ? { ...pm, [field]: value } : pm
            )
        }
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const deletePaymentMethod = (unitId: string, scaleId: string, pmId: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        const scaleIndex = newBusinessUnitScales[unitId].scales.findIndex(s => s.id === scaleId)
        if (scaleIndex !== -1) {
          newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods = 
            newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods.filter(pm => pm.id !== pmId)
        }
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const addInstallment = (unitId: string, scaleId: string, pmId: string) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        const scaleIndex = newBusinessUnitScales[unitId].scales.findIndex(s => s.id === scaleId)
        if (scaleIndex !== -1) {
          const pmIndex = newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods.findIndex(pm => pm.id === pmId)
          if (pmIndex !== -1) {
            const newInstallment: InstallmentConfig = {
              range: "",
              processing: "",
              financing: ""
            }
            if (!newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods[pmIndex].installments) {
              newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods[pmIndex].installments = []
            }
            newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods[pmIndex].installments!.push(newInstallment)
          }
        }
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const updateInstallments = (unitId: string, scaleId: string, pmId: string, newInstallments: InstallmentConfig[]) => {
    setFormData(prev => {
      const newBusinessUnitScales = { ...prev.businessUnitScales }
      
      if (newBusinessUnitScales[unitId]) {
        const scaleIndex = newBusinessUnitScales[unitId].scales.findIndex(s => s.id === scaleId)
        if (scaleIndex !== -1) {
          const pmIndex = newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods.findIndex(pm => pm.id === pmId)
          if (pmIndex !== -1) {
            newBusinessUnitScales[unitId].scales[scaleIndex].paymentMethods[pmIndex].installments = newInstallments
          }
        }
      }
      
      return {
        ...prev,
        businessUnitScales: newBusinessUnitScales
      }
    })
  }

  const addRecalculationOption = () => {
    if (!formData.recalculationPeriod.trim()) return
    
    const newOption = {
      id: Date.now(),
      period: formData.recalculationPeriod,
      unit: formData.recalculationUnit,
      nextRecalculation: new Date(Date.now() + (parseInt(formData.recalculationPeriod) * (formData.recalculationUnit === 'months' ? 30 : 1) * 24 * 60 * 60 * 1000)).toLocaleDateString()
    }
    
    setFormData(prev => ({
      ...prev,
      recalculationOptions: [...prev.recalculationOptions, newOption],
      recalculationPeriod: ""
    }))
  }

  const deleteRecalculationOption = (id: number) => {
    setFormData(prev => ({
      ...prev,
      recalculationOptions: prev.recalculationOptions.filter(option => option.id !== id)
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar que sea CSV
      if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
        alert('Por favor selecciona un archivo CSV válido')
        return
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 10MB permitido')
        return
      }
      
      setFormData(prev => ({ ...prev, sellerFile: file }))
      setTouched(prev => ({ ...prev, sellerFile: true }))
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Validar que sea CSV
      if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
        alert('Por favor arrastra un archivo CSV válido')
        return
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 10MB permitido')
        return
      }
      
      setFormData(prev => ({ ...prev, sellerFile: file }))
      setTouched(prev => ({ ...prev, sellerFile: true }))
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Header mejorado con Andes UI */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
            </div>
                  <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configuración Básica</h2>
                  <p className="text-sm text-gray-600">Define los parámetros fundamentales de tu acuerdo</p>
                </div>
              </div>
              
              {formData.type === "PxE" && (
                <Alert className="bg-green-50 border-green-200">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Pricing por Escalas seleccionado:</strong> Este tipo de acuerdo permite configurar precios basados en volúmenes de negocio con escalas personalizadas.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información básica */}
              <MPCard className="border-2 hover:border-blue-200 transition-colors">
                <MPCardHeader className="bg-gray-50 border-b">
                  <MPCardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Información General
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Nombre del Acuerdo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ej: Acuerdo Sellers Premium Q1 2024"
                      className={`transition-all ${errors.name ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Descripción *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe el objetivo y alcance del acuerdo..."
                      rows={4}
                      className={`transition-all ${errors.description ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site" className="text-sm font-semibold text-gray-700">
                      Sitio de aplicación *
                    </Label>
                    <Select value={formData.site} onValueChange={(value) => handleInputChange("site", value)}>
                      <SelectTrigger className={`transition-all ${errors.site ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}>
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                            {country.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.site && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.site}
                      </p>
                    )}
                  </div>
                </MPCardContent>
              </MPCard>

              {/* Configuración de equipos */}
              <MPCard className="border-2 hover:border-blue-200 transition-colors">
                <MPCardHeader className="bg-gray-50 border-b">
                  <MPCardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    Equipos/Iniciativas y Unidades
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Equipos/Iniciativas *</Label>
                    <div className="space-y-3">
                        {teams.map((team) => (
                        <div key={team.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                          <Checkbox
                            id={`team-${team.id}`}
                            checked={formData.team.includes(team.id)}
                            onCheckedChange={(checked) => handleArrayChange("team", team.id, !!checked)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label htmlFor={`team-${team.id}`} className="text-sm font-medium cursor-pointer flex-1">
                            {team.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.team && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.team}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Unidad de negocio que aplicará *</Label>
                    <div className="space-y-3">
                      {businessUnits.map((unit) => (
                        <div key={unit.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                          <Checkbox
                            id={`unit-${unit.id}`}
                            checked={formData.businessUnit.includes(unit.id)}
                            onCheckedChange={(checked) => handleArrayChange("businessUnit", unit.id, !!checked)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label htmlFor={`unit-${unit.id}`} className="text-sm font-medium cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-500" />
                              {unit.label}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.businessUnit && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessUnit}
                      </p>
                    )}
                  </div>
                </MPCardContent>
              </MPCard>
            </div>

            {/* Campos condicionales para tipos que no sean PxE */}
            {formData.type !== "PxE" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MPCard className="border-2 hover:border-blue-200 transition-colors">
                  <MPCardContent className="p-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      Presupuesto de campaña *
                    </Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                        placeholder="Ej: $50,000 USD"
                        className={`transition-all ${errors.budget ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                      {errors.budget && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.budget}
                        </p>
                    )}
                  </div>
                  </MPCardContent>
                </MPCard>

                <MPCard className="border-2 hover:border-blue-200 transition-colors">
                  <MPCardContent className="p-6">
                    <div className="space-y-2">
                      <Label htmlFor="expectedTPV" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      TPV Esperado *
                    </Label>
                    <Input
                      id="expectedTPV"
                      value={formData.expectedTPV}
                        onChange={(e) => handleInputChange("expectedTPV", e.target.value)}
                        placeholder="Ej: $1,000,000"
                        className={`transition-all ${errors.expectedTPV ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                      {errors.expectedTPV && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.expectedTPV}
                        </p>
                    )}
                  </div>
                  </MPCardContent>
                </MPCard>

                <MPCard className="border-2 hover:border-blue-200 transition-colors">
                  <MPCardContent className="p-6">
                    <div className="space-y-2">
                      <Label htmlFor="expectedResults" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        Resultados esperados *
                      </Label>
                      <Input
                        id="expectedResults"
                        value={formData.expectedResults}
                        onChange={(e) => handleInputChange("expectedResults", e.target.value)}
                        placeholder="Ej: 15% incremento TPV"
                        className={`transition-all ${errors.expectedResults ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                      {errors.expectedResults && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.expectedResults}
                        </p>
                      )}
                    </div>
                  </MPCardContent>
                </MPCard>
              </div>
            )}

            {/* Fechas */}
            <MPCard className="border-2 hover:border-blue-200 transition-colors">
              <MPCardHeader className="bg-gray-50 border-b">
                <MPCardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Período de Vigencia
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">
                        Fecha de inicio *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className={`transition-all ${errors.startDate ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.startDate}
                      </p>
                      )}
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                      Fecha de fin <span className="text-gray-500">(opcional)</span>
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className="focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
              </MPCardContent>
              </MPCard>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            {/* Header mejorado */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
              </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configuración de Audiencias</h2>
                  <p className="text-sm text-gray-600">Define quién será beneficiario de este acuerdo</p>
                </div>
              </div>
            </div>

            <MPCard className="border-2 hover:border-purple-200 transition-colors">
              <MPCardHeader className="bg-gray-50 border-b">
                <MPCardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                  Selección de Audiencia
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="p-6">
            <RadioGroup
              value={formData.audienceType}
                  onValueChange={(value) => handleInputChange("audienceType", value)}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="none" id="none" className="mt-1" />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="none" className="text-base font-medium cursor-pointer">
                        Sin audiencia inicial
                      </Label>
                      <p className="text-sm text-gray-600">
                        Se completará la audiencia luego de la creación del internal agreement
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="defined-sellers" id="defined-sellers" className="mt-1" />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="defined-sellers" className="text-base font-medium cursor-pointer">
                      Audiencia definida (lista de sellers)
                    </Label>
                      <p className="text-sm text-gray-600">
                        Carga una lista específica de sellers mediante archivo CSV
                      </p>
                  </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="defined-group" id="defined-group" className="mt-1" />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="defined-group" className="text-base font-medium cursor-pointer">
                      Audiencia definida (grupo)
                    </Label>
                      <p className="text-sm text-gray-600">
                        Selecciona uno o más grupos predefinidos de sellers
                      </p>
                  </div>
                  </div>


                </RadioGroup>
                
                {errors.audienceType && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-4">
                    <AlertCircle className="w-4 h-4" />
                    {errors.audienceType}
                  </p>
                )}
              </MPCardContent>
                </MPCard>

            {/* Configuración específica por tipo de audiencia */}
            {formData.audienceType === "defined-sellers" && (
              <MPCard className="border-2 border-blue-200">
                <MPCardHeader className="bg-blue-50 border-b border-blue-200">
                  <MPCardTitle className="flex items-center gap-2 text-lg text-blue-800">
                    <Upload className="w-5 h-5" />
                    Carga de Lista de Sellers
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent className="p-6">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      formData.sellerFile 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {formData.sellerFile ? (
                      <div className="space-y-3">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-green-800">Archivo cargado exitosamente</p>
                          <p className="text-sm text-green-600 font-medium">{formData.sellerFile.name}</p>
                          <p className="text-xs text-green-600">
                            Tamaño: {(formData.sellerFile.size / 1024).toFixed(1)} KB
                          </p>
                          <p className="text-xs text-green-600">
                            Última modificación: {new Date(formData.sellerFile.lastModified).toLocaleDateString()}
                          </p>
                  </div>
                        <MPButton
                          variant="secondary"
                          onClick={() => setFormData(prev => ({ ...prev, sellerFile: undefined }))}
                          className="text-sm"
                        >
                          Cambiar archivo
                        </MPButton>
                  </div>
                    ) : (
                <div className="space-y-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Arrastra tu archivo CSV aquí
                          </p>
                          <p className="text-sm text-gray-500">
                            o haz clic para seleccionar
                          </p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                          onChange={handleFileUpload}
                      className="hidden"
                          id="file-upload"
                        />
                        <MPButton
                          variant="secondary"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Seleccionar archivo
                      </MPButton>
                  </div>
                    )}
                </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Formato esperado del CSV
                    </h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div>
                        <p><strong>Columnas requeridas:</strong></p>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>• <strong>seller_id:</strong> ID único del seller (obligatorio)</li>
                          <li>• <strong>email:</strong> Email del seller (opcional)</li>
                          <li>• <strong>status:</strong> Estado del seller: active, inactive (opcional)</li>
                        </ul>
                    </div>
                      <div>
                        <p><strong>Requisitos técnicos:</strong></p>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>• Tamaño máximo: 10MB</li>
                          <li>• Codificación: UTF-8</li>
                          <li>• Separador: coma (,)</li>
                        </ul>
                </div>
                      <div>
                        <p><strong>Ejemplo:</strong></p>
                        <code className="block bg-white p-3 rounded border text-xs mt-2 font-mono">
                          seller_id,email,status<br/>
                          12345,seller1@example.com,active<br/>
                          67890,seller2@example.com,active<br/>
                          54321,seller3@example.com,inactive
                        </code>
                      </div>
                    </div>
                  </div>

                  {errors.sellerFile && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-4">
                      <AlertCircle className="w-4 h-4" />
                      {errors.sellerFile}
                    </p>
                  )}
                </MPCardContent>
              </MPCard>
            )}

            {formData.audienceType === "defined-group" && (
              <MPCard className="border-2 border-purple-200">
                <MPCardHeader className="bg-purple-50 border-b border-purple-200">
                  <MPCardTitle className="flex items-center gap-2 text-lg text-purple-800">
                    <Users className="w-5 h-5" />
                    Selección de Grupos
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent className="p-6">
                <div className="space-y-4">
                    {predefinedGroups.map((group) => (
                      <div 
                        key={group.id} 
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          formData.selectedGroups?.includes(group.id)
                            ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                        }`}
                        onClick={() => {
                          const isSelected = formData.selectedGroups?.includes(group.id)
                          const newGroups = isSelected
                            ? formData.selectedGroups?.filter(id => id !== group.id) || []
                            : [...(formData.selectedGroups || []), group.id]
                          handleInputChange("selectedGroups", newGroups)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={formData.selectedGroups?.includes(group.id) || false}
                              className="mt-1"
                              disabled
                            />
                            <div className="space-y-2">
                    <div>
                                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                <p className="text-sm text-gray-600">{group.description}</p>
                    </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {group.sellerCount.toLocaleString()} sellers
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {group.criteria}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Actualizado: {new Date(group.lastUpdate).toLocaleDateString()}
                                </span>
                  </div>
                  </div>
                  </div>
                          {formData.selectedGroups?.includes(group.id) && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              Seleccionado
                            </Badge>
                          )}
                  </div>
                    </div>
                  ))}
                </div>

                  {formData.selectedGroups && formData.selectedGroups.length > 0 && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Resumen de Selección
                      </h4>
                      <p className="text-sm text-purple-700">
                        <strong>{formData.selectedGroups.length}</strong> grupo(s) seleccionado(s) - 
                        <strong> {predefinedGroups
                          .filter(g => formData.selectedGroups?.includes(g.id))
                          .reduce((total, g) => total + g.sellerCount, 0)
                          .toLocaleString()}</strong> sellers aproximadamente
                  </p>
                </div>
                  )}

                  {errors.selectedGroups && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-4">
                      <AlertCircle className="w-4 h-4" />
                      {errors.selectedGroups}
                    </p>
                  )}
                </MPCardContent>
              </MPCard>
            )}


          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            {/* Header mejorado */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-600" />
              </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formData.type === "PxE" ? "Configuración de Escalas de Pricing" : "Configuración de Precios"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {formData.type === "PxE" 
                      ? "Define las escalas de precios basadas en volumen de negocio" 
                      : "Establece los parámetros de pricing para el acuerdo"
                    }
                  </p>
                </div>
              </div>
              </div>

            {formData.type === "PxE" ? (
              <div className="space-y-8">
                {/* Nueva experiencia de Escalas de Pricing por Business Unit */}
                <MPCard className="border-2 hover:border-green-200 transition-colors">
                  <MPCardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <MPCardTitle className="flex items-center gap-2 text-lg">
                          <Building2 className="w-5 h-5 text-green-600" />
                          Escalas de Pricing por Business Unit
                        </MPCardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                          Configura las escalas de pricing por unidad de negocio
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Selector de Business Unit */}
                        <Select 
                          onValueChange={addBusinessUnit}
                          value=""
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Agregar Business Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessUnitsForScales
                              .filter(bu => !activeBusinessUnits.includes(bu.id))
                              .map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </MPCardHeader>
                  <MPCardContent className="p-6">
                    {activeBusinessUnits.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-600">No hay Business Units configuradas</p>
                        <p className="text-sm text-gray-500">Selecciona una Business Unit para comenzar</p>
                      </div>
                    ) : (
                      <Tabs value={currentBusinessUnitTab} onValueChange={setCurrentBusinessUnitTab}>
                        <div className="flex items-center justify-between mb-4">
                          <TabsList className="grid grid-cols-auto gap-1">
                            {activeBusinessUnits.map((unitId) => {
                              const unit = businessUnitsForScales.find(bu => bu.id === unitId)
                              return (
                                <TabsTrigger key={unitId} value={unitId} className="relative">
                                  {unit?.name}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeBusinessUnit(unitId)
                                    }}
                                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remover Business Unit"
                                  >
                                    ×
                                  </button>
                                </TabsTrigger>
                              )
                            })}
                          </TabsList>
                        </div>

                        {activeBusinessUnits.map((unitId) => (
                          <TabsContent key={unitId} value={unitId} className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Escalas para {businessUnitsForScales.find(bu => bu.id === unitId)?.name}
                              </h3>
                              <MPButton 
                                variant="primary" 
                                className="flex items-center gap-2"
                                onClick={() => {
                                  // Agregar escala para esta business unit específica
                                  const newScale = {
                                    id: Date.now().toString(),
                                    minTPV: "",
                                    maxTPV: "",
                                    discount: "",
                                    description: "",
                                    isEditing: true,
                                    hasPricingConfigured: false,
                                    businessUnit: unitId
                                  }
                                  
                                  setFormData(prev => ({
                                    ...prev,
                                    businessUnitScales: {
                                      ...prev.businessUnitScales,
                                      [unitId]: {
                                        ...prev.businessUnitScales[unitId],
                                        scales: [...(prev.businessUnitScales[unitId]?.scales || []), newScale]
                                      }
                                    }
                                  }))
                                }}
                              >
                                <Plus className="w-4 h-4" />
                                Agregar Escala
                              </MPButton>
                            </div>

                            {/* Contenido de escalas simplificado */}
                            <div className="text-center py-8 text-gray-500">
                              <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="font-medium text-gray-600">Escalas para {businessUnitsForScales.find(bu => bu.id === unitId)?.name}</p>
                              <p className="text-sm text-gray-500">Funcionalidad en desarrollo</p>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </MPCardContent>
                </MPCard>

                {/* Configuración de Recálculo */}
                <MPCard className="border-2 hover:border-blue-200 transition-colors">
                  <MPCardHeader className="bg-gray-50 border-b">
                    <MPCardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Configuración de Recálculo
                    </MPCardTitle>
                  </MPCardHeader>
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  formData.defaultScale === scale.id 
                                    ? 'bg-green-100 border-2 border-green-500' 
                                    : 'bg-blue-100'
                                }`}>
                                  <span className={`text-sm font-bold ${
                                    formData.defaultScale === scale.id 
                                      ? 'text-green-600' 
                                      : 'text-blue-600'
                                  }`}>
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    Escala {index + 1} - R$ {scale.minTPV || '0'} até R$ {scale.maxTPV || '∞'}
                                  </span>
                                  {formData.defaultScale === scale.id && (
                                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                      DEFAULT
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span 
                                    className={`text-sm cursor-pointer hover:underline ${
                                      scale.hasPricingConfigured 
                                        ? 'text-green-600' 
                                        : 'text-orange-600'
                                    }`}
                                    onClick={() => openRatesPopup(scale.id)}
                                  >
                                    {scale.hasPricingConfigured ? '✓ Tasas Configuradas' : '⚠ Configurar Tasas'}
                                  </span>
                                </div>
                                <button 
                                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                    formData.defaultScale === scale.id
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  onClick={() => setDefaultScale(scale.id)}
                                  title={formData.defaultScale === scale.id ? 'Quitar como default' : 'Marcar como default'}
                                >
                                  {formData.defaultScale === scale.id ? 'Es Default' : 'Set Default'}
                                </button>
                                <button 
                                  className="p-2 hover:bg-gray-100 rounded"
                                  onClick={() => toggleScaleEdit(scale.id)}
                                >
                                  <Edit className="w-4 h-4 text-gray-400" />
                                </button>
                                <button 
                                  className="p-2 hover:bg-gray-100 rounded"
                                  onClick={() => deletePricingScale(scale.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>

                            {/* Formulario de edición */}
                            {scale.isEditing && (
                              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">TPV Mínimo (R$)</Label>
                                    <Input
                                      value={scale.minTPV}
                                      onChange={(e) => updatePricingScale(scale.id, 'minTPV', e.target.value)}
                                      placeholder="0"
                                      className="mt-1"
                                      type="number"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">TPV Máximo (R$)</Label>
                                    <Input
                                      value={scale.maxTPV}
                                      onChange={(e) => updatePricingScale(scale.id, 'maxTPV', e.target.value)}
                                      placeholder="Dejar vacío para ilimitado"
                                      className="mt-1"
                                      type="number"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <MPButton 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => toggleScaleEdit(scale.id)}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Guardar
                                  </MPButton>
                                  <MPButton 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => cancelScaleEdit(scale.id)}
                                  >
                                    Cancelar
                                  </MPButton>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </MPCardContent>
                </MPCard>

                {/* Configuración de Recálculo */}
                <MPCard className="border-2 hover:border-blue-200 transition-colors">
                  <MPCardHeader className="bg-gray-50 border-b">
                    <MPCardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Configuración de Recálculo
                    </MPCardTitle>
                  </MPCardHeader>
                  <MPCardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recalculationPeriod" className="text-sm font-semibold text-gray-700">
                          Período
                    </Label>
                      <Input
                          id="recalculationPeriod"
                          value={formData.recalculationPeriod}
                          onChange={(e) => handleInputChange("recalculationPeriod", e.target.value)}
                          placeholder="Ej: 3"
                        type="number"
                          className="focus:border-blue-500"
                      />
                    </div>

                      <div className="space-y-2">
                        <Label htmlFor="recalculationUnit" className="text-sm font-semibold text-gray-700">
                          Unidad
                    </Label>
                        <Select
                          value={formData.recalculationUnit}
                          onValueChange={(value) => handleInputChange("recalculationUnit", value)}
                        >
                          <SelectTrigger className="focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="months">Meses</SelectItem>
                          </SelectContent>
                        </Select>
                  </div>

                      <div className="flex items-end">
                        <MPButton
                          variant="secondary"
                          onClick={addRecalculationOption}
                          disabled={!formData.recalculationPeriod.trim()}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </MPButton>
                </div>
                </div>

                    {formData.recalculationOptions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Opciones de Recálculo Configuradas
                        </h4>
                <div className="space-y-2">
                          {formData.recalculationOptions.map((option) => (
                            <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                                  <span className="font-medium">
                                    Cada {option.period} {option.unit === 'months' ? 'mes(es)' : option.unit === 'weeks' ? 'semana(s)' : 'día(s)'}
                    </span>
                                  <p className="text-sm text-gray-600">
                                    Próximo recálculo: {option.nextRecalculation}
                    </p>
                  </div>
                </div>
                              <MPButton
                                variant="secondary"
                                size="sm"
                                onClick={() => deleteRecalculationOption(option.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </MPButton>
                  </div>
                          ))}
                </div>
                      </div>
                    )}
                  </MPCardContent>
              </MPCard>
              </div>
            ) : (
              // Configuración de precios para otros tipos
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MPCard className="border-2 hover:border-green-200 transition-colors">
                  <MPCardContent className="p-6">
                    <div className="space-y-2">
                      <Label htmlFor="commission" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Comisión (%)
                    </Label>
                      <Input
                        id="commission"
                        value={formData.commission}
                        onChange={(e) => handleInputChange("commission", e.target.value)}
                        placeholder="Ej: 2.5"
                        type="number"
                        step="0.01"
                        className="focus:border-green-500"
                      />
                    </div>
                  </MPCardContent>
              </MPCard>

                <MPCard className="border-2 hover:border-green-200 transition-colors">
                  <MPCardContent className="p-6">
                <div className="space-y-2">
                      <Label htmlFor="threshold" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        Umbral Mínimo
                      </Label>
                      <Input
                        id="threshold"
                        value={formData.threshold}
                        onChange={(e) => handleInputChange("threshold", e.target.value)}
                        placeholder="Ej: $1,000"
                        className="focus:border-green-500"
                      />
                  </div>
                  </MPCardContent>
              </MPCard>
                  </div>
              )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            {/* Header mejorado */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
                    <div>
                  <h2 className="text-2xl font-bold text-gray-900">Simulación y Métricas</h2>
                  <p className="text-sm text-gray-600">Revisa el resumen y métricas proyectadas del acuerdo</p>
                    </div>
                    </div>
                    </div>

            {/* Resumen del acuerdo */}
            <MPCard className="border-2 hover:border-amber-200 transition-colors">
              <MPCardHeader className="bg-gray-50 border-b">
                <MPCardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Resumen del Acuerdo
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Información Básica
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Tipo:</span> {formData.type}</p>
                      <p className="break-words overflow-wrap-anywhere"><span className="font-medium">Nombre:</span> {formData.name || "Sin especificar"}</p>
                      <p className="break-words overflow-wrap-anywhere"><span className="font-medium">Descripción:</span> {formData.description || "Sin especificar"}</p>
                      <p><span className="font-medium">Sitio:</span> {countries.find(c => c.id === formData.site)?.label || "Sin especificar"}</p>
                    </div>
                    </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      Equipos/Iniciativas y Audiencia
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="break-words overflow-wrap-anywhere">
                        <span className="font-medium">Equipos/Iniciativas:</span> {
                          formData.team.map(t => teams.find(team => team.id === t)?.label).join(", ") || "Sin especificar"
                        }
                      </p>
                      <p className="break-words overflow-wrap-anywhere">
                        <span className="font-medium">Unidades:</span> {
                          formData.businessUnit.map(u => businessUnits.find(unit => unit.id === u)?.label).join(", ") || "Sin especificar"
                        }
                      </p>
                      <p><span className="font-medium">Tipo de audiencia:</span> {
                        formData.audienceType === "none" ? "Sin audiencia inicial" :
                        formData.audienceType === "defined-sellers" ? "Lista de sellers" :
                        formData.audienceType === "defined-group" ? "Grupos predefinidos" :

                        "Sin especificar"
                      }</p>
                      {formData.audienceType === "defined-group" && formData.selectedGroups && formData.selectedGroups.length > 0 && (
                        <p className="break-words overflow-wrap-anywhere">
                          <span className="font-medium">Grupos seleccionados:</span> {
                            formData.selectedGroups.map(groupId => 
                              predefinedGroups.find(g => g.id === groupId)?.name
                            ).join(", ")
                          }
                        </p>
                      )}

                      </div>
                    </div>
                    
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Fechas y Métricas
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Inicio:</span> {formData.startDate || "Sin especificar"}</p>
                      <p><span className="font-medium">Fin:</span> {formData.endDate || "Sin fecha límite"}</p>
                      {formData.type !== "PxE" && (
                        <>
                          <p className="break-words overflow-wrap-anywhere"><span className="font-medium">Presupuesto:</span> {formData.budget || "Sin especificar"}</p>
                          <p className="break-words overflow-wrap-anywhere"><span className="font-medium">TPV Esperado:</span> {formData.expectedTPV || "Sin especificar"}</p>
                          <p className="break-words overflow-wrap-anywhere"><span className="font-medium">Resultados:</span> {formData.expectedResults || "Sin especificar"}</p>
                        </>
                      )}
                      </div>
                    </div>
                  </div>
              </MPCardContent>
              </MPCard>

            {/* Evaluación de Riesgo */}
            <MPCard className="border-2 border-red-200">
              <MPCardHeader className="bg-red-50 border-b border-red-200">
                <MPCardTitle className="flex items-center gap-2 text-lg text-red-800">
                  <Shield className="w-5 h-5" />
                  Evaluación de Riesgo
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Riesgo Financiero</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medio</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                    <p className="text-xs text-gray-600">Basado en presupuesto y TPV proyectado</p>
                    </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Complejidad Operativa</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Baja</Badge>
                  </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600">Configuración estándar sin complejidades</p>
                  </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Impacto en Sistema</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Medio</Badge>
                  </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                    <p className="text-xs text-gray-600">Carga moderada en procesamiento</p>
                  </div>
                  </div>
              </MPCardContent>
              </MPCard>

            {/* Proyección de TPV */}
            <MPCard className="border-2 border-blue-200">
              <MPCardHeader className="bg-blue-50 border-b border-blue-200">
                <MPCardTitle className="flex items-center gap-2 text-lg text-blue-800">
                  <TrendingUp className="w-5 h-5" />
                  Proyección de TPV
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="p-6">
              <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4'].map((mes, index) => (
                      <div key={mes} className="text-center">
                        <div className="bg-blue-100 rounded-lg p-4 mb-2">
                          <div 
                            className="bg-blue-600 rounded"
                            style={{ 
                              height: `${60 + (index * 20)}px`,
                              width: '100%'
                            }}
                          ></div>
                  </div>
                        <p className="text-sm font-medium text-gray-700">{mes}</p>
                        <p className="text-xs text-gray-500">${(150000 + (index * 50000)).toLocaleString()}</p>
                  </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Proyección basada en datos históricos y configuración del acuerdo
                  </p>
                  </div>
              </MPCardContent>
            </MPCard>

            {/* Impacto Financiero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MPCard className="border-2 border-green-200">
                <MPCardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Ahorro Proyectado</h3>
                  <p className="text-2xl font-bold text-green-600">$45,000</p>
                  <p className="text-sm text-gray-500">En los primeros 6 meses</p>
                </MPCardContent>
            </MPCard>

              <MPCard className="border-2 border-blue-200">
                <MPCardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900">ROI Estimado</h3>
                  <p className="text-2xl font-bold text-blue-600">185%</p>
                  <p className="text-sm text-gray-500">Retorno de inversión</p>
                </MPCardContent>
            </MPCard>

              <MPCard className="border-2 border-purple-200">
                <MPCardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Sellers Impactados</h3>
                  <p className="text-2xl font-bold text-purple-600">2,450</p>
                  <p className="text-sm text-gray-500">Aproximadamente</p>
                </MPCardContent>
              </MPCard>
                    </div>

            {/* Análisis de Escenarios */}
            <MPCard className="border-2 border-orange-200">
              <MPCardHeader className="bg-orange-50 border-b border-orange-200">
                <MPCardTitle className="flex items-center gap-2 text-lg text-orange-800">
                  <BarChart3 className="w-5 h-5" />
                  Análisis de Escenarios
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Escenario Pesimista
                    </h4>
                    <div className="space-y-1 text-sm text-red-700">
                      <p>• TPV: -25% del objetivo</p>
                      <p>• Participación: 60% sellers</p>
                      <p>• ROI: 95%</p>
                  </div>
                </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Escenario Base
                    </h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>• TPV: 100% del objetivo</p>
                      <p>• Participación: 80% sellers</p>
                      <p>• ROI: 185%</p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Escenario Optimista
                    </h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>• TPV: +35% del objetivo</p>
                      <p>• Participación: 95% sellers</p>
                      <p>• ROI: 275%</p>
                </div>
              </div>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Alertas y Recomendaciones */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Recomendaciones:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Monitorear métricas de participación semanalmente</li>
                  <li>• Establecer alertas automáticas para desviaciones {'>'}15%</li>
                  <li>• Revisar escalas de pricing mensualmente</li>
                  <li>• Preparar plan de contingencia para escenario pesimista</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header principal */}
        <div className="flex items-center justify-between mb-8">
          <button
              onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              {formData.type === "PxE" ? "Pricing por Escalas" : "Acuerdo Interno"}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">
              Paso {currentStep} de 4
            </Badge>
          </div>
        </div>

        {/* Indicador de progreso mejorado */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Crear Acuerdo Mejorado</h1>
            <p className="text-sm text-gray-600">
              {Math.round((currentStep / 4) * 100)}% completado
            </p>
          </div>
          
          <div className="relative">
            <Progress 
              value={(currentStep / 4) * 100} 
              className="h-3 bg-gray-200"
            />
            <div className="flex justify-between mt-3">
              {[
                { step: 1, title: "Configuración", icon: Settings },
                { step: 2, title: "Audiencias", icon: Users },
                { step: 3, title: "Precios", icon: Calculator },
                { step: 4, title: "Simulación", icon: BarChart3 }
              ].map(({ step, title, icon: Icon }) => (
                <div 
                  key={step}
                  className={`flex flex-col items-center ${
                    step <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    step < currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step === currentStep 
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido del paso */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Botones de navegación mejorados */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            {currentStep > 1 && (
          <MPButton
            variant="secondary"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 font-semibold border-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </MPButton>
            )}
              </div>

          <div className="flex flex-col items-end gap-3">
            {/* Mensaje de advertencia para escalas sin configurar */}
            {currentStep === 3 && formData.type === "PxE" && !validatePricingConfiguration() && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-orange-800">
                      Configuración de Pricing Requerida
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Las siguientes escalas necesitan configuración de pricing:
                    </p>
                    <ul className="text-sm text-orange-700 mt-2 list-disc list-inside">
                      {getUnconfiguredScales().map((scale, index) => (
                        <li key={scale.id}>
                          Escala {scale.index} - R$ {scale.minTPV || '0'} até R$ {scale.maxTPV || '∞'}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-orange-600 mt-2">
                      Haz clic en "⚠ Configurar Tasas" para cada escala.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {currentStep < 4 ? (
                <MPButton
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className={`flex items-center gap-2 px-8 py-3 text-white font-semibold transition-all ${
                    !isStepValid(currentStep) 
                      ? 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400' 
                      : 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 hover:shadow-lg hover:scale-105 shadow-md'
                  }`}
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </MPButton>
            ) : (
              <MPButton
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex items-center gap-2 px-8 py-3 text-white font-semibold transition-all ${
                  isLoading ? 'opacity-75 cursor-wait bg-green-500' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105 shadow-md'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar a aprobación
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </MPButton>
            )}
            </div>
          </div>
        </div>
        
        {/* Popup de Tasas Aplicadas */}
        <Dialog open={showRatesPopup} onOpenChange={closeRatesPopup}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Configurar Tasas Aplicadas
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Medios de pago</h3>
              
              {/* Tabla Compacta Unificada */}
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-medium text-gray-600">Medio de Pago</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Días de liberación</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Processing fee</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Financing fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Pix LATAM */}
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">Pix LATAM</TableCell>
                      <TableCell className="text-sm text-gray-500">No aplica</TableCell>
                      <TableCell>
                        <Input placeholder="Processing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="No aplica" className="h-8 text-sm" disabled />
                      </TableCell>
                    </TableRow>

                    {/* Prepaid */}
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">Prepaid</TableCell>
                      <TableCell className="text-sm text-gray-500">No aplica</TableCell>
                      <TableCell>
                        <Input placeholder="Processing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Financing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                    </TableRow>

                    {/* Tarjeta de débito */}
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">Tarjeta de débito</TableCell>
                      <TableCell className="text-sm text-gray-500">No aplica</TableCell>
                      <TableCell>
                        <Input placeholder="Processing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Financing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                    </TableRow>

                    {/* Tarjeta de crédito */}
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">Tarjeta de crédito</TableCell>
                      <TableCell className="text-sm text-gray-500">No aplica</TableCell>
                      <TableCell>
                        <Input placeholder="Processing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Financing fee %" className="h-8 text-sm" type="number" step="0.01" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter>
              <MPButton variant="secondary" onClick={closeRatesPopup}>
                Cancelar
              </MPButton>
              <MPButton variant="primary" onClick={saveRatesConfiguration}>
                <Check className="w-4 h-4 mr-2" />
                Guardar Configuración
              </MPButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 