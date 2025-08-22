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
  type: string
  name: string
  description: string
  site: string
  team: string[]
  budget: string
  expectedTPV: string
  startDate: string
  endDate: string
  targetAudience: string
  expectedResults: string
  audienceType: string
  audienceRules: any[]
  sellerFile?: File
  selectedGroups?: string[]
  minTPV?: string
  maxTPV?: string
  businessCategory?: string
  region?: string
  applicationConditions?: string
  marketplace?: string
  businessUnit?: string
  paymentMethods?: string[]
  timeLimitDays?: string
  tpnLimit?: string
  tpvLimit?: string
  tpvCurrency?: string
  processingDiscount?: string
  liberationDays?: string
  financingImprovement?: string
  commission: string
  threshold: string
  approved: boolean
  pricingScales: any[]
}

interface ValidationErrors {
  [key: string]: string
}

export function CreateAgreementFlowImprovedFixed({ onBack, onNavigateToInternalAgreements, preselectedType }: CreateAgreementFlowImprovedProps) {
  const [currentStep, setCurrentStep] = useState(3) // Start at step 3 for testing

  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  
  const [formData, setFormData] = useState<FormData>({
    type: "PxE", // Set to PxE for testing
    name: "Test Agreement",
    description: "Test description",
    site: "AR",
    team: ["commercial"],
    budget: "",
    expectedTPV: "",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    targetAudience: "Test audience",
    expectedResults: "",
    audienceType: "no-audience",
    audienceRules: [],
    processingDiscount: "",
    liberationDays: "",
    financingImprovement: "",
    commission: "",
    threshold: "",
    approved: false,
    pricingScales: [],
  })

  // Funciones para manejar las escalas de pricing
  const addPricingScale = () => {
    const newScale = {
      id: `scale-${Date.now()}`,
      name: `Escala ${formData.pricingScales.length + 1}`,
      minAmount: formData.pricingScales.length === 0 ? "0" : "",
      maxAmount: "",
      type: "default",
      tags: [],
      validation: "pending"
    }
    setFormData({
      ...formData,
      pricingScales: [...formData.pricingScales, newScale]
    })
  }

  const updatePricingScale = (scaleId: string, updates: any) => {
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

  const shouldShowError = (fieldName: string) => {
    return hasAttemptedNext || touchedFields.has(fieldName)
  }

  // Render Step 3 content
  const renderStep3Content = () => {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {formData.type === "PxE" ? "Configuración de Escalas" : "Configuración de Precios"}
          </h2>
          <p className="text-gray-600">
            {formData.type === "PxE" 
              ? "Define las escalas de pricing para el acuerdo"
              : "Define las condiciones de precios para el acuerdo"
            }
          </p>
        </div>

        <div className="space-y-6">
          {/* Tabla editable para PxE */}
          {formData.type === "PxE" ? (
            <>
              {/* Descripción para PxE */}
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
                    className="flex items-center gap-2"
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
                          <TableHead className="w-[100px]">Tags</TableHead>
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
                              <Badge variant="secondary" className="text-xs">
                                Tags
                              </Badge>
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
                                  onClick={() => {
                                    // Aquí podrías abrir un modal de edición
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </MPButton>
                                <MPButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deletePricingScale(scale.id)}
                                  className="text-red-600 hover:text-red-700"
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
              </MPCard>
            </>
          ) : (
            <>
              {/* Contenido original para otros tipos */}
              <div className="text-center">
                <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                  Define las condiciones de precios que se aplicarán a los vendedores que cumplan con los criterios de audiencia.
                </p>
              </div>

              {/* Processing */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Processing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="processingDiscount" className="text-sm font-medium">
                      Descuento en processing (%)
                    </Label>
                    <Input
                      id="processingDiscount"
                      type="number"
                      placeholder="0"
                      value={formData.processingDiscount || ""}
                      onChange={(e) => setFormData({ ...formData, processingDiscount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="liberationDays" className="text-sm font-medium">
                      Días de liberación
                    </Label>
                    <Input
                      id="liberationDays"
                      type="number"
                      placeholder="0"
                      value={formData.liberationDays || ""}
                      onChange={(e) => setFormData({ ...formData, liberationDays: e.target.value })}
                    />
                  </div>
                </div>
              </MPCard>

              {/* Financing */}
              <MPCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Financing</h3>
                <div>
                  <Label htmlFor="financingImprovement" className="text-sm font-medium">
                    Mejora en financing (%)
                  </Label>
                  <Input
                    id="financingImprovement"
                    type="number"
                    placeholder="0"
                    value={formData.financingImprovement || ""}
                    onChange={(e) => setFormData({ ...formData, financingImprovement: e.target.value })}
                  />
                </div>
              </MPCard>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Crear Acuerdo Interno</h1>
            <span className="text-sm text-gray-600">Paso 3 de 6</span>
          </div>
          <Progress value={(3 / 6) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        {renderStep3Content()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <MPButton
            variant="secondary"
            onClick={onBack}
            className="px-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </MPButton>
          
          <MPButton
            variant="primary"
            className="px-6 font-medium"
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </MPButton>
        </div>
      </div>
    </div>
  )
} 