# Decisiones de Diseño - Internal Agreements v0

## Resumen Ejecutivo
Este documento justifica las decisiones de diseño tomadas para el prototipo v0 del módulo "Internal Agreements" de Mercado Pago.

## Jerarquía de Información

### Dashboard Principal
- **KPIs prominentes**: Los 4 indicadores clave (TPV, Reglas Activas, Próximas a Vencer, Rentabilidad) se ubican en la parte superior para visibilidad inmediata
- **Filtros contextuales**: Buscador y filtro por tipo de acuerdo ubicados antes de la lista para facilitar la navegación
- **Lista de acuerdos**: Formato de tarjetas expandidas que muestran información crítica sin necesidad de hacer clic

### Flujo de Creación
- **Wizard de 4 pasos**: Progreso visual claro con barra de progreso y navegación paso a paso
- **Validaciones en tiempo real**: Feedback inmediato para reducir errores y mejorar la experiencia
- **Simulación antes de confirmar**: Paso final que muestra impacto proyectado para toma de decisiones informada

## Patrones de Diseño Elegidos

### Navegación
- **Sidebar fijo**: Menú lateral siempre visible para acceso rápido a secciones principales
- **Breadcrumbs implícitos**: Botones "Volver" contextuales en lugar de breadcrumbs tradicionales
- **Estados de navegación**: Indicadores visuales claros del estado actual

### Componentes
- **Cards para agrupación**: Contenido relacionado agrupado en tarjetas para mejor escaneabilidad
- **Tabs para detalles**: Organización de información compleja en pestañas (Resumen, Audiencia, Historial, Performance)
- **Badges para estados**: Identificación rápida de tipos y estados de acuerdos

### Feedback Visual
- **Colores semánticos**: Verde para éxito/activo, Amarillo para advertencias, Rojo para errores/crítico
- **Iconografía consistente**: Lucide React para mantener coherencia visual
- **Estados de carga**: Placeholders y skeletons para mejor percepción de performance

## Supuestos para v0

### Datos y Contenido
- **Mock data realista**: Números y nombres representativos del contexto de Mercado Pago
- **Escenarios típicos**: 3-4 tipos de acuerdos más comunes según el PRD
- **Estados variados**: Combinación de acuerdos activos, pausados y próximos a vencer

### Funcionalidad
- **Flujo completo de creación**: Todos los pasos implementados pero sin persistencia real
- **Validaciones básicas**: Reglas de negocio fundamentales implementadas en frontend
- **Simulación estática**: Cálculos de rentabilidad con fórmulas simplificadas

### Responsive Design
- **Desktop first**: Optimizado para uso en escritorio (principal audiencia)
- **Breakpoints estándar**: Adaptación a tablet y móvil para casos de uso secundarios
- **Componentes flexibles**: Grid system que se adapta a diferentes tamaños de pantalla

## Consideraciones Técnicas

### Performance
- **Componentes optimizados**: Uso de React hooks para estado local y evitar re-renders innecesarios
- **Lazy loading**: Preparado para implementar carga diferida de datos pesados
- **Caching strategy**: Estructura preparada para implementar cache de consultas frecuentes

### Accesibilidad
- **Contraste adecuado**: Colores que cumplen WCAG 2.1 AA
- **Navegación por teclado**: Todos los elementos interactivos accesibles via teclado
- **Screen readers**: Textos alternativos y labels apropiados

### Escalabilidad
- **Componentes reutilizables**: Arquitectura modular para facilitar mantenimiento
- **Tipado fuerte**: TypeScript para mejor developer experience y menos errores
- **Patrones consistentes**: Estructura repetible para nuevas funcionalidades

## Próximos Pasos Recomendados

1. **Validación con usuarios**: Testing de usabilidad con equipos comerciales
2. **Integración con APIs**: Conexión con servicios backend reales
3. **Refinamiento visual**: Ajustes de spacing, tipografía y colores según brand guidelines
4. **Optimización mobile**: Mejoras específicas para experiencia móvil
5. **Métricas y analytics**: Implementación de tracking para optimización continua
