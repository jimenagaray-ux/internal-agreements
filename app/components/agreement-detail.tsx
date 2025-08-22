"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Copy,
  Pause,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface AgreementDetailProps {
  agreement: any
  onBack: () => void
  onEdit: () => void
}

export function AgreementDetail({ agreement, onBack, onEdit }: AgreementDetailProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const performanceData = [
    { month: "Oct", tpv: 125000, merchants: 45, revenue: 2500 },
    { month: "Nov", tpv: 142000, merchants: 52, revenue: 2840 },
    { month: "Dec", tpv: 158000, merchants: 58, revenue: 3160 },
  ]

  const historyData = [
    {
      date: "2024-01-15",
      action: "Creado",
      user: "Ana García",
      details: "Acuerdo inicial creado y aprobado",
    },
    {
      date: "2024-02-01",
      action: "Activado",
      user: "Sistema",
      details: "Acuerdo activado automáticamente",
    },
    {
      date: "2024-03-15",
      action: "Modificado",
      user: "Carlos López",
      details: "Ajuste en comisión de 2.5% a 2.3%",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{agreement.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={agreement.type === "ISCA" ? "default" : "secondary"}>{agreement.type}</Badge>
              <Badge variant={agreement.status === "active" ? "default" : "secondary"}>
                {agreement.status === "active" ? "Activo" : "Pausado"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Clonar
          </Button>
          <Button variant="outline">
            <Pause className="w-4 h-4 mr-2" />
            Pausar
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
            <Trash2 className="w-4 h-4 mr-2" />
            Terminar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Merchants Activos</span>
            </div>
            <div className="text-2xl font-bold">58</div>
            <div className="text-xs text-green-600">+6 este mes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">TPV Mensual</span>
            </div>
            <div className="text-2xl font-bold">$158K</div>
            <div className="text-xs text-green-600">+11.3%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <div className="text-2xl font-bold">$3.16K</div>
            <div className="text-xs text-green-600">+11.3%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Días Restantes</span>
            </div>
            <div className="text-2xl font-bold">45</div>
            <div className="text-xs text-orange-600">Vence 31/12</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="audience">Audiencia</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Comisión base:</span>
                  <span className="font-medium">{agreement.commission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Umbral descuento:</span>
                  <span className="font-medium">$50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comisión con descuento:</span>
                  <span className="font-medium">2.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vigencia:</span>
                  <span className="font-medium">01/01 - {agreement.expires}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado del Acuerdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Aprobado y activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Renovación automática habilitada</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Próximo a vencer en 45 días</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso del período</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Campaña de bienvenida para nuevos merchants del Q4 2024. Incluye comisiones preferenciales para
                incentivar la adopción y retención de nuevos usuarios durante el período de mayor actividad comercial.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criterios de Audiencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tipo de segmentación</h4>
                  <Badge>Reglas dinámicas</Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Criterios activos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>TPV mensual mínimo</span>
                      <span className="font-medium">$10,000</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Antigüedad mínima</span>
                      <span className="font-medium">30 días</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Categorías incluidas</span>
                      <div className="flex gap-1">
                        <Badge variant="secondary">Retail</Badge>
                        <Badge variant="secondary">Servicios</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Audiencia actual</span>
                  </div>
                  <p className="text-blue-800">2,847 merchants cumplen con los criterios</p>
                  <p className="text-sm text-blue-700 mt-1">Última actualización: hace 2 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historyData.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.action}</span>
                        <span className="text-sm text-gray-500">por {item.user}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.details}</p>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">TPV Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$425K</div>
                <div className="text-sm text-gray-600">Últimos 3 meses</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Generado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">$8.5K</div>
                <div className="text-sm text-gray-600">Comisiones cobradas</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Merchants Únicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">58</div>
                <div className="text-sm text-gray-600">Activos este mes</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm text-gray-600">Mes</div>
                      <div className="font-medium">{data.month}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">TPV</div>
                      <div className="font-medium">${data.tpv.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Merchants</div>
                      <div className="font-medium">{data.merchants}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Revenue</div>
                      <div className="font-medium">${data.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
