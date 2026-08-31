/*
  0003_nota_debito_moneda_tipo_cambio.sql

  Agrega la moneda elegida y el valor real del tipo de cambio a cada Nota de
  Débito, en los 3 módulos (travelace, paquetes, carga) Y en sus tablas
  "Anulada"/"Anulado" -- la anulación hoy hace un INSERT explícito de columnas
  hacia la tabla anulada (ver notaDebitoTravelaceManagement.cs), así que si no
  se agregan estas columnas ahí también, el dato se pierde en cuanto se anula
  una ND.

  No se toca `codTipoCambio` (columna existente, vestigial, hardcodeada a 1 en
  el código actual) para no reinterpretar el significado de datos ya
  guardados. Las columnas nuevas son 100% opcionales (NULL) para no afectar
  filas existentes.

  Convención nueva: monedaNota = 1 (USD) | 2 (BS). NULL en filas viejas se
  interpreta en el código como "legacy, mostrar como USD", sin reescribir nada.

  Seguro de re-ejecutar: cada ALTER está guardado con IF NOT EXISTS.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- Travelace (UA)
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.travelaceNotaDebito') AND name = 'monedaNota')
    ALTER TABLE dbo.travelaceNotaDebito ADD monedaNota INT NULL, tipoCambioValor FLOAT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.travelaceNotaDebitoAnulada') AND name = 'monedaNota')
    ALTER TABLE dbo.travelaceNotaDebitoAnulada ADD monedaNota INT NULL, tipoCambioValor FLOAT NULL;
GO

-- Paquetes
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.paquetesNotaDebito') AND name = 'monedaNota')
    ALTER TABLE dbo.paquetesNotaDebito ADD monedaNota INT NULL, tipoCambioValor FLOAT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.paquetesNotaDebitoAnulado') AND name = 'monedaNota')
    ALTER TABLE dbo.paquetesNotaDebitoAnulado ADD monedaNota INT NULL, tipoCambioValor FLOAT NULL;
GO

-- Carga
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.cargaNotaDebito') AND name = 'monedaNota')
    ALTER TABLE dbo.cargaNotaDebito ADD monedaNota INT NULL, tipoCambioValor FLOAT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.cargaNotaDebitoAnulado') AND name = 'monedaNota')
    ALTER TABLE dbo.cargaNotaDebitoAnulado ADD monedaNota INT NULL, tipoCambioValor FLOAT NULL;
GO
