"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Users, DollarSign, Calculator, AlertCircle, CheckCircle, Settings } from "lucide-react"


interface CreateAgreementFlowProps {
  onBack: () => void
}

export function CreateAgreementFlow({ onBack }: CreateAgreementFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    audienceType: "",
    audienceRules: [],
    commission: "",
    threshold: "",
    startDate: "",
    endDate: "",
    approved: false,
    pricingScales: [] as any[],
  })

  const steps = [
    { number: 1, title: "Tipo de Acuerdo", icon: Check },
    { number: 2, title: "Audiencia", icon: Users },
    { number: 3, title: "Pricing", icon: DollarSign },
    { number: 4, title: "Simulación", icon: Calculator },
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

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePricingAssistantComplete = (scales: any[]) => {
    setFormData({ ...formData, pricingScales: scales })
    setShowPricingAssistant(false)
    // Avanzar al siguiente paso después de completar el asistente
    setCurrentStep(4)
  }



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Selecciona el tipo de acuerdo</h2>
              <p className="text-gray-600 mb-6">Elige el modelo de pricing que mejor se adapte a tus necesidades</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agreementTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.type === type.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      {formData.type === type.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del acuerdo</Label>
                <Input
                  id="name"
                  placeholder="Ej: Campaña Bienvenida Q4 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el objetivo y alcance del acuerdo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Define la audiencia</h2>
              <p className="text-gray-600 mb-6">Especifica quién será elegible para este acuerdo</p>
            </div>

            <RadioGroup
              value={formData.audienceType}
              onValueChange={(value) => setFormData({ ...formData, audienceType: value })}
            >
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="static" id="static" />
                    <Label htmlFor="static" className="font-medium">
                      Lista estática
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Subir archivo CSV con IDs de merchants específicos</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dynamic" id="dynamic" />
                    <Label htmlFor="dynamic" className="font-medium">
                      Reglas dinámicas
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">Definir criterios que se evalúan automáticamente</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ai-generated" id="ai-generated" />
                    <Label htmlFor="ai-generated" className="font-medium">
                      Generación con IA
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">
                    Describe tu audiencia en lenguaje natural y la IA generará las reglas
                  </p>
                </Card>
              </div>
            </RadioGroup>

            {formData.audienceType === "dynamic" && (
              <Card className="p-4">
                <h3 className="font-medium mb-4">Criterios de segmentación</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>TPV mensual mínimo</Label>
                      <Input placeholder="$10,000" />
                    </div>
                    <div>
                      <Label>Antigüedad mínima</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="90">90 días</SelectItem>
                          <SelectItem value="180">6 meses</SelectItem>
                          <SelectItem value="365">1 año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Categorías incluidas</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Retail", "Servicios", "Alimentación", "Tecnología"].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox id={category} />
                          <Label htmlFor={category} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {formData.audienceType === "ai-generated" && (
              <div className="p-4">
                <h3 className="font-medium mb-4">Generación de audiencia con IA</h3>
                <p className="text-sm text-gray-600 mb-4">Describe la audiencia objetivo en lenguaje natural:</p>
                <Textarea placeholder="Ej: Merchants con alto volumen de ventas en el último trimestre." />
                <Button className="mt-4">Generar reglas</Button>
                {formData.audienceRules && (
                  <div>
                    <h4 className="font-medium mt-4">Reglas generadas:</h4>
                    <pre>{JSON.stringify(formData.audienceRules, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Estimación de audiencia</span>
              </div>
              <p className="text-blue-800">~2,450 merchants cumplirían con estos criterios</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Parámetros de pricing</h2>
              <p className="text-gray-600 mb-6">Define las comisiones y condiciones del acuerdo</p>
            </div>

            {/* Asistente de Precios Escalonados para PxE */}
            {formData.type === "PxE" && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Asistente de Precios Escalonados</h3>
                    <p className="text-blue-700 text-sm">Configura hasta 10 escalas de precios de forma guiada</p>
                  </div>
                </div>
                
                {formData.pricingScales.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        ✅ {formData.pricingScales.length} escalas configuradas
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // El asistente de precios ha sido eliminado
                          // Crear escalas por defecto
                          handlePricingAssistantComplete([
                            { min: 0, max: 1000, rate: 3.5 },
                            { min: 1000, max: 5000, rate: 3.0 },
                            { min: 5000, max: Infinity, rate: 2.5 }
                          ])
                        }}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Editar Escalas
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {formData.pricingScales.slice(0, 3).map((scale: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded text-sm">
                          <span className="font-medium">{scale.name}</span>
                          <span className="text-gray-600">
                            {scale.minUnits} - {scale.maxUnits || "∞"} → {scale.price} {scale.currency}
                          </span>
                        </div>
                      ))}
                      {formData.pricingScales.length > 3 && (
                        <div className="text-center text-sm text-blue-600">
                          +{formData.pricingScales.length - 3} escalas más
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-blue-700 mb-4">
                      Usa el asistente para configurar tu esquema de precios escalonados de forma rápida y sencilla.
                    </p>
                    <Button 
                      onClick={() => {
                        // El asistente de precios ha sido eliminado
                        // Crear escalas por defecto
                        handlePricingAssistantComplete([
                          { min: 0, max: 1000, rate: 3.5 },
                          { min: 1000, max: 5000, rate: 3.0 },
                          { min: 5000, max: Infinity, rate: 2.5 }
                        ])
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Abrir Asistente
                    </Button>
                  </div>
                )}
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Comisiones</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Comisión base (%)</Label>
                    <Input
                      placeholder="2.5"
                      value={formData.commission}
                      onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Umbral para descuento</Label>
                    <Input
                      placeholder="$50,000"
                      value={formData.threshold}
                      onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Comisión con descuento (%)</Label>
                    <Input placeholder="2.0" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Vigencia</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Fecha de inicio</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Fecha de fin</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-renew" />
                    <Label htmlFor="auto-renew" className="text-sm">
                      Renovación automática
                    </Label>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Validaciones</span>
              </div>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• La comisión debe estar entre 1.0% y 5.0%</li>
                <li>• El período mínimo es de 30 días</li>
                <li>• Se requiere aprobación para comisiones menores a 1.5%</li>
              </ul>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Simulación de rentabilidad</h2>
              <p className="text-gray-600 mb-6">Revisa el impacto proyectado antes de crear el acuerdo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+$125K</div>
                  <div className="text-sm text-gray-600">Ingresos adicionales estimados</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">18.5%</div>
                  <div className="text-sm text-gray-600">Margen de rentabilidad</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2,450</div>
                  <div className="text-sm text-gray-600">Merchants impactados</div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-medium mb-4">Resumen del acuerdo</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <Badge>{formData.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span>{formData.name || "Sin nombre"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comisión:</span>
                  <span>{formData.commission || "0"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vigencia:</span>
                  <span>
                    {formData.startDate} - {formData.endDate}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium mb-2 text-blue-900">Proceso de aprobación</h3>
              <p className="text-sm text-blue-800 mb-4">
                Este acuerdo requiere aprobación del equipo de Revenue debido a la comisión especial.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Validaciones técnicas completadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Pendiente: Aprobación de Revenue Manager</span>
                </div>
              </div>
            </Card>

            <div>
              <Label htmlFor="comments">Comentarios para aprobación</Label>
              <Textarea
                id="comments"
                placeholder="Justifica la necesidad de este acuerdo especial..."
                className="mt-1"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Crear Nuevo Acuerdo</h1>
          <p className="text-gray-600">Paso {currentStep} de 4</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={(currentStep / 4) * 100} className="mb-4" />
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className="text-xs mt-1 text-center">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <Card className="mb-6">
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep < 4 ? (
          <Button onClick={nextStep} disabled={!formData.type && currentStep === 1}>
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Enviar para Aprobación
          </Button>
        )}
      </div>
    </div>
  )
}
