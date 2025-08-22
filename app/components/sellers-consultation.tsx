'use client'

import React, { useState } from 'react';
import { MPButton } from '@/components/ui/mp-button';
import { MPCard, MPCardHeader, MPCardTitle, MPCardContent } from '@/components/ui/mp-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Star,
  Eye,
  Download,
  Filter
} from 'lucide-react';

interface SellersConsultationProps {
  onBack: () => void;
  onViewSellerDetail: (seller: Seller) => void;
}

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalSales: number;
  products: number;
  rating: number;
  category: string;
}

export default function SellersConsultation({ onBack, onViewSellerDetail }: SellersConsultationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para sellers
  const mockSellers: Seller[] = [
    {
      id: '12345',
      name: 'Tech Solutions SA',
      email: 'contacto@techsolutions.com',
      phone: '+54 11 4567-8900',
      location: 'Buenos Aires, Argentina',
      registrationDate: '2023-01-15',
      status: 'active',
      totalSales: 2500000,
      products: 150,
      rating: 4.8,
      category: 'Tecnología'
    },
    {
      id: '67890',
      name: 'Moda Express',
      email: 'ventas@modaexpress.com',
      phone: '+54 11 9876-5432',
      location: 'Córdoba, Argentina',
      registrationDate: '2023-03-22',
      status: 'active',
      totalSales: 1800000,
      products: 89,
      rating: 4.5,
      category: 'Moda y Accesorios'
    },
    {
      id: '54321',
      name: 'Hogar & Deco',
      email: 'info@hogardeco.com',
      phone: '+54 11 2345-6789',
      location: 'Rosario, Argentina',
      registrationDate: '2023-02-10',
      status: 'pending',
      totalSales: 950000,
      products: 45,
      rating: 4.2,
      category: 'Hogar y Jardín'
    }
  ];

  const filteredSellers = mockSellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.id.includes(searchTerm) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    setIsLoading(true);
    // Simular búsqueda
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <MPButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </MPButton>
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Consulta de Sellers</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MPButton variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </MPButton>
            <MPButton variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </MPButton>
          </div>
        </div>

        {/* Search Section */}
        <MPCard className="mb-6">
          <MPCardHeader>
            <MPCardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              Buscar Seller
            </MPCardTitle>
          </MPCardHeader>
          <MPCardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">ID, Nombre o Email del Seller</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Ingresa ID, nombre o email del seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <MPButton 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
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
          </MPCardContent>
        </MPCard>

        {/* Results Section */}
        {searchTerm && (
          <MPCard>
            <MPCardHeader>
              <MPCardTitle>
                Resultados de búsqueda ({filteredSellers.length} encontrados)
              </MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              {filteredSellers.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron sellers con los criterios de búsqueda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSellers.map((seller) => (
                    <div
                      key={seller.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onViewSellerDetail(seller)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                            <p className="text-sm text-gray-600">ID: {seller.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(seller.status)}
                          <MPButton variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </MPButton>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{seller.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{seller.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{formatCurrency(seller.totalSales)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{seller.products} productos</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </MPCardContent>
          </MPCard>
        )}


      </div>
    </div>
  );
}
