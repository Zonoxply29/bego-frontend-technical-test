# Cargo Orders App

Aplicación frontend para visualizar órdenes de carga, consultar próximos pedidos, filtrar por número de orden y revisar el detalle de cada orden.

El proyecto fue construido con una estructura modular para separar responsabilidades entre API, servicios, hooks, adaptadores, tipos y componentes visuales.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- SCSS Modules
- Fetch API

---

## Funcionalidades principales

### Vista de órdenes

- Consulta de pedidos próximos desde la API.
- Renderizado de cards de órdenes.
- Filtro por número de orden desde el componente `SearchBar`.
- Mapeo de estados visuales como `Assigned` e `In transit`.
- Mapeo de color del punto de estado según la información recibida por la API.
- Botón de pickup con contador:
  - Muestra cuánto falta para iniciar pickup.
  - Cuando el tiempo termina, muestra `Its time for pickup`.
  - Al hacer click imprime en consola: `Navegar`.
- Botón `Resume` para navegar a la vista de detalle de la orden.

### Vista de detalle

- Navegación desde `Resume`.
- Header con botón de regreso a la vista principal.
- Card superior con información general de la orden.
- Switch entre `Pickup` y `Dropoff`.
- Datos provenientes de `destinations`.
- Timeline de progreso basado en el `status` de la orden.
- Botón `Track Order`:
  - Se habilita únicamente cuando `status >= 3`.
  - Al hacer click imprime en consola: `Track Order`.
- Panel expandible para mostrar u ocultar información del pickup/dropoff seleccionado.
- Mapeo de teléfono y correo desde `contact_info`.

---

## Endpoints utilizados

La URL base se configura mediante variable de entorno:

```env
VITE_API_BASE_URL=https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io
```

Endpoints:

```txt
GET /orders/upcoming
GET /orders
```

### Nota importante sobre los datos

El endpoint `/orders/upcoming` devuelve la lista de órdenes próximas.

El endpoint `/orders` devuelve información detallada de una orden. Por eso la aplicación conserva la lista de `/orders/upcoming` como fuente principal y enriquece las órdenes con información de `/orders` cuando existe coincidencia por `_id` u `order_number`.

Esto permite conservar todas las cards de próximos pedidos sin perder información detallada cuando está disponible.

---

## Estructura del proyecto

```txt
src/
├─ adapters/
│  ├─ order-card.adapter.ts
│  └─ order-details.adapter.ts
│
├─ api/
│  ├─ apiClient.ts
│  └─ endpoints.ts
│
├─ assets/
│  └─ icons/
│
├─ components/
│  ├─ CargoDetailsSummary/
│  ├─ CargoHeader/
│  ├─ DestinationDataPanel/
│  ├─ NavigationButton/
│  ├─ OrderCard/
│  ├─ OrdersTabs/
│  ├─ SearchBar/
│  └─ TrackingProgressCard/
│
├─ hooks/
│  ├─ useEnrichedUpcomingOrders.ts
│  ├─ useNavigationCountdown.ts
│  ├─ useOrderDetails.ts
│  ├─ useOrderSearch.ts
│  └─ useOrders.ts
│
├─ pages/
│  ├─ CargoOrderDetailsPage/
│  └─ CargoOrdersPage/
│
├─ routes/
│  ├─ AppRouter.tsx
│  └─ routes.ts
│
├─ services/
│  └─ ordersService.ts
│
├─ styles/
│  └─ abstracts/
│
├─ types/
│  ├─ order-card.types.ts
│  ├─ order-details.types.ts
│  └─ orders.types.ts
│
├─ main.tsx
└─ App.tsx
```

---

## Instalación

Clonar el repositorio:

```bash
git clone <repository-url>
```

Entrar al proyecto:

```bash
cd <project-folder>
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

---

## Scripts disponibles

```bash
npm run dev
```

Levanta el servidor de desarrollo.

```bash
npm run build
```

Genera la versión de producción.

```bash
npm run preview
```

Permite revisar localmente el build de producción.

---

## Arquitectura y buenas prácticas aplicadas

### Separación de responsabilidades

La aplicación evita hacer llamadas HTTP directamente desde los componentes visuales.

Flujo general:

```txt
Page
→ Hook
→ Service
→ API Client
→ API
```

Ejemplo:

```txt
CargoOrdersPage
→ useEnrichedUpcomingOrders
→ useOrders
→ ordersService
→ apiClient
```

---

### Adaptadores de datos

La API no se consume directamente en la UI. Primero se adapta a modelos visuales.

```txt
Respuesta API
→ Adapter
→ Tipo visual
→ Componente
```

Adaptadores principales:

```txt
order-card.adapter.ts
order-details.adapter.ts
```

Esto evita que los componentes dependan de nombres internos de la API como:

```txt
order_number
status_class
reference_number
contact_info
```

Los componentes reciben datos ya preparados como:

```txt
orderNumber
status
statusDotVariant
referenceNumber
destinations
timeline
```

---

### Hooks principales

#### `useOrders`

Obtiene órdenes desde la API.

#### `useEnrichedUpcomingOrders`

Obtiene órdenes próximas y las enriquece con datos detallados cuando hay coincidencia.

#### `useOrderDetails`

Obtiene y adapta la información necesaria para la vista de detalle.

#### `useNavigationCountdown`

Compara la fecha de inicio contra la hora actual para habilitar el botón de pickup.

#### `useOrderSearch`

Filtra órdenes por número de orden.

---

## Reglas funcionales implementadas

### Filtro por orden

El buscador normaliza el texto para permitir búsquedas con o sin `#`, espacios o diferencia entre mayúsculas y minúsculas.

Ejemplos válidos:

```txt
7804
#7804GNZ
gnz
ID7PJQBJ
```

---

### Botón de pickup

El botón compara `startDate` contra la hora actual.

```txt
Si startDate > Date.now()
→ muestra contador
→ botón deshabilitado

Si startDate <= Date.now()
→ muestra "Its time for pickup"
→ botón habilitado
→ click imprime "Navegar"
```

---

### Timeline de detalle

El timeline se basa en el valor numérico de `status`.

```txt
status >= 1 → Created Order
status >= 2 → Accepted Order
status >= 3 → Pickup set up
status >= 4 → Pickup Completed
```

---

### Track Order

```txt
status < 3
→ botón deshabilitado

status >= 3
→ botón habilitado
→ click imprime "Track Order"
```

---

### Pickup / Dropoff data

La card superior permite seleccionar entre pickup y dropoff.

El panel inferior muestra la información correspondiente al destino seleccionado:

```txt
address
date
time
telephone
email
```

La información de contacto se toma desde:

```txt
destinations[index].contact_info.telephone
destinations[index].contact_info.email
```

---

## Consideraciones de API

Algunos datos no están disponibles en todos los endpoints.

Por ejemplo, `/orders/upcoming` puede no traer:

```txt
route.pickup
route.dropoff
reference_number
contact_info
```

Cuando esos datos no existen, la aplicación utiliza fallbacks seguros como:

```txt
Sin referencia
Sin teléfono
Sin correo
Recolección
Entrega
```

Esto evita errores de renderizado y mantiene la UI estable.

---

## Verificación manual

### Probar buscador

1. Ejecutar la app.
2. Escribir parte del número de orden.
3. Confirmar que solo se muestren las cards coincidentes.
4. Escribir un valor inexistente y validar el mensaje vacío.

### Probar pickup button

1. Revisar una orden con `startDate` futuro.
2. Confirmar que se muestra contador.
3. Revisar una orden con `startDate` vencido.
4. Confirmar que aparece `Its time for pickup`.
5. Hacer click y validar en consola `Navegar`.

### Probar detalle

1. Dar click en `Resume`.
2. Confirmar navegación a `/orders/:orderNumber`.
3. Cambiar entre pickup y dropoff.
4. Confirmar que cambia la información del panel inferior.
5. Abrir y cerrar el panel.
6. Validar que `Track Order` solo esté activo si `status >= 3`.

---

## Estado del proyecto

La prueba integra consumo de API, renderizado dinámico, navegación, adaptación de datos, manejo de estados, contador en tiempo real y componentes reutilizables con estilos modulares.
