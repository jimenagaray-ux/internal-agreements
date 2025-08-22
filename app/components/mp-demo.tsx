"use client"

import { useState } from 'react'
import { MPButton } from '@/components/ui/mp-button'
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle, MPCardDescription, MPCardFooter } from '@/components/ui/mp-card'
import { MPPaymentMethods, MPPaymentMethodsInline, PaymentMethod } from '@/components/ui/mp-payment-methods'
import { Badge } from '@/components/ui/badge'
import { CreditCard, DollarSign, Users, TrendingUp, Star } from 'lucide-react'

export function MPDemo() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'visa',
      name: 'Visa',
      type: 'credit_card',
      enabled: true,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      type: 'credit_card',
      enabled: true,
    },
    {
      id: 'mercadopago',
      name: 'MercadoPago',
      type: 'digital_wallet',
      enabled: true,
    },
    {
      id: 'pix',
      name: 'PIX',
      type: 'bank_transfer',
      enabled: true,
    },
    {
      id: 'bank_transfer',
      name: 'Transferencia Bancaria',
      type: 'bank_transfer',
      enabled: false,
    },
  ]

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 mp-heading">
          Componentes MercadoPago
        </h1>

        {/* Sección de Botones */}
        <MPCard variant="elevated" padding="lg" className="mb-8">
          <MPCardHeader>
            <MPCardTitle>Botones con Estilo MercadoPago</MPCardTitle>
            <MPCardDescription>
              Diferentes variantes de botones usando los colores oficiales de MercadoPago
            </MPCardDescription>
          </MPCardHeader>
          <MPCardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MPButton variant="primary" size="md">
                <CreditCard className="w-4 h-4 mr-2" />
                Primario
              </MPButton>
              <MPButton variant="secondary" size="md">
                <DollarSign className="w-4 h-4 mr-2" />
                Secundario
              </MPButton>
              <MPButton variant="success" size="md">
                <TrendingUp className="w-4 h-4 mr-2" />
                Éxito
              </MPButton>
              <MPButton variant="warning" size="md">
                <Star className="w-4 h-4 mr-2" />
                Advertencia
              </MPButton>
              <MPButton variant="error" size="md">
                Error
              </MPButton>
              <MPButton variant="ghost" size="md">
                <Users className="w-4 h-4 mr-2" />
                Ghost
              </MPButton>
            </div>
          </MPCardContent>
        </MPCard>

        {/* Sección de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MPCard variant="default" padding="lg" hover>
            <MPCardHeader>
              <MPCardTitle>Tarjeta Estándar</MPCardTitle>
              <MPCardDescription>
                Tarjeta básica con hover effect
              </MPCardDescription>
            </MPCardHeader>
            <MPCardContent>
              <p className="text-gray-600 mp-body">
                Esta es una tarjeta estándar con el estilo visual de MercadoPago.
              </p>
            </MPCardContent>
            <MPCardFooter>
              <Badge className="mp-badge">Standard</Badge>
            </MPCardFooter>
          </MPCard>

          <MPCard variant="elevated" padding="lg" hover>
            <MPCardHeader>
              <MPCardTitle>Tarjeta Elevada</MPCardTitle>
              <MPCardDescription>
                Tarjeta con sombra más pronunciada
              </MPCardDescription>
            </MPCardHeader>
            <MPCardContent>
              <p className="text-gray-600 mp-body">
                Esta tarjeta tiene una sombra más elevada para destacar contenido importante.
              </p>
            </MPCardContent>
            <MPCardFooter>
              <Badge className="bg-mp-blue text-white">Elevada</Badge>
            </MPCardFooter>
          </MPCard>
        </div>

        {/* Sección de Métodos de Pago */}
        <MPCard variant="outlined" padding="lg" className="mb-8">
          <MPCardHeader>
            <MPCardTitle>Métodos de Pago</MPCardTitle>
            <MPCardDescription>
              Selecciona tu método de pago preferido
            </MPCardDescription>
          </MPCardHeader>
          <MPCardContent>
            <MPPaymentMethods
              methods={paymentMethods}
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={setSelectedPaymentMethod}
              showIcons={true}
              compact={false}
            />
          </MPCardContent>
        </MPCard>

        {/* Sección de Métodos de Pago Inline */}
        <MPCard variant="filled" padding="lg" className="mb-8">
          <MPCardHeader>
            <MPCardTitle>Métodos de Pago - Vista Compacta</MPCardTitle>
            <MPCardDescription>
              Versión inline de los métodos de pago
            </MPCardDescription>
          </MPCardHeader>
          <MPCardContent>
            <MPPaymentMethodsInline
              methods={paymentMethods}
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={setSelectedPaymentMethod}
            />
          </MPCardContent>
        </MPCard>

        {/* Sección de Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mp-alert">
            <h4 className="font-semibold mb-2">Información</h4>
            <p className="mp-body">Esta es una alerta informativa con el estilo de MercadoPago.</p>
          </div>
          
          <div className="mp-alert-success">
            <h4 className="font-semibold mb-2">Éxito</h4>
            <p className="mp-body">¡Operación completada exitosamente!</p>
          </div>
          
          <div className="mp-alert-warning">
            <h4 className="font-semibold mb-2">Advertencia</h4>
            <p className="mp-body">Ten en cuenta esta información importante.</p>
          </div>
          
          <div className="mp-alert-error">
            <h4 className="font-semibold mb-2">Error</h4>
            <p className="mp-body">Ha ocurrido un error en la operación.</p>
          </div>
        </div>

        {/* Sección de Gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="mp-gradient-blue text-white p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Gradiente Azul</h3>
            <p className="mp-body">Colores principales de MercadoPago</p>
          </div>
          
          <div className="mp-gradient-yellow text-gray-900 p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Gradiente Amarillo</h3>
            <p className="mp-body">Colores secundarios de MercadoPago</p>
          </div>
          
          <div className="mp-gradient-green text-white p-6 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Gradiente Verde</h3>
            <p className="mp-body">Colores de éxito de MercadoPago</p>
          </div>
        </div>

        {/* Información del método seleccionado */}
        {selectedPaymentMethod && (
          <MPCard variant="elevated" padding="lg" className="mt-8">
            <MPCardHeader>
              <MPCardTitle>Método Seleccionado</MPCardTitle>
            </MPCardHeader>
            <MPCardContent>
              <p className="mp-body">
                Has seleccionado: <strong>{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</strong>
              </p>
            </MPCardContent>
          </MPCard>
        )}
      </div>
    </div>
  )
} 