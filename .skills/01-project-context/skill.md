---
name: project-context
description: Memoria técnica y contexto central de FinanzasApp. Define el objetivo, stack tecnológico, arquitectura modular, modelo ERD, reglas de negocio y directivas innegociables para el agente.
---

# Memoria Técnica y Contexto: FinanzasApp

## 1. Visión y Objetivo del Proyecto
FinanzasApp es una aplicación móvil que combina motores de cálculo financiero puro con el registro estructurado de las finanzas personales del usuario (ingresos, gastos, tarjetas de crédito, deudas y amortizaciones), todo consolidado en un panel visual con métricas financieras.
- **Alcance y distribución:** Generación de un archivo APK para Android mediante EAS Build (Expo) para uso personal exclusivo, sin publicación inicial en Google Play Store.
- **Seguridad:** Aislamiento absoluto de datos por usuario implementado a nivel de motor de base de datos.

---

## 2. Stack Tecnológico
- **Cliente Móvil:** React Native con Expo.
- **Lenguaje:** TypeScript con tipado estático estricto (prohibido el uso de `any`).
- **Backend as a Service (BaaS):** Supabase (PostgreSQL, Supabase Auth, Storage y API generada).
- **Base de Datos:** PostgreSQL.
- **Autenticación:** Supabase Auth (gestión de sesiones y tokens persistentes).
- **Seguridad:** Row Level Security (RLS) habilitado en el 100% de las tablas con datos del usuario.
- **Empaquetado:** EAS Build orientado a la generación de APK local.

---

## 3. Arquitectura y Estructura del Proyecto

### 3.1 Desacoplamiento por Capas
La aplicación mantiene una separación estricta entre la matemática pura, el acceso a datos y la interfaz de usuario:
- `src/modules/`: Funciones deterministas de cálculo financiero puro. Tienen estrictamente prohibido importar React, React Native o el cliente de Supabase.
- `src/services/`: Único punto de contacto con Supabase y las operaciones de red.
- `src/screens/` y `src/components/`: Presentación y renderizado de la interfaz.

### 3.2 Estructura del Repositorio
```text
src/
├── components/         # Componentes de UI reutilizables (inputs, botones, tablas, charts)
├── screens/            # Pantallas agrupadas por flujo funcional
├── navigation/         # Enrutamiento de la aplicación (stacks y tabs)
├── hooks/              # Custom hooks para encapsular estado y efectos (useAuth, useLoan)
├── services/           # Repositorios CRUD y cliente Supabase
├── utils/              # Formateo de fechas, divisas y helpers genéricos
├── types/              # Definiciones e interfaces de TypeScript
├── constants/          # Constantes globales (colores, categorías base, periodos)
├── modules/            # MOTOR FINANCIERO PURO (cero dependencias externas)
│   ├── interest/       # Interés simple y compuesto (Fase 1)
│   ├── rates/          # Conversión de tasas nominales y efectivas (Fase 1)
│   ├── loans/          # Amortizaciones, seguros y comparadores (Fase 2, 7)
│   ├── creditCards/    # Lógica de fechas de corte, límites y cuotas (Fase 4)
│   ├── finances/       # Métricas de liquidez, ingresos, gastos y dashboard (Fase 5, 8)
│   └── investments/    # VP, VF, VPN, TIR (método numérico) y tasa real (Fase 6)
└── database/           # Tipos generados a partir del esquema de Supabase (Fase 3)
```

---

## 4. Modelo de Datos y ERD (Entity-Relationship Diagram)

### 4.1 Entidades Principales
- **Usuario (`profiles`):** Extiende la tabla nativa `auth.users` de Supabase (`id` referenciado a `auth.users.id`, `full_name`, `currency`).
- **Categoría (`categories`):** Clasificador transversal para `incomes`, `expenses` y `credit_card_transactions`.
- **Tarjeta de Crédito (`credit_cards`):** Líneas de crédito revolventes asignadas a un usuario (`name`, `issuer`, `credit_limit`, `cutoff_day`, `payment_day`).
- **Compra con Tarjeta (`credit_card_transactions`):** Compras realizadas contra una tarjeta existente (`card_id`, `description`, `amount`, `purchase_date`, `category`, `installments`, `rate`).
- **Deuda (`debts`):** Compromisos de pago pendientes (`name`, `entity`, `initial_amount`, `pending_balance`, `interest_rate`, `installment_value`, `start_date`, `due_date`, `compra_tarjeta_id`).
- **Pago de Deuda (`loan_payments`):** Registros de pagos que amortizan directamente el saldo pendiente de una deuda o crédito.
- **Ingreso (`incomes`):** Entradas efectivas de recursos (`amount`, `category`, `date`, `description`).
- **Gasto (`expenses`):** Egresos directos e inmediatos de liquidez (`amount`, `category`, `date`, `description`).
- **Inversiones (`investments`):** Escenarios de evaluación de proyectos guardados (`initial_investment`, `discount_rate`, `cash_flows`, `npv`, `irr`).
- **Metas Financieras (`financial_goals`):** Objetivos de ahorro proyectados para visualización en dashboard.

### 4.2 Cardinalidades y Relaciones
```text
auth.users (Supabase Auth)
  │
  ├── 1:1 ──── profiles
  ├── 1:N ──── incomes
  ├── 1:N ──── expenses
  ├── 1:N ──── investments
  ├── 1:N ──── financial_goals
  ├── 1:N ──── debts ────────────────────────────────────── 1:N ── loan_payments
  │             ▲                                                ▲
  │             └── 1:1 (opcional)                               │
  │                   │                                          │
  └── 1:N ──── credit_cards                                      │
                └── 1:N ── credit_card_transactions              │
                              │                                  │
                              └── (si genera deuda diferida) ────┘
```

- **Relación CompraTarjeta - Deuda:** Toda compra diferida con tarjeta genera exactamente una fila en `debts` (`compra_tarjeta_id NOT NULL`).
- **Deudas independientes:** Créditos personales o extrabancarios se registran en `debts` con `compra_tarjeta_id = NULL`.
- **Consistencia relacional:** Las tablas secundarias como transacciones y pagos de crédito derivan su validación de propiedad mediante claves foráneas hacia sus entidades principales.

---

## 5. Reglas de Negocio Críticas

### 5.1 Separación Estricta: Gasto vs. Compra con Tarjeta
- **Gasto directo (`expenses`):** Representa un egreso inmediato del dinero disponible en efectivo o cuentas de débito del usuario.
- **Compra con Tarjeta (`credit_card_transactions`):** No consume liquidez inmediata del usuario; consume cupo de la tarjeta y genera una Deuda (`debts`).
- **Desembolso real:** La salida de dinero asociada a una tarjeta solo ocurre cuando se registra un Pago de Deuda (`loan_payments`).
- **REGLA MANDATORIA:** Prohibido unificar `expenses` con `credit_card_transactions` o sumar compras a crédito directamente al cálculo del flujo de caja diario, para evitar duplicidades erróneas.

### 5.2 Inmutabilidad Histórica de Tasas
- La tasa de interés pactada se guarda de manera congelada en el registro de la Deuda o la CompraTarjeta al momento de ser creada.
- Si el usuario edita posteriormente la tasa de interés base configurada en la TarjetaCredito, las compras y deudas previas no deben modificarse ni recalcularse bajo ningún concepto.

### 5.3 Seguridad y Políticas RLS
- El cliente móvil nunca define los permisos de visibilidad ni de escritura por sí solo.
- Todas las consultas SQL a Supabase se validan mediante la función de servidor `auth.uid() = user_id`.
- Queda prohibido aceptar o confiar en identificadores de usuario enviados en el cuerpo del payload desde la aplicación.

### 5.4 Validaciones Numéricas y Cálculos
- La interfaz no debe enviar formularios con datos no numéricos, campos vacíos o valores negativos en campos que exigen números naturales o positivos.
- Toda tabla de amortización, cálculo de cuotas o simulador debe utilizar de forma obligatoria las funciones puras ubicadas en `src/modules/`.
- En algoritmos iterativos (como la TIR mediante Newton-Raphson), se deben atrapar los casos matemáticos sin convergencia o con infinitas soluciones, regresando un error estructurado sin quebrar la ejecución.

---

## 6. Requerimientos Funcionales y Secuencia de Fases

### 6.1 Fases Constructivas (Analogía del Edificio)
El desarrollo del proyecto es rigurosamente secuencial:
- **Fase 0 (Planos):** Inicialización de Expo + TypeScript, diseño del ERD y arquitectura.
- **Fase 1 (Cimientos):** Interés simple, compuesto y conversión de tasas (`src/modules/interest/`, `src/modules/rates/`).
- **Fase 2 (Estructura portante):** Préstamos y generación de tablas de amortización (`src/modules/loans/`).
- **Fase 3 (Redes e instalaciones):** Configuración de Supabase, Auth, RLS y esquemas PostgreSQL.
- **Fase 4 (Primera habitación):** CRUD de tarjetas de crédito y registro de compras diferidas.
- **Fase 5 (Resto de habitaciones):** CRUD de ingresos, gastos y deudas con pagos de amortización.
- **Fase 6 (Sistemas de control):** Herramientas de evaluación de inversión (VP, VF, VPN, TIR y tasa real de Fisher).
- **Fase 7 (Panel de acabados):** Comparador de préstamos multi-escenario y checklist contractual.
- **Fase 8 (Vista panorámica):** Dashboard financiero y cálculo de indicadores consolidados (tasa de ahorro, endeudamiento, flujo neto).
- **Fase 9 (Entrega de llaves):** Pruebas integrales, auditoría de RLS y generación de APK mediante EAS Build.

### 6.2 Matriz de Requerimientos Funcionales
- **RF-01 a RF-03:** Autenticación (Registro, Login, Logout).
- **RF-04 a RF-06:** Cálculos de interés simple, compuesto y conversión de tasas.
- **RF-07 y RF-08:** Simulación de préstamos y tablas de amortización detalladas.
- **RF-09 a RF-12:** Tarjetas de crédito, compras a cuotas y consulta de fechas de corte y pago.
- **RF-13 a RF-15:** CRUD de ingresos, gastos y control de deudas con amortización y seguimiento de saldo.
- **RF-16 a RF-20:** Cálculo de Valor Presente, Valor Futuro, VPN, TIR y Tasa Real.
- **RF-21 y RF-22:** Comparador de ofertas de crédito y checklist para toma de decisiones de crédito.
- **RF-23 a RF-25:** Dashboard financiero, indicadores analíticos de salud y políticas transversales de seguridad RLS.

---

## 7. Convenciones del Proyecto
- **Nombres en el código:** Variables, funciones, clases, tipos e interfaces en inglés técnico (ej: `calculateInstallment`, `CreditCardTransaction`).
- **Nombres en la Base de Datos:** Tablas y columnas en inglés en `snake_case` (ej: `credit_cards`, `initial_amount`).
- **Textos de la Interfaz:** Mensajes de error, etiquetas y pantallas en español latinoamericano comprensible.
- **Manejo de Moneda:** Los modelos numéricos procesan valores en tipo `number` decimal; el formato monetario se aplica únicamente al renderizar en la vista usando la configuración de `profiles.currency`.

---

## 8. Directivas Innegociables (PROHIBIDO MODIFICAR SIN AUTORIZACIÓN)
Como agente de desarrollo de Antigravity:
1. **NO importar dependencias de React, React Native o Supabase dentro de `src/modules/`:** Deben permanecer como funciones puras.
2. **NO computar las compras con tarjeta dentro de la tabla o entidad `expenses`:** Respeta la canalización obligatoria: Compra con tarjeta -> Deuda -> Pagos de deuda.
3. **NO modificar tasas históricas retroactivamente:** Modificar una tarjeta de crédito no debe impactar deudas preexistentes.
4. **NO deshabilitar RLS ni realizar operaciones prescindiendo de `auth.uid()`:** Toda entidad de usuario debe estar resguardada en PostgreSQL.
5. **NO alterar el orden de fases:** No diseñes pantallas de agregación como el Dashboard si los módulos de cálculo o las entidades base de persistencia no han sido completados previamente.
