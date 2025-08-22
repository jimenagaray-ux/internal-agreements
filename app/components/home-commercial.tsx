'use client'

import React from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { 
  Store, 
  Building2, 
  Users, 
  BarChart3, 
  CreditCard, 
  Database, 
  FileText,
  Settings,
  Globe,
  ArrowRight,
  Search
} from 'lucide-react';

interface HomeCommercialProps {
  onNavigate: (section: string) => void;
}

export default function HomeCommercial({ onNavigate }: HomeCommercialProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">Inicio</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm">Hola, Username</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          One Tool Comercial
        </h2>

        {/* Agreement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Acuerdos con sellers */}
          <MPCard variant="outlined" className="h-full">
            <MPCardHeader>
              <MPCardTitle className="text-lg font-semibold text-gray-900">
                Acuerdos con sellers
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <p className="text-gray-600 mb-6">
                Crea acuerdos, gestiona liberaciones y administra la operatoria comercial de todos los sellers.
              </p>
              <div className="flex items-center justify-between">
                <MPButton 
                  variant="primary" 
                  size="md"
                  onClick={() => onNavigate('sellers')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Ingresar
                </MPButton>
                <MPButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('new-promotion')}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  Promociones <ArrowRight className="w-4 h-4 ml-1" />
                </MPButton>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Acuerdos con proveedores */}
          <MPCard variant="outlined" className="h-full">
            <MPCardHeader>
              <MPCardTitle className="text-lg font-semibold text-gray-900">
                Acuerdos con proveedores
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <p className="text-gray-600 mb-6">
                Crea los acuerdos que determinan nuestra capacidad de procesar pagos a través de adquirentes, medios off, transferencias o promociones propias.
              </p>
              <div className="flex items-center justify-between">
                <MPButton 
                  variant="secondary" 
                  size="md"
                  disabled
                  className="opacity-50 cursor-not-allowed bg-gray-300 text-gray-700"
                >
                  Ingresar
                </MPButton>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  PRÓXIMAMENTE
                </span>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Acuerdos internos */}
          <MPCard variant="outlined" className="h-full border-blue-300 bg-blue-50">
            <MPCardHeader>
              <MPCardTitle className="text-lg font-semibold text-gray-900">
                Acuerdos internos
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <p className="text-gray-600 mb-6">
                Crea acuerdos entre partes de Mercado Libre que permiten sostener la rentabilidad con foco en la eficiencia operativa.
              </p>
              <div className="flex items-center justify-between">
                <MPButton 
                  variant="primary" 
                  size="md"
                  onClick={() => onNavigate('internal-agreements')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Ingresar
                </MPButton>
                <MPButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('new-promotion')}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  Promociones <ArrowRight className="w-4 h-4 ml-1" />
                </MPButton>
              </div>
            </MPCardContent>
          </MPCard>
        </div>

        {/* Otros accesos */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Otros accesos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dashboard de promociones */}
            <div 
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer border-purple-300"
              onClick={() => onNavigate('promotions-dashboard')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Dashboard de promociones</h4>
            </div>

            {/* Master de BINs */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Master de BINs</h4>
            </div>

            {/* Acumuladores y CAPS */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Acumuladores y CAPS</h4>
            </div>

            {/* Mis solicitudes */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Mis solicitudes</h4>
            </div>

            {/* Dashboard de acuerdos internos - NUEVA OPCIÓN */}
            <div 
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer border-blue-300"
              onClick={() => onNavigate('internal-agreements-dashboard')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Dashboard de acuerdos internos</h4>
            </div>

            {/* Consulta de sellers - NUEVA OPCIÓN */}
            <div 
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer border-green-300"
              onClick={() => onNavigate('sellers-consultation')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Consulta de sellers</h4>
            </div>

            {/* Consulta de Seller MVP - NUEVA OPCIÓN */}
            <div 
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer border-orange-300"
              onClick={() => onNavigate('seller-mvp-consultation')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">Consulta Seller MVP</h4>
              <p className="text-xs text-gray-500 mt-1">Acuerdos vigentes por ID</p>
            </div>
          </div>
        </div>

        {/* Herramientas */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Selecciona una herramienta para acceder a su buscador
          </h3>
          <div className="flex flex-wrap gap-4">
            <MPButton 
              variant="secondary" 
              size="md"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Rule Engine
            </MPButton>
            <MPButton 
              variant="secondary" 
              size="md"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Method
            </MPButton>
            <MPButton 
              variant="secondary" 
              size="md"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
            >
              <Globe className="w-4 h-4 mr-2" />
              Router
            </MPButton>
          </div>
        </div>
      </div>
    </div>
  );
} 