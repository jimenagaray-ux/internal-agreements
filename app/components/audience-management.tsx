'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft,
  Users,
  Upload,
  Download,
  Eye,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Filter,
  Search,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Group
} from 'lucide-react';

interface Agreement {
  id: string;
  nombre: string;
  area: string;
  estado: string;
}

interface AudienceConfig {
  tipo: 'no-audience' | 'defined-sellers' | 'defined-group' | 'dynamic';
  descripcion: string;
  criterios: any[];
  estadisticas: {
    totalSellers: number;
    sellerActivos: number;
    tpvPromedio: string;
    ultimaActualizacion: string;
  };
}

interface AudienceManagementProps {
  agreement: Agreement;
  onBack: () => void;
  onAddSellerManual?: (agreement: Agreement) => void;
  onUploadSellersList?: (agreement: Agreement) => void;
}

export default function AudienceManagement({ agreement, onBack, onAddSellerManual, onUploadSellersList }: AudienceManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [audienceConfig, setAudienceConfig] = useState<AudienceConfig>({
    tipo: 'no-audience',
    descripcion: 'Sin audiencia inicial - Se completará la audiencia luego de la creación del internal agreements',
    criterios: [],
    estadisticas: {
      totalSellers: 0,
      sellerActivos: 0,
      tpvPromedio: '$0',
      ultimaActualizacion: new Date().toLocaleDateString('es-ES')
    }
  });

  const [tempConfig, setTempConfig] = useState<AudienceConfig>(audienceConfig);

  // Mock data para sellers y grupos
  const mockSellers = [
    { id: 'SELL001', nombre: 'TechStore SA', tpv: '$150.000', estado: 'Activo', categoria: 'Tecnología' },
    { id: 'SELL002', nombre: 'FashionPlus', tpv: '$89.500', estado: 'Activo', categoria: 'Moda' },
    { id: 'SELL003', nombre: 'HomeDecor', tpv: '$67.200', estado: 'Pausado', categoria: 'Hogar' },
    { id: 'SELL004', nombre: 'SportZone', tpv: '$234.100', estado: 'Activo', categoria: 'Deportes' },
  ];

  const mockGroups = [
    { id: 'group1', nombre: 'Sellers Premium', sellers: 45, tpvPromedio: '$125.000' },
    { id: 'group2', nombre: 'Sellers Nuevos', sellers: 23, tpvPromedio: '$45.000' },
    { id: 'group3', nombre: 'Sellers Alto Volumen', sellers: 12, tpvPromedio: '$350.000' },
    { id: 'group4', nombre: 'Sellers Tecnología', sellers: 67, tpvPromedio: '$89.500' },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAudienceConfig(tempConfig);
    setIsEditing(false);
    setIsLoading(false);
    alert('Configuración de audiencia guardada exitosamente');
  };

  const handleCancel = () => {
    setTempConfig(audienceConfig);
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simular procesamiento del archivo
      alert(`Archivo ${file.name} cargado. Se procesarán los sellers.`);
    }
  };

  const handleExportAudience = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Audiencia exportada exitosamente');
    setIsLoading(false);
  };

  const getAudienceTypeLabel = (tipo: string) => {
    const labels = {
      'no-audience': 'Sin audiencia inicial',
      'defined-sellers': 'Lista específica de sellers',
      'defined-group': 'Grupos predefinidos',
      'dynamic': 'Audiencia dinámica'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const renderAudienceConfiguration = () => {
    if (!isEditing) {
      return (
        <MPCard>
          <MPCardHeader>
            <MPCardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Configuración Actual
              </div>
              <MPButton
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </MPButton>
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Tipo de Audiencia</Label>
              <p className="text-lg font-semibold text-gray-900">{getAudienceTypeLabel(audienceConfig.tipo)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Descripción</Label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{audienceConfig.descripcion}</p>
            </div>
            {audienceConfig.criterios.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Criterios Configurados</Label>
                <div className="space-y-2 mt-2">
                  {audienceConfig.criterios.map((criterio, index) => (
                    <div key={index} className="flex items-center p-2 bg-blue-50 rounded-md">
                      <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-900">{criterio.descripcion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </MPCardContent>
        </MPCard>
      );
    }

    return (
      <MPCard>
        <MPCardHeader>
          <MPCardTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-green-600" />
            Editar Configuración
          </MPCardTitle>
        </MPCardHeader>
        <MPCardContent className="space-y-6">
          {/* Selector de tipo de audiencia */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Selecciona el tipo de audiencia
            </Label>
            <RadioGroup
              value={tempConfig.tipo}
              onValueChange={(value) => setTempConfig({ 
                ...tempConfig, 
                tipo: value as AudienceConfig['tipo'] 
              })}
            >
              <div className="space-y-3">
                <MPCard className={`p-4 cursor-pointer ${tempConfig.tipo === 'no-audience' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-audience" id="no-audience" />
                    <Label htmlFor="no-audience" className="font-medium">Sin audiencia inicial</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    Se completará la audiencia luego de la creación del internal agreements
                  </p>
                </MPCard>

                <MPCard className={`p-4 cursor-pointer ${tempConfig.tipo === 'defined-sellers' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defined-sellers" id="defined-sellers" />
                    <Label htmlFor="defined-sellers" className="font-medium">Lista específica de sellers</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    Subir archivo CSV con IDs de sellers específicos
                  </p>
                </MPCard>

                <MPCard className={`p-4 cursor-pointer ${tempConfig.tipo === 'defined-group' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defined-group" id="defined-group" />
                    <Label htmlFor="defined-group" className="font-medium">Grupos predefinidos</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    Seleccionar grupos existentes de sellers
                  </p>
                </MPCard>


              </div>
            </RadioGroup>
          </div>

          {/* Configuración específica según el tipo */}
          {tempConfig.tipo === 'defined-sellers' && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Cargar lista de sellers</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arrastra y suelta tu archivo CSV aquí</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="seller-csv"
                />
                <label htmlFor="seller-csv">
                  <MPButton variant="secondary" size="sm" className="cursor-pointer">
                    Seleccionar archivo CSV
                  </MPButton>
                </label>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {tempConfig.tipo === 'defined-group' && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Seleccionar grupos</Label>
              <div className="space-y-3">
                {mockGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox id={group.id} />
                    <div className="flex-1">
                      <Label htmlFor={group.id} className="font-medium">{group.nombre}</Label>
                      <p className="text-sm text-gray-600">
                        {group.sellers} sellers • TPV promedio: {group.tpvPromedio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tempConfig.tipo === 'dynamic' && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Configurar criterios dinámicos</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minTPV" className="text-sm">TPV mínimo mensual</Label>
                  <Input id="minTPV" type="number" placeholder="100000" />
                </div>
                <div>
                  <Label htmlFor="maxTPV" className="text-sm">TPV máximo mensual</Label>
                  <Input id="maxTPV" type="number" placeholder="5000000" />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm">Categoría de negocio</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                      <SelectItem value="moda">Moda</SelectItem>
                      <SelectItem value="hogar">Hogar</SelectItem>
                      <SelectItem value="deportes">Deportes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region" className="text-sm">Región</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar región" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="norte">Norte</SelectItem>
                      <SelectItem value="sur">Sur</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="todo">Todo el país</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Descripción personalizada */}
          <div>
            <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
              Descripción personalizada
            </Label>
            <Textarea
              id="descripcion"
              value={tempConfig.descripcion}
              onChange={(e) => setTempConfig({ ...tempConfig, descripcion: e.target.value })}
              placeholder="Describe la configuración de audiencia..."
              rows={3}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3 pt-4 border-t">
            <MPButton
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </MPButton>
            <MPButton
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </MPButton>
          </div>
        </MPCardContent>
      </MPCard>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
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
              <h1 className="text-3xl font-bold text-gray-900">Gestionar Audiencia</h1>
              <p className="text-gray-600 mt-1">{agreement.nombre} - {agreement.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MPButton
              variant="secondary"
              onClick={handleExportAudience}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Audiencia
            </MPButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuración de Audiencia */}
          <div className="lg:col-span-2 space-y-6">
            {renderAudienceConfiguration()}

            {/* Sellers Actuales (si tiene audiencia) */}
            {audienceConfig.tipo !== 'no-audience' && (
              <MPCard>
                <MPCardHeader>
                  <MPCardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Group className="w-5 h-5 mr-2 text-purple-600" />
                      Sellers en la Audiencia
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar seller..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <MPButton variant="outline" size="sm">
                        <Filter className="w-4 h-4" />
                      </MPButton>
                    </div>
                  </MPCardTitle>
                </MPCardHeader>
                <MPCardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Seller ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">TPV</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockSellers.map((seller) => (
                          <tr key={seller.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-mono text-gray-900">{seller.id}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{seller.nombre}</td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{seller.tpv}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={seller.estado === 'Activo' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {seller.estado}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">{seller.categoria}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-1">
                                <MPButton variant="ghost" size="sm" className="p-1">
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </MPButton>
                                <MPButton variant="ghost" size="sm" className="p-1">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </MPButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </MPCardContent>
              </MPCard>
            )}
          </div>

          {/* Sidebar - Estadísticas */}
          <div className="space-y-6">
            {/* Estadísticas de Audiencia */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Estadísticas
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total de Sellers</p>
                  <p className="text-2xl font-bold text-gray-900">{audienceConfig.estadisticas.totalSellers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sellers Activos</p>
                  <p className="text-2xl font-bold text-green-600">{audienceConfig.estadisticas.sellerActivos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">TPV Promedio</p>
                  <p className="text-lg font-semibold text-gray-900">{audienceConfig.estadisticas.tpvPromedio}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Última actualización: {audienceConfig.estadisticas.ultimaActualizacion}
                  </p>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Estado del Acuerdo */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Estado del Acuerdo
                </MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Estado Actual</p>
                  <Badge variant={agreement.estado === 'Activo' ? 'default' : 'secondary'}>
                    {agreement.estado}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="text-sm text-gray-900">{agreement.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID del Acuerdo</p>
                  <p className="text-sm font-mono text-gray-900">{agreement.id}</p>
                </div>
              </MPCardContent>
            </MPCard>

            {/* Acciones Rápidas */}
            <MPCard>
              <MPCardHeader>
                <MPCardTitle className="text-sm font-medium text-gray-700">Acciones Rápidas</MPCardTitle>
              </MPCardHeader>
              <MPCardContent className="space-y-2">
                <MPButton 
                  variant="secondary" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onAddSellerManual?.(agreement)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Seller Manual
                </MPButton>
                <MPButton 
                  variant="secondary" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onUploadSellersList?.(agreement)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Cargar listado de sellers
                </MPButton>
                <MPButton variant="outline" size="sm" className="w-full justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Validar Audiencia
                </MPButton>
              </MPCardContent>
            </MPCard>
          </div>
        </div>
      </div>
    </div>
  );
} 