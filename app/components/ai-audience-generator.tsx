"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2, CheckCircle, Edit3, Trash2, Plus, Users, DollarSign, Calendar, Tag } from "lucide-react"

interface Rule {
  id: string
  type: "tpv" | "age" | "category" | "location" | "transactions" | "custom"
  operator: "greater_than" | "less_than" | "equals" | "contains" | "between"
  value: string | number
  label: string
  icon: any
}

interface AIAudienceGeneratorProps {
  onRulesGenerated: (rules: Rule[]) => void
  generatedRules: Rule[]
}

export function AIAudienceGenerator({ onRulesGenerated, generatedRules }: AIAudienceGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [rules, setRules] = useState<Rule[]>(generatedRules || [])
  const [editingRule, setEditingRule] = useState<string | null>(null)

  // Simulación de respuesta de IA
  const generateRulesFromPrompt = async (userPrompt: string): Promise<Rule[]> => {
    // Simulamos delay de API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Lógica simple para generar reglas basadas en palabras clave
    const generatedRules: Rule[] = []
    const lowerPrompt = userPrompt.toLowerCase()

    // Detectar TPV
    if (lowerPrompt.includes("tpv") || lowerPrompt.includes("volumen") || lowerPrompt.includes("facturación")) {
      const tpvMatch = userPrompt.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)[k|m]?/i)
      const amount = tpvMatch ? tpvMatch[1].replace(",", "") : "10000"
      generatedRules.push({
        id: "tpv-rule",
        type: "tpv",
        operator: "greater_than",
        value: amount,
        label: `TPV mensual mayor a $${amount}`,
        icon: DollarSign,
      })
    }

    // Detectar antigüedad
    if (lowerPrompt.includes("nuevo") || lowerPrompt.includes("reciente") || lowerPrompt.includes("días")) {
      const daysMatch = userPrompt.match(/(\d+)\s*días?/i)
      const days = daysMatch ? daysMatch[1] : "30"
      generatedRules.push({
        id: "age-rule",
        type: "age",
        operator: "less_than",
        value: days,
        label: `Registrados hace menos de ${days} días`,
        icon: Calendar,
      })
    }

    // Detectar categorías
    const categories = ["retail", "servicios", "alimentación", "tecnología", "salud", "educación"]
    categories.forEach((category) => {
      if (lowerPrompt.includes(category)) {
        generatedRules.push({
          id: `category-${category}`,
          type: "category",
          operator: "equals",
          value: category,
          label: `Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          icon: Tag,
        })
      }
    })

    // Detectar ubicación
    const locations = ["argentina", "brasil", "méxico", "colombia", "chile", "uruguay"]
    locations.forEach((location) => {
      if (lowerPrompt.includes(location)) {
        generatedRules.push({
          id: `location-${location}`,
          type: "location",
          operator: "equals",
          value: location,
          label: `País: ${location.charAt(0).toUpperCase() + location.slice(1)}`,
          icon: Users,
        })
      }
    })

    // Si no se detectó nada específico, generar reglas por defecto
    if (generatedRules.length === 0) {
      generatedRules.push({
        id: "default-tpv",
        type: "tpv",
        operator: "greater_than",
        value: "5000",
        label: "TPV mensual mayor a $5,000",
        icon: DollarSign,
      })
    }

    return generatedRules
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const newRules = await generateRulesFromPrompt(prompt)
      setRules(newRules)
      onRulesGenerated(newRules)
    } catch (error) {
      console.error("Error generating rules:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditRule = (ruleId: string, updates: Partial<Rule>) => {
    const updatedRules = rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    setRules(updatedRules)
    onRulesGenerated(updatedRules)
    setEditingRule(null)
  }

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = rules.filter((rule) => rule.id !== ruleId)
    setRules(updatedRules)
    onRulesGenerated(updatedRules)
  }

  const addCustomRule = () => {
    const newRule: Rule = {
      id: `custom-${Date.now()}`,
      type: "custom",
      operator: "greater_than",
      value: "",
      label: "Nueva regla personalizada",
      icon: Plus,
    }
    const updatedRules = [...rules, newRule]
    setRules(updatedRules)
    setEditingRule(newRule.id)
  }

  const estimateAudience = (rules: Rule[]) => {
    // Simulación simple de estimación de audiencia
    let baseAudience = 10000
    rules.forEach((rule) => {
      switch (rule.type) {
        case "tpv":
          baseAudience *= 0.3
          break
        case "age":
          baseAudience *= 0.4
          break
        case "category":
          baseAudience *= 0.2
          break
        case "location":
          baseAudience *= 0.6
          break
        default:
          baseAudience *= 0.5
      }
    })
    return Math.floor(baseAudience)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium text-purple-900">Generador de Audiencia con IA</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ai-prompt">Describe tu audiencia objetivo</Label>
            <Textarea
              id="ai-prompt"
              placeholder="Ejemplo: Quiero dirigirme a merchants nuevos de retail en Argentina con TPV mayor a $15,000 mensuales que se registraron en los últimos 60 días"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando reglas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar Reglas
              </>
            )}
          </Button>
        </div>
      </Card>

      {rules.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Reglas Generadas</h3>
            <Button variant="outline" size="sm" onClick={addCustomRule}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Regla
            </Button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <rule.icon className="w-4 h-4 text-gray-600" />
                  {editingRule === rule.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={rule.label}
                        onChange={(e) => handleEditRule(rule.id, { label: e.target.value })}
                        className="h-8"
                      />
                      <Select
                        value={rule.operator}
                        onValueChange={(value) => handleEditRule(rule.id, { operator: value as any })}
                      >
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="greater_than">Mayor que</SelectItem>
                          <SelectItem value="less_than">Menor que</SelectItem>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="contains">Contiene</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={rule.value}
                        onChange={(e) => handleEditRule(rule.id, { value: e.target.value })}
                        className="h-8 w-24"
                      />
                      <Button size="sm" onClick={() => setEditingRule(null)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm">{rule.label}</span>
                  )}
                </div>

                {editingRule !== rule.id && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingRule(rule.id)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {rules.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Estimación de audiencia</span>
          </div>
          <p className="text-blue-800">
            ~{estimateAudience(rules).toLocaleString()} merchants cumplirían con estas reglas
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Estimación basada en datos históricos • Actualizada en tiempo real
          </p>
        </div>
      )}

      {rules.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Reglas configuradas correctamente</span>
          </div>
          <p className="text-sm text-green-800">
            Las reglas se aplicarán automáticamente y se evaluarán en tiempo real
          </p>
        </Card>
      )}
    </div>
  )
}
