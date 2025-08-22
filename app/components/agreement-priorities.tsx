'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle } from "@/components/ui/mp-card"
import { MPButton } from "@/components/ui/mp-button"
import { Badge } from "@/components/ui/badge"
import { 
  GripVertical, 
  ArrowLeft, 
  Target, 
  DollarSign, 
  Users, 
  Zap,
  Save,
  RotateCcw,
  Handshake,
  Tag,
  Settings,
  Calendar
} from "lucide-react"

interface AgreementType {
  id: string
  title: string
  description: string
  icon: any
  priority: number
  color: string
  bgColor: string
  borderColor: string
}

interface AgreementPrioritiesProps {
  onBack: () => void
}

interface SortableItemProps {
  agreementType: AgreementType
  index: number
}

function SortableItem({ agreementType, index }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: agreementType.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const IconComponent = agreementType.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50 scale-105 z-50' : ''} transition-all duration-200`}
    >
      <MPCard className={`${agreementType.bgColor} ${agreementType.borderColor} border-2 mb-4 hover:shadow-md transition-shadow`}>
        <MPCardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 rounded hover:bg-gray-200 transition-colors"
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>

            {/* Priority Badge */}
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-gray-300">
              <span className="text-lg font-bold text-gray-700">#{index + 1}</span>
            </div>

            {/* Icon */}
            <div className={`w-12 h-12 ${agreementType.bgColor} rounded-lg flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${agreementType.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{agreementType.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  Prioridad {index + 1}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{agreementType.description}</p>
            </div>
          </div>
        </MPCardContent>
      </MPCard>
    </div>
  )
}

export function AgreementPriorities({ onBack }: AgreementPrioritiesProps) {
  const [agreementTypes, setAgreementTypes] = useState<AgreementType[]>([
    {
      id: "PxE",
      title: "Pricing por Escala",
      description: "Precios basados en volumen de negocio con umbrales de TPV",
      icon: Target,
      priority: 1,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "ISCA",
      title: "ISCA",
      description: "Incentivos por volumen de transacciones con comisiones escalonadas",
      icon: DollarSign,
      priority: 2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "seller-agreements",
      title: "Seller Agreements",
      description: "Acuerdos específicos con sellers individuales para condiciones personalizadas",
      icon: Handshake,
      priority: 3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      id: "promociones",
      title: "Promociones",
      description: "Campañas promocionales temporales con descuentos y ofertas especiales",
      icon: Tag,
      priority: 4,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
    {
      id: "audience",
      title: "Audiencia Específica",
      description: "Precios personalizados para segmentos con targeting avanzado",
      icon: Users,
      priority: 5,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "reglas-legacy",
      title: "Reglas Legacy",
      description: "Reglas de pricing heredadas del sistema anterior que requieren mantenimiento",
      icon: Settings,
      priority: 6,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "seasonal",
      title: "Seasonal (Acuerdos Calendarizados)",
      description: "Acuerdos con sellers programados por temporadas y fechas específicas",
      icon: Calendar,
      priority: 7,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
    {
      id: "always-on",
      title: "Always-On",
      description: "Campañas permanentes sin fecha de fin con activación automática",
      icon: Zap,
      priority: 8,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ])

  const [originalOrder, setOriginalOrder] = useState<AgreementType[]>([...agreementTypes])
  const [hasChanges, setHasChanges] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setAgreementTypes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Update priorities
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          priority: index + 1
        }))

        setHasChanges(true)
        return updatedItems
      })
    }
  }

  const handleSave = () => {
    // Aquí podrías hacer una llamada a la API para guardar las prioridades
    console.log('Guardando prioridades:', agreementTypes.map(type => ({
      id: type.id,
      priority: type.priority
    })))
    
    setOriginalOrder([...agreementTypes])
    setHasChanges(false)
    
    // Simular guardado exitoso
    alert('Prioridades guardadas exitosamente')
  }

  const handleReset = () => {
    setAgreementTypes([...originalOrder])
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          
          {hasChanges && (
            <div className="flex items-center gap-3">
              <MPButton variant="secondary" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Deshacer Cambios
              </MPButton>
              <MPButton variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Prioridades
              </MPButton>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Prioridades de Internal Agreements
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Arrastra y suelta los tipos de acuerdos para definir su orden de prioridad. 
            Los acuerdos con mayor prioridad se procesarán primero en el sistema.
          </p>
          
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Tienes cambios sin guardar</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Recuerda guardar los cambios para que se apliquen en el sistema.
              </p>
            </div>
          )}
        </div>

        {/* Drag and Drop Area */}
        <MPCard className="bg-white shadow-sm">
          <MPCardHeader>
            <MPCardTitle className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-500" />
              Orden de Prioridad ({agreementTypes.length} tipos de acuerdos)
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent className="p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={agreementTypes} strategy={verticalListSortingStrategy}>
                {agreementTypes.map((agreementType, index) => (
                  <SortableItem
                    key={agreementType.id}
                    agreementType={agreementType}
                    index={index}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">💡 Consejos:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Arrastra desde el ícono de líneas verticales para mover un elemento</li>
                  <li>• La prioridad #1 será la más alta (se procesa primero)</li>
                  <li>• Los cambios se guardan automáticamente al hacer clic en "Guardar"</li>
                  <li>• Puedes deshacer los cambios antes de guardar</li>
                  <li>• Las reglas de mayor prioridad pueden sobrescribir las de menor prioridad</li>
                </ul>
              </div>
            </div>
          </MPCardContent>
        </MPCard>

        {/* Summary Section */}
        <div className="mt-8">
          <MPCard className="bg-blue-50 border-blue-200">
            <MPCardHeader>
              <MPCardTitle className="text-blue-900">Resumen de Tipos de Acuerdos</MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-blue-900 mb-2">Acuerdos de Alto Impacto:</h5>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Pricing por Escala - Volumen de negocio</li>
                    <li>• ISCA - Incentivos por transacciones</li>
                    <li>• Seller Agreements - Condiciones personalizadas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-900 mb-2">Acuerdos Especializados:</h5>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Promociones - Campañas temporales</li>
                    <li>• Seasonal - Acuerdos calendarizados</li>
                    <li>• Reglas Legacy - Sistema anterior</li>
                  </ul>
                </div>
              </div>
            </MPCardContent>
          </MPCard>
        </div>
      </div>
    </div>
  )
} 