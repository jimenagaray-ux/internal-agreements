'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft,
  User,
  Calculator,
  DollarSign,
  Calendar,
  Save,
  Search,
  CheckCircle,
  Settings
} from 'lucide-react';

interface Agreement {
  id: string;
  nombre: string;
}

interface AddSellerManualProps {
  agreement: Agreement;
  onBack: () => void;
}

export default function AddSellerManual({ agreement, onBack }: AddSellerManualProps) {
  const [custId, setCustId] = useState('');
  const [selectedPricingOption, setSelectedPricingOption] = useState('');
  const [selectedTable, setSelectedTable] = useState('[MLA] Pricing Scale - Link');
  const [tpvValue, setTpvValue] = useState('');
  const [scaleOption, setScaleOption] = useState('declared');
  const [recalculationPeriod, setRecalculationPeriod] = useState('1');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pricingOptions = [
    { value: 'simulation', label: 'Sin una Simulación' },
    { value: 'scale', label: 'Configuración por Escalas' },
    { value: 'custom', label: 'Configuración Personalizada' }
  ];

  const tables = [
    '[MLA] Pricing Scale - Link',
    '[MLB] Pricing Scale - Link',
    '[MLC] Pricing Scale - Link',
    '[MLM] Pricing Scale - Link'
  ];

  const scaleConfigurations = {
    5: {
      name: 'Escala 5',
      details: [
        'BJ: Link de Pago - 5.29%',
        'Dinero en la cuenta: 5.29%',
        'Descuentos en cuotas de cheques bancarios: 5.29%',
        'Tarjeta de crédito: 5.29%',
        'Tarjeta de débito: 5.29%',
        'Mercado Crédito: 5.29%',
        'Tarjeta prepaga: 5.29%',
        'Medios de pago en efectivo: 5.29%',
        'Primer recálculo: 01/ago.'
      ]
    }
  };

  const handleSave = async () => {
    if (!custId.trim()) {
      alert('Por favor ingresa un Cust ID válido antes de guardar');
      return;
    }

    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Seller ${custId} agregado exitosamente al acuerdo ${agreement.id}`);
      onBack();
    } catch (error) {
      alert('Error al guardar el seller. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSeller = async () => {
    if (!custId) return;
    setIsLoading(true);
    // Simular búsqueda
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Seller ${custId} encontrado y validado`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <MPButton
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </MPButton>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurar pricing para un usuario</h1>
              <p className="text-gray-600 mt-1">{agreement.nombre} - {agreement.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Selección de Opción de Pricing */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Configuración de Pricing
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="space-y-4">
              <div>
                <Label htmlFor="pricing-option" className="text-sm font-medium text-gray-700">
                  Seleccione una opción para seteo de precios
                </Label>
                <Select value={selectedPricingOption} onValueChange={setSelectedPricingOption}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="sin una Simulación" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Customer ID */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Identificación del Seller
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="space-y-4">
              <div>
                <Label htmlFor="cust-id" className="text-sm font-medium text-gray-700">
                  Cust Id *
                </Label>
                <div className="flex space-x-3 mt-2">
                  <Input
                    id="cust-id"
                    type="text"
                    value={custId}
                    onChange={(e) => setCustId(e.target.value)}
                    placeholder="142711364"
                    className="flex-1"
                  />
                  <MPButton
                    variant="secondary"
                    onClick={handleSearchSeller}
                    disabled={!custId || isLoading}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </MPButton>
                </div>
              </div>

              {custId && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        🇦🇷 Activo Tipo: SCALE Tabla: [Scale] Pricing Scale MLA
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </MPCardContent>
          </MPCard>

          {/* Tabla de Configuración */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-purple-600" />
                Tabla de Pricing
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <div>
                <Label htmlFor="table-select" className="text-sm font-medium text-gray-700">
                  Tabla
                </Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Configuración de Escala */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Configura la escala para el seller
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="space-y-6">
              <div>
                <Label htmlFor="tpv-input" className="text-sm font-medium text-gray-700">
                  TPV
                </Label>
                <Input
                  id="tpv-input"
                  type="text"
                  value={tpvValue}
                  onChange={(e) => setTpvValue(e.target.value)}
                  placeholder="Ingresa el TPV declarado por el seller"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Opciones de configuración
                </Label>
                <RadioGroup value={scaleOption} onValueChange={setScaleOption}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="declared" id="declared" />
                      <Label htmlFor="declared" className="text-sm">
                        De acuerdo al TPV declarado
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="predefined" id="predefined" />
                      <Label htmlFor="predefined" className="text-sm">
                        Predeterminada (Escala 5)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last-month" id="last-month" />
                      <Label htmlFor="last-month" className="text-sm">
                        Basada en el TPV del último mes
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="text-sm">
                        Elegir escala manualmente
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Escala Configurada */}
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-md">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Escala configurada: 5</h4>
                    <p className="text-sm text-blue-700">BJ: Link de Pago</p>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-blue-800">
                  {scaleConfigurations[5].details.map((detail, index) => (
                    <p key={index}>{detail}</p>
                  ))}
                </div>

                <MPButton
                  variant="secondary"
                  size="sm"
                  className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  Ver tasas
                </MPButton>
              </div>
            </MPCardContent>
          </MPCard>

          {/* Información de Recálculo */}
          <MPCard>
            <MPCardHeader>
              <MPCardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                Información de recálculo
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Primer mes de recálculo (Predeterminado: 0)
                </Label>
                <RadioGroup value={recalculationPeriod} onValueChange={setRecalculationPeriod}>
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="month-0" />
                      <Label htmlFor="month-0" className="text-sm">0</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="month-1" />
                      <Label htmlFor="month-1" className="text-sm">1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="month-2" />
                      <Label htmlFor="month-2" className="text-sm">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="month-3" />
                      <Label htmlFor="month-3" className="text-sm">3</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                  Razón
                </Label>
                <Input
                  id="reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Razón..."
                  className="mt-2"
                />
              </div>
            </MPCardContent>
          </MPCard>

          {/* Botón de Guardado */}
          <div className="flex justify-end space-x-3">
            <MPButton
              variant="secondary"
              onClick={onBack}
              disabled={isLoading}
            >
              Cancelar
            </MPButton>
            <MPButton
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 ${
                !custId && !isLoading
                  ? 'opacity-75 cursor-not-allowed' 
                  : ''
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </MPButton>
          </div>
        </div>
      </div>
    </div>
  );
} 