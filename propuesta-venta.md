# Propuesta de Implementación — Sistema Contable Metropolitana

---

## 1. Resumen Ejecutivo

**Sistema Contable Metropolitana** es una plataforma web integral para la gestión administrativa, contable y operativa de agencias de viajes. El sistema permite administrar clientes, proveedores, operadores turísticos, notas de débito, órdenes de pago y reportes de ventas para múltiples líneas de negocio desde un único panel de control.

Desarrollado con tecnologías modernas (Angular + .NET Core + SQL Server), el sistema está diseñado para ser modular, escalable y adaptable a las necesidades operativas de empresas del sector turístico y de servicios.

### Beneficios Clave
- **Gestión unificada** de múltiples líneas de negocio desde una plataforma
- **Reducción de errores** mediante automatización de cálculos contables
- **Reportes en tiempo real** con dashboard de indicadores financieros
- **Exportación a PDF** de documentos contables
- **Importación masiva** vía Excel
- **Acceso web** desde cualquier lugar, sin instalación

---

## 2. Descripción del Sistema

### Visión General

Plataforma web vertical para agencias de viajes que centraliza la gestión de:

| Área | Descripción |
|------|-------------|
| **Contabilidad** | Notas de débito, órdenes de pago, cálculo automático de comisiones |
| **CRM** | Gestión de clientes, proveedores, operadores, counters |
| **Reportes** | Ventas, profit por counter, reportes filtrados |
| **Dashboard** | KPIs financieros, actividad del sistema, proyecciones |

### Líneas de Negocio Soportadas

El sistema maneja de forma independiente **3 líneas de negocio**, cada una con su propio conjunto de datos, reglas y reportes:

| Línea | Descripción | Ejemplos de Uso |
|-------|-------------|-----------------|
| **Travelace / Universal Assistance** | Asistencia al viajero | Seguros de viaje, asistencia médica, coberturas |
| **Carga** | Carga/Logística | Fletes, transporte de carga, logística |
| **Paquetes** | Paquetes turísticos | Tours, paquetes vacacionales, reservas |

Cada línea tiene CRUD independiente de clientes, proveedores, counters, notas de débito, órdenes de pago y reportes.

---

## 3. Catálogo de Módulos y Funcionalidades

### 3.1 Módulo de Seguridad y Acceso

| Funcionalidad | Descripción |
|---------------|-------------|
| Login de usuarios | Autenticación mediante credenciales (usuario/contraseña) |
| Roles de usuario | Administrador y usuario estándar con permisos diferenciados |
| Protección de rutas | Acceso restringido a usuarios autenticados vía guardianes de ruta |
| Diseño responsive | Interfaz adaptable a desktop y tablets |

### 3.2 Dashboard Principal

| Funcionalidad | Descripción |
|---------------|-------------|
| KPIs financieros | Ingresos activos, total anulado, notas activas, monto pendiente |
| KPIs de actividad | Usuarios activos, eventos del día, notas del día |
| Ingresos mensuales | Gráfico de ingresos reales vs. proyectados (regresión lineal) |
| Ingresos por sucursal | Distribución de ingresos por ciudad/oficina |
| Top clientes | Clientes con mayor volumen de operaciones |
| Distribución por módulo | Volumen de operaciones por línea de negocio |
| Cuentas por cobrar | Resumen de pagado vs. pendiente |
| Eventos recientes | Bitácora de actividad del sistema |

### 3.3 Gestión de Clientes (Agencias)

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado de clientes | Tabla paginada con búsqueda y filtros |
| Crear cliente | Formulario con datos de contacto, fiscal y comercial |
| Editar cliente | Modificación de datos existentes |
| Eliminar cliente | Baja lógica de clientes |
| Asignación por sucursal | Clientes asociados a una ciudad/oficina |

*Disponible para las 3 líneas de negocio (Clientes Travelace, Carga y Paquetes)*

### 3.4 Gestión de Proveedores

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado de proveedores | Tabla paginada con búsqueda |
| CRUD completo | Crear, editar, eliminar proveedores |

### 3.5 Gestión de Operadores Turísticos

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado de operadores | Tabla paginada con búsqueda y filtros |
| CRUD completo | Crear, editar, eliminar operadores |
| Configuración de comisiones | % Argentina, % Agencia, % Metropolitana |
| Asignación de counter | Vinculación con counters |

### 3.6 Gestión de Counters (Vendedores)

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado de counters | Tabla paginada con búsqueda |
| CRUD completo | Crear, editar, eliminar counters |
| Configuración de comisiones | % Normal, % Low Cost, % Corporativo, % Especial |
| Asignación de proveedores | Vinculación con proveedores |

### 3.7 Gestión de Sucursales / Ciudades

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado de sucursales | Tabla paginada |
| CRUD completo | Crear, editar sucursales |
| Asignación de encargado | Responsable de sucursal |

### 3.8 Gestión de Usuarios del Sistema

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado de usuarios | Tabla paginada |
| CRUD completo | Crear, editar usuarios |
| Roles | Asignación de roles (admin / estándar) |
| Asignación por sucursal | Usuario vinculado a una ciudad/oficina |

### 3.9 Notas de Débito

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado | Tabla paginada con búsqueda por texto (agencia, pasajero, servicio, voucher) |
| Crear | Formulario con selección de cliente, pasajero, servicio, voucher, fechas |
| Editar | Modificación de notas existentes |
| Perfil / Detalle | Vista de detalle con diseño para impresión PDF |
| Cálculo automático | Distribución automática de montos: agencia, counter, operador, metropolitana, Argentina |
| Estados | Normal, Anulado, Remitido, Pendiente de Fecha |
| Anulación | Proceso de anulación con registro en log |
| Remisión | Marcar como remitido |
| ND Anulación | Nota de débito de anulación |
| Importación Excel | Carga masiva desde archivo .xls |
| Exportación PDF | Generación de documento PDF para impresión |

*Disponible para las 3 líneas de negocio*

### 3.10 Órdenes de Pago

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado | Tabla paginada con filtros |
| Crear | Selección de notas de débito pendientes, forma de pago |
| Editar | Modificación de órdenes existentes |
| Perfil / Detalle | Vista de detalle con diseño para impresión PDF |
| Formas de pago | Efectivo, Tarjeta, Cheque, Cuenta de Banco, WE Travel |
| Cálculo de saldo | Cálculo automático de saldo deudor |
| Exportación PDF | Generación de documento PDF para impresión |
| Conversión a letras | Monto en dólares expresado en texto |

*Disponible para las 3 líneas de negocio*

### 3.11 Reportes de Ventas

| Funcionalidad | Descripción |
|---------------|-------------|
| Reporte general | Ventas por operador en rango de fechas (formato landscape) |
| Profit por counter | Rentabilidad por vendedor en rango de fechas |
| Reporte filtrado | Ventas filtradas con múltiples criterios |
| Totales automáticos | Sumatorias de montos, comisiones, netos |
| Exportación PDF | Reportes descargables en PDF |

*Disponible para las 3 líneas de negocio*

### 3.12 Reporte de Notas de Débito por Cliente

| Funcionalidad | Descripción |
|---------------|-------------|
| Filtro por cliente | Selección de cliente específico |
| Filtro por fechas | Rango de fechas personalizable |
| Vista de detalle | Información completa de cada nota |
| Exportación PDF | Generación de reporte en PDF |
| Totales | Sumatorias de montos totales y comisiones |

### 3.13 Reporte de Órdenes de Pago

| Funcionalidad | Descripción |
|---------------|-------------|
| Filtro por sucursal | Selección de ciudad/oficina |
| Vista general | Órdenes de pago con detalle |

### 3.14 Módulo de Dashboards

| Funcionalidad | Descripción |
|---------------|-------------|
| Dashboard Financiero | Ingresos, proyecciones, top clientes, distribución por sucursal |
| Dashboard de Actividad | Usuarios activos, eventos del día, actividad por sucursal |
| Proyecciones | Regresión lineal para pronóstico de ingresos |

### 3.15 Auditoría y Logs

| Funcionalidad | Descripción |
|---------------|-------------|
| Registro de eventos | Trazabilidad de acciones críticas (impresión, anulación, filtros) |
| Persistencia | Almacenamiento en base de datos con fecha, usuario y sucursal |

---

## 4. Arquitectura Técnica

### 4.1 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | Angular | 8.3.23 |
| **UI Library** | NG-ZORRO Ant Design | 8.5.2 |
| **Backend API** | ASP.NET Core | 2.1 |
| **Backend Data** | .NET Framework | 4.7.2 |
| **Base de Datos** | SQL Server | (compatible con SQL Server 2012+) |
| **ORM** | ADO.NET (sin ORM) | Consultas SQL parametrizadas |
| **Autenticación** | JWT (token-based) | Personalizado |
| **PDF** | jsPDF + html2canvas | Generación cliente-side |
| **Excel** | NPOI / EPPlus | Importación .xls |
| **Gráficos** | Dashboard interactivo con KPIs | |

### 4.2 Diagrama de Arquitectura

```
[Browser] ←→ [Angular 8 SPA] ←→ [ASP.NET Core 2.1 API] ←→ [SQL Server]
                                                    ↓
                                            [.NET Framework 4.7.2]
                                        (Lógica de datos - ADO.NET)
```

### 4.3 Estructura de Datos

El sistema cuenta con aproximadamente **35+ tablas/entidades** distribuidas en:

- **Maestros:** Clientes, Proveedores, Operadores, Counters, Sucursales, Usuarios
- **Transaccionales:** Notas de Débito, Órdenes de Pago, Operaciones de Pago
- **Configuración:** Roles, Tipos de Cambio, Formas de Pago
- **Auditoría:** Logs de eventos

Cada línea de negocio (Travelace, Carga, Paquetes) tiene su propio conjunto de tablas transaccionales con estructura similar, permitiendo operación independiente.

### 4.4 Hosting y Despliegue

| Componente | Requisito |
|------------|-----------|
| Servidor Web | Windows Server / Linux con .NET Core runtime |
| Base de Datos | SQL Server (on-premise o cloud) |
| Dominio | DNS configurado con SSL |
| Almacenamiento | Para upload de imágenes y archivos Excel |

---

## 5. Propuesta de Implementación

### 5.1 Fases del Proyecto

**Fase 1 — Fundamentos (3-4 semanas)**
- Setup del proyecto (frontend + backend + BD)
- Módulo de autenticación y seguridad
- Gestión de sucursales, usuarios y roles
- Dashboard principal con KPIs básicos

**Fase 2 — Core Contable (6-8 semanas)**
- Gestión de clientes, proveedores, operadores y counters (3 líneas)
- Módulo de Notas de Débito completo (CRUD + cálculos + PDF)
- Módulo de Órdenes de Pago completo (CRUD + PDF)
- Importación Excel

**Fase 3 — Reportes y Dashboard (3-4 semanas)**
- Reportes de ventas (generales, profit, filtrados)
- Reportes de notas de débito y órdenes de pago
- Dashboard financiero completo
- Dashboard de actividad

**Fase 4 — Calidad y Despliegue (2-3 semanas)**
- Pruebas integrales
- Capacitación de usuarios
- Documentación técnica
- Despliegue en producción
- Ajustes post-puesta en marcha

**Tiempo total estimado: 14-19 semanas**

### 5.2 Personal Requerido

| Rol | Dedicación |
|-----|-----------|
| Project Manager | Tiempo parcial durante todo el proyecto |
| Desarrollador Frontend (Angular) | Tiempo completo (Fases 1-3) |
| Desarrollador Backend (.NET) | Tiempo completo (Fases 1-3) |
| DBA / SQL Developer | Tiempo parcial |
| Tester / QA | Tiempo completo (Fase 4) |
| Diseñador UX/UI | Tiempo parcial (Fase 1) |

---

## 6. Modelo de Cotización

### 6.1 Opciones de Licenciamiento

| Opción | Descripción |
|--------|-------------|
| **Licencia Perpetua** | Pago único por uso ilimitado del software. Incluye 1 año de soporte y actualizaciones. |
| **Suscripción Mensual** | Pago recurrente mensual. Incluye soporte, actualizaciones y hosting (opcional). |
| **SaaS (Cloud)** | Software como servicio. Sin instalación, hosting incluido, pago mensual por usuario. |

### 6.2 Componentes de la Cotización

| Componente | Incluye |
|------------|---------|
| **Implementación** | Configuración del proyecto, personalización de marca, parametrización inicial |
| **Desarrollo de Módulos** | Todos los módulos descritos en el catálogo (Sección 3) |
| **Capacitación** | Manuales de usuario, sesiones de capacitación virtual/presencial |
| **Soporte Técnico** | Mesa de ayuda, resolución de incidencias, actualizaciones menores |
| **Hosting (opcional)** | Servidor cloud, dominio, SSL, backup, monitoreo 24/7 |

### 6.3 Valor Agregado

- **Código fuente** entregado al cliente (sin vendor lock-in)
- **Arquitectura modular** permite agregar nuevas líneas de negocio sin modificar las existentes
- **Personalización** de colores, logo y marca del cliente (glassmorphism, responsive)
- **Escalabilidad** de 1 a N sucursales sin límite
- **Soporte** para importación de datos existentes (migración desde Excel u otros sistemas)

---

## 7. Próximos Pasos

1. Reunión de presentación y resolución de dudas
2. Firma de acuerdo de confidencialidad (NDA)
3. Presentación de demostración en vivo del sistema
4. Definición de requerimientos específicos del cliente
5. Elaboración de cronograma detallado y cotización final
6. Inicio del proyecto

---

**Contacto:** [Nombre de la Empresa] — [Teléfono] — [Email]

**Documento generado:** Julio 2026
