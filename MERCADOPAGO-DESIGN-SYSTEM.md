# 🎨 Sistema de Diseño MercadoPago

## ✨ Implementación Completada

Se ha integrado exitosamente un **Sistema de Diseño Visual** inspirado en MercadoPago al proyecto Internal Agreements, incorporando componentes visuales, colores oficiales y la tipografía característica de la marca.

---

## 🏗️ **Componentes Implementados**

### 1. **MPButton** - Botones Oficiales
Botones con los colores y estilos oficiales de MercadoPago:

```tsx
<MPButton variant="primary" size="md">
  <CreditCard className="w-4 h-4 mr-2" />
  Botón Primario
</MPButton>

<MPButton variant="secondary" size="lg" loading>
  Cargando...
</MPButton>

<MPButton variant="success" fullWidth>
  ¡Éxito!
</MPButton>
```

**Variantes Disponibles:**
- `primary` - Azul MercadoPago (#009EE3)
- `secondary` - Borde azul con fondo blanco
- `success` - Verde MercadoPago (#00A650)
- `warning` - Amarillo MercadoPago (#FFC107)
- `error` - Rojo MercadoPago (#CE0E2D)
- `ghost` - Transparente con texto azul

### 2. **MPCard** - Tarjetas Estilizadas
Tarjetas con el estilo visual de MercadoPago:

```tsx
<MPCard variant="elevated" padding="lg" hover>
  <MPCardHeader>
    <MPCardTitle>Título de la Tarjeta</MPCardTitle>
    <MPCardDescription>
      Descripción del contenido
    </MPCardDescription>
  </MPCardHeader>
  <MPCardContent>
    <p>Contenido principal</p>
  </MPCardContent>
  <MPCardFooter>
    <Badge className="bg-mp-blue text-white">Etiqueta</Badge>
  </MPCardFooter>
</MPCard>
```

**Variantes Disponibles:**
- `default` - Tarjeta estándar
- `outlined` - Solo borde
- `elevated` - Sombra pronunciada
- `filled` - Fondo gris claro

### 3. **MPPaymentMethods** - Métodos de Pago
Componentes para mostrar métodos de pago con iconos oficiales:

```tsx
<MPPaymentMethods
  methods={paymentMethods}
  selectedMethod={selectedMethod}
  onMethodSelect={setSelectedMethod}
  showIcons={true}
  compact={false}
/>

<MPPaymentMethodsInline
  methods={paymentMethods}
  selectedMethod={selectedMethod}
  onMethodSelect={setSelectedMethod}
/>
```

**Incluye iconos para:**
- Visa, Mastercard, MercadoPago
- PIX, Transferencia Bancaria
- Wallets digitales

---

## 🎨 **Colores Oficiales**

### Colores Principales
```css
--mp-blue: #009EE3;        /* Azul principal */
--mp-light-blue: #00A8F5;  /* Azul claro */
--mp-dark-blue: #003DA6;   /* Azul oscuro */
--mp-yellow: #FFC107;      /* Amarillo */
--mp-green: #00A650;       /* Verde */
--mp-red: #CE0E2D;         /* Rojo */
```

### Clases CSS Disponibles
```css
.text-mp-blue { color: #009EE3; }
.bg-mp-blue { background-color: #009EE3; }
.border-mp-blue { border-color: #009EE3; }

.mp-gradient-blue { /* Gradiente azul */ }
.mp-gradient-yellow { /* Gradiente amarillo */ }
.mp-gradient-green { /* Gradiente verde */ }
```

---

## 🔤 **Tipografía**

### Fuente Principal
**Proxima Nova** - La fuente oficial de MercadoPago
```css
font-family: 'Proxima Nova', 'Helvetica Neue', Arial, sans-serif;
```

### Clases de Tipografía
```css
.mp-heading  /* Títulos y encabezados */
.mp-body     /* Texto de cuerpo */
.mp-small    /* Texto pequeño */
```

---

## 🛠️ **Implementación Técnica**

### Archivos Creados
- `lib/mercadopago-theme.ts` - Tema completo con colores y estilos
- `components/ui/mp-button.tsx` - Componente de botones
- `components/ui/mp-card.tsx` - Componente de tarjetas
- `components/ui/mp-payment-methods.tsx` - Componentes de métodos de pago
- `app/components/mp-demo.tsx` - Demostración de componentes

### Configuración CSS
- `app/globals.css` - Estilos globales con variables CSS
- `tailwind.config.ts` - Configuración de Tailwind con colores MP

### Integración con Proyecto
- **Asistente de Precios**: Actualizado con componentes MP
- **Sidebar**: Nueva opción "Componentes MP" para demo
- **Routing**: Soporte para vista de demostración

---

## 🎯 **Uso en el Proyecto**

### Asistente de Precios Mejorado
El asistente de configuración de precios escalonados ahora usa:
- **MPButton** para todas las acciones
- **MPCard** para secciones de contenido
- **Colores oficiales** en iconos y elementos
- **Tipografía Proxima Nova** para mejor legibilidad

### Componentes Disponibles
```tsx
// Importación
import { MPButton } from "@/components/ui/mp-button"
import { MPCard, MPCardContent, MPCardHeader, MPCardTitle } from "@/components/ui/mp-card"
import { MPPaymentMethods } from "@/components/ui/mp-payment-methods"

// Uso
<MPButton variant="primary" size="md">
  Acción Principal
</MPButton>

<MPCard variant="elevated" padding="lg">
  <MPCardHeader>
    <MPCardTitle>Título</MPCardTitle>
  </MPCardHeader>
  <MPCardContent>
    Contenido
  </MPCardContent>
</MPCard>
```

---

## 📱 **Página de Demostración**

Accede a **"Componentes MP"** desde el sidebar para ver:
- ✅ Todos los botones con diferentes variantes
- ✅ Tarjetas con diferentes estilos
- ✅ Métodos de pago interactivos
- ✅ Alertas y notificaciones
- ✅ Gradientes y efectos visuales

---

## 🔧 **Compatibilidad**

### SDK de MercadoPago
- **@mercadopago/sdk-react** instalado
- Compatible con componentes oficiales de MP
- Preparado para integrar Checkout y pagos

### Tecnologías
- **React 19** ✅
- **TypeScript** ✅
- **Tailwind CSS** ✅
- **Next.js 15** ✅

---

## 🚀 **Próximos Pasos**

### Posibles Mejoras
1. **Integración SDK Completa**: Implementar componentes de checkout
2. **Animaciones**: Añadir micro-interacciones
3. **Tema Oscuro**: Variante dark mode
4. **Más Componentes**: Modals, dropdowns, etc.

### Acceso a Andes UI
Si obtenes acceso a la documentación interna de **Andes UI/Fury UI**:
1. Reemplazar componentes custom por oficiales
2. Usar tokens de diseño internos
3. Implementar guidelines específicos

---

## 🎉 **Resultado Final**

✅ **Sistema de diseño completo** con colores oficiales de MercadoPago
✅ **Componentes reutilizables** con tipografía Proxima Nova
✅ **Asistente de precios mejorado** con estilo profesional
✅ **Página de demostración** para testing y desarrollo
✅ **Configuración completa** de Tailwind y CSS
✅ **Compatibilidad total** con el proyecto existente

**¡El proyecto ahora tiene una apariencia profesional y consistente con la marca MercadoPago!** 🎨

---

## 📞 **Acceso a la Aplicación**

1. **Ejecuta:** `npm run dev`
2. **Accede:** `http://localhost:3000`
3. **Explora:** Sidebar → "Componentes MP" para ver la demostración
4. **Usa:** Sidebar → "Asistente de Precios" para la funcionalidad mejorada

¡Disfruta del nuevo sistema de diseño MercadoPago! 🚀 