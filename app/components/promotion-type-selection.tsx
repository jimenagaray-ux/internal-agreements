'use client'

import React from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { 
  ArrowLeft,
  ExternalLink,
  Calendar,
  Megaphone,
  Store,
  ArrowRight
} from 'lucide-react';

interface PromotionTypeSelectionProps {
  onBack: () => void;
  onSelectType: (type: string) => void;
}

export default function PromotionTypeSelection({ onBack, onSelectType }: PromotionTypeSelectionProps) {
  const promotionTypes = [
    {
      id: 'terceros',
      title: 'Promoción de Terceros',
      description: 'Promociones creadas en colaboración con marcas, proveedores o partners externos para ampliar el alcance y beneficios.',
      icon: ExternalLink,
      color: 'blue',
      features: [
        'Colaboración con marcas externas',
        'Beneficios compartidos',
        'Mayor alcance de audiencia',
        'Validación de partners requerida'
      ]
    },
    {
      id: 'seasonal',
      title: 'Seasonal',
      description: 'Promociones estacionales vinculadas a fechas especiales, eventos o temporadas específicas del año.',
      icon: Calendar,
      color: 'orange',
      features: [
        'Fechas especiales y eventos',
        'Promociones estacionales',
        'Alta demanda esperada',
        'Planificación anticipada'
      ]
    },
    {
      id: 'campana',
      title: 'Campaña',
      description: 'Promociones estratégicas de marketing diseñadas para objetivos específicos de negocio y engagement.',
      icon: Megaphone,
      color: 'purple',
      features: [
        'Objetivos estratégicos definidos',
        'Métricas de engagement',
        'Segmentación avanzada',
        'Análisis de performance'
      ]
    },
    {
      id: 'propia',
      title: 'Promoción Propia',
      description: 'Promociones internas de MercadoPago para impulsar productos, servicios o funcionalidades específicas.',
      icon: Store,
      color: 'green',
      features: [
        'Productos MercadoPago',
        'Control total del proceso',
        'Flexibilidad en configuración',
        'Implementación rápida'
      ]
    }
  ];

  const getCardStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-300 hover:border-blue-400 hover:shadow-lg';
      case 'orange':
        return 'border-orange-300 hover:border-orange-400 hover:shadow-lg';
      case 'purple':
        return 'border-purple-300 hover:border-purple-400 hover:shadow-lg';
      case 'green':
        return 'border-green-300 hover:border-green-400 hover:shadow-lg';
      default:
        return 'border-gray-300 hover:border-gray-400 hover:shadow-lg';
    }
  };

  const getIconStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getButtonStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'orange':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MPButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </MPButton>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Seleccionar Tipo de Promoción</h1>
              <p className="text-sm text-purple-100">Elige el tipo de promoción que deseas crear</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Intro */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Qué tipo de promoción deseas crear?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecciona el tipo de promoción que mejor se adapte a tus objetivos. 
            Cada tipo tiene características y configuraciones específicas.
          </p>
        </div>

        {/* Promotion Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {promotionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <MPCard 
                key={type.id} 
                className={`cursor-pointer transition-all duration-200 ${getCardStyles(type.color)}`}
                onClick={() => onSelectType(type.id)}
              >
                <MPCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyles(type.color)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <MPCardTitle className="text-lg font-semibold text-gray-900">
                          {type.title}
                        </MPCardTitle>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </MPCardHeader>
                <MPCardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    {type.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Características:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <MPButton
                      variant="primary"
                      size="sm"
                      className={`w-full ${getButtonStyles(type.color)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectType(type.id);
                      }}
                    >
                      Seleccionar {type.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </MPButton>
                  </div>
                </MPCardContent>
              </MPCard>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">¿Necesitas ayuda para elegir?</h3>
              <p className="text-sm text-blue-800 mb-3">
                Cada tipo de promoción está diseñado para diferentes objetivos de negocio:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• <strong>Terceros:</strong> Para colaboraciones con marcas externas</li>
                <li>• <strong>Seasonal:</strong> Para eventos especiales y fechas importantes</li>
                <li>• <strong>Campaña:</strong> Para objetivos estratégicos de marketing</li>
                <li>• <strong>Propia:</strong> Para promocionar productos internos de MercadoPago</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
