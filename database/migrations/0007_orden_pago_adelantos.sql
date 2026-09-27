/*
  0007_orden_pago_adelantos.sql

  Agrega soporte para "Adelantos" (pagos parciales) sobre una Orden de Pago
  pendiente, en los 3 modulos (Travelace/Universal Assistance, Carga,
  Paquetes). Un adelanto NO marca la Orden de Pago como pagada -- solo resta
  del saldoDeudor ya existente en travelOrdenPago/cargaOrdenPago/
  paquetesOrdenPago (columna que hoy se escribe al crear la ND pero no se
  usaba para nada mas). La OP solo pasa a pagado=true por el flujo normal de
  "Pagar" cuando se liquida el 100% restante.

  Cada modulo tiene su propia tabla de adelantos (mismo patron que las tablas
  de Orden de Pago existentes), con las mismas columnas:
    - idOrdenPago: FK logica a la fila de travelOrdenPago/cargaOrdenPago/
      paquetesOrdenPago que se esta abonando.
    - idNotaDebito: codigoUnicoNota de la ND, para trazabilidad/reportes.
    - monto, concepto (libre, opcional), fechaPago, idSucursal, createBy,
      createDate.

  Seguro de re-ejecutar: cada CREATE TABLE esta guardado con IF NOT EXISTS.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'travelOrdenPagoAdelanto')
BEGIN
    CREATE TABLE dbo.travelOrdenPagoAdelanto (
        id INT IDENTITY(1,1) PRIMARY KEY,
        idOrdenPago INT NOT NULL,
        idNotaDebito INT NOT NULL,
        monto FLOAT NOT NULL,
        concepto NVARCHAR(500) NULL,
        fechaPago DATETIME NOT NULL,
        idSucursal INT NOT NULL,
        createBy INT NOT NULL,
        createDate DATETIME NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cargaOrdenPagoAdelanto')
BEGIN
    CREATE TABLE dbo.cargaOrdenPagoAdelanto (
        id INT IDENTITY(1,1) PRIMARY KEY,
        idOrdenPago INT NOT NULL,
        idNotaDebito INT NOT NULL,
        monto FLOAT NOT NULL,
        concepto NVARCHAR(500) NULL,
        fechaPago DATETIME NOT NULL,
        idSucursal INT NOT NULL,
        createBy INT NOT NULL,
        createDate DATETIME NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'paquetesOrdenPagoAdelanto')
BEGIN
    CREATE TABLE dbo.paquetesOrdenPagoAdelanto (
        id INT IDENTITY(1,1) PRIMARY KEY,
        idOrdenPago INT NOT NULL,
        idNotaDebito INT NOT NULL,
        monto FLOAT NOT NULL,
        concepto NVARCHAR(500) NULL,
        fechaPago DATETIME NOT NULL,
        idSucursal INT NOT NULL,
        createBy INT NOT NULL,
        createDate DATETIME NOT NULL
    );
END
GO
