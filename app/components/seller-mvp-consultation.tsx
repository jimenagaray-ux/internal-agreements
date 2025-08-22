'use client'

import { useState } from 'react'
import { MPButton } from "@/components/ui/mp-button"
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle } from "@/components/ui/mp-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft,
  Search,
  User,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Eye,
  Info,
  Building
} from "lucide-react"

interface SellerAgreement {
  id: string
  name: string
  type: 'Base Mayorista' | 'Promocional' | 'Por Volumen' | 'Respaldo'
  status: 'Activo' | 'Prioritario' | 'Respaldo'
  priority: number
  discount: string
  validity: string
  conditions: string
  currency: string
  appliedSince: string
  description?: string
}

interface SellerInfo {
  id: string
  name: string
  segment: string
  status: string
  registrationDate: string
  totalAgreements: number
  activeAgreements: number
}

interface SellerMVPConsultationProps {
  onBack: () => void
}

export default function SellerMVPConsultation({ onBack }: SellerMVPConsultationProps) {
  const [sellerId, setSellerId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null)
  const [agreements, setAgreements] = useState<SellerAgreement[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Mock data para simulación
  const mockSellerData: Record<string, { info: SellerInfo; agreements: SellerAgreement[] }> = {
    '123456789': {
      info: {
        id: '123456789',
        name: 'Revendedor Gold SA',
        segment: 'Gold',
        status: 'Activo',
        registrationDate: '2024-01-15',
        totalAgreements: 4,
        activeAgreements: 3
      },
      agreements: [
        {
          id: 'AGR-001',
          name: 'Base Mayorista 2024',
          type: 'Base Mayorista',
          status: 'Activo',
          priority: 1,
          discount: '12% sobre PVP',
          validity: 'Hasta 31/12/2025',
          conditions: '60 días fecha factura',
          currency: 'ARS',
          appliedSince: '01/01/2024',
          description: 'Acuerdo base para revendedores con volumen alto'
        },
        {
          id: 'AGR-002',
          name: 'Campaña Día del Padre 2025',
          type: 'Promocional',
          status: 'Prioritario',
          priority: 2,
          discount: '15% adicional en Línea Blanca',
          validity: 'Hasta 20/06/2025',
          conditions: '60 días fecha factura',
          currency: 'ARS',
          appliedSince: '01/05/2025',
          description: 'Promoción especial para incrementar ventas en línea blanca'
        },
        {
          id: 'AGR-003',
          name: 'Descuento por Volumen Q2',
          type: 'Por Volumen',
          status: 'Activo',
          priority: 3,
          discount: '3% adicional sobre 100 unidades',
          validity: 'Hasta 30/06/2025',
          conditions: '45 días fecha factura',
          currency: 'ARS',
          appliedSince: '01/04/2025',
          description: 'Incentivo por volumen de compras trimestrales'
        },
        {
          id: 'AGR-004',
          name: 'Lista Backup Estándar',
          type: 'Respaldo',
          status: 'Respaldo',
          priority: 4,
          discount: '8% sobre PVP',
          validity: 'Hasta 31/12/2024',
          conditions: '30 días fecha factura',
          currency: 'ARS',
          appliedSince: '01/01/2024',
          description: 'Lista de respaldo para casos especiales'
        }
      ]
    },
    '987654321': {
      info: {
        id: '987654321',
        name: 'Distribuidora Central LTDA',
        segment: 'Premium',
        status: 'Activo',
        registrationDate: '2023-08-10',
        totalAgreements: 2,
        activeAgreements: 2
      },
      agreements: [
        {
          id: 'AGR-005',
          name: 'Premium Partner 2024',
          type: 'Base Mayorista',
          status: 'Activo',
          priority: 1,
          discount: '18% sobre PVP',
          validity: 'Hasta 31/12/2024',
          conditions: '90 días fecha factura',
          currency: 'ARS',
          appliedSince: '01/01/2024',
          description: 'Acuerdo premium para partners estratégicos'
        },
        {
          id: 'AGR-006',
          name: 'Volumen Especial',
          type: 'Por Volumen',
          status: 'Activo',
          priority: 2,
          discount: '5% adicional sobre 500 unidades',
          validity: 'Hasta 31/12/2024',
          conditions: '60 días fecha factura',
          currency: 'ARS',
          appliedSince: '01/03/2024',
          description: 'Descuento especial por alto volumen de compras'
        }
      ]
    }
  }

  const handleSearch = async () => {
    if (!sellerId.trim()) return

    setIsLoading(true)
    setSearchPerformed(true)
    
    // Simular búsqueda con delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const sellerData = mockSellerData[sellerId.trim()]
    
    if (sellerData) {
      setSellerInfo(sellerData.info)
      setAgreements(sellerData.agreements.sort((a, b) => a.priority - b.priority))
    } else {
      setSellerInfo(null)
      setAgreements([])
    }
    
    setIsLoading(false)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Prioritario':
        return 'default'
      case 'Activo':
        return 'secondary'
      case 'Respaldo':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Prioritario':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'Activo':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Respaldo':
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Base Mayorista':
        return <Building className="w-4 h-4 text-blue-600" />
      case 'Promocional':
        return <Target className="w-4 h-4 text-purple-600" />
      case 'Por Volumen':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'Respaldo':
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <h1 className="text-3xl font-bold text-gray-900">
              Consulta de Seller MVP
            </h1>
            <p className="text-gray-600 mt-1">
              Consulta acuerdos vigentes por ID de seller
            </p>
          </div>
          <div className="w-20" />
        </div>

        {/* Search Section */}
        <MPCard className="mb-8">
          <MPCardHeader>
            <MPCardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Búsqueda de Seller
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID del Seller
                </label>
                <Input
                  type="text"
                  placeholder="Ingresa el ID del seller (ej: 123456789)"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  className="text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <MPButton 
                variant="primary" 
                onClick={handleSearch}
                disabled={!sellerId.trim() || isLoading}
                className="px-8"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </MPButton>
            </div>
            
            {/* Helper text */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <Info className="w-4 h-4 inline mr-1" />
                <strong>IDs de prueba:</strong> 123456789 (Revendedor Gold), 987654321 (Distribuidora Central)
              </p>
            </div>
          </MPCardContent>
        </MPCard>

        {/* Results Section */}
        {searchPerformed && (
          <>
            {sellerInfo ? (
              <>
                {/* Seller Info */}
                <MPCard className="mb-6">
                  <MPCardHeader>
                    <MPCardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Información del Seller
                    </MPCardTitle>
                  </MPCardHeader>
                  <MPCardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                        <p className="text-lg font-semibold text-gray-900">{sellerInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID</p>
                        <p className="text-lg font-semibold text-gray-900">{sellerInfo.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Segmento</p>
                        <Badge variant="secondary" className="mt-1">
                          {sellerInfo.segment}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estado</p>
                        <Badge variant="default" className="mt-1 bg-green-100 text-green-800">
                          {sellerInfo.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                        <p className="text-lg font-semibold text-gray-900">{sellerInfo.registrationDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Acuerdos</p>
                        <p className="text-lg font-semibold text-gray-900">{sellerInfo.totalAgreements}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Acuerdos Activos</p>
                        <p className="text-lg font-semibold text-green-600">{sellerInfo.activeAgreements}</p>
                      </div>
                    </div>
                  </MPCardContent>
                </MPCard>

                {/* Agreements List */}
                <MPCard>
                  <MPCardHeader>
                    <div className="flex items-center justify-between">
                      <MPCardTitle className="flex items-center gap-2">
                        <ArrowUpDown className="w-5 h-5 text-blue-600" />
                        Acuerdos Vigentes - Ordenados por Prioridad
                      </MPCardTitle>
                      <Badge variant="outline" className="text-sm">
                        {agreements.length} acuerdos encontrados
                      </Badge>
                    </div>
                  </MPCardHeader>
                  <MPCardContent>
                    {agreements.length > 0 ? (
                      <div className="space-y-4">
                        {agreements.map((agreement, index) => (
                          <div 
                            key={agreement.id}
                            className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                                  {agreement.priority}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    {getTypeIcon(agreement.type)}
                                    {agreement.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">ID: {agreement.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusBadgeVariant(agreement.status)} className="flex items-center gap-1">
                                  {getStatusIcon(agreement.status)}
                                  {agreement.status}
                                </Badge>
                                <Badge variant="outline">
                                  {agreement.type}
                                </Badge>
                              </div>
                            </div>

                            {agreement.description && (
                              <p className="text-gray-600 mb-4 text-sm bg-gray-50 p-3 rounded">
                                {agreement.description}
                              </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <div>
                                  <p className="text-gray-500">Descuento</p>
                                  <p className="font-semibold text-gray-900">{agreement.discount}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="text-gray-500">Vigencia</p>
                                  <p className="font-semibold text-gray-900">{agreement.validity}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <div>
                                  <p className="text-gray-500">Condiciones</p>
                                  <p className="font-semibold text-gray-900">{agreement.conditions}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-600" />
                                <div>
                                  <p className="text-gray-500">Aplicado desde</p>
                                  <p className="font-semibold text-gray-900">{agreement.appliedSince}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                              <MPButton variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalle
                              </MPButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No se encontraron acuerdos para este seller</p>
                      </div>
                    )}
                  </MPCardContent>
                </MPCard>
              </>
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Seller no encontrado:</strong> No se encontró información para el ID "{sellerId}". 
                  Verifica que el ID sea correcto.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  )
}


