/*
  Script de recreación de la estructura de la base de datos "metropolitanaDB".

  Generado extrayendo en vivo el esquema real desde las vistas de sistema de SQL Server
  (sys.tables, sys.columns, sys.types, sys.identity_columns, sys.default_constraints,
  sys.key_constraints, sys.foreign_keys, sys.indexes) contra la BD remota usada por el
  proyecto (ver backend/Metropolitan/DataBase/connectionDB.cs).

  Confirmado contra la BD real (SQL Server 2016 SP3):
  - 26 tablas en total, todas en el esquema dbo.
  - NO existen foreign keys, índices adicionales (fuera de las PK), unique constraints,
    check constraints, triggers ni vistas en la base actual. La integridad referencial
    (p. ej. notaDebito -> clientes/operadores/counters) se maneja solo en el código de
    la aplicación (ADO.NET), no en la BD.
  - Todas las tablas tienen una PK de tipo IDENTITY(1,1) sobre "id", EXCEPTO:
      * counter   -> "id" es IDENTITY pero NO tiene ninguna PRIMARY KEY definida.
      * operador  -> "id" es IDENTITY pero NO tiene ninguna PRIMARY KEY definida.
    Esto es tal cual está en la base real hoy (posible descuido original, no una
    decisión de diseño). Se agregó igual la PK en este script porque claramente esa
    es la intención (mismo patrón que counterCarga/counterPaquetes y operadorCarga/
    operadorPaquetes, que sí la tienen) — si preferís replicar el defecto tal cual,
    comentá esas dos líneas de PRIMARY KEY marcadas abajo.
  - logsManagement.id es uniqueidentifier con DEFAULT (newid()), no es IDENTITY.
  - generalCode.numero es la única columna NOT NULL fuera de las PKs.

  Pensado para correr contra una base nueva y vacía.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-------------------------------------------------------------------------------
-- Compartidas / configuración
-------------------------------------------------------------------------------

CREATE TABLE dbo.sucursales (
    id          INT IDENTITY(1,1) NOT NULL,
    nombre      NVARCHAR(MAX)     NULL,
    direccion   NVARCHAR(MAX)     NULL,
    telefonos   NVARCHAR(MAX)     NULL,
    email       NVARCHAR(MAX)     NULL,
    idEncargado INT               NULL,
    createdby   INT               NULL,
    modifyBy    INT               NULL,
    createdate  DATE              NULL,
    modifydate  DATE              NULL,
    CONSTRAINT PK_sucursales PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.usersCompany (
    id          INT IDENTITY(1,1) NOT NULL,
    nombre      NVARCHAR(500)     NULL,
    ci          NCHAR(10)         NULL,
    email       NVARCHAR(500)     NULL,
    usuario     NVARCHAR(MAX)     NULL,
    pass        NVARCHAR(50)      NULL,
    idRole      VARCHAR(20)       NULL,
    idSucursal  INT               NULL,
    createdBy   INT               NULL,
    createdDate DATE              NULL,
    modifyBy    INT               NULL,
    modifieDate DATETIME          NULL,
    CONSTRAINT PK_usersCompany PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.generalCode (
    id       INT IDENTITY(1,1) NOT NULL,
    nombre   NVARCHAR(50)      NULL,
    numero   INT               NOT NULL,
    sucursal INT               NULL,
    CONSTRAINT PK_generalCode PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.logsManagement (
    id         UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_logsManagement_id DEFAULT (NEWID()),
    eventShoot NVARCHAR(MAX)    NULL,
    fromEvent  NVARCHAR(MAX)    NULL,
    userEvent  INT              NULL,
    itemUsed   NVARCHAR(MAX)    NULL,
    idSucursal INT              NULL,
    createDate DATETIME         NULL,
    CONSTRAINT PK_logs PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.proveedor (
    id          INT IDENTITY(1,1) NOT NULL,
    nombre      NVARCHAR(MAX)     NULL,
    direccion   NVARCHAR(MAX)     NULL,
    telefono    NVARCHAR(20)      NULL,
    createdBy   INT               NULL,
    createdDate DATE              NULL,
    modifyBy    INT               NULL,
    modifyDate  DATE              NULL,
    CONSTRAINT PK_proveedor PRIMARY KEY (id)
);
GO

-------------------------------------------------------------------------------
-- Módulo Travelace (Universal Assistance)
-------------------------------------------------------------------------------

CREATE TABLE dbo.clients (
    id          INT IDENTITY(1,1) NOT NULL,
    nombre      NVARCHAR(MAX)     NULL,
    telefonos   NVARCHAR(200)     NULL,
    fax         NVARCHAR(100)     NULL,
    contacto    NVARCHAR(200)     NULL,
    ruc         NVARCHAR(200)     NULL,
    direccion   NVARCHAR(MAX)     NULL,
    casilla     NVARCHAR(200)     NULL,
    cargo       NVARCHAR(200)     NULL,
    idSucursal  INT               NULL,
    idCiudad    INT               NULL,
    createdby   INT               NULL,
    modifyBy    INT               NULL,
    createdate  DATE              NULL,
    modifydate  DATE              NULL,
    CONSTRAINT PK_clients PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.operador (
    id                  INT IDENTITY(1,1) NOT NULL,
    nombre              NVARCHAR(MAX)     NULL,
    direccion           NVARCHAR(MAX)     NULL,
    telefono            NVARCHAR(20)      NULL,
    porcentageArgentina FLOAT             NULL,
    porcentajeAgencia   FLOAT             NULL,
    counterId           INT               NULL,
    porcentajeMetropolitan FLOAT          NULL,
    idSucursal          INT               NULL,
    createdBy           INT               NULL,
    createdDate         DATE              NULL,
    modifyBy            INT               NULL,
    modifyDate          DATE              NULL,
    CONSTRAINT PK_operador PRIMARY KEY (id) -- no existe en la BD real hoy; ver nota de cabecera
);
GO

CREATE TABLE dbo.counter (
    id                 INT IDENTITY(1,1) NOT NULL,
    nombre             NVARCHAR(MAX)     NULL,
    nombreCod          NVARCHAR(MAX)     NULL,
    direccion          NVARCHAR(MAX)     NULL,
    telefono           NVARCHAR(20)      NULL,
    porcentajeNormal   FLOAT             NULL,
    porcentajeLowCost  FLOAT             NULL,
    porcentajeCorp     FLOAT             NULL,
    porcentajeEspecial FLOAT             NULL,
    idAgencia          INT               NULL,
    idsProveedores     NVARCHAR(MAX)     NULL,
    idSucursal         INT               NULL,
    createdBy          INT               NULL,
    createdDate        DATE              NULL,
    modifyBy           INT               NULL,
    modifyDate         DATE              NULL,
    CONSTRAINT PK_counter PRIMARY KEY (id) -- no existe en la BD real hoy; ver nota de cabecera
);
GO

CREATE TABLE dbo.travelaceNotaDebito (
    id               INT IDENTITY(1,1) NOT NULL,
    codCliente       INT               NULL,
    codCounter       INT               NULL,
    codOperador      INT               NULL,
    codTipoCambio    INT               NULL,
    fechaGestion     DATE              NULL,
    pasajero         NVARCHAR(MAX)     NULL,
    servicios        NVARCHAR(MAX)     NULL,
    voucher          NVARCHAR(MAX)     NULL,
    fechaVencimiento DATE              NULL,
    totalArgentina   FLOAT             NULL,
    totalAgencia     FLOAT             NULL,
    totalCounter     FLOAT             NULL,
    totalMetropolitan FLOAT            NULL,
    total            FLOAT             NULL,
    montoNeto        FLOAT             NULL,
    concepto         NVARCHAR(MAX)     NULL,
    isEspecial       INT               NULL,
    codigoUnicoNota  INT               NULL,
    estado           INT               NULL,
    idSucursal       INT               NULL,
    createdBy        INT               NULL,
    createdDate      DATE              NULL,
    modifyBy         INT               NULL,
    modifyDate       DATE              NULL,
    estadoEditado    INT               NULL,
    CONSTRAINT PK_travelaceNotaDebito PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.travelaceNotaDebitoAnulada (
    id               INT IDENTITY(1,1) NOT NULL,
    codCliente       INT               NULL,
    codCounter       INT               NULL,
    codOperador      INT               NULL,
    codTipoCambio    INT               NULL,
    fechaGestion     DATE              NULL,
    pasajero         NVARCHAR(MAX)     NULL,
    servicios        NVARCHAR(MAX)     NULL,
    voucher          NVARCHAR(MAX)     NULL,
    fechaVencimiento DATE              NULL,
    totalArgentina   FLOAT             NULL,
    totalAgencia     FLOAT             NULL,
    totalCounter     FLOAT             NULL,
    totalMetropolitan FLOAT            NULL,
    total            FLOAT             NULL,
    montoNeto        FLOAT             NULL,
    concepto         NVARCHAR(MAX)     NULL,
    isEspecial       INT               NULL,
    codigoUnicoNota  INT               NULL,
    estado           INT               NULL,
    idSucursal       INT               NULL,
    createdBy        INT               NULL,
    createdDate      DATE              NULL,
    modifyBy         INT               NULL,
    modifyDate       DATE              NULL,
    estadoEditado    INT               NULL,
    CONSTRAINT PK_travelaceNotaDebitoAnulada PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.travelOrdenPago (
    id            INT IDENTITY(1,1) NOT NULL,
    fechaPago     DATETIME          NULL,
    montoAPagar   FLOAT             NULL,
    monedaPago    INT               NULL,
    saldoDeudor   FLOAT             NULL,
    numeroPago    INT               NULL,
    formaPago     INT               NULL,
    numeroTarjeta NCHAR(20)         NULL,
    concepto      NVARCHAR(MAX)     NULL,
    anulado       INT               NULL,
    idNotaDebito  INT               NULL,
    pagado        BIT               NULL,
    codProfile    NVARCHAR(MAX)     NULL,
    idSucursal    INT               NULL,
    createdBy     INT               NULL,
    modifyBy      INT               NULL,
    createDate    DATETIME          NULL,
    modifyDate    DATETIME          NULL,
    CONSTRAINT PK_travelOrdenPago PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.travelOrdenPagoAnulado (
    id            INT IDENTITY(1,1) NOT NULL,
    fechaPago     DATETIME          NULL,
    montoAPagar   FLOAT             NULL,
    monedaPago    INT               NULL,
    saldoDeudor   FLOAT             NULL,
    numeroPago    INT               NULL,
    formaPago     INT               NULL,
    numeroTarjeta NCHAR(20)         NULL,
    concepto      NVARCHAR(MAX)     NULL,
    anulado       INT               NULL,
    idNotaDebito  INT               NULL,
    pagado        BIT               NULL,
    codProfile    NVARCHAR(MAX)     NULL,
    idSucursal    INT               NULL,
    createdBy     INT               NULL,
    modifyBy      INT               NULL,
    createDate    DATETIME          NULL,
    modifyDate    DATETIME          NULL,
    CONSTRAINT PK_travelOrdenPagoAnulado PRIMARY KEY (id)
);
GO

-------------------------------------------------------------------------------
-- Módulo Paquetes
-------------------------------------------------------------------------------

CREATE TABLE dbo.clientePaquetes (
    id          INT IDENTITY(1,1) NOT NULL,
    nombre      NVARCHAR(MAX)     NULL,
    telefonos   NVARCHAR(200)     NULL,
    fax         NVARCHAR(100)     NULL,
    contacto    NVARCHAR(200)     NULL,
    ruc         NVARCHAR(200)     NULL,
    direccion   NVARCHAR(MAX)     NULL,
    casilla     NVARCHAR(200)     NULL,
    cargo       NVARCHAR(200)     NULL,
    idSucursal  INT               NULL,
    idCiudad    INT               NULL,
    createdby   INT               NULL,
    modifyBy    INT               NULL,
    createdate  DATE              NULL,
    modifydate  DATE              NULL,
    CONSTRAINT PK_clientePaquetes PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.operadorPaquetes (
    id                  INT IDENTITY(1,1) NOT NULL,
    nombre              NVARCHAR(MAX)     NULL,
    direccion           NVARCHAR(MAX)     NULL,
    telefono            NVARCHAR(20)      NULL,
    porcentageArgentina FLOAT             NULL,
    porcentajeAgencia   FLOAT             NULL,
    counterId           INT               NULL,
    porcentajeMetropolitan FLOAT          NULL,
    idSucursal          INT               NULL,
    createdBy           INT               NULL,
    createdDate         DATE              NULL,
    modifyBy            INT               NULL,
    modifyDate          DATE              NULL,
    CONSTRAINT PK_operadorPaquetes PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.counterPaquetes (
    id                 INT IDENTITY(1,1) NOT NULL,
    nombre             NVARCHAR(MAX)     NULL,
    nombreCod          NVARCHAR(MAX)     NULL,
    direccion          NVARCHAR(MAX)     NULL,
    telefono           NVARCHAR(20)      NULL,
    porcentajeNormal   FLOAT             NULL,
    porcentajeLowCost  FLOAT             NULL,
    porcentajeCorp     FLOAT             NULL,
    porcentajeEspecial FLOAT             NULL,
    idAgencia          INT               NULL,
    idsProveedores     NVARCHAR(MAX)     NULL,
    idSucursal         INT               NULL,
    createdBy          INT               NULL,
    createdDate        DATE              NULL,
    modifyBy           INT               NULL,
    modifyDate         DATE              NULL,
    CONSTRAINT PK_counterPaquetes PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.paquetesNotaDebito (
    id               INT IDENTITY(1,1) NOT NULL,
    codCliente       INT               NULL,
    codCounter       INT               NULL,
    codOperador      INT               NULL,
    codTipoCambio    INT               NULL,
    fechaGestion     DATE              NULL,
    pasajero         NVARCHAR(MAX)     NULL,
    servicios        NVARCHAR(MAX)     NULL,
    voucher          NVARCHAR(MAX)     NULL,
    fechaVencimiento DATE              NULL,
    totalArgentina   FLOAT             NULL,
    totalAgencia     FLOAT             NULL,
    totalCounter     FLOAT             NULL,
    totalMetropolitan FLOAT            NULL,
    total            FLOAT             NULL,
    montoNeto        FLOAT             NULL,
    concepto         NVARCHAR(MAX)     NULL,
    isEspecial       INT               NULL,
    codigoUnicoNota  INT               NULL,
    estado           INT               NULL,
    idSucursal       INT               NULL,
    createdBy        INT               NULL,
    createdDate      DATE              NULL,
    modifyBy         INT               NULL,
    modifyDate       DATE              NULL,
    estadoEditado    INT               NULL,
    CONSTRAINT PK_paquetesNotaDebito PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.paquetesNotaDebitoAnulado (
    id               INT IDENTITY(1,1) NOT NULL,
    codCliente       INT               NULL,
    codCounter       INT               NULL,
    codOperador      INT               NULL,
    codTipoCambio    INT               NULL,
    fechaGestion     DATE              NULL,
    pasajero         NVARCHAR(MAX)     NULL,
    servicios        NVARCHAR(MAX)     NULL,
    voucher          NVARCHAR(MAX)     NULL,
    fechaVencimiento DATE              NULL,
    totalArgentina   FLOAT             NULL,
    totalAgencia     FLOAT             NULL,
    totalCounter     FLOAT             NULL,
    totalMetropolitan FLOAT            NULL,
    total            FLOAT             NULL,
    montoNeto        FLOAT             NULL,
    concepto         NVARCHAR(MAX)     NULL,
    isEspecial       INT               NULL,
    codigoUnicoNota  INT               NULL,
    estado           INT               NULL,
    idSucursal       INT               NULL,
    createdBy        INT               NULL,
    createdDate      DATE              NULL,
    modifyBy         INT               NULL,
    modifyDate       DATE              NULL,
    estadoEditado    INT               NULL,
    CONSTRAINT PK_paquetesNotaDebitoAnulado PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.paquetesOrdenPago (
    id            INT IDENTITY(1,1) NOT NULL,
    fechaPago     DATETIME          NULL,
    montoAPagar   FLOAT             NULL,
    monedaPago    INT               NULL,
    saldoDeudor   FLOAT             NULL,
    numeroPago    INT               NULL,
    formaPago     INT               NULL,
    numeroTarjeta NCHAR(20)         NULL,
    concepto      NVARCHAR(MAX)     NULL,
    anulado       INT               NULL,
    idNotaDebito  INT               NULL,
    pagado        BIT               NULL,
    codProfile    NVARCHAR(MAX)     NULL,
    idSucursal    INT               NULL,
    createdBy     INT               NULL,
    modifyBy      INT               NULL,
    createDate    DATETIME          NULL,
    modifyDate    DATETIME          NULL,
    CONSTRAINT PK_paquetesOrdenPago PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.paquetesOrdenPagoAnulado (
    id            INT IDENTITY(1,1) NOT NULL,
    fechaPago     DATETIME          NULL,
    montoAPagar   FLOAT             NULL,
    monedaPago    INT               NULL,
    saldoDeudor   FLOAT             NULL,
    numeroPago    INT               NULL,
    formaPago     INT               NULL,
    numeroTarjeta NCHAR(20)         NULL,
    concepto      NVARCHAR(MAX)     NULL,
    anulado       INT               NULL,
    idNotaDebito  INT               NULL,
    pagado        BIT               NULL,
    codProfile    NVARCHAR(MAX)     NULL,
    idSucursal    INT               NULL,
    createdBy     INT               NULL,
    modifyBy      INT               NULL,
    createDate    DATETIME          NULL,
    modifyDate    DATETIME          NULL,
    CONSTRAINT PK_paquetesOrdenPagoAnulado PRIMARY KEY (id)
);
GO

-------------------------------------------------------------------------------
-- Módulo Carga
-------------------------------------------------------------------------------

CREATE TABLE dbo.clienteCarga (
    id          INT IDENTITY(1,1) NOT NULL,
    nombre      NVARCHAR(MAX)     NULL,
    telefonos   NVARCHAR(200)     NULL,
    fax         NVARCHAR(100)     NULL,
    contacto    NVARCHAR(200)     NULL,
    ruc         NVARCHAR(200)     NULL,
    direccion   NVARCHAR(MAX)     NULL,
    casilla     NVARCHAR(200)     NULL,
    cargo       NVARCHAR(200)     NULL,
    idSucursal  INT               NULL,
    idCiudad    INT               NULL,
    createdby   INT               NULL,
    modifyBy    INT               NULL,
    createdate  DATE              NULL,
    modifydate  DATE              NULL,
    CONSTRAINT PK_clienteCarga PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.operadorCarga (
    id                  INT IDENTITY(1,1) NOT NULL,
    nombre              NVARCHAR(MAX)     NULL,
    direccion           NVARCHAR(MAX)     NULL,
    telefono            NVARCHAR(20)      NULL,
    porcentageArgentina FLOAT             NULL,
    porcentajeAgencia   FLOAT             NULL,
    counterId           INT               NULL,
    porcentajeMetropolitan FLOAT          NULL,
    idSucursal          INT               NULL,
    createdBy           INT               NULL,
    createdDate         DATE              NULL,
    modifyBy            INT               NULL,
    modifyDate          DATE              NULL,
    CONSTRAINT PK_operadorCarga PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.counterCarga (
    id                 INT IDENTITY(1,1) NOT NULL,
    nombre             NVARCHAR(MAX)     NULL,
    nombreCod          NVARCHAR(MAX)     NULL,
    direccion          NVARCHAR(MAX)     NULL,
    telefono           NVARCHAR(20)      NULL,
    porcentajeNormal   FLOAT             NULL,
    porcentajeLowCost  FLOAT             NULL,
    porcentajeCorp     FLOAT             NULL,
    porcentajeEspecial FLOAT             NULL,
    idAgencia          INT               NULL,
    idsProveedores     NVARCHAR(MAX)     NULL,
    idSucursal         INT               NULL,
    createdBy          INT               NULL,
    createdDate        DATE              NULL,
    modifyBy           INT               NULL,
    modifyDate         DATE              NULL,
    CONSTRAINT PK_counterCarga PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.cargaNotaDebito (
    id               INT IDENTITY(1,1) NOT NULL,
    codCliente       INT               NULL,
    codCounter       INT               NULL,
    codOperador      INT               NULL,
    codTipoCambio    INT               NULL,
    fechaGestion     DATE              NULL,
    pasajero         NVARCHAR(MAX)     NULL,
    servicios        NVARCHAR(MAX)     NULL,
    voucher          NVARCHAR(MAX)     NULL,
    fechaVencimiento DATE              NULL,
    totalArgentina   FLOAT             NULL,
    totalAgencia     FLOAT             NULL,
    totalCounter     FLOAT             NULL,
    totalMetropolitan FLOAT            NULL,
    total            FLOAT             NULL,
    montoNeto        FLOAT             NULL,
    concepto         NVARCHAR(MAX)     NULL,
    isEspecial       INT               NULL,
    codigoUnicoNota  INT               NULL,
    estado           INT               NULL,
    idSucursal       INT               NULL,
    createdBy        INT               NULL,
    createdDate      DATE              NULL,
    modifyBy         INT               NULL,
    modifyDate       DATE              NULL,
    estadoEditado    INT               NULL,
    CONSTRAINT PK_cargaNotaDebito PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.cargaNotaDebitoAnulado (
    id               INT IDENTITY(1,1) NOT NULL,
    codCliente       INT               NULL,
    codCounter       INT               NULL,
    codOperador      INT               NULL,
    codTipoCambio    INT               NULL,
    fechaGestion     DATE              NULL,
    pasajero         NVARCHAR(MAX)     NULL,
    servicios        NVARCHAR(MAX)     NULL,
    voucher          NVARCHAR(MAX)     NULL,
    fechaVencimiento DATE              NULL,
    totalArgentina   FLOAT             NULL,
    totalAgencia     FLOAT             NULL,
    totalCounter     FLOAT             NULL,
    totalMetropolitan FLOAT            NULL,
    total            FLOAT             NULL,
    montoNeto        FLOAT             NULL,
    concepto         NVARCHAR(MAX)     NULL,
    isEspecial       INT               NULL,
    codigoUnicoNota  INT               NULL,
    estado           INT               NULL,
    idSucursal       INT               NULL,
    createdBy        INT               NULL,
    createdDate      DATE              NULL,
    modifyBy         INT               NULL,
    modifyDate       DATE              NULL,
    estadoEditado    INT               NULL,
    CONSTRAINT PK_cargaNotaDebitoAnulado PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.cargaOrdenPago (
    id            INT IDENTITY(1,1) NOT NULL,
    fechaPago     DATETIME          NULL,
    montoAPagar   FLOAT             NULL,
    monedaPago    INT               NULL,
    saldoDeudor   FLOAT             NULL,
    numeroPago    INT               NULL,
    formaPago     INT               NULL,
    numeroTarjeta NCHAR(20)         NULL,
    concepto      NVARCHAR(MAX)     NULL,
    anulado       INT               NULL,
    idNotaDebito  INT               NULL,
    pagado        BIT               NULL,
    codProfile    NVARCHAR(MAX)     NULL,
    idSucursal    INT               NULL,
    createdBy     INT               NULL,
    modifyBy      INT               NULL,
    createDate    DATETIME          NULL,
    modifyDate    DATETIME          NULL,
    CONSTRAINT PK_cargaOrdenPago PRIMARY KEY (id)
);
GO

CREATE TABLE dbo.cargaOrdenPagoAnulado (
    id            INT IDENTITY(1,1) NOT NULL,
    fechaPago     DATETIME          NULL,
    montoAPagar   FLOAT             NULL,
    monedaPago    INT               NULL,
    saldoDeudor   FLOAT             NULL,
    numeroPago    INT               NULL,
    formaPago     INT               NULL,
    numeroTarjeta NCHAR(20)         NULL,
    concepto      NVARCHAR(MAX)     NULL,
    anulado       INT               NULL,
    idNotaDebito  INT               NULL,
    pagado        BIT               NULL,
    codProfile    NVARCHAR(MAX)     NULL,
    idSucursal    INT               NULL,
    createdBy     INT               NULL,
    modifyBy      INT               NULL,
    createDate    DATETIME          NULL,
    modifyDate    DATETIME          NULL,
    CONSTRAINT PK_cargaOrdenPagoAnulado PRIMARY KEY (id)
);
GO
