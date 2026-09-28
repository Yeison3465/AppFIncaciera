# React Native + Expo + TypeScript — FinanzasApp

## 1. Propósito

Esta skill define cómo desarrollar el cliente móvil de FinanzasApp.

Stack principal:

* React Native
* Expo
* Expo Router
* TypeScript
* Supabase

Esta skill se aplica a:

* Pantallas
* Componentes
* Hooks
* Formularios
* Navegación
* Estado
* UI móvil
* Integración con servicios
* Performance
* Accesibilidad
* Testing del cliente

---

# 2. Contexto del proyecto

FinanzasApp es una aplicación móvil de finanzas personales.

El cliente móvil utiliza:

* React Native para la interfaz.
* Expo para desarrollo y tooling.
* Expo Router para navegación.
* TypeScript para tipado.

El backend utiliza:

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)

Entidades principales del dominio:

* Usuario
* TarjetaCredito
* CompraTarjeta
* Deuda
* Pago
* Ingreso
* Gasto
* Categoria

Las reglas financieras pertenecen al dominio y no deben inventarse dentro de los componentes.

---

# 3. Regla principal

Antes de implementar una funcionalidad:

1. Entender el requerimiento.
2. Revisar el contexto del proyecto.
3. Inspeccionar la estructura existente.
4. Revisar componentes, hooks y servicios reutilizables.
5. Revisar las dependencias instaladas.
6. Determinar dónde debe vivir la nueva lógica.
7. Implementar la solución mínima que cumpla el requerimiento.
8. Revisar TypeScript, UI, errores y arquitectura.

No comenzar creando archivos sin revisar primero el proyecto.

---

# 4. Inspección del proyecto

Antes de modificar código relevante, revisar cuando corresponda:

* `package.json`
* `tsconfig.json`
* `app.json` / `app.config.*`
* `src/app`
* componentes existentes
* hooks existentes
* servicios
* tipos
* providers
* configuración de navegación

No asumir versiones ni dependencias.

---

# 5. Dependencias

Antes de instalar una librería:

1. Revisar si ya existe.
2. Revisar si React Native proporciona la funcionalidad.
3. Revisar si Expo proporciona una solución.
4. Evaluar compatibilidad con la versión actual.
5. Evaluar mantenimiento.
6. Evaluar si realmente reduce complejidad.

No instalar dependencias solamente por preferencia personal.

No duplicar soluciones existentes.

---

# 6. TypeScript

TypeScript es obligatorio para código nuevo.

Preferir:

* `type`
* `interface`
* tipos explícitos
* unions
* generics cuando aporten valor

Evitar:

```ts
any
```

y especialmente:

```ts
as any
```

como mecanismo para ocultar errores.

No utilizar `@ts-ignore` para solucionar problemas que puedan corregirse correctamente.

---

# 7. Modelos

Los modelos del dominio deben estar tipados.

No duplicar manualmente tipos que ya existan en el proyecto si pueden reutilizarse.

Cuando los datos de la base de datos y la UI tengan estructuras diferentes, realizar una transformación explícita.

No modificar un modelo de dominio únicamente para satisfacer una pantalla.

---

# 8. Componentes

Los componentes deben tener una responsabilidad clara.

Separar cuando corresponda:

```text
Screen
↓
Hook
↓
Service / Data layer
↓
Supabase
```

La estructura exacta debe respetar la arquitectura definida por el proyecto.

Evitar componentes que mezclen:

* UI
* acceso a datos
* reglas financieras
* navegación compleja
* transformaciones extensas

---

# 9. Reutilización

Antes de crear un componente, hook, utilidad o servicio:

* Buscar si ya existe.
* Revisar cómo se utiliza.
* Reutilizarlo si corresponde.

Componentes comunes pueden incluir:

* Button
* Input
* Card
* Modal
* Header
* LoadingState
* ErrorState
* EmptyState
* MoneyText

No crear abstracciones únicamente para reducir unas pocas líneas.

---

# 10. Hooks

Los custom hooks deben encapsular lógica reutilizable o compleja.

Ejemplos:

```text
useAuth
useCreditCards
useTransactions
useDebts
usePayments
```

No crear un hook gigante que controle múltiples dominios.

`useEffect` debe utilizarse para efectos secundarios reales, no como solución automática para cualquier lógica.

---

# 11. Estado

Distinguir entre:

```text
UI State
Form State
Server State
Session State
Domain State
```

No convertir todo en estado global.

Antes de agregar Zustand, Redux, Context u otra solución:

1. Determinar si realmente es necesaria.
2. Revisar las soluciones existentes.
3. Evaluar el alcance del estado.

No introducir una librería de estado solamente porque sea popular.

---

# 12. Estado asíncrono

Las operaciones asíncronas importantes deben contemplar:

```text
loading
success
empty
error
```

cuando corresponda.

Evitar que una operación pueda ejecutarse múltiples veces accidentalmente.

Los botones de acciones críticas deben manejar correctamente el estado `submitting`.

---

# 13. Formularios

Los formularios deben:

* Tener tipos.
* Validar entradas.
* Mostrar errores.
* Manejar loading.
* Evitar doble envío.
* Mostrar feedback.
* Considerar el teclado móvil.

Ejemplo de flujo:

```text
editing
↓
validating
↓
submitting
↓
success / error
```

La validación del cliente no reemplaza la validación del backend.

---

# 14. Finanzas

La UI no debe inventar reglas financieras.

Separar:

```text
CompraTarjeta
Deuda
Pago
```

Una pantalla puede mostrar varias de estas entidades, pero no debe mezclarlas conceptualmente.

Los cálculos financieros deben pertenecer a la capa de dominio correspondiente.

Para valores monetarios:

* Mantener una estrategia consistente de precisión.
* Mantener formato de moneda uniforme.
* Evitar cálculos de dinero descuidados.
* Respetar las reglas definidas por el dominio.

---

# 15. Supabase

La integración con Supabase pertenece principalmente a la skill específica de Supabase.

Desde React Native:

* No duplicar lógica de acceso a datos.
* No colocar consultas complejas en múltiples componentes.
* Utilizar la capa de acceso definida por la arquitectura.

Separar UI y acceso a datos cuando la complejidad lo requiera.

---

# 16. Seguridad

Nunca colocar secretos en el cliente móvil.

Nunca utilizar una Supabase Service Role Key en React Native.

No confiar en ocultar botones para proteger datos.

La aplicación controla la experiencia.

Supabase Auth y RLS controlan autenticación y autorización de datos.

Al cerrar sesión, evitar mantener información privada del usuario anterior en estados accesibles.

---

# 17. Expo

Preferir soluciones compatibles con Expo.

Antes de instalar módulos nativos:

1. Revisar si Expo ya proporciona la funcionalidad.
2. Revisar compatibilidad.
3. Determinar si funciona con Expo Go.
4. Determinar si requiere Development Build.
5. Revisar configuración adicional.

No modificar configuración nativa sin necesidad.

---

# 18. Expo Router

FinanzasApp utiliza Expo Router.

Mantener una estructura de rutas coherente con el proyecto.

Ejemplo:

```text
src/app/
├── _layout.tsx
├── index.tsx
├── login.tsx
├── register.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── transactions.tsx
│   ├── cards.tsx
│   └── profile.tsx
└── cards/
    ├── [id].tsx
    └── create.tsx
```

Este ejemplo no debe imponerse si la estructura real del proyecto es diferente.

---

# 19. Navegación

Antes de crear una ruta:

* Revisar la estructura actual.
* Determinar si es pública o privada.
* Revisar parámetros.
* Revisar navegación de regreso.
* Validar parámetros recibidos.

No asumir que un parámetro de ruta siempre existe o es válido.

---

# 20. Autenticación

La navegación privada debe coordinarse con el estado de sesión.

Considerar:

```text
checking session
authenticated
unauthenticated
```

Evitar mostrar temporalmente pantallas privadas mientras se verifica la sesión.

La navegación no sustituye RLS.

---

# 21. UI

La interfaz debe ser consistente con el sistema visual existente.

Respetar:

* colores
* tipografía
* spacing
* tamaños
* bordes
* radios
* sombras
* iconografía
* componentes reutilizables

Si existe un sistema de diseño, utilizarlo.

Evitar estilos duplicados.

---

# 22. Diseño proporcionado por el usuario

Cuando el usuario proporcione:

* Figma
* imagen
* mockup
* captura
* diseño visual

la implementación debe buscar **máxima fidelidad visual**.

Analizar:

* layout
* jerarquía
* spacing
* tamaños
* colores
* tipografía
* iconos
* bordes
* sombras
* estados

Si el usuario solicita "hacerlo igual", no rediseñar por iniciativa propia.

Las mejoras de UX deben proponerse por separado.

---

# 23. Responsive

La interfaz debe funcionar correctamente en diferentes tamaños de pantalla.

Considerar:

* teléfonos pequeños
* teléfonos grandes
* safe areas
* notch
* barra de estado
* teclado
* orientación cuando corresponda

No diseñar únicamente para un dispositivo específico.

---

# 24. Accesibilidad

Los elementos interactivos deben considerar:

* `accessibilityLabel`
* `accessibilityRole`
* contraste
* tamaño táctil
* estados
* navegación

No utilizar solamente el color para comunicar información.

---

# 25. Listas

Para listas grandes utilizar componentes apropiados como:

* `FlatList`
* `SectionList`

Evitar renderizar grandes cantidades de elementos mediante `map()` cuando una lista optimizada sea más apropiada.

Utilizar identificadores estables como keys.

---

# 26. Performance

No optimizar prematuramente.

Primero garantizar correctitud.

Después revisar problemas reales de:

* renders
* listas
* imágenes
* efectos
* consultas
* navegación
* cálculos

No utilizar `useMemo`, `useCallback` o `memo` automáticamente.

Usarlos cuando exista una razón concreta.

---

# 27. Imágenes

Optimizar imágenes considerando:

* tamaño
* formato
* dimensiones
* cache
* carga
* placeholders

Evitar recursos innecesariamente pesados.

---

# 28. Animaciones

Las animaciones deben tener un propósito.

Evaluar:

* performance
* accesibilidad
* interacción
* duración

No agregar animaciones únicamente para aumentar la complejidad visual.

---

# 29. Estados de UI

Una pantalla que depende de datos debe considerar:

```text
Loading
Data
Empty
Error
```

Ejemplo:

```text
Cargando tarjetas...
```

```text
Todavía no tienes tarjetas.
[Agregar tarjeta]
```

```text
No pudimos cargar tus tarjetas.
[Intentar nuevamente]
```

---

# 30. Manejo de errores

No ocultar errores silenciosamente.

Evitar:

```ts
try {
  ...
} catch {
}
```

sin una razón.

Distinguir cuando sea posible:

* validación
* red
* autenticación
* autorización
* servidor
* error inesperado

Los mensajes técnicos deben transformarse en mensajes comprensibles para el usuario cuando corresponda.

---

# 31. Feedback

Las operaciones importantes deben proporcionar feedback.

Ejemplos:

```text
Tarjeta creada correctamente.
```

```text
Compra registrada correctamente.
```

```text
No pudimos registrar la compra.
```

Las acciones destructivas deben solicitar confirmación cuando corresponda.

---

# 32. Teclado

Los formularios deben considerar el teclado virtual.

Verificar:

* inputs inferiores
* scroll
* botones
* modales
* formularios largos

El teclado no debe ocultar campos importantes.

---

# 33. Fechas

Mantener una estrategia consistente para fechas.

Considerar:

* zona horaria
* formato almacenado
* formato mostrado
* locale

No mezclar formatos arbitrariamente.

---

# 34. Moneda

Mantener una representación monetaria consistente.

La UI debe utilizar el formato definido por el proyecto.

No mostrar diferentes formatos para el mismo concepto sin una decisión de diseño.

---

# 35. Arquitectura

La implementación debe respetar la skill `software-architect`.

No introducir una arquitectura paralela dentro de una funcionalidad.

La solución debe favorecer:

* separación de responsabilidades
* bajo acoplamiento
* alta cohesión
* testabilidad
* mantenibilidad

Evitar tanto la sobreingeniería como los componentes gigantes.

---

# 36. Organización

Una estructura posible es:

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── types/
├── utils/
├── constants/
└── providers/
```

La estructura real debe respetar las decisiones existentes.

Cuando el proyecto crezca, puede organizarse por feature:

```text
features/
├── auth/
├── transactions/
├── credit-cards/
├── debts/
├── payments/
├── income/
└── expenses/
```

No reorganizar todo el proyecto sin necesidad.

---

# 37. Services

Los services deben representar responsabilidades claras.

Ejemplo:

```text
creditCardService
transactionService
debtService
paymentService
```

Evitar un servicio gigante que controle toda la aplicación.

---

# 38. Funciones

Preferir funciones pequeñas y con una responsabilidad clara.

Separar cuando una función intente simultáneamente:

* consultar datos
* transformar datos
* modificar estado
* navegar
* mostrar feedback

---

# 39. Utilidades

Las utilities deben contener lógica reutilizable.

Ejemplos:

```text
formatCurrency
formatDate
parseCurrency
```

No crear un único `utils.ts` gigante.

---

# 40. Single Source of Truth

Evitar duplicar el mismo dato en múltiples estados.

No almacenar como estado información que pueda derivarse de otra fuente confiable.

Cada dato importante debe tener una fuente de verdad clara.

---

# 41. Código limpio

El código nuevo debe:

* ser legible
* estar tipado
* evitar duplicación
* evitar código muerto
* evitar comentarios innecesarios
* mantener imports limpios

Los comentarios deben explicar decisiones o comportamientos no evidentes.

---

# 42. Refactorización

No refactorizar partes no relacionadas con la tarea.

Antes de modificar un componente compartido:

1. Buscar sus usos.
2. Revisar sus props.
3. Evaluar impacto.
4. Actualizar consumidores si es necesario.

Mantener los cambios enfocados.

---

# 43. Testing

Las funcionalidades importantes deben ser testeables.

Priorizar:

* validaciones
* lógica financiera
* transformaciones
* hooks críticos
* componentes importantes
* flujos de autenticación

Los tests deben comprobar comportamiento, no solamente implementación interna.

---

# 44. Debugging

Ante un error:

1. Reproducirlo.
2. Leer el error real.
3. Identificar su origen.
4. Determinar si pertenece a UI, navegación, TypeScript, Expo, Supabase o dominio.
5. Corregir la causa.
6. Verificar regresiones.

No solucionar errores simplemente ocultándolos.

---

# 45. Código temporal

No dejar workarounds temporales como solución definitiva sin documentarlos.

No utilizar:

```ts
@ts-ignore
```

o configuraciones relajadas solamente para conseguir que compile.

---

# 46. Git

No realizar operaciones Git destructivas sin autorización.

Los cambios deben mantenerse enfocados y ser fáciles de revisar.

---

# 47. Checklist de implementación

Antes de finalizar una funcionalidad:

## Proyecto

* [ ] Revisé el código existente.
* [ ] Revisé dependencias.
* [ ] Respeté la estructura actual.

## React Native

* [ ] La implementación utiliza correctamente React Native.
* [ ] Es compatible con Expo.
* [ ] Respeta Expo Router.

## TypeScript

* [ ] Todo el código nuevo está tipado.
* [ ] No utilicé `any` innecesariamente.
* [ ] No oculté errores de TypeScript.

## UI

* [ ] Respeta el diseño.
* [ ] Es responsive.
* [ ] Considera accesibilidad.
* [ ] Tiene loading/error/empty cuando corresponde.

## Datos

* [ ] No mezclé UI con acceso a datos innecesariamente.
* [ ] Respeta Supabase.
* [ ] Respeta Auth y RLS.

## Arquitectura

* [ ] Las responsabilidades están separadas.
* [ ] No existe duplicación innecesaria.
* [ ] No agregué sobreingeniería.

## Calidad

* [ ] No dejé código muerto.
* [ ] No dejé logs sensibles.
* [ ] Consideré testing.
* [ ] Revisé posibles regresiones.

---

# 48. Principio final

La implementación de FinanzasApp debe seguir este orden de prioridad:

1. Correctitud
2. Seguridad
3. Integridad de datos
4. Arquitectura
5. Mantenibilidad
6. Experiencia de usuario
7. Performance

La solución debe ser tan simple como sea posible sin sacrificar esos principios.

No agregar tecnologías, patrones o dependencias sin una necesidad real.

No inventar reglas del dominio.

No modificar un diseño proporcionado por el usuario sin autorización.

Construir código que otro desarrollador pueda entender y mantener.
