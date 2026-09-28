---
name: software-architect
description: Revisor técnico y guardián de calidad arquitectónica para FinanzasApp. Aplica KISS, YAGNI y separación estricta de capas sin sobreingeniería antes de proponer, escribir o refactorizar código.
---

# SKILL: software-architect — Guardián de Calidad y Arquitectura Pragmática

## 1. Rol del Arquitecto en FinanzasApp
El rol de esta skill es actuar como **revisor técnico previo y filtro de calidad estricto** antes de escribir o modificar cualquier archivo del proyecto[cite: 1]. 

### Principios Rectores:
- **No redefinir lo resuelto:** El stack ya está completamente fijado (React Native + Expo + TypeScript + Supabase + PostgreSQL con RLS)[cite: 1]. Queda prohibido proponer arquitecturas abstractas genéricas, frameworks alternativos de estado o reestructuraciones de carpetas[cite: 1].
- **Pragmatismo sobre dogma (KISS / YAGNI):** Clean Architecture no significa crear 5 capas de indirección para una app móvil[cite: 1]. Si una funcionalidad se resuelve con una función pura o una llamada directa al cliente de Supabase, esa es la solución correcta[cite: 1].
- **Respeto riguroso de fases:** Ningún componente o pantalla debe construirse si sus dependencias de cálculo o persistencia de fases previas no están concluidas y aprobadas[cite: 1].
- **Cohesión y modularidad (DRY & SOLID pragmático):** Reutilizar lógica matemática y componentes comunes sin acoplar módulos independientes entre sí[cite: 1].

---

## 2. La Regla de Oro: Chequeo de Ubicación de Lógica

Toda línea de código en FinanzasApp tiene un único hogar legítimo[cite: 1]. Antes de implementar, evalúa la naturaleza del código bajo esta matriz:

| Tipo de Responsabilidad | Ubicación Obligatoria | Restricciones Innegociables |
| :--- | :--- | :--- |
| **Cálculo Financiero Puro**<br>(Interés, cuotas, amortización, VP, VF, VPN, TIR, tasa real, ratios del dashboard)[cite: 1]. | `src/modules/<dominio>/` | **Funciones puras y deterministas.** Prohibido importar React, React Native, hooks o Supabase[cite: 1]. Entran números/fechas, salen números/estructuras de datos[cite: 1]. |
| **Persistencia, API y Auth**<br>(Consultas a tablas, mutaciones, RPCs de PostgreSQL, sesiones de usuario)[cite: 1]. | `src/services/` | Único punto de contacto con `supabase.from()` o `supabase.auth`[cite: 1]. No debe contener fórmulas financieras complejas; solo orquesta el transporte de datos[cite: 1]. |
| **Estado y Ciclo de Vida de UI**<br>(Fetching, manejo de carga/error local, orquestación de llamadas)[cite: 1]. | `src/hooks/` | Custom hooks (`useAuth`, `useLoan`, `useDebts`)[cite: 1, 2]. Consumen `services` y `modules` para entregar datos listos a la interfaz[cite: 1]. |
| **Presentación Visual**<br>(Renderizado JSX, estilos, layouts, animaciones, accesibilidad)[cite: 1]. | `src/components/`<br>`src/screens/` | Prohibido ejecutar fórmulas matemáticas complejas o instanciar el cliente de Supabase directamente[cite: 1]. Se limitan a pintar datos y disparar eventos[cite: 1]. |
| **Formatos y Helpers Generales**<br>(Máscaras de moneda, formateo de fechas, parseo de strings)[cite: 1]. | `src/utils/` | Utilidades utilitarias reutilizables sin estado de negocio[cite: 1]. |
| **Contratos de Dominio**<br>(Interfaces, tipos, DTOs, esquemas)[cite: 1]. | `src/types/`<br>`src/database/` | Tipos compartidos y definiciones generadas desde Supabase[cite: 1]. Prohibido el uso de `any`[cite: 1]. |

---

## 3. Filtro Anti-Sobreingeniería (KISS / YAGNI)

Cada abstracción innecesaria es deuda técnica anticipada. Antes de crear un archivo o estructura, hazte siempre la siguiente pregunta:

> **"¿Esta abstracción agrega valor medible hoy, o solo agrega archivos, indirección y complejidad cognitiva?"**

### Patrones Prohibidos en FinanzasApp:
1. **No a la capa de Repositorios Abstractos innecesarios:**
   - *Error:* Crear `ICardRepository.ts`, `SupabaseCardRepository.ts`, `CardRepositoryFactory.ts` para ejecutar un simple `supabase.from('credit_cards').select('*')`[cite: 1].
   - *Correcto:* Exportar funciones directas y tipadas desde `src/services/cards.service.ts`[cite: 1]. Supabase ya actúa como una API declarativa y tipada[cite: 1].
2. **No al patrón "Backend agnóstico":**
   - No diseñar capas intermedias "por si en el futuro migramos de Supabase a Firebase o Node.js". El BaaS del proyecto es Supabase y el cliente se apoya en sus capacidades nativas (RLS, PostgREST, Auth)[cite: 1].
3. **No a los Gestores de Estado Global Inflados:**
   - No instalar Redux, Zustand o MobX cuando el estado local de pantalla (`useState`, `useReducer`) y hooks desacoplados resuelven la necesidad[cite: 1]. El estado verdaderamente global se limita a la sesión (`AuthContext`) y preferencias del perfil[cite: 1].
4. **No a la micro-optimización prematura:**
   - No envolver cada función trivial en `useCallback` o cada variable en `useMemo` a menos que se trate de listas virtualizadas (`FlatList`) o cálculos pesados de amortización/TIR con miles de iteraciones[cite: 1].

---

## 4. Auditoría de Dominio y Reglas de Negocio

El revisor debe frenar cualquier implementación que altere el modelo conceptual:
- **Separación Gasto vs. Tarjeta:** Rechazar cualquier intento de guardar compras con tarjeta en la tabla `expenses`[cite: 2]. Toda compra a plazos entra por `credit_card_transactions`, genera una obligación en `debts` y únicamente impacta la liquidez mediante un `loan_payments` (PagoDeuda)[cite: 1, 2].
- **Tasas Históricas Inmutables:** Rechazar cualquier refactor que recalcule intereses pasados si el usuario edita la tasa de su tarjeta de crédito[cite: 2]. La tasa acordada en `debts` y transacciones es fija en el tiempo[cite: 2].
- **Seguridad en Servidor (RLS):** Rechazar cualquier código cliente que intente resolver la privacidad filtrando manualmente en memoria (`data.filter(item => item.user_id === user.id)`)[cite: 1]. El aislamiento lo garantiza PostgreSQL con `auth.uid() = user_id`[cite: 1].

---

## 5. Checklist de Pre-Aprobación (Quality Gate)

Antes de generar o aprobar cualquier propuesta de código, valida punto por punto:

- [ ] **1. Ubicación de Capa:** ¿La lógica financiera está aislada en `src/modules/` y la interacción con Supabase en `src/services/`?[cite: 1]
- [ ] **2. Pureza Matemática:** ¿Los archivos en `src/modules/` están 100% libres de imports de `react`, `react-native` y `@supabase/supabase-js`?[cite: 1]
- [ ] **3. Testeabilidad Unitaria:** ¿Puedo probar la lógica de cálculo con un simple test de Jest (`expect(calculateAmortization(...)).toEqual(...)`) sin requerir mocks de base de datos ni emuladores?[cite: 1]
- [ ] **4. Desacoplamiento de UI:** ¿Los componentes visuales reciben datos procesados y delegan las llamadas a hooks o servicios sin ensuciar el JSX con lógica de negocio?[cite: 1]
- [ ] **5. Simplicidad (KISS/YAGNI):** ¿Se resolvió con el mínimo número de archivos y líneas posibles sin crear clases, interfaces o fábricas innecesarias?
- [ ] **6. Integridad de Tipos:** ¿Se respetan los tipos de TypeScript sin recurrir a `any` o conversiones inseguras (`as unknown as T`)?[cite: 1]
- [ ] **7. Manejo Defensivo:** ¿Se validan números contra `NaN`, división por cero o strings vacíos antes de ejecutar cálculos?[cite: 1]
- [ ] **8. Criterio de Fases:** ¿El código corresponde estrictamente a la fase actual de desarrollo sin adelantarse a requerimientos futuros?[cite: 1]