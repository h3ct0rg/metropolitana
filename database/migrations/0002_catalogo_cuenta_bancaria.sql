/*
  0002_catalogo_cuenta_bancaria.sql

  Crea el catálogo de cuentas bancarias que hoy vive hardcodeado en el
  frontend (arreglo `cuentas`, solo visible cuando formaPago = "Cuenta de
  Banco"). Aditivo puro. Los ids nuevos NO se relacionan con los ids de string
  "1".."10" que usaba el picklist viejo del frontend -- ese valor nunca fue
  persistido como llave foránea real en ningún lado del backend (queda como
  texto libre en `numeroTarjeta`), así que no hay compatibilidad histórica que
  preservar aquí más allá de mantener los mismos 10 nombres/monedas.

  Seguro de re-ejecutar: todas las secciones están guardadas con IF NOT EXISTS.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'cuentaBancaria' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.cuentaBancaria (
        id          INT IDENTITY(1,1) NOT NULL,
        nombre      NVARCHAR(200)     NOT NULL,
        moneda      VARCHAR(10)       NOT NULL, -- 'USD' | 'BS'
        activo      BIT               NOT NULL CONSTRAINT DF_cuentaBancaria_activo DEFAULT (1),
        createdBy   INT               NULL,
        createdDate DATETIME          NULL CONSTRAINT DF_cuentaBancaria_createdDate DEFAULT (GETDATE()),
        modifyBy    INT               NULL,
        modifyDate  DATETIME          NULL,
        CONSTRAINT PK_cuentaBancaria PRIMARY KEY (id)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.cuentaBancaria WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT dbo.cuentaBancaria ON;

    INSERT INTO dbo.cuentaBancaria (id, nombre, moneda, activo)
    VALUES
      (1,  N'BANCO BISA CUENTA 11 EN DOLARES METRO',                    'USD', 1),
      (2,  N'BANCO BISA CUENTA 19 EN BOLIVIANOS METRO',                 'BS',  1),
      (3,  N'BANCO GANADERO CUENTA 39 EN DOLARES LILIANA',              'USD', 1),
      (4,  N'BANCO NACIONAL CUENTA 73 EN DOLARES METRO',                'USD', 1),
      (5,  N'BCP CUENTA 17 EN BOLIVIANOS ANDREA',                       'BS',  1),
      (6,  N'BCP CUENTA 301 EN BOLIVIANOS ANDREA',                      'BS',  1),
      (7,  N'GANADERO CUENTA 361 BOLIVIANOS Lilian',                    'BS',  1),
      (8,  N'BANCO MERCANTIL SANTA CRUZ CUENTA 252 BOLIVIANOS Liliana', 'BS',  1),
      (9,  N'BANCO UNION CUENTA 843 BOLIVIANOS Lilian Fiordoliva',      'BS',  1),
      (10, N'BANCO BISA CUENTA 4025 EN BS ANDREA',                      'BS',  1);

    SET IDENTITY_INSERT dbo.cuentaBancaria OFF;
END
GO
