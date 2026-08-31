/*
  0005_tipo_cambio_config.sql

  Historial del "tipo de cambio del día" (USD -> Bs), configurable solo por
  roles administrador desde la nueva pantalla de Configuración. Se usa como
  valor por defecto (sugerido, editable) al crear una ND o una OP.

  Tabla de solo-INSERT: nunca se hace UPDATE sobre una fila existente. Fijar
  un nuevo tipo de cambio significa insertar una fila nueva; "el valor actual"
  se resuelve siempre tomando la fila más reciente (mayor id / createdDate).
  Esto da un historial de auditoría completo sin mutar nunca un registro ya
  guardado, coherente con el resto del enfoque aditivo de este proyecto.

  Seguro de re-ejecutar: la creación de tabla está guardada con IF NOT EXISTS;
  la semilla inicial solo se inserta si la tabla está vacía.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'tipoCambioConfig' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.tipoCambioConfig (
        id          INT IDENTITY(1,1) NOT NULL,
        valor       FLOAT             NOT NULL,
        createdBy   INT               NULL,
        createdDate DATETIME          NOT NULL CONSTRAINT DF_tipoCambioConfig_createdDate DEFAULT (GETDATE()),
        CONSTRAINT PK_tipoCambioConfig PRIMARY KEY (id)
    );
END
GO

-- Semilla inicial: mismo valor que hoy está hardcodeado en el frontend
-- (6.96), para que el primer ND/OP creado tras el despliegue ya tenga un
-- default razonable en vez de un campo vacío.
IF NOT EXISTS (SELECT 1 FROM dbo.tipoCambioConfig)
BEGIN
    INSERT INTO dbo.tipoCambioConfig (valor, createdBy) VALUES (6.96, NULL);
END
GO
