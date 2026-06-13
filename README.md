# Cargo Orders App

## Delivery Links

* **GitHub Repository:** https://github.com/Zonoxply29/bego-frontend-technical-test
* **Live Demo:** https://bego-frontend-technical-test-gfzgmcevs-hugo-ggv-s-projects.vercel.app/

---

## Overview

Cargo Orders App is a frontend technical test developed for BEGO.
The application allows users to view upcoming cargo orders, search orders by number, check the status of each order, and open a detailed view with pickup, dropoff, tracking progress, and destination information.

The project was built with a modular structure to keep the code clean, reusable, and easy to maintain.

---

## Technologies Used

* React
* TypeScript
* Vite
* React Router DOM
* SCSS Modules
* Fetch API

---

## Main Features

### Cargo Orders View

* Fetches upcoming cargo orders from the API.
* Displays each order as a reusable card component.
* Allows searching orders by order number.
* Shows order status with visual indicators.
* Displays pickup and dropoff information.
* Includes a pickup countdown button:

  * Shows the remaining time before pickup starts.
  * Enables the button when the pickup time is reached.
  * Logs `Navegar` in the console when clicked.
* Includes a `Resume` button to navigate to the order details page.

### Cargo Details View

* Displays detailed information for a selected order.
* Allows switching between pickup and dropoff data.
* Shows the order reference number and order number.
* Displays destination address, date, time, phone, and email.
* Includes a tracking progress timeline based on the order status.
* Enables the `Track Order` button only when the order status allows it.
* Includes an expandable data panel.
* Provides a back button to return to the main orders view.

---

## API Configuration

The project uses a base URL configured through an environment variable.

Create a `.env` file in the root folder:

```env
VITE_API_BASE_URL=https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io
```

An `.env.example` file should also be included in the repository:

```env
VITE_API_BASE_URL=https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io
```

---

## API Endpoints

```txt
GET /orders/upcoming
GET /orders
```

### Important API Note

The `/orders/upcoming` endpoint returns the list of upcoming orders.

The `/orders` endpoint returns detailed information for an order.
For this reason, the application keeps `/orders/upcoming` as the main source for the order list and enriches the matching order with detailed information from `/orders` when possible.

This approach keeps all upcoming orders visible while still using additional details when they are available.

---

## Project Structure

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

## Installation

Clone the repository:

```bash
git clone https://github.com/Zonoxply29/bego-frontend-technical-test.git
```

Enter the project folder:

```bash
cd bego-frontend-technical-test
```

Install dependencies:

```bash
npm install
```

Create the `.env` file:

```env
VITE_API_BASE_URL=https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io
```

Run the project locally:

```bash
npm run dev
```

---

## Available Scripts

```bash
npm run dev
```

Runs the application in development mode.

```bash
npm run build
```

Builds the application for production.

```bash
npm run preview
```

Runs a local preview of the production build.

---

## Architecture

The project follows a clean separation of responsibilities.

```txt
Page
→ Hook
→ Service
→ API Client
→ API
```

Example:

```txt
CargoOrdersPage
→ useEnrichedUpcomingOrders
→ useOrders
→ ordersService
→ apiClient
```

This keeps API logic outside of the UI components and makes the project easier to test, maintain, and extend.

---

## Data Adapters

The application does not use raw API data directly inside the UI.

API responses are transformed by adapters before being passed to components.

```txt
API Response
→ Adapter
→ UI Type
→ Component
```

Main adapters:

```txt
order-card.adapter.ts
order-details.adapter.ts
```

This prevents components from depending directly on API field names such as:

```txt
order_number
status_class
reference_number
contact_info
```

Instead, components receive clean and prepared data such as:

```txt
orderNumber
status
statusDotVariant
referenceNumber
destinations
timeline
```

---

## Main Hooks

### `useOrders`

Fetches orders from the API.

### `useEnrichedUpcomingOrders`

Fetches upcoming orders and enriches them with detailed data when there is a match.

### `useOrderDetails`

Finds and adapts the selected order for the details page.

### `useNavigationCountdown`

Compares the pickup start date with the current time and controls the pickup button state.

### `useOrderSearch`

Filters orders by order number.

---

## Functional Rules

### Order Search

The search input normalizes the text to allow searches with or without `#`, spaces, or uppercase/lowercase differences.

Valid examples:

```txt
7804
#7804GNZ
gnz
ID7PJQBJ
```

---

### Pickup Button

The pickup button compares `startDate` with the current time.

```txt
If startDate > Date.now()
→ show countdown
→ button disabled

If startDate <= Date.now()
→ show "Its time for pickup"
→ button enabled
→ click logs "Navegar"
```

---

### Tracking Timeline

The tracking timeline is based on the numeric `status` value.

```txt
status >= 1 → Created Order
status >= 2 → Accepted Order
status >= 3 → Pickup set up
status >= 4 → Pickup Completed
```

---

### Track Order Button

```txt
status < 3
→ button disabled

status >= 3
→ button enabled
→ click logs "Track Order"
```

---

### Pickup and Dropoff Data

The user can select between pickup and dropoff in the summary card.

The lower panel displays the selected destination information:

```txt
address
date
time
telephone
email
```

Contact information is read from:

```txt
destinations[index].contact_info.telephone
destinations[index].contact_info.email
```

---

## API Fallbacks

Some fields are not available in all API responses.

For example, `/orders/upcoming` may not include:

```txt
route.pickup
route.dropoff
reference_number
contact_info
```

When data is missing, the application uses safe fallback values such as:

```txt
No reference
No phone
No email
Pickup
Dropoff
```

This prevents rendering errors and keeps the UI stable.

---

## Manual Testing Checklist

### Orders View

1. Open the live demo.
2. Confirm that the cargo order cards are displayed.
3. Search by order number.
4. Confirm that the list filters correctly.
5. Click the `Resume` button.
6. Confirm that the app navigates to the order details page.

### Pickup Button

1. Check an order with a future pickup date.
2. Confirm that the countdown is displayed.
3. Check an order with an available pickup time.
4. Confirm that the button shows `Its time for pickup`.
5. Click the button and confirm that `Navegar` appears in the console.

### Details View

1. Open an order detail page.
2. Switch between pickup and dropoff.
3. Confirm that the lower data panel updates.
4. Open and close the data panel.
5. Check that the timeline updates based on the order status.
6. Confirm that the `Track Order` button is enabled only when `status >= 3`.
7. Refresh a route like `/orders/:orderNumber` and confirm that it does not return a 404.

---

## Deployment

The project was deployed using Vercel.

A `vercel.json` file is included to support React Router routes in production:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Project Status

The project includes API integration, dynamic rendering, routing, data adaptation, state handling, real-time countdown logic, responsive components, and modular SCSS styling.
