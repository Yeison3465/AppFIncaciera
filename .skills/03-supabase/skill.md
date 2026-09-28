# Skill: Supabase — FinanzasApp

## 1. Identidad de la Skill

Esta skill define las reglas para utilizar Supabase dentro de FinanzasApp.

Supabase funciona como el **backend y API de datos** de la aplicación móvil.

La arquitectura oficial del proyecto es:

```text
React Native + Expo + TypeScript
              ↓
          Supabase
              ↓
          PostgreSQL
```

Supabase proporciona principalmente:

* API de acceso a PostgreSQL.
* Autenticación.
* Row Level Security (RLS).
* Gestión de sesión.
* Acceso a datos.
* Storage cuando sea necesario.
* Servicios complementarios de backend.

La aplicación móvil consume Supabase.

No introducir Prisma como capa de acceso a datos salvo que el usuario decida explícitamente cambiar la arquitectura.

---

# 2. Objetivo

La skill debe garantizar que la integración con Supabase sea:

* Segura.
* Tipada.
* Mantenible.
* Escalable.
* Consistente.
* Compatible con React Native + Expo.
* Compatible con la arquitectura del proyecto.
* Respetuosa con las reglas financieras de FinanzasApp.

La prioridad es evitar que las consultas de Supabase terminen mezcladas directamente con toda la lógica de las pantallas.

---

# 3. Modelo mental

Pensar Supabase como una API de backend:

```text
Usuario
   ↓
React Native
   ↓
Hook / Service
   ↓
Supabase
   ↓
PostgreSQL
```

La aplicación solicita datos a Supabase.

Supabase procesa la solicitud.

PostgreSQL almacena los datos.

RLS determina qué datos puede consultar o modificar el usuario autenticado.

---

# 4. Responsabilidad de Supabase

Supabase es responsable de:

```text
Autenticación
Persistencia
Consultas
Inserciones
Actualizaciones
Eliminaciones
Autorización mediante RLS
Sesiones
Acceso a PostgreSQL
```

React Native es responsable principalmente de:

```text
UI
UX
Navegación
Estado visual
Formularios
Feedback
Presentación de datos
```

La lógica financiera debe permanecer separada de ambos cuando su complejidad lo requiera.

---

# 5. Stack oficial

FinanzasApp utiliza:

```text
React Native
Expo
TypeScript
Expo Router
Supabase
PostgreSQL
Supabase Auth
Row Level Security
```

No sustituir este stack automáticamente.

---

# 6. Regla fundamental

Antes de realizar una consulta:

1. Identificar qué dato se necesita.
2. Identificar la entidad.
3. Identificar quién es el usuario.
4. Determinar si la operación es lectura o escritura.
5. Revisar las relaciones necesarias.
6. Revisar las políticas RLS.
7. Revisar los tipos.
8. Ejecutar la consulta desde la capa correspondiente.

No realizar consultas arbitrarias desde cualquier componente.

---

# 7. Cliente Supabase

Debe existir una configuración centralizada del cliente Supabase.

Evitar crear múltiples clientes manualmente:

```text
supabase1
supabase2
supabase3
```

sin una razón arquitectónica.

La aplicación debe reutilizar la instancia configurada para el proyecto.

---

# 8. Variables de entorno

Las credenciales y configuración deben manejarse mediante la configuración definida por el proyecto.

Nunca colocar secretos directamente en el código.

No subir secretos al repositorio.

Revisar:

```text
.env
.env.example
app.config.*
```

según la configuración existente.

---

# 9. Service Role Key

La Service Role Key **nunca debe estar en la aplicación móvil**.

No utilizarla desde:

```text
React Native
Expo
componentes
hooks
services del cliente
```

La Service Role Key tiene privilegios elevados y debe permanecer en un entorno backend seguro.

---

# 10. Anon / Publishable Key

La clave pública correspondiente al cliente puede utilizarse según la configuración oficial de Supabase.

Pero una clave pública no significa:

```text
acceso ilimitado
```

La seguridad real depende de:

```text
Auth
+
RLS
+
políticas correctas
```

---

# 11. RLS

Row Level Security es una parte fundamental de la seguridad de FinanzasApp.

La aplicación no debe depender únicamente de:

```text
if (user.id === ...)
```

en React Native.

La base de datos debe aplicar las restricciones mediante RLS.

---

# 12. Regla de propiedad

Los datos financieros pertenecen a usuarios.

Cuando una entidad tenga:

```text
usuario_id
```

debe existir una estrategia clara para garantizar que el usuario solamente pueda acceder a sus propios datos.

Ejemplo conceptual:

```text
Usuario A
   ↓
Tarjetas de A

Usuario B
   ↓
Tarjetas de B
```

Usuario A no debe poder consultar las tarjetas de B manipulando una solicitud desde el cliente.

---

# 13. RLS como autorización real

El frontend controla la experiencia.

RLS controla el acceso a los datos.

Por tanto:

```text
UI oculta botón
≠
Seguridad
```

La seguridad debe existir en PostgreSQL mediante políticas.

---

# 14. Auth

Supabase Auth administra la autenticación.

Debe manejar:

* Registro.
* Login.
* Logout.
* Sesión.
* Recuperación de contraseña.
* Estado autenticado.
* Estado no autenticado.
* Cambios de sesión.

No implementar un sistema de autenticación paralelo sin necesidad.

---

# 15. Sesión

La aplicación debe conocer el estado:

```text
checking
authenticated
unauthenticated
```

Evitar consultar datos privados antes de conocer el usuario autenticado.

---

# 16. Usuario autenticado

Cuando una operación dependa del usuario actual:

```text
Auth Session
      ↓
User ID
      ↓
Consulta Supabase
```

No pedir al usuario manualmente un `usuario_id` para operaciones que puedan obtenerlo de la sesión.

---

# 17. No confiar en IDs enviados por la UI

Un ID enviado desde React Native no demuestra que el usuario tenga permiso sobre ese registro.

Ejemplo:

```text
/cards/123
```

El usuario podría modificar:

```text
123 → 456
```

Por eso la autorización debe depender de RLS.

---

# 18. Consultas

Supabase debe utilizarse para realizar operaciones de datos de manera explícita.

Ejemplos conceptuales:

```text
SELECT
INSERT
UPDATE
DELETE
```

mediante la API de Supabase.

La consulta debe ser clara y específica.

---

# 19. Evitar consultas gigantes

No realizar una consulta que traiga toda la base de datos para después filtrar todo en React Native.

Preferir:

```text
Supabase
↓
Datos necesarios
↓
React Native
```

en lugar de:

```text
Supabase
↓
Toda la información
↓
React Native
↓
Filtrado
```

---

# 20. Seleccionar solamente lo necesario

Evitar solicitar columnas que no se utilizan.

Preferir consultas específicas.

Esto ayuda a:

* reducir transferencia.
* mejorar claridad.
* mejorar performance.
* reducir exposición innecesaria de datos.

---

# 21. Relaciones

Cuando existan relaciones entre tablas, evaluar si la consulta puede resolverlas mediante las capacidades de Supabase/PostgREST.

Ejemplo conceptual:

```text
Tarjeta
   ↓
Compras
   ↓
Deuda
```

No realizar múltiples consultas innecesarias si una consulta relacional bien diseñada puede resolver el caso.

---

# 22. No sobreoptimizar relaciones

Tampoco realizar joins complejos simplemente porque son posibles.

Elegir la consulta más clara y adecuada para el caso.

---

# 23. Tipos de base de datos

Cuando Supabase genere tipos TypeScript para PostgreSQL, utilizarlos como fuente confiable de los tipos de persistencia.

Evitar redefinir manualmente todas las tablas si ya existe una definición generada.

---

# 24. Database Types

La estructura conceptual debe ser:

```text
PostgreSQL
      ↓
Tipos generados
      ↓
TypeScript
```

Esto reduce inconsistencias entre base de datos y aplicación.

---

# 25. Separación de modelos

No asumir que el tipo de PostgreSQL debe ser exactamente igual al modelo visual.

Puede existir:

```text
Database Model
↓
Domain Model
↓
UI Model
```

cuando sea necesario.

No crear estas capas si no aportan valor.

---

# 26. Services

Las operaciones de Supabase pueden encapsularse en services.

Ejemplo:

```text
services/
├── authService.ts
├── creditCardService.ts
├── transactionService.ts
├── debtService.ts
└── paymentService.ts
```

Cada service debe tener una responsabilidad clara.

---

# 27. Mega service

Evitar:

```text
supabaseService.ts
```

que contenga todas las operaciones de la aplicación.

Dividir cuando el proyecto lo requiera.

---

# 28. Hooks

Los hooks pueden utilizar los services para coordinar:

* datos.
* loading.
* error.
* estado.
* refresh.

Ejemplo:

```text
Screen
   ↓
useCreditCards()
   ↓
creditCardService
   ↓
Supabase
```

---

# 29. Consultas dentro de componentes

Evitar colocar consultas complejas directamente dentro de las pantallas.

No convertir una pantalla en:

```text
UI
+
Auth
+
Supabase
+
validación
+
reglas financieras
+
transformaciones
```

Separar responsabilidades.

---

# 30. Regla de simplicidad

No crear services o repositories únicamente porque una consulta tenga cinco líneas.

La abstracción debe aportar:

* reutilización.
* separación.
* testabilidad.
* claridad.
* mantenimiento.

---

# 31. Manejo de errores

Toda operación con Supabase debe contemplar errores.

No ignorar:

```text
error
```

ni asumir que toda operación fue exitosa.

---

# 32. Resultado de operaciones

Las operaciones deben manejar explícitamente:

```text
data
error
```

y cuando corresponda:

```text
count
status
```

según la operación.

---

# 33. Errores técnicos

No mostrar directamente al usuario errores internos como:

```text
PostgrestError
23505
42501
```

cuando exista un mensaje más comprensible.

La capa de aplicación debe transformar el error cuando corresponda.

---

# 34. Error de autorización

Si RLS bloquea una operación:

No intentar solucionar el problema desactivando RLS.

Primero revisar:

1. Usuario autenticado.
2. `auth.uid()`.
3. Propiedad del registro.
4. Política RLS.
5. Operación realizada.
6. Relación entre tablas.

---

# 35. Nunca desactivar RLS como solución rápida

No utilizar:

```text
RLS OFF
```

para solucionar errores de la aplicación.

La solución debe estar en:

```text
política
+
consulta
+
autenticación
```

---

# 36. INSERT

Antes de insertar:

* Validar datos.
* Determinar usuario.
* Validar relaciones.
* Respetar restricciones.
* Considerar RLS.
* Manejar errores.

---

# 37. UPDATE

Nunca actualizar datos solamente porque el ID exista.

La operación debe estar protegida por RLS.

Ejemplo conceptual:

```text
UPDATE tarjeta
WHERE id = ?
```

debe estar acompañado por una política que garantice la propiedad correspondiente.

---

# 38. DELETE

Las eliminaciones deben considerar:

* autorización.
* relaciones.
* integridad referencial.
* confirmación desde UI.
* actualización del estado local.

No asumir que eliminar un registro es siempre una operación aislada.

---

# 39. Integridad referencial

Las relaciones importantes deben estar respaldadas por PostgreSQL.

No depender exclusivamente de React Native para mantener relaciones válidas.

---

# 40. Transacciones

Cuando una operación requiera modificar múltiples entidades relacionadas y la atomicidad sea importante, evaluar una estrategia transaccional apropiada.

No simular transacciones únicamente haciendo:

```text
insert
↓
insert
↓
insert
```

desde el cliente cuando una falla pueda dejar datos inconsistentes.

En esos casos puede ser necesario utilizar una función PostgreSQL/RPC o una estrategia backend apropiada.

---

# 41. RPC

Utilizar funciones PostgreSQL/RPC cuando exista una operación que:

* involucre varias modificaciones.
* requiera atomicidad.
* tenga lógica de base de datos compleja.
* deba ejecutarse de manera controlada en PostgreSQL.

No utilizar RPC para todas las operaciones simples.

---

# 42. Regla contra sobreuso de RPC

No convertir cada:

```text
SELECT
INSERT
UPDATE
DELETE
```

en una función RPC.

Usar el mecanismo más simple que resuelva correctamente el problema.

---

# 43. Lógica financiera

Las reglas financieras importantes no deben depender exclusivamente de la UI.

Ejemplos:

```text
cupo disponible
saldo de deuda
pagos
intereses
cuotas
```

Deben tener una fuente de verdad claramente definida.

---

# 44. Tarjeta de crédito

En FinanzasApp:

```text
TarjetaCredito
```

contiene información propia de la tarjeta, incluyendo:

* Usuario.
* Nombre.
* Entidad emisora.
* Cupo.
* Cupo disponible.
* Día de corte.
* Día de pago.
* Tasa.

La tasa pertenece a la tarjeta.

---

# 45. Compra con tarjeta

```text
CompraTarjeta
```

representa la compra realizada utilizando una tarjeta.

Una compra:

* pertenece a una tarjeta.
* puede tener categoría.
* tiene descripción.
* tiene valor.
* tiene fecha.
* puede generar una deuda.

La compra no debe almacenar nuevamente la tasa de la tarjeta.

---

# 46. Deuda

La deuda representa la obligación financiera generada.

Conceptualmente:

```text
CompraTarjeta
      ↓
    Deuda
```

Las cuotas pertenecen al concepto de deuda según el diseño actual.

---

# 47. Pago

El pago representa una reducción de la obligación.

Conceptualmente:

```text
Deuda
  ↓
Pago
```

No confundir:

```text
Compra
≠
Deuda
≠
Pago
```

---

# 48. Flujo financiero

El modelo actual debe entenderse conceptualmente como:

```text
Usuario
   ↓
Tarjeta
   ↓
Compra
   ↓
Deuda
   ↓
Pago
```

Mientras que los ingresos y gastos se manejan como conceptos financieros independientes según el modelo definido.

---

# 49. Cupo disponible

El `cupo_disponible` debe mantenerse consistente con las operaciones financieras que afecten la tarjeta.

No modificarlo arbitrariamente desde cualquier pantalla.

Debe existir una estrategia clara sobre:

```text
Compra
Pago
Cancelación
Eliminación
```

y cómo afectan el cupo.

---

# 50. Categorías

Las categorías deben utilizarse mediante sus relaciones correspondientes.

No duplicar nombres de categorías dentro de cada transacción si existe una entidad `Categoria`.

---

# 51. Ingresos

Los ingresos pertenecen al usuario correspondiente.

Las operaciones deben estar protegidas mediante Auth + RLS.

---

# 52. Gastos

Los gastos pertenecen al usuario correspondiente.

Las operaciones deben estar protegidas mediante Auth + RLS.

---

# 53. Consultas financieras

Evitar que cada pantalla implemente su propio cálculo del resumen financiero.

Si existe:

```text
Resumen financiero
```

definir claramente de dónde provienen sus datos.

---

# 54. Fuente única de verdad

No mantener simultáneamente:

```text
saldo en UI
+
saldo local
+
saldo Supabase
```

sin una estrategia clara de sincronización.

Supabase debe ser la fuente de verdad para los datos persistentes.

---

# 55. Estado local

React Native puede mantener temporalmente:

```text
loading
form values
selected filters
visual state
```

pero no debe convertirse accidentalmente en otra base de datos.

---

# 56. Cache

No introducir cache automáticamente.

Si se necesita:

* definir duración.
* definir invalidación.
* definir actualización.
* definir comportamiento offline.
* definir conflictos.

---

# 57. Refresh

Después de una modificación:

```text
Crear
↓
Actualizar estado o invalidar datos
↓
Mostrar información actualizada
```

Evitar consultas redundantes.

---

# 58. Paginación

Cuando las tablas puedan crecer considerablemente, evaluar paginación.

Especialmente:

* Gastos.
* Ingresos.
* Compras.
* Pagos.
* Movimientos.

No traer miles de registros al dispositivo sin necesidad.

---

# 59. Ordenamiento

Definir el orden desde la consulta cuando sea apropiado.

No depender de que PostgreSQL devuelva los registros en un orden accidental.

---

# 60. Filtros

Cuando un filtro pueda ejecutarse eficientemente en PostgreSQL, considerar hacerlo allí.

Ejemplo:

```text
fecha
categoría
tipo
tarjeta
estado
```

No traer información innecesaria al dispositivo para filtrarla toda localmente.

---

# 61. Búsqueda

Para grandes cantidades de datos:

```text
Usuario
↓
criterio de búsqueda
↓
Supabase/PostgreSQL
↓
resultados
```

Preferir esto frente a descargar toda la información.

---

# 62. Seguridad de consultas

No confiar en valores provenientes directamente del usuario.

Validar:

* IDs.
* Fechas.
* Montos.
* filtros.
* parámetros.
* relaciones.

RLS debe ser la segunda línea fundamental de protección.

---

# 63. IDs

Los IDs enviados desde rutas o formularios deben validarse.

Ejemplo:

```text
/cards/:id
```

No asumir que:

```text
id
```

siempre corresponde a un registro válido.

---

# 64. Datos inexistentes

Supabase puede devolver:

```text
data = null
```

o una colección vacía.

La aplicación debe manejar estos estados.

---

# 65. Empty state

Una consulta válida sin resultados no necesariamente es un error.

Distinguir:

```text
Sin datos
```

de:

```text
Error al consultar
```

---

# 66. Loading

Las consultas deben tener estado:

```text
loading
success
empty
error
```

cuando corresponda.

---

# 67. Suscripciones en tiempo real

No utilizar Realtime automáticamente.

Primero determinar si realmente se necesita.

Casos potenciales:

* cambios que deben reflejarse inmediatamente.
* múltiples clientes.
* actualizaciones externas.

Para datos financieros personales, evaluar cuidadosamente el costo y beneficio.

---

# 68. Storage

Supabase Storage debe utilizarse únicamente cuando exista una necesidad real de almacenar archivos.

Ejemplos posibles:

```text
avatars
comprobantes
documentos
imágenes
```

No almacenar archivos grandes directamente en PostgreSQL.

---

# 69. Storage y seguridad

Los archivos también deben tener políticas de acceso apropiadas.

No asumir que ocultar una URL es seguridad.

---

# 70. Auth + RLS

La combinación fundamental de seguridad es:

```text
Supabase Auth
       +
      RLS
```

Auth identifica al usuario.

RLS determina qué puede hacer con los datos.

---

# 71. Logout

Al cerrar sesión:

* limpiar sesión.
* limpiar información sensible en memoria.
* evitar mostrar datos del usuario anterior.
* regresar al flujo de autenticación.

---

# 72. Sesiones

No implementar manualmente tokens si Supabase Auth ya gestiona la sesión.

Utilizar los mecanismos oficiales del cliente de Supabase.

---

# 73. Consultas desde hooks

Un hook puede proporcionar una API limpia a la UI.

Ejemplo conceptual:

```ts
const {
  cards,
  loading,
  error,
  refresh,
} = useCreditCards();
```

La pantalla no necesita conocer los detalles de la consulta.

---

# 74. Service API

Los services pueden exponer operaciones claras:

```text
getCreditCards()
getCreditCardById()
createCreditCard()
updateCreditCard()
deleteCreditCard()
```

Evitar que la UI conozca detalles innecesarios de PostgreSQL.

---

# 75. Naming

Utilizar nombres coherentes con el dominio.

Ejemplos:

```text
creditCardService
purchaseService
debtService
paymentService
incomeService
expenseService
categoryService
```

No mezclar español e inglés arbitrariamente si el proyecto ya tiene una convención.

---

# 76. Consultas repetidas

Si varias pantallas necesitan exactamente la misma consulta:

No duplicarla sin necesidad.

Centralizarla donde aporte valor.

---

# 77. No ocultar consultas

La abstracción tampoco debe llegar al extremo de crear una capa imposible de entender.

Debe ser fácil responder:

```text
¿De dónde salen estos datos?
```

---

# 78. Transformaciones

Si Supabase devuelve:

```text
snake_case
```

y la aplicación utiliza:

```text
camelCase
```

mantener una estrategia consistente de transformación.

No convertir datos arbitrariamente en cada componente.

---

# 79. Fechas

PostgreSQL y TypeScript pueden manejar fechas de manera diferente.

Definir claramente:

```text
formato almacenado
formato transportado
formato mostrado
```

Considerar zona horaria.

---

# 80. Dinero

Los valores monetarios requieren cuidado.

No asumir que:

```text
number
```

resuelve automáticamente todos los problemas de precisión financiera.

Mantener una estrategia consistente de:

* decimales.
* redondeo.
* moneda.
* tasas.

---

# 81. Decimal

Si PostgreSQL utiliza tipos `numeric/decimal`, revisar cómo llegan a TypeScript y qué representación utiliza el cliente.

No convertir automáticamente valores financieros sin considerar precisión.

---

# 82. Validación

La validación debe existir en múltiples niveles cuando corresponda:

```text
UI
↓
Service
↓
PostgreSQL
```

La validación de React Native no reemplaza las restricciones de la base de datos.

---

# 83. Constraints

Utilizar PostgreSQL para proteger integridad mediante mecanismos como:

* NOT NULL.
* UNIQUE.
* FOREIGN KEY.
* CHECK.
* restricciones apropiadas.

No confiar exclusivamente en TypeScript.

---

# 84. Migraciones

Los cambios estructurales de PostgreSQL deben gestionarse mediante un proceso reproducible de migraciones.

No realizar cambios manuales sin registrar cómo reproducirlos.

---

# 85. Cambios de esquema

Antes de modificar una tabla:

1. Revisar relaciones.
2. Revisar RLS.
3. Revisar consultas.
4. Revisar tipos generados.
5. Revisar código consumidor.
6. Aplicar migración.
7. Actualizar tipos.
8. Verificar funcionalidad.

---

# 86. Eliminación de columnas

No eliminar una columna sin comprobar:

```text
frontend
services
hooks
queries
RLS
triggers
functions
```

---

# 87. RLS por tabla

Cada tabla que contenga información privada debe evaluarse individualmente.

No asumir que proteger una tabla protege automáticamente todas las relacionadas.

---

# 88. Relaciones y RLS

Cuando una operación acceda mediante relaciones:

```text
Compra
↓
Tarjeta
↓
Usuario
```

las políticas deben impedir que un usuario llegue indirectamente a datos de otro usuario.

---

# 89. Policies

Las policies deben ser:

* claras.
* específicas.
* mínimas.
* revisables.

Evitar policies excesivamente permisivas.

---

# 90. Política de lectura

Una política de `SELECT` debe responder:

```text
¿Quién puede leer este registro?
```

---

# 91. Política de inserción

Una política de `INSERT` debe responder:

```text
¿Quién puede crear este registro?
¿A qué usuario pertenece?
```

---

# 92. Política de actualización

Una política de `UPDATE` debe responder:

```text
¿Quién puede modificar este registro?
```

y considerar tanto el registro existente como los nuevos valores cuando sea necesario.

---

# 93. Política de eliminación

Una política de `DELETE` debe responder:

```text
¿Quién puede eliminar este registro?
```

---

# 94. Auth UID

Cuando corresponda, utilizar la identidad autenticada de Supabase:

```text
auth.uid()
```

para relacionar operaciones con el usuario actual.

---

# 95. No confiar en user_id del cliente

Un campo:

```text
usuario_id
```

enviado desde React Native no debe considerarse una prueba de identidad.

La identidad debe derivarse de la sesión/autenticación y protegerse mediante RLS.

---

# 96. Triggers

No utilizar triggers automáticamente.

Considerarlos cuando una regla de base de datos realmente deba ejecutarse independientemente del cliente.

Documentar su propósito.

---

# 97. Database Functions

Las funciones PostgreSQL pueden utilizarse para lógica que pertenece naturalmente a la base de datos.

No mover toda la lógica de negocio a PostgreSQL sin necesidad.

---

# 98. Arquitectura

La integración debe seguir:

```text
UI
↓
Hook
↓
Service / Repository
↓
Supabase
↓
PostgreSQL
```

cuando el tamaño de la funcionalidad lo justifique.

---

# 99. Separación de responsabilidades

Supabase no debe contener:

```text
UI
navegación
componentes
estilos
```

React Native tampoco debe contener toda la lógica SQL.

---

# 100. No ORM

Supabase no debe conceptualizarse como:

```text
Prisma
```

dentro de FinanzasApp.

El proyecto utiliza las capacidades de Supabase para acceder a PostgreSQL mediante su API.

No agregar Prisma para resolver consultas que Supabase ya puede manejar adecuadamente.

---

# 101. Complejidad

Utilizar:

```text
consulta directa
```

para operaciones simples.

Utilizar:

```text
service
```

cuando exista lógica de acceso reutilizable.

Utilizar:

```text
RPC / función PostgreSQL
```

cuando exista una necesidad real de lógica transaccional o de base de datos.

No crear capas innecesarias.

---

# 102. Performance

Evitar:

* consultas duplicadas.
* consultas en cada render.
* traer columnas innecesarias.
* traer miles de registros.
* múltiples consultas que podrían resolverse correctamente juntas.
* refresh innecesario.

---

# 103. Seguridad primero

Antes de optimizar una consulta:

```text
¿RLS está correcto?
¿Auth está correcto?
¿Los datos están protegidos?
```

La optimización nunca debe eliminar controles de seguridad.

---

# 104. Desarrollo local

Cuando se utilice Supabase localmente, mantener una configuración separada de producción.

No conectar accidentalmente el entorno de desarrollo con datos reales.

---

# 105. Entornos

Distinguir cuando corresponda:

```text
Development
Test
Production
```

Las credenciales y proyectos deben corresponder al entorno.

---

# 106. Datos de prueba

No utilizar datos financieros reales como datos de prueba si no es necesario.

Preferir datos ficticios.

---

# 107. Logs

No registrar:

* tokens.
* contraseñas.
* credenciales.
* información financiera sensible.
* información privada del usuario.

---

# 108. Debugging de Supabase

Ante un error:

1. Leer el error real.
2. Identificar la operación.
3. Revisar usuario autenticado.
4. Revisar ID.
5. Revisar consulta.
6. Revisar relaciones.
7. Revisar RLS.
8. Revisar constraints.
9. Revisar tipos.
10. Corregir la causa.

No desactivar seguridad para hacer desaparecer el error.

---

# 109. Errores comunes

Si una consulta devuelve `permission denied`, revisar:

```text
Auth
↓
auth.uid()
↓
RLS
↓
Policy
↓
Relaciones
```

No asumir inmediatamente que el problema está en React Native.

---

# 110. Error de constraint

Si PostgreSQL devuelve un error de integridad:

Revisar:

```text
NOT NULL
UNIQUE
FOREIGN KEY
CHECK
```

No ocultar la restricción.

La restricción normalmente está protegiendo la integridad de los datos.

---

# 111. Después de una mutación

Después de:

```text
INSERT
UPDATE
DELETE
```

la aplicación debe quedar sincronizada con Supabase.

Puede:

* actualizar el estado.
* invalidar/refrescar datos.
* utilizar el registro retornado.

Elegir la estrategia coherente con la arquitectura.

---

# 112. Evitar estado duplicado

No mantener una copia permanente de cada tabla de Supabase en múltiples componentes.

Evitar:

```text
cardsScreenCards
homeCards
dashboardCards
profileCards
```

sin una estrategia clara.

---

# 113. Fuente de verdad

Los datos persistentes deben tener una fuente de verdad clara:

```text
Supabase/PostgreSQL
```

El cliente representa esos datos.

---

# 114. Realtime

Si se utiliza Supabase Realtime:

* definir qué tabla escucha.
* definir qué eventos interesan.
* limpiar suscripciones.
* evitar suscripciones duplicadas.
* manejar reconexión.

No crear listeners globales innecesarios.

---

# 115. Suscripciones

Siempre limpiar suscripciones cuando corresponda.

Evitar:

```text
mount
↓
subscribe
↓
unmount
↓
subscribe nuevamente
```

sin limpiar la anterior.

---

# 116. Storage

Cuando se utilice Storage:

```text
Upload
↓
Storage
↓
URL / referencia
↓
Database
```

La base de datos puede almacenar la referencia necesaria, no necesariamente el archivo completo.

---

# 117. Auth y perfil

Separar conceptualmente:

```text
Supabase Auth User
```

de:

```text
datos adicionales del perfil
```

si el modelo del proyecto requiere una tabla propia de usuario/perfil.

---

# 118. Usuario del dominio

Si FinanzasApp posee una entidad `Usuario`, determinar claramente su relación con el usuario de Supabase Auth.

No duplicar identidades sin una razón.

---

# 119. Regla de dominio

El usuario autenticado debe ser el punto de partida para los datos privados.

Conceptualmente:

```text
Auth User
   ↓
Usuario
   ↓
Datos financieros
```

según el modelo final de la base de datos.

---

# 120. Pruebas

Las consultas críticas deben poder verificarse.

Priorizar:

* Auth.
* RLS.
* creación de datos.
* lectura de datos.
* actualización.
* eliminación.
* relaciones.
* restricciones financieras.

---

# 121. Testing de RLS

No basta con probar:

```text
Usuario A → sus datos
```

También debe verificarse conceptualmente:

```text
Usuario A → datos de B
```

y confirmar que el acceso sea rechazado o no exponga información.

---

# 122. Testing de relaciones

Comprobar que:

```text
Usuario
↓
Tarjeta
↓
Compra
↓
Deuda
↓
Pago
```

mantenga las relaciones esperadas.

---

# 123. Migraciones + tipos

Después de cambios de esquema:

```text
Migración
↓
Base de datos
↓
Tipos TypeScript
↓
Services
↓
Hooks
↓
UI
```

Verificar toda la cadena.

---

# 124. No modificar el esquema por comodidad de UI

La base de datos representa el dominio.

No agregar columnas solamente porque una pantalla resulta más fácil de implementar.

Primero analizar el dominio.

---

# 125. No modificar el dominio por comodidad de consulta

Tampoco deformar el modelo financiero únicamente para simplificar una consulta.

Si una consulta es compleja, evaluar:

* índices.
* consulta específica.
* view.
* función.
* RPC.

según el caso.

---

# 126. Índices

Cuando una tabla crezca, evaluar índices para columnas utilizadas frecuentemente en:

* filtros.
* joins.
* búsquedas.
* ordenamiento.

No crear índices indiscriminadamente.

---

# 127. Integridad financiera

Los datos financieros deben priorizar:

```text
precisión
+
consistencia
+
trazabilidad
```

sobre comodidad de implementación.

---

# 128. Auditoría

Si una funcionalidad requiere historial de cambios, diseñar explícitamente una estrategia de auditoría.

No asumir que PostgreSQL registra automáticamente todo lo necesario para el dominio.

---

# 129. Eliminación lógica

No utilizar `soft delete` automáticamente.

Determinar primero si el dominio necesita conservar registros eliminados.

---

# 130. Restricciones del dominio

Cuando una regla sea crítica, preferir que exista una protección persistente cuando sea posible.

Ejemplo:

```text
valor > 0
```

puede requerir validación tanto en UI como en PostgreSQL.

---

# 131. Seguridad por defecto

Ante cualquier duda:

```text
¿Este usuario debería poder acceder?
```

Si la respuesta no está clara, revisar la política antes de permitir la operación.

---

# 132. No confiar en el cliente

Todo lo enviado desde React Native debe considerarse manipulable.

Esto incluye:

* IDs.
* montos.
* usuario_id.
* categorías.
* fechas.
* estados.
* parámetros.

El backend/base de datos debe validar y autorizar.

---

# 133. Operaciones sensibles

Las operaciones que afecten:

* dinero.
* deuda.
* cupo.
* pagos.
* autenticación.

requieren especial cuidado.

---

# 134. Compra + deuda

Si registrar una compra implica crear/modificar más de una entidad:

```text
Compra
+
Deuda
+
Cupo
```

evaluar si la operación necesita atomicidad.

No asumir que tres requests independientes siempre son suficientes.

---

# 135. Pago + deuda + cupo

Igualmente, un pago puede afectar:

```text
Pago
↓
Saldo de deuda
↓
Cupo disponible
```

La implementación debe garantizar consistencia.

---

# 136. Regla contra race conditions

Operaciones financieras concurrentes deben analizarse cuidadosamente.

Ejemplo:

```text
Solicitud A modifica cupo
Solicitud B modifica cupo
```

No confiar únicamente en valores previamente cargados en React Native.

---

# 137. Cálculos sensibles

Cuando un cálculo determine un valor persistente crítico:

Evaluar dónde debe realizarse:

```text
Cliente
o
PostgreSQL
```

según la necesidad de consistencia y seguridad.

---

# 138. No duplicar reglas

Si una regla financiera existe en un único lugar, no copiar una versión diferente en:

```text
Screen
Hook
Service
Database
```

sin una razón.

Definir claramente la fuente de verdad.

---

# 139. Documentación

Documentar decisiones importantes relacionadas con:

* RLS.
* Auth.
* tablas.
* relaciones.
* RPC.
* triggers.
* funciones.
* índices.
* operaciones financieras.

---

# 140. Cambios peligrosos

Antes de modificar:

```text
RLS
Policies
Auth
Foreign Keys
Triggers
Functions
```

revisar impacto en toda la aplicación.

---

# 141. Revisión de una nueva tabla

Antes de crear una tabla:

```text
¿Pertenece al dominio?
¿Quién es su propietario?
¿Qué relaciones tiene?
¿Qué datos contiene?
¿Qué operaciones tendrá?
¿Qué RLS necesita?
¿Qué índices necesita?
```

---

# 142. Revisión de una nueva relación

Antes de crear una relación:

```text
¿Es realmente 1:1?
¿1:N?
¿N:N?
¿Necesita tabla intermedia?
```

No modelar relaciones solamente según la UI.

---

# 143. Tabla intermedia

Para relaciones N:N utilizar una entidad intermedia apropiada.

Ejemplo conceptual:

```text
User
↓
UserRole
↓
Role
```

cuando el dominio lo requiera.

---

# 144. Datos privados

Todo dato financiero debe considerarse privado por defecto.

No crear políticas públicas sin una razón explícita.

---

# 145. Public APIs

Si una funcionalidad requiere información pública:

Separarla conceptualmente de los datos privados.

No hacer públicas tablas completas solamente para obtener algunos datos.

---

# 146. Performance y seguridad

Una consulta más rápida no es mejor si:

```text
rompe RLS
```

Una política segura tampoco es suficiente si:

```text
hace inutilizable el flujo
```

Buscar equilibrio entre seguridad, claridad y performance.

---

# 147. Regla de mínima complejidad

Para una operación simple:

```text
Supabase query
```

es suficiente.

Para una operación reutilizable:

```text
Service
```

Para una operación compleja y transaccional:

```text
RPC / PostgreSQL
```

No crear cinco capas para una consulta sencilla.

---

# 148. Regla de consistencia

Todas las funcionalidades nuevas deben seguir las mismas convenciones de acceso a Supabase.

Evitar:

```text
Pantalla A → query directa
Pantalla B → repository
Pantalla C → hook
Pantalla D → RPC
```

sin una razón.

---

# 149. Procedimiento operativo

Para una nueva funcionalidad:

```text
1. Revisar requerimiento
2. Revisar modelo de datos
3. Identificar tablas
4. Revisar relaciones
5. Revisar Auth
6. Revisar RLS
7. Revisar tipos
8. Diseñar consulta
9. Implementar service si corresponde
10. Implementar hook si corresponde
11. Conectar UI
12. Manejar loading
13. Manejar errores
14. Probar autorización
15. Probar integridad
16. Revisar performance
```

---

# 150. Checklist de consulta

Antes de terminar una consulta:

* [ ] Sé qué tabla estoy consultando.
* [ ] Sé qué usuario puede acceder.
* [ ] RLS está contemplado.
* [ ] No estoy trayendo datos innecesarios.
* [ ] Los tipos son correctos.
* [ ] Los errores se manejan.
* [ ] El loading se maneja.
* [ ] No existe una consulta duplicada.
* [ ] La consulta está en el lugar correcto.

---

# 151. Checklist de mutación

Para `INSERT`, `UPDATE` o `DELETE`:

* [ ] Validé los datos.
* [ ] La operación está protegida por RLS.
* [ ] Las relaciones son válidas.
* [ ] Se respetan constraints.
* [ ] Se evita doble envío.
* [ ] Se maneja el error.
* [ ] Se actualiza la UI.
* [ ] Se mantiene la consistencia.
* [ ] Se evaluó atomicidad si afecta múltiples entidades.

---

# 152. Checklist de seguridad

* [ ] Supabase Auth está correctamente utilizado.
* [ ] RLS está habilitado donde corresponde.
* [ ] Las policies son específicas.
* [ ] No existe Service Role Key en el cliente.
* [ ] No hay secretos en el repositorio.
* [ ] No se confía en `usuario_id` enviado por el cliente.
* [ ] Los datos privados no son públicos.
* [ ] Se validan IDs y parámetros.

---

# 153. Checklist financiero

Para funcionalidades financieras:

* [ ] La regla pertenece al dominio correcto.
* [ ] No se confunden Compra, Deuda y Pago.
* [ ] La tasa pertenece a `TarjetaCredito`.
* [ ] Las cuotas pertenecen a `Deuda`.
* [ ] El cupo disponible mantiene consistencia.
* [ ] Los montos tienen precisión adecuada.
* [ ] Se consideran operaciones concurrentes.
* [ ] Se considera atomicidad cuando corresponde.
* [ ] La fuente de verdad está clara.

---

# 154. Regla de arquitectura

La skill de Supabase no debe decidir por sí sola toda la arquitectura.

Debe coordinarse con:

```text
Context
Software Architect
React Native
UI/UX
```

Supabase se encarga principalmente del backend de datos.

---

# 155. Regla de colaboración entre skills

Conceptualmente:

```text
Context
   ↓
Software Architect
   ↓
Supabase
   ↓
React Native
   ↓
UI/UX
```

La secuencia puede variar según la tarea, pero las responsabilidades no deben mezclarse.

---

# 156. Regla de no invención

Si no está claro:

* qué tabla utilizar.
* qué relación existe.
* qué policy existe.
* qué dato pertenece al usuario.
* dónde debe vivir una regla.

No inventar.

Revisar el esquema, contexto y código existente.

---

# 157. Regla de cambios mínimos

Una funcionalidad nueva no debe provocar automáticamente:

```text
reestructuración completa
```

de Supabase.

Modificar solamente lo necesario.

---

# 158. Regla de compatibilidad

Antes de modificar una tabla:

Revisar quién la utiliza.

Antes de modificar una policy:

Revisar qué operaciones dependen de ella.

Antes de modificar una relación:

Revisar consultas y tipos.

---

# 159. Resultado esperado

Una implementación correcta con Supabase debe conseguir:

```text
React Native
      ↓
Capa de acceso
      ↓
Supabase API
      ↓
PostgreSQL
```

con:

```text
Auth
+
RLS
+
Tipos
+
Integridad
+
Consultas eficientes
```

---

# 160. Principio definitivo

En FinanzasApp:

> **Supabase es el backend/API de datos de la aplicación.**

React Native consume sus servicios.

PostgreSQL almacena la información.

Supabase Auth identifica al usuario.

RLS protege los datos.

La aplicación no debe intentar reemplazar estos mecanismos con lógica solamente en el cliente.

La arquitectura debe permanecer:

```text
React Native
     ↓
Supabase
     ↓
PostgreSQL
```

y evolucionar de manera incremental.

No introducir Prisma.

No duplicar la base de datos en el cliente.

No desactivar RLS para solucionar errores.

No exponer secretos.

No confiar en el cliente para autorización.

No mezclar UI con consultas complejas.

No duplicar reglas financieras.

No crear abstracciones innecesarias.

La prioridad es:

```text
Seguridad
+
Integridad de datos
+
Correctitud
+
Claridad
+
Mantenibilidad
+
Performance
```

utilizando Supabase como el backend/API oficial de FinanzasApp.
