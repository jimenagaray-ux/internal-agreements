'use client'

import React, { useState } from 'react';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { MPButton } from '@/components/ui/mp-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Upload,
  FileText,
  Save,
  X
} from 'lucide-react';

interface Agreement {
  id: string;
  nombre: string;
}

interface UploadSellersListProps {
  agreement: Agreement;
  onBack: () => void;
}

export default function UploadSellersList({ agreement, onBack }: UploadSellersListProps) {
  const [reason, setReason] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const actions = [
    { value: 'add', label: 'Agregar sellers' },
    { value: 'remove', label: 'Remover sellers' },
    { value: 'update', label: 'Actualizar sellers' },
    { value: 'replace', label: 'Reemplazar lista completa' }
  ];

  const siteIds = [
    { value: 'MLA', label: 'MLA - Argentina' },
    { value: 'MLB', label: 'MLB - Brasil' },
    { value: 'MLC', label: 'MLC - Chile' },
    { value: 'MLM', label: 'MLM - México' },
    { value: 'MLU', label: 'MLU - Uruguay' },
    { value: 'MLC0', label: 'MLC0 - Colombia' }
  ];

  const approvers = [
    { value: 'juan.perez', label: 'Juan Pérez - Revenue Manager' },
    { value: 'maria.gonzalez', label: 'María González - Finance Manager' },
    { value: 'carlos.rodriguez', label: 'Carlos Rodríguez - Operations Lead' },
    { value: 'ana.martin', label: 'Ana Martín - Director' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Por favor selecciona un archivo CSV válido');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Por favor arrastra un archivo CSV válido');
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSave = async () => {
    // Validar campos obligatorios
    const missingFields = [];
    if (!reason.trim()) missingFields.push('Razón');
    if (!selectedAction) missingFields.push('Acción');
    if (!selectedSiteId) missingFields.push('Site ID');
    if (!selectedApprover) missingFields.push('Aprobador');
    if (!selectedFile) missingFields.push('Archivo CSV');

    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos obligatorios:\n• ${missingFields.join('\n• ')}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular procesamiento del archivo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert(`Listado de sellers procesado exitosamente:
- Acción: ${actions.find(a => a.value === selectedAction)?.label}
- Site: ${siteIds.find(s => s.value === selectedSiteId)?.label}
- Archivo: ${selectedFile!.name}
- Enviado a: ${approvers.find(a => a.value === selectedApprover)?.label}`);
      
      onBack();
    } catch (error) {
      alert('Error al procesar el archivo. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Nuevo Archivo</h1>
              <p className="text-gray-600 mt-1">{agreement.nombre} - {agreement.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Razón */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
              Razón
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe la razón para cargar este listado de sellers..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Acción */}
            <div>
              <Label htmlFor="action" className="text-sm font-medium text-gray-700 mb-2 block">
                Acción
              </Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Site ID */}
            <div>
              <Label htmlFor="site-id" className="text-sm font-medium text-gray-700 mb-2 block">
                Site ID
              </Label>
              <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {siteIds.map((site) => (
                    <SelectItem key={site.value} value={site.value}>
                      {site.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aprobador */}
            <div>
              <Label htmlFor="approver" className="text-sm font-medium text-gray-700 mb-2 block">
                Aprobador
              </Label>
              <Select value={selectedApprover} onValueChange={setSelectedApprover}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {approvers.map((approver) => (
                    <SelectItem key={approver.value} value={approver.value}>
                      {approver.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Archivo */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4 block">
              Archivo
            </Label>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-lg font-medium text-green-900">{selectedFile.name}</p>
                      <p className="text-sm text-green-700">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <MPButton
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </MPButton>
                  </div>
                  <p className="text-sm text-green-600">
                    ✓ Archivo CSV cargado correctamente
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg text-gray-700 mb-2">
                      📁 <span className="text-blue-600 underline cursor-pointer">Seleccionar</span> o arrastrar el archivo aquí
                    </p>
                    <p className="text-sm text-gray-500">
                      Hasta 1 archivo con extensión .csv
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <MPButton
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Seleccionar archivo
                  </MPButton>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Formato esperado del CSV:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>Columna 1:</strong> seller_id (obligatorio)</p>
                  <p>• <strong>Columna 2:</strong> email (opcional)</p>
                  <p>• <strong>Columna 3:</strong> categoria (opcional)</p>
                  <p>• <strong>Ejemplo:</strong> 123456789,seller@email.com,tecnologia</p>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-start space-x-4 pt-6 border-t border-gray-200">
            <MPButton
              variant="secondary"
              onClick={onBack}
              disabled={isLoading}
              className="px-6"
            >
              Vuelve
            </MPButton>
            <MPButton
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 ${
                (!reason.trim() || !selectedAction || !selectedSiteId || !selectedApprover || !selectedFile) && !isLoading
                  ? 'opacity-75 cursor-not-allowed' 
                  : ''
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Procesando...' : 'Salvar'}
            </MPButton>
          </div>
        </div>
      </div>
    </div>
  );
} 