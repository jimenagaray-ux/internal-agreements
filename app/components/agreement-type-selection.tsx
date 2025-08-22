'use client'

import { MPButton } from "@/components/ui/mp-button"
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle } from "@/components/ui/mp-card"
import { 
  ArrowLeft, 
  Check, 
  DollarSign, 
  Users, 
  Target, 
  Zap
} from "lucide-react"

interface AgreementTypeSelectionProps {
  onBack: () => void
  onSelectType: (type: string) => void
}

export function AgreementTypeSelection({ onBack, onSelectType }: AgreementTypeSelectionProps) {
  const agreementTypes = [
    {
      id: "ISCA",
      title: "ISCA",
      description: "Incentivos por volumen de transacciones",
      features: ["Comisiones escalonadas", "Metas mensuales", "Bonificaciones"],
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      available: false
    },
    {
      id: "PxE",
      title: "Pricing por Escala",
      description: "Precios basados en volumen de negocio",
      features: ["Umbrales de TPV", "Descuentos progresivos", "Revisión trimestral"],
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      available: true
    },
    {
      id: "audience",
      title: "Audiencia Específica",
      description: "Precios personalizados para segmentos",
      features: ["Targeting avanzado", "Precios fijos", "Duración flexible"],
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      available: false
    },
    {
      id: "always-on",
      title: "Always-On",
      description: "Campañas permanentes sin fecha de fin",
      features: ["Sin vencimiento", "Activación automática", "Monitoreo continuo"],
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      available: false
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selecciona el tipo de acuerdo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el modelo de pricing que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Agreement Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {agreementTypes.map((type) => {
            const IconComponent = type.icon
            const isDisabled = !type.available
            
            return (
              <MPCard
                key={type.id}
                className={`
                  ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg hover:scale-105'}
                  transition-all duration-300
                  ${isDisabled ? 'bg-gray-100 border-gray-300' : `${type.bgColor} ${type.borderColor}`}
                  border-2
                  ${isDisabled ? 'grayscale' : ''}
                `}
                onClick={() => type.available && onSelectType(type.id)}
              >
                <MPCardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 ${isDisabled ? 'bg-gray-200' : type.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : type.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <MPCardTitle className={`text-2xl font-bold ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
                          {type.title}
                        </MPCardTitle>
                        {isDisabled && (
                          <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-full">
                            Próximamente
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDisabled ? 'text-gray-500' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                </MPCardHeader>
                <MPCardContent>
                  <div className="space-y-3">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : 'text-green-600'} flex-shrink-0`} />
                        <span className={`font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-700'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    {type.available ? (
                      <MPButton 
                        variant="primary" 
                        className={`w-full font-medium ${type.color.replace('text-', 'bg-').replace('600', '600')} hover:${type.color.replace('text-', 'bg-').replace('600', '700')} text-white`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectType(type.id)
                        }}
                      >
                        Seleccionar {type.title}
                      </MPButton>
                    ) : (
                      <MPButton 
                        variant="secondary" 
                        className="w-full font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        Próximamente disponible
                      </MPButton>
                    )}
                  </div>
                </MPCardContent>
              </MPCard>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Podrás modificar y configurar los detalles específicos en los siguientes pasos
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Las opciones marcadas como "Próximamente" estarán disponibles en futuras actualizaciones
          </p>
        </div>
      </div>
    </div>
  )
} 