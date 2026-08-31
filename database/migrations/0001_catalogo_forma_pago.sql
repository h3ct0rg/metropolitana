/*
  0001_catalogo_forma_pago.sql

  Crea el catálogo de "formas de pago" que hoy vive hardcodeado en el frontend
  (arreglo `optionsMetodoPago` duplicado en los 3 módulos: travelace, carga,
  paquetes). Aditivo puro: solo CREATE TABLE + seed inicial con los mismos ids
  numéricos que ya usan las ND/OP existentes, para no romper referencias
  históricas.

  Seguro de re-ejecutar: todas las secciones están guardadas con IF NOT EXISTS.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'formaPago' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.formaPago (
        id                     INT IDENTITY(1,1) NOT NULL,
        nombre                 NVARCHAR(100)     NOT NULL,
        moneda                 VARCHAR(10)       NOT NULL, -- 'USD' | 'BS' | 'AMBOS'
        areasAplicables        NVARCHAR(100)     NULL,     -- p.ej. 'TRAVELACE,PAQUETES,CARGA'; NULL = todas
        requiereCuentaBancaria BIT               NOT NULL CONSTRAINT DF_formaPago_reqCuenta DEFAULT (0),
        activo                 BIT               NOT NULL CONSTRAINT DF_formaPago_activo DEFAULT (1),
        orden                  INT               NULL,
        createdBy              INT               NULL,
        createdDate            DATETIME          NULL CONSTRAINT DF_formaPago_createdDate DEFAULT (GETDATE()),
        modifyBy               INT               NULL,
        modifyDate             DATETIME          NULL,
        CONSTRAINT PK_formaPago PRIMARY KEY (id)
    );
END
GO

-- Semilla: preserva EXACTAMENTE los ids 1-6 ya usados hoy por el frontend/BD,
-- renombra el 1 ("Efectivo" -> "Efectivo Dólares") y agrega el 7 nuevo
-- ("Efectivo Bolivianos"). El 3 (Cheque) queda desactivado, no eliminado,
-- porque ND/OP históricas ya lo referencian.
IF NOT EXISTS (SELECT 1 FROM dbo.formaPago WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT dbo.formaPago ON;

    INSERT INTO dbo.formaPago (id, nombre, moneda, areasAplicables, requiereCuentaBancaria, activo, orden)
    VALUES
      (1, N'Efectivo Dólares',       'USD',   'TRAVELACE,PAQUETES,CARGA', 0, 1, 1),
      (2, N'Tarjeta Credito/Debito', 'USD',   'TRAVELACE,PAQUETES,CARGA', 0, 1, 2),
      (3, N'Cheque',                 'AMBOS', 'TRAVELACE,PAQUETES,CARGA', 0, 0, 3),
      (4, N'Cuenta de Banco',        'AMBOS', 'TRAVELACE,PAQUETES,CARGA', 1, 1, 4),
      (5, N'WE TRAVEL',              'USD',   'TRAVELACE,PAQUETES,CARGA', 0, 1, 5),
      (6, N'LINKSER',                'BS',    'TRAVELACE,PAQUETES,CARGA', 0, 1, 6),
      (7, N'Efectivo Bolivianos',    'BS',    'TRAVELACE,PAQUETES,CARGA', 0, 1, 7);

    SET IDENTITY_INSERT dbo.formaPago OFF;
END
GO

-- Nota: tras el IDENTITY_INSERT, SQL Server conserva el high-watermark de la
-- identidad (7), así que la próxima fila insertada normalmente (desde la
-- pantalla de Configuración) obtendrá id=8 automáticamente. No requiere
-- ningún RESEED manual.
