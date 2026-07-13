# Metropolitana

Sistema interno de gestión para Metropolitana, con tres líneas de negocio paralelas — **Travelace** (Universal Assistance), **Paquetes** y **Carga** — cada una con su propio flujo de Notas de Débito, Órdenes de Pago, clientes, operadores y counters. Incluye reportes de ventas, carga masiva por Excel, y dashboards ejecutivos (financiero y de actividad de usuarios).

## Stack

- **Frontend**: Angular 8 + [ng-zorro-antd](https://ng.ant.design/) 8.5.2, gráficos con `ng2-charts`/`chart.js` 2.x.
- **Backend**: ASP.NET Core 2.1, ADO.NET/`System.Data.SqlClient` puro (sin Entity Framework), sobre SQL Server.
- La base de datos es remota (hosteada en somee.com) — no hace falta levantar SQL Server localmente. La cadena de conexión está en `backend/Metropolitan/DataBase/connectionDB.cs`.

## Requisitos

- **Node.js 18** y **npm 9+** (probado con Node 18.17, npm 9.6.7).
- **Visual Studio 2019/2022** (o Build Tools equivalentes) con soporte de ASP.NET Core y **MSBuild de escritorio**. El backend **no** se puede compilar con `dotnet build`/`dotnet run` del SDK moderno: el proyecto `Common` usa una referencia COM (`ResolveComReference`), que solo el MSBuild de Visual Studio soporta. Por eso el flujo local pasa por Visual Studio, no por la CLI de `dotnet`.

## Correr el proyecto en local

### Backend

1. Abrir `backend/Metropolitan/Metropolitan.sln` en Visual Studio.
2. Restaurar paquetes NuGet (Visual Studio lo hace solo al abrir, o `botón derecho en la solución > Restaurar paquetes NuGet`).
3. Elegir el perfil de arranque **IIS Express** y ejecutar (F5). Esto expone la API en `http://localhost:58800/api` (puerto fijado en `backend/Metropolitan/Metropolitan/Properties/launchSettings.json`, que es el que espera el frontend en desarrollo).

### Frontend

```bash
cd frontend/metropolitan
npm install --legacy-peer-deps
npm start
```

- `npm start` corre `ng serve` → abre en `http://localhost:4200`.
- `--legacy-peer-deps` es necesario por un conflicto de peer-dependencies preexistente entre `@angular/http@7.2.16` (legacy) y el resto de paquetes `@angular/*@~8.2.14`.
- El frontend en modo desarrollo apunta a `http://localhost:58800/api` (`src/environments/environment.ts`) — el backend debe estar corriendo en ese puerto.

## Build de producción del frontend

```bash
cd frontend/metropolitan
npm install --legacy-peer-deps
NODE_OPTIONS=--openssl-legacy-provider npx ng build --configuration=production
```

- `NODE_OPTIONS=--openssl-legacy-provider` es necesario en Node 17+ por el cambio de proveedor OpenSSL (Node 18 lo requiere con esta versión de Angular CLI/Webpack).
- El resultado queda en `dist/metropolitan`, listo para servir como sitio estático (usa `src/environments/environment.prod.ts` como configuración de API, actualmente apuntando a `https://metropolitana.somee.com/nodo/publish/api`).
- Genera bundles diferenciales ES2015 (navegadores modernos) + ES5 (navegadores viejos) automáticamente.

En PowerShell, la variable de entorno se setea distinto:
```powershell
cd frontend/metropolitan
npm install --legacy-peer-deps
$env:NODE_OPTIONS="--openssl-legacy-provider"
npx ng build --configuration=production
```
