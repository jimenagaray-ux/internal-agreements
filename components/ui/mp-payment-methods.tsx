import React from 'react'
import { cn } from '@/lib/utils'
import { MPCard, MPCardContent } from './mp-card'

interface PaymentMethod {
  id: string
  name: string
  icon?: string
  type: 'credit_card' | 'debit_card' | 'digital_wallet' | 'bank_transfer' | 'cash'
  enabled?: boolean
}

interface MPPaymentMethodsProps {
  methods: PaymentMethod[]
  selectedMethod?: string
  onMethodSelect?: (methodId: string) => void
  showIcons?: boolean
  compact?: boolean
  className?: string
}

const MPPaymentMethods: React.FC<MPPaymentMethodsProps> = ({
  methods,
  selectedMethod,
  onMethodSelect,
  showIcons = true,
  compact = false,
  className,
}) => {
  const getMethodIcon = (method: PaymentMethod) => {
    // Iconos SVG para los métodos de pago más comunes
    const icons = {
      visa: (
        <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
          <rect width="40" height="24" fill="#1A1F71" rx="4"/>
          <path d="M16.2 7.8h-2.4L12 18h2.4l1.8-10.2zm5.4 0h-2.4L17.4 18H20l1.8-10.2z" fill="white"/>
        </svg>
      ),
      mastercard: (
        <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
          <rect width="40" height="24" fill="#EB001B" rx="4"/>
          <circle cx="15" cy="12" r="6" fill="#FF5F00"/>
          <circle cx="25" cy="12" r="6" fill="#F79E1B"/>
        </svg>
      ),
      mercadopago: (
        <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
          <rect width="40" height="24" fill="#009EE3" rx="4"/>
          <path d="M20 8l-4 8h8l-4-8z" fill="white"/>
        </svg>
      ),
      pix: (
        <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
          <rect width="40" height="24" fill="#32BCAD" rx="4"/>
          <path d="M20 8l-4 4 4 4 4-4-4-4z" fill="white"/>
        </svg>
      ),
      bank_transfer: (
        <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
          <rect width="40" height="24" fill="#6B7280" rx="4"/>
          <path d="M8 10h24v2H8zm0 4h24v2H8zm0 4h16v2H8z" fill="white"/>
        </svg>
      ),
      default: (
        <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
          <rect width="40" height="24" fill="#E5E7EB" rx="4"/>
          <path d="M12 8h16v8H12z" fill="#9CA3AF"/>
        </svg>
      ),
    }
    
    return icons[method.id as keyof typeof icons] || icons.default
  }

  const getMethodTypeIcon = (type: PaymentMethod['type']) => {
    const typeIcons = {
      credit_card: '💳',
      debit_card: '💳',
      digital_wallet: '📱',
      bank_transfer: '🏦',
      cash: '💵',
    }
    
    return typeIcons[type] || '💳'
  }

  return (
    <div className={cn('grid gap-2', compact ? 'grid-cols-2' : 'grid-cols-1', className)}>
      {methods.map((method) => (
        <MPCard
          key={method.id}
          variant={selectedMethod === method.id ? 'elevated' : 'outlined'}
          padding={compact ? 'sm' : 'md'}
          hover={true}
          clickable={method.enabled !== false}
          className={cn(
            'transition-all duration-200',
            selectedMethod === method.id && 'ring-2 ring-blue-500 border-blue-300',
            method.enabled === false && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => {
            if (method.enabled !== false && onMethodSelect) {
              onMethodSelect(method.id)
            }
          }}
        >
          <MPCardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {showIcons && (
                  <div className="flex-shrink-0">
                    {method.icon ? (
                      <img src={method.icon} alt={method.name} className="w-8 h-5 object-contain" />
                    ) : (
                      getMethodIcon(method)
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {method.name}
                    </span>
                    {!showIcons && (
                      <span className="text-lg">
                        {getMethodTypeIcon(method.type)}
                      </span>
                    )}
                  </div>
                  {!compact && (
                    <p className="text-xs text-gray-500 capitalize">
                      {method.type.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>
              
              {selectedMethod === method.id && (
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </MPCardContent>
        </MPCard>
      ))}
    </div>
  )
}

// Componente para mostrar métodos de pago en línea (más compacto)
const MPPaymentMethodsInline: React.FC<MPPaymentMethodsProps> = ({
  methods,
  selectedMethod,
  onMethodSelect,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {methods.map((method) => (
        <button
          key={method.id}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200',
            'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            selectedMethod === method.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
            method.enabled === false && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => {
            if (method.enabled !== false && onMethodSelect) {
              onMethodSelect(method.id)
            }
          }}
          disabled={method.enabled === false}
        >
          {method.icon ? (
            <img src={method.icon} alt={method.name} className="w-6 h-4 object-contain" />
          ) : (
            <div className="w-6 h-4 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs">💳</span>
            </div>
          )}
          <span className="text-sm font-medium">{method.name}</span>
        </button>
      ))}
    </div>
  )
}

export { MPPaymentMethods, MPPaymentMethodsInline }
export type { PaymentMethod } 