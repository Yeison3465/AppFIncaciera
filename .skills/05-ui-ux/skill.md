---
name: ui-ux
description: Directrices del Design System "Aura Financial V2.5" para FinanzasApp. Regula la traducción fiel 1:1 de capturas, bocetos y especificaciones a componentes React Native + Expo tipados, gobernando tokens, componentes atómicos, números tabulares y patrones de interacción.
---

# SKILL: ui-ux — Design System "Aura Financial V2.5" & UI Assembly

## 1. Misión Principal y Protocolo de Traducción Visual

Esta skill rige la capa visual de FinanzasApp (`src/components/` y `src/screens/`). Cuando el usuario proporcione una imagen, captura de pantalla, boceto o descripción funcional:

1. **Análisis y Deconstrucción Atómica:** El agente descompone la vista identificando qué componentes del catálogo oficial de Aura Financial V2.5 resuelven cada bloque.
2. **Prohibición de Estilos Huérfanos:** Queda prohibido improvisar paletas fuera de norma, definir botones genéricos con `<Button>` nativo de React Native o crear estilos desconectados de los tokens.
3. **Fidelidad Estética 1:1:** Toda pantalla debe construirse ensamblando **exclusivamente** los componentes y primitivas estandarizadas de Aura Financial V2.5, respetando geometrías, jerarquías de color y estados interactivos.

---

## 2. Tokens de Diseño Oficiales (Aura Financial V2.5)

### 2.1 Paleta de Color Semántica
```typescript
export const AURA_COLORS = {
  // Fondos y Superficies Principales
  obsidian: '#121316',          // Fondo oscuro primario y botones de máxima jerarquía
  darkCard: '#1E2025',          // Superficie de tarjetas oscuras elevadas y contenedores
  lightSurface: '#F4F4F5',      // Fondo claro neutro de apoyo
  borderSubtle: 'rgba(255, 255, 255, 0.1)', // Bordes sutiles en modo oscuro
  borderLight: '#E4E4E7',       // Bordes en superficies claras

  // Acentos y Estados Financieros
  amberGold: '#F59E0B',         // Acciones destacadas, simulaciones y selección activa
  amberGoldLight: 'rgba(245, 158, 11, 0.15)', // Píldoras y badges de simulación
  emeraldGreen: '#10B981',      // Ingresos, rendimientos positivos y validación exitosa
  emeraldGreenLight: 'rgba(16, 185, 129, 0.15)', // Badges de tasa positiva
  redAlert: '#EF4444',          // Gastos, deudas pendientes y alertas de error
  redAlertLight: '#FEE2E2',     // Fondos para banners y modales de error

  // Tipografía y Textos
  textPrimary: '#FFFFFF',       // Texto sobre fondos obsidian o darkCard
  textDark: '#121316',          // Texto sobre fondos claros o botones acento
  textMuted: '#9CA3AF',         // Textos secundarios, labels y placeholders
  textMutedDark: '#71717A',     // Subtítulos sobre superficie clara
};
```

### 2.2 Tipografía y Regla Obligatoria de Números Tabulares
- **Familia tipográfica base:** Hanken Grotesk (con pesos 400 Regular, 500 Medium, 600 SemiBold, 700 Bold).
- **REGLA OBLIGATORIA DE NÚMEROS FINANCIEROS (`tabular-nums`):**
  TODO texto que renderice montos, dinero en moneda local ($), cuotas, plazos, tasas de interés o porcentajes DEBE incluir en su StyleSheet la propiedad:
```typescript
fontVariant: ['tabular-nums']
```
  Esto garantiza ancho monotemático por dígito, evitando saltos visuales (*layout jitter*) cuando los números se actualizan reactivamente al manipular steppers o simulaciones.

### 2.3 Geometría, Espaciado y Radios de Borde
- **Bordes de Contenedores y Tarjetas (`SurfaceCard`, `Inputs`):** Curvatura suave de 8px a 16px (`borderRadius: 12` o `16`).
- **Bordes de Botones Principales y Menú Flotante:** Radio completo tipo píldora (`borderRadius: 9999`).
- **Altura estándar de Botones y Campos:** 52px de altura mínima de toque para maximizar ergonomía táctil móvil.
- **Márgenes de pantalla horizontales:** `paddingHorizontal: 20` estándar.

---

## 3. Catálogo de Componentes Atómicos Reutilizables
Todo desarrollo visual debe importar y ensamblar los siguientes componentes disponibles en `src/components/`:

```text
src/components/
├── buttons/
│   ├── PrimaryButton.tsx        # Botón Obsidian 52px con flecha de acción
│   ├── AccentButton.tsx         # Botón Amber Gold para simulaciones y proyecciones
│   ├── SecondaryButton.tsx      # Botón Outline / Ghost para exportar o acciones secundarias
│   └── IconButton.tsx           # Botón circular (FAB / Quick Action)
├── inputs/
│   ├── TextInputField.tsx       # Input de texto con floating/inset label y validación
│   └── FinancialStepper.tsx     # Stepper numérico de alta precisión con +/-
├── cards/
│   ├── BlackSovereignHero.tsx   # Tarjeta Hero oscura para resúmenes de crédito/cuota
│   └── SurfaceCard.tsx          # Tarjeta genérica con radio 8-16px
├── navigation/
│   └── FloatingIslandTabBar.tsx # Barra de navegación suspendida tipo píldora (5 nodos)
└── feedback/
    ├── LoadingState.tsx         # Spinner animado con subtítulo y badge PostgreSQL RLS
    ├── CardSkeleton.tsx         # Esqueleto de carga con pulso neutro
    ├── ErrorBanner.tsx          # Banner de alerta inline descartable
    └── ErrorScreenState.tsx     # Pantalla completa de error con botón de reintento
```

### 3.1 Botones y Acciones de Interacción (`src/components/buttons/`)
1. **`<PrimaryButton />` (Obsidian)**
   - **Visual:** Fondo `#121316`, altura 52px, radio 9999px, texto blanco SemiBold centrado, acompañado de un ícono de flecha (`->` / `ArrowRight`) a la derecha.
   - **Uso:** Call To Action de máxima jerarquía: envíos de formularios, iniciar sesión, confirmar registro o aplicar amortizaciones.
2. **`<AccentButton />` (Amber Gold)**
   - **Visual:** Fondo `#F59E0B`, altura 52px, radio 9999px, texto negro `#121316` Bold, ícono inicial de chispa / calculadora (`Sparkles` o `Calculator`).
   - **Uso:** Hitos financieros clave, ejecuciones de simulación de préstamos, y acciones de alto valor funcional.
3. **`<SecondaryButton />` (Outline / Ghost)**
   - **Visual:** Fondo transparente, borde neutro (`#E4E4E7` o `borderSubtle`), altura 52px, radio 9999px, ícono + texto en Obsidian o blanco.
   - **Uso:** Acciones secundarias como "Exportar Reporte [PDF / CSV]" o cancelar operaciones.
4. **`<IconButton />` (Circular Quick Action / FAB)**
   - **Visual:** Botón completamente circular (48x48 o 56x56 px), con opciones de fondo Obsidian, Amber o Neutro.
   - **Variantes estándar de acción:**
     - `add`: Botón ámbar con ícono `+` (Nuevo Crédito / Nuevo Gasto).
     - `calculate`: Botón obsidian con ícono de calculadora.
     - `share`: Botón outline con ícono de compartir.
     - `adjust`: Botón outline con ícono de sliders/variables.

### 3.2 Inputs y Controles Numéricos (`src/components/inputs/`)
1. **`<TextInputField />` (Inset / Floating Label)**
   - **Estructura visual:** Contenedor con borde suave (12px), label en la parte superior en mayúsculas pequeñas (`fontSize: 10`, `color: textMuted`), input nativo debajo, e ícono a la derecha.
   - **Estados obligatorios:**
     - *Normal / Success:* Borde sutil, ícono de verificación circular verde (`CheckCircle`) en `#10B981` al validar el dato.
     - *Error:* Fondo rojizo suave (`#FEE2E2`), borde `#EF4444`, texto de ayuda inferior en rojo: `"La contraseña debe contener al menos 8 caracteres"`, e ícono de alerta o toggle de visibilidad (`EyeOff`).
2. **`<FinancialStepper />` (Control Numérico de Alta Precisión)**
   - Componente estandarizado para capitales, aportes, plazos y tasas:
   - **Encabezado y Labels:**
     - Soporta prop `labelClassName` para unificar estilos con los títulos de configuración (ej. `text-base font-semibold text-textMutedDark`).
     - Renderizado condicional del encabezado si existe `label`, `badgeText` o `subLabel`.
     - Badge opcional a la derecha (ej. `badgeVariant="amber" | "emerald" | "neutral"`).
   - **Contenedor y Fila Interactiva:**
     - Contenedor tipo pastilla sin bordes rígidos: `bg-gray-100 rounded-xl p-1 h-[54px]`.
     - Botón decremento: `w-11 h-11 rounded-full bg-white items-center justify-center ml-[6px]`, icono `remove` tamaño 19px (`AURA_COLORS.textDark`).
     - Bloque central con monto editable y números tabulares obligatorios (`text-xl font-extrabold text-textDark text-center`, `fontVariant: ['tabular-nums']`).
     - Prefijo opcional (`prefix="$"`) y sufijo opcional (`suffix="%"`).
     - Botón incremento: `w-11 h-11 rounded-full bg-white items-center justify-center mr-[6px]`, icono `add` tamaño 19px (`AURA_COLORS.textDark`).
   - **Valores por defecto en Mockups y Estado Inicial:**
     - Todo valor inicial o de ejemplo ilustrativo en mockups DEBE iniciar en `0` (ej. `value={0}`, `$0.00` o `0%`).

### 3.3 Tarjetas de Superficie, Métricas y Bloques Hero (`src/components/cards/`)
1. **`<BlackSovereignHero />` (Hero de Resultados Financieros)**
   - Contenedor premium para visualizar el resultado central de préstamos y simulaciones:
   - **Fondo y Forma:** Fondo `#121316`, radio de borde 16px, padding interno de 20px, borde perimetral sutil (`rgba(255,255,255,0.08)`).
   - **Cabecera de la Tarjeta:**
     - Ícono de escudo dorado (`ShieldCheck`) + Título en mayúsculas doradas/blancas (`BLACK SOVEREIGN HERO`).
     - Badge derecho con borde y fondo oscuro que muestra la tasa por defecto: `Tasa 0.0% E.A.`.
   - **Cuerpo Central:**
     - Etiqueta tenue: `CUOTA PERIÓDICA FIJA ESTIMADA`.
     - Valor monetario destacado en Amber Gold o Blanco con número tabular: `$ 0.00 / mes`.
   - **Pie de Tarjeta (Sub-métricas en 2 columnas):**
     - Columna 1: Capital Solicitado -> `$ 0.00`.
     - Columna 2: Total Intereses -> `$ 0.00` en ámbar.
2. **Tarjetas Métricas de Comparación (2 Columnas sin Borde)**
   - Bloques emparejados para resultados financieros (ej. Capital Aportado vs. Rendimiento Ganado):
   - **Contenedores:** `bg-gray-50 rounded-2xl p-4` SIN bordes de color (`border-0` / sin `border-gray-100`).
   - **Columna Izquierda (Capital / Base):**
     - Punto indicador gris: `w-2 h-2 rounded-full bg-gray-500`.
     - Título: `text-[13px] font-medium text-gray-700` (`Capital Aportado`).
     - Monto: `text-[22px] font-extrabold text-textDark` con valor por defecto `$0.00`.
     - Subtexto: `text-xs text-textMutedDark mt-1` con porcentaje por defecto `0.0% del total`.
   - **Columna Derecha (Rendimiento / Ganancia Verde):**
     - Punto indicador verde: `w-2 h-2 rounded-full bg-emerald-500`.
     - Título en verde: `text-[13px] font-medium text-emerald-600` (`Rendimiento Ganado`).
     - Monto en verde: `text-[22px] font-extrabold text-emerald-600` con valor por defecto `+$0.00`.
     - Subtexto en verde: `text-xs text-emerald-600 mt-1` con porcentaje por defecto `0.0% interés puro`.
3. **`<SurfaceCard />` (Contenedor Base)**
   - Contenedor con `borderRadius: 16`, fondo `#1E2025` (en modo oscuro) o blanco con sombra suave en modo claro. Provee padding configurable (16px a 20px) para agrupar formularios y listados.

### 3.4 Navegación: Tab Bar Flotante (`src/components/navigation/`)
**`<FloatingIslandTabBar />` (Floating Island Dock)**
- **Concepto:** Barra suspendida fija en la parte inferior de la pantalla sobre el margen inferior seguro (`bottom: 24`).
- **Dimensiones y Estilo:**
  - Altura: 60px.
  - Geometría: Forma de píldora (`borderRadius: 9999`).
  - Fondo: Obsidian `#121316` con borde sutil `rgba(255, 255, 255, 0.1)` y elevación/sombra profunda.
- **5 Nodos de Navegación Táctiles:**
  1. `Calc` (Interés y tasas / Fase 1).
  2. `Préstamos` (Simulador y amortización / Fase 2).
  3. `Tarjetas` (Líneas de crédito y diferidos / Fase 4).
  4. `Flujos` (Ingresos, gastos y deudas / Fase 5).
  5. `Perfil` (Configuración de moneda y sesión / Fase 3).
- **Estado Activo:** El ícono y label del tab seleccionado se iluminan en Amber Gold (`#F59E0B`), acompañado de un micro-indicador puntual (dot luminoso) debajo del ícono. Nodos inactivos se muestran en gris tenue (`#9CA3AF`).

### 3.5 Estados de Carga y Manejo de Errores (`src/components/feedback/`)
1. **`<LoadingState />` & `<CardSkeleton />`**
   - **Indicador activo:** Spinner circular con animación fluida en acento ámbar.
   - **Feedback explicativo:** Texto de estado contextual (ej. *"Sincronizando Simulación... Calculando tabla de amortización francesa"*).
   - **Badge de Infraestructura:** Badge técnico tenue a la derecha: `PostgreSQL RLS`.
   - **Esqueleto (Skeleton):** Bloques rectangulares con esquinas redondeadas (`borderRadius: 8`) y animación de opacidad sutil para simular la carga de tablas y tarjetas.
2. **`<ErrorBanner />` (Alerta Inline)**
   - **Contenedor:** Fondo rosado tenue (`#FEE2E2`), borde `#EF4444` de 1px, `borderRadius: 12`.
   - **Contenido:** Ícono de advertencia circular rojo (`AlertCircle`), título en negrita (*Credenciales no reconocidas*), texto descriptivo claro y botón de cierre `x` a la derecha.
3. **`<ErrorScreenState />` (Pantalla de Error / Fallo de Conexión)**
   - **Iconografía:** Círculo suave en tono pastel rojizo con ícono central de desconexión / alerta (`WifiOff` o `AlertTriangle`).
   - **Mensaje:** Título de 18px SemiBold (*"Error de Conexión en Cálculos"*) y texto secundario explicativo (*"No se pudo sincronizar el plan de amortización con el servidor seguro. Revisa tu red."*).
   - **Acción de rescate:** Inclusión obligatoria de un `<PrimaryButton />` configurado con la etiqueta *Reintentar Conexión*.

---

## 4. Reglas Estrictas de Ensamblaje Visual
Como agente de diseño e interfaz:
1. **NO usar `<Button>` nativo de React Native:** Utiliza exclusivamente `PrimaryButton`, `AccentButton`, `SecondaryButton` o `IconButton`.
2. **NO hardcodear fuentes estándar sin variantes numéricas:** Todo texto financiero debe contener `fontVariant: ['tabular-nums']`.
3. **NO omitir estados de feedback:** Ningún formulario o pantalla puede pasar a producción sin prever visualmente el estado de carga (`LoadingState` / `Skeleton`) y la interfaz de error (`ErrorBanner` o `ErrorScreenState`).
4. **Respetar Safe Areas:** Todo ensamblaje de pantalla utiliza `SafeAreaView` o hooks de insets para evitar solapamientos con la barra de estado y con el `FloatingIslandTabBar` suspendido.
5. **Alineación con el Roadmap:** Solo ensamblar interfaces cuyas entidades de negocio pertenezcan a la fase en desarrollo o a fases previas ya concluidas.

## Stack de UI

FinanzasApp utiliza Tailwind CSS adaptado a React Native para la construcción de interfaces.

Tecnologías:

- React Native
- Expo
- TypeScript
- Expo Router
- Tailwind para React Native

Reglas:

- Utilizar las clases de Tailwind para estilos siempre que sea posible.
- Evitar crear StyleSheet manuales cuando Tailwind pueda resolver el estilo.
- Mantener los estilos visuales consistentes con el Design System de FinanzasApp.
- No introducir otra solución de styling sin justificarla.
- Los estilos dinámicos o casos que Tailwind no pueda resolver adecuadamente pueden utilizar APIs de React Native.
- No mezclar arbitrariamente diferentes sistemas de estilos dentro del mismo componente.
