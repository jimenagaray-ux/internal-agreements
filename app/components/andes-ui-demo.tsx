'use client'

import { useState } from 'react'
import { MPButton } from "@/components/ui/mp-button"
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle } from "@/components/ui/mp-card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  User,
  Bell,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save
} from "lucide-react"

interface AndesUIDemoProps {
  onBack: () => void
}

export function AndesUIDemo({ onBack }: AndesUIDemoProps) {
  const [selectedTab, setSelectedTab] = useState("buttons")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: ""
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Andes UI Components
            </h1>
            <p className="text-lg text-gray-600">
              Sistema de diseño inspirado en Andes para React
            </p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Alert Info */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Componentes Andes UI:</strong> Esta demostración muestra componentes React inspirados en el sistema de diseño Andes, 
            adaptados para funcionar en el ecosistema de Next.js y React.
          </AlertDescription>
        </Alert>

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="buttons" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Botones
            </TabsTrigger>
            <TabsTrigger value="forms" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Formularios
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="navigation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Navegación
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-8">
            <MPCard className="p-6">
              <MPCardHeader>
                <MPCardTitle className="text-2xl text-gray-900 mb-4">
                  Sistema de Botones Andes
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-6">
                {/* Primary Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Botones Primarios</h3>
                  <div className="flex flex-wrap gap-4">
                    <MPButton variant="primary" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Pequeño
                    </MPButton>
                    <MPButton variant="primary" size="md">
                      <Save className="w-4 h-4 mr-2" />
                      Mediano
                    </MPButton>
                    <MPButton variant="primary" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Grande
                    </MPButton>
                    <MPButton variant="primary" size="md" disabled>
                      Deshabilitado
                    </MPButton>
                  </div>
                </div>

                {/* Secondary Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Botones Secundarios</h3>
                  <div className="flex flex-wrap gap-4">
                    <MPButton variant="secondary" size="md">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </MPButton>
                    <MPButton variant="secondary" size="md">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </MPButton>
                    <MPButton variant="secondary" size="md">
                      <Upload className="w-4 h-4 mr-2" />
                      Subir
                    </MPButton>
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Botones de Acción</h3>
                  <div className="flex flex-wrap gap-4">
                    <MPButton variant="success" size="md">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprobar
                    </MPButton>
                    <MPButton variant="warning" size="md">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Advertencia
                    </MPButton>
                    <MPButton variant="error" size="md">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </MPButton>
                  </div>
                </div>

                {/* Ghost Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Botones Ghost</h3>
                  <div className="flex flex-wrap gap-4">
                    <MPButton variant="ghost" size="md">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </MPButton>
                    <MPButton variant="ghost" size="md">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </MPButton>
                  </div>
                </div>
              </MPCardContent>
            </MPCard>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-8">
            <MPCard className="p-6">
              <MPCardHeader>
                <MPCardTitle className="text-2xl text-gray-900 mb-4">
                  Componentes de Formulario Andes
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nombre Completo *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@andes.gob.ar"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                        Rol *
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Departamento
                      </Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                        <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Selecciona departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">Tecnología</SelectItem>
                          <SelectItem value="hr">Recursos Humanos</SelectItem>
                          <SelectItem value="finance">Finanzas</SelectItem>
                          <SelectItem value="health">Salud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <MPButton variant="secondary" size="md">
                    Cancelar
                  </MPButton>
                  <MPButton variant="primary" size="md">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </MPButton>
                </div>
              </MPCardContent>
            </MPCard>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Info Card */}
              <MPCard className="p-6 border-l-4 border-l-blue-500">
                <MPCardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <MPCardTitle className="text-lg text-gray-900">
                      Información
                    </MPCardTitle>
                  </div>
                </MPCardHeader>
                <MPCardContent>
                  <p className="text-gray-600 mb-4">
                    Esta tarjeta muestra información importante del sistema.
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    Informativo
                  </Badge>
                </MPCardContent>
              </MPCard>

              {/* Success Card */}
              <MPCard className="p-6 border-l-4 border-l-green-500">
                <MPCardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <MPCardTitle className="text-lg text-gray-900">
                      Éxito
                    </MPCardTitle>
                  </div>
                </MPCardHeader>
                <MPCardContent>
                  <p className="text-gray-600 mb-4">
                    Operación completada exitosamente.
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    Completado
                  </Badge>
                </MPCardContent>
              </MPCard>

              {/* Warning Card */}
              <MPCard className="p-6 border-l-4 border-l-yellow-500">
                <MPCardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <MPCardTitle className="text-lg text-gray-900">
                      Advertencia
                    </MPCardTitle>
                  </div>
                </MPCardHeader>
                <MPCardContent>
                  <p className="text-gray-600 mb-4">
                    Revisa esta información antes de continuar.
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Atención
                  </Badge>
                </MPCardContent>
              </MPCard>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <MPCard className="p-6 hover:shadow-lg transition-shadow">
                <MPCardHeader>
                  <MPCardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    Gestión de Usuarios
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <p className="text-gray-600 mb-4">
                    Administra usuarios, roles y permisos del sistema de forma centralizada.
                  </p>
                  <div className="flex gap-2">
                    <MPButton variant="primary" size="sm">
                      Ver Usuarios
                    </MPButton>
                    <MPButton variant="secondary" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Nuevo
                    </MPButton>
                  </div>
                </MPCardContent>
              </MPCard>

              <MPCard className="p-6 hover:shadow-lg transition-shadow">
                <MPCardHeader>
                  <MPCardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-600" />
                    Configuración
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <p className="text-gray-600 mb-4">
                    Configura los parámetros del sistema y personaliza la experiencia.
                  </p>
                  <div className="flex gap-2">
                    <MPButton variant="primary" size="sm">
                      Configurar
                    </MPButton>
                    <MPButton variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </MPButton>
                  </div>
                </MPCardContent>
              </MPCard>
            </div>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-8">
            <MPCard className="p-6">
              <MPCardHeader>
                <MPCardTitle className="text-2xl text-gray-900 mb-4">
                  Componentes de Navegación
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-6">
                {/* Breadcrumb */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Breadcrumb</h3>
                  <nav className="flex text-sm text-gray-500">
                    <a href="#" className="hover:text-blue-600">Inicio</a>
                    <span className="mx-2">/</span>
                    <a href="#" className="hover:text-blue-600">Acuerdos</a>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Crear Nuevo</span>
                  </nav>
                </div>

                {/* Pagination */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Paginación</h3>
                  <div className="flex items-center gap-2">
                    <MPButton variant="secondary" size="sm" disabled>
                      Anterior
                    </MPButton>
                    <MPButton variant="primary" size="sm">1</MPButton>
                    <MPButton variant="secondary" size="sm">2</MPButton>
                    <MPButton variant="secondary" size="sm">3</MPButton>
                    <span className="text-gray-500">...</span>
                    <MPButton variant="secondary" size="sm">10</MPButton>
                    <MPButton variant="secondary" size="sm">
                      Siguiente
                    </MPButton>
                  </div>
                </div>

                {/* Search Bar */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Barra de Búsqueda</h3>
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Buscar acuerdos..."
                      className="pl-10 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </MPCardContent>
            </MPCard>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-8">
            <div className="space-y-6">
              {/* Alerts */}
              <MPCard className="p-6">
                <MPCardHeader>
                  <MPCardTitle className="text-xl text-gray-900 mb-4">
                    Alertas y Notificaciones
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Información:</strong> Este es un mensaje informativo del sistema.
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Éxito:</strong> La operación se completó correctamente.
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Advertencia:</strong> Revisa los datos antes de continuar.
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-red-200 bg-red-50">
                    <X className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Error:</strong> Se produjo un error al procesar la solicitud.
                    </AlertDescription>
                  </Alert>
                </MPCardContent>
              </MPCard>

              {/* Badges */}
              <MPCard className="p-6">
                <MPCardHeader>
                  <MPCardTitle className="text-xl text-gray-900 mb-4">
                    Badges y Estados
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                    <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                    <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
                  </div>
                </MPCardContent>
              </MPCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 