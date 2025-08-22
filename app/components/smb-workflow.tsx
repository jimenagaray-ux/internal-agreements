'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  User,
  Calculator,
  DollarSign,
  Calendar,
  Save,
  Search,
  CheckCircle,
  Settings,
  Users,
  Store,
  ArrowRight,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  AlertTriangle,
  Info
} from 'lucide-react';

interface SMBWorkflowProps {
  onBack: () => void;
  onNext?: (data: any) => void;
}

export default function SMBWorkflow({ onBack, onNext }: SMBWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [custId, setCustId] = useState('');
  const [tpvValue, setTpvValue] = useState('');
  const [configOption, setConfigOption] = useState('declared');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  const configOptions = [
    { value: 'declared', label: 'De acuerdo al TPV declarado' },
    { value: 'predetermined', label: 'Predeterminada (Escala 5)' }
  ];



  // Mock data para precios actuales vs nuevos
  const currentPrices = {
    linkPago: 6.99,
    dineroEnCuenta: 6.99,
    descuentoCuotas: 6.99,
    tarjetaCredito: 6.99,
    tarjetaDebito: 6.99,
    mercadoCredito: 6.99,
    tarjetaPrepaga: 6.99,
    mediosEfectivo: 6.99,
    escala: 'Escala 7'
  };

  const newPrices = {
    linkPago: 5.29,
    dineroEnCuenta: 5.29,
    descuentoCuotas: 5.29,
    tarjetaCredito: 5.29,
    tarjetaDebito: 5.29,
    mercadoCredito: 5.29,
    tarjetaPrepaga: 5.29,
    mediosEfectivo: 5.29,
    escala: 'Escala 5'
  };

  const priceComparisonItems = [
    { key: 'linkPago', label: 'BJ: Link de Pago' },
    { key: 'dineroEnCuenta', label: 'Dinero en la cuenta' },
    { key: 'descuentoCuotas', label: 'Descuentos en cuotas de cheques bancarios' },
    { key: 'tarjetaCredito', label: 'Tarjeta de crédito' },
    { key: 'tarjetaDebito', label: 'Tarjeta de débito' },
    { key: 'mercadoCredito', label: 'Mercado Crédito' },
    { key: 'tarjetaPrepaga', label: 'Tarjeta prepaga' },
    { key: 'mediosEfectivo', label: 'Medios de pago en efectivo' }
  ];

  const handleSearch = async () => {
    if (!custId.trim()) return;
    
    setIsLoading(true);
    // Simular búsqueda
    setTimeout(() => {
      setSearchResults([
        {
          id: custId,
          name: 'Seller Demo SMB',
          email: 'seller@example.com',
          status: 'active',
          category: 'SMB',
          registrationDate: '2024-01-15',
          tpv: 125000
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleConfigOptionChange = (value: string) => {
    setConfigOption(value);
    // Mostrar comparación de precios cuando se selecciona predeterminada
    if (value === 'predetermined') {
      setShowPriceComparison(true);
    } else {
      setShowPriceComparison(false);
    }
  };

  const calculatePriceDifference = (currentPrice: number, newPrice: number) => {
    return ((newPrice - currentPrice) / currentPrice) * 100;
  };

  const handleAddSeller = () => {
    if (!custId || !reason) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (configOption === 'declared' && !tpvValue) {
      alert('Por favor ingresa el TPV declarado');
      return;
    }

    if (!startDate || !endDate) {
      alert('Por favor selecciona las fechas de inicio y fin del acuerdo');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    const sellerData = {
      custId,
      tpvValue,
      configOption,
      startDate,
      endDate,
      reason,
      searchResults
    };

    // Avanzar al siguiente paso
    setCurrentStep(2);
    if (onNext) {
      onNext(sellerData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Búsqueda de Seller */}
      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Seller SMB
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="custId">CUST ID del Seller</Label>
              <Input
                id="custId"
                placeholder="Ingresa el CUST ID del seller SMB"
                value={custId}
                onChange={(e) => setCustId(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <MPButton 
                onClick={handleSearch}
                disabled={!custId.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
          </div>

          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Seller Encontrado
              </h4>
              {searchResults.map((seller) => (
                <div key={seller.id} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{seller.name}</h5>
                    <Badge className="bg-green-100 text-green-800">SMB</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">ID:</span> {seller.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {seller.email}
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span> {seller.status}
                    </div>
                    <div>
                      <span className="font-medium">TPV Mensual:</span> ${seller.tpv.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MPCardContent>
      </MPCard>

      {/* Configuración de Escala */}
      {searchResults.length > 0 && (
        <MPCard>
          <MPCardHeader>
            <MPCardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              Configura la escala para el seller
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent className="space-y-6">
            {/* TPV Section */}
            <div>
              <Label className="text-sm font-medium text-gray-700">TPV</Label>
              <Input
                placeholder="Ingresa el TPV declarado por el seller"
                value={tpvValue}
                onChange={(e) => setTpvValue(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Opciones de configuración */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Opciones de configuración</Label>
              <RadioGroup value={configOption} onValueChange={handleConfigOptionChange} className="space-y-3">
                {configOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Escala configurada info */}
            {configOption === 'predetermined' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Escala configurada: 5</h4>
                    <p className="text-sm text-blue-800 mb-2">BJ: Link de Pago</p>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>BJ: Link de Pago - 5.29%</div>
                      <div>Dinero en la cuenta: 5.29%</div>
                      <div>Descuentos en cuotas de cheques bancarios: 5.29%</div>
                      <div>Tarjeta de crédito: 5.29%</div>
                      <div>Tarjeta de débito: 5.29%</div>
                      <div>Mercado Crédito: 5.29%</div>
                      <div>Tarjeta prepaga: 5.29%</div>
                      <div>Medios de pago en efectivo: 5.29%</div>
                      <div>Primer recálculo: 01/ago.</div>
                    </div>
                    <MPButton variant="secondary" size="sm" className="mt-3">
                      Ver tasas
                    </MPButton>
                  </div>
                </div>
              </div>
            )}

            {/* Comparación de precios */}
            {showPriceComparison && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <ArrowUpDown className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-900">Comparación de Precios</h4>
                      <p className="text-sm text-orange-700">Precios actuales vs nuevos precios a implementar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      {currentPrices.escala}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-orange-600" />
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {newPrices.escala}
                    </Badge>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
                  <div className="grid grid-cols-4 bg-orange-100 text-orange-900 text-sm font-medium">
                    <div className="p-3 border-r border-orange-200">Método de Pago</div>
                    <div className="p-3 border-r border-orange-200 text-center">Precio Actual</div>
                    <div className="p-3 border-r border-orange-200 text-center">Precio Nuevo</div>
                    <div className="p-3 text-center">Diferencia</div>
                  </div>
                  
                  {priceComparisonItems.map((item, index) => {
                    const currentPrice = currentPrices[item.key as keyof typeof currentPrices] as number;
                    const newPrice = newPrices[item.key as keyof typeof newPrices] as number;
                    const difference = calculatePriceDifference(currentPrice, newPrice);
                    const isReduction = difference < 0;
                    
                    return (
                      <div key={item.key} className={`grid grid-cols-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="p-3 border-r border-gray-200 text-sm text-gray-900">
                          {item.label}
                        </div>
                        <div className="p-3 border-r border-gray-200 text-center text-sm font-medium text-red-600">
                          {currentPrice}%
                        </div>
                        <div className="p-3 border-r border-gray-200 text-center text-sm font-medium text-green-600">
                          {newPrice}%
                        </div>
                        <div className="p-3 text-center">
                          <div className={`inline-flex items-center gap-1 text-sm font-medium ${
                            isReduction ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isReduction ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {Math.abs(difference).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-green-900 mb-1">Impacto Positivo</h5>
                      <p className="text-sm text-green-800">
                        La nueva configuración de precios representa una <strong>reducción promedio del 24.3%</strong> en las comisiones, 
                        lo que mejorará significativamente la rentabilidad del seller SMB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 mb-1">Información Adicional</h5>
                      <p className="text-sm text-blue-800">
                        Los nuevos precios entrarán en vigencia inmediatamente después de la confirmación. 
                        El primer recálculo se realizará según la configuración seleccionada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MPCardContent>
        </MPCard>
      )}

      {/* Periodo de vigencia */}
      {searchResults.length > 0 && (
        <MPCard>
          <MPCardHeader>
            <MPCardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Periodo de Vigencia
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Fecha de Inicio *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  Fecha de Fin *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2"
                  min={startDate} // La fecha de fin no puede ser anterior a la de inicio
                  required
                />
              </div>
            </div>

            {/* Mostrar duración calculada si ambas fechas están seleccionadas */}
            {startDate && endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Duración del acuerdo: {
                      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                    } días
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700">Razón</Label>
              <Input
                id="reason"
                placeholder="Motivo del acuerdo SMB..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2"
                required
              />
            </div>
          </MPCardContent>
        </MPCard>
      )}

      {/* Botones de acción */}
      {searchResults.length > 0 && (
        <div className="flex justify-end space-x-3">
          <MPButton variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancelar
          </MPButton>
          <MPButton 
            onClick={handleAddSeller}
            disabled={!custId || !reason || !startDate || !endDate || (configOption === 'declared' && !tpvValue)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Seller SMB
          </MPButton>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Seller SMB Agregado Exitosamente
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Seller agregado a la audiencia SMB!
            </h3>
            <p className="text-gray-600 mb-6">
              El seller {custId} ha sido agregado exitosamente con la configuración de pricing SMB.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Resumen de la configuración:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>CUST ID:</strong> {custId}</div>
                <div><strong>Configuración:</strong> {configOptions.find(opt => opt.value === configOption)?.label}</div>
                {configOption === 'declared' && tpvValue && (
                  <div><strong>TPV Declarado:</strong> ${tpvValue}</div>
                )}
                {configOption === 'predetermined' && (
                  <div><strong>Escala:</strong> Predeterminada (Escala 5)</div>
                )}
                <div><strong>Fecha de inicio:</strong> {startDate ? new Date(startDate).toLocaleDateString('es-ES') : 'No especificada'}</div>
                <div><strong>Fecha de fin:</strong> {endDate ? new Date(endDate).toLocaleDateString('es-ES') : 'No especificada'}</div>
                {startDate && endDate && (
                  <div><strong>Duración:</strong> {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} días</div>
                )}
                <div><strong>Razón:</strong> {reason}</div>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <MPButton 
                variant="secondary"
                onClick={() => setCurrentStep(1)}
              >
                Agregar Otro Seller
              </MPButton>
              <MPButton 
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Finalizar
              </MPButton>
            </div>
          </div>
        </MPCardContent>
      </MPCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4 shadow-lg">
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
              <div>
                <h1 className="text-xl font-semibold">Flujo de Acuerdos SMB</h1>
                <p className="text-sm text-green-100">Paso {currentStep} de 2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Agregar Seller</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Confirmación</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </div>
    </div>
  );
}
