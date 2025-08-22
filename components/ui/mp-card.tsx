import React from 'react'
import { cn } from '@/lib/utils'

interface MPCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
}

const MPCard = React.forwardRef<HTMLDivElement, MPCardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md', 
    hover = false,
    clickable = false,
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'rounded-lg transition-all duration-200'
    
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm',
      outlined: 'bg-white border border-gray-300',
      elevated: 'bg-white shadow-lg border border-gray-100',
      filled: 'bg-gray-50 border border-gray-200',
    }
    
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    }
    
    const hoverStyles = hover ? 'hover:shadow-xl hover:border-blue-200' : ''
    const clickableStyles = clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''
    
    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
          clickableStyles,
          className
        )}
        ref={ref}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MPCard.displayName = 'MPCard'

// Componente para el header de la tarjeta
const MPCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)

MPCardHeader.displayName = 'MPCardHeader'

// Componente para el título de la tarjeta
const MPCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
)

MPCardTitle.displayName = 'MPCardTitle'

// Componente para la descripción de la tarjeta
const MPCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600', className)}
      {...props}
    >
      {children}
    </p>
  )
)

MPCardDescription.displayName = 'MPCardDescription'

// Componente para el contenido de la tarjeta
const MPCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
)

MPCardContent.displayName = 'MPCardContent'

// Componente para el footer de la tarjeta
const MPCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)

MPCardFooter.displayName = 'MPCardFooter'

export { 
  MPCard, 
  MPCardHeader, 
  MPCardTitle, 
  MPCardDescription, 
  MPCardContent, 
  MPCardFooter 
} 