'use client'

import React from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { 
  ArrowLeft,
  Building2,
  Users,
  Store,
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface SellerAgreementsSelectionProps {
  onBack: () => void;
  onSelectOption: (option: 'cartera-asesorada' | 'smbs') => void;
}

export default function SellerAgreementsSelection({ onBack, onSelectOption }: SellerAgreementsSelectionProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MPButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </MPButton>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold">Acuerdos con Sellers</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Selecciona el tipo de acuerdo
          </h2>
          <p className="text-lg text-gray-600">
            Elige la categoría de sellers con la que deseas trabajar
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cartera Asesorada Big Sellers */}
          <MPCard 
            className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100"
            onClick={() => onSelectOption('cartera-asesorada')}
          >
            <MPCardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <MPCardTitle className="text-xl font-bold text-blue-900">
                Acuerdos Cartera Asesorada
              </MPCardTitle>
              <MPCardTitle className="text-lg font-semibold text-blue-800">
                Big Sellers
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="text-center space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                Gestiona acuerdos con grandes sellers que forman parte de nuestra cartera asesorada. 
                Sellers de alto volumen con gestión personalizada y condiciones especiales.
              </p>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Alto volumen de transacciones</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Gestión comercial personalizada</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Condiciones preferenciales</span>
                </div>
              </div>

              <div className="pt-4">
                <MPButton 
                  variant="primary" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Seleccionar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MPButton>
              </div>
            </MPCardContent>
          </MPCard>

          {/* SMBs */}
          <MPCard 
            className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100"
            onClick={() => onSelectOption('smbs')}
          >
            <MPCardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <MPCardTitle className="text-xl font-bold text-green-900">
                Acuerdos SMBs
              </MPCardTitle>
              <MPCardTitle className="text-lg font-semibold text-green-800">
                Small & Medium Business
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="text-center space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                Administra acuerdos con pequeñas y medianas empresas. 
                Sellers en crecimiento con necesidades específicas y condiciones adaptadas a su escala.
              </p>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <Store className="w-4 h-4 text-green-600" />
                  <span>Pequeñas y medianas empresas</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>En proceso de crecimiento</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>Condiciones escalables</span>
                </div>
              </div>

              <div className="pt-4">
                <MPButton 
                  variant="primary" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  Seleccionar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MPButton>
              </div>
            </MPCardContent>
          </MPCard>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">¿Necesitas ayuda para decidir?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Si no estás seguro de qué categoría elegir, puedes consultar con tu equipo comercial 
              o revisar la documentación de clasificación de sellers.
            </p>
            <MPButton variant="secondary" size="sm">
              Ver Documentación
            </MPButton>
          </div>
        </div>
      </div>
    </div>
  );
}
