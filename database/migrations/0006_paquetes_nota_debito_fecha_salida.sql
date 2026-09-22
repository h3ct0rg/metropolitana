/*
  0006_paquetes_nota_debito_fecha_salida.sql

  Agrega "Fecha de Salida" (fecha de viaje) a la Nota de Débito de Paquetes,
  distinta de fechaGestion (fecha de registro administrativo) y
  fechaVencimiento (fecha límite de pago) que ya existen. Es exclusiva de
  Paquetes -- Travelace/Carga no la usan, por eso solo se agrega a
  paquetesNotaDebito y paquetesNotaDebitoAnulado.

  Igual que con moneda/tipoCambio (ver 0003), la anulación de una ND hace un
  INSERT explícito de columnas hacia paquetesNotaDebitoAnulado (ver
  paquetesNotaDebitoTravelaceManagement.cs), así que la columna se agrega
  también ahí para no perder el dato al anular.

  Columna 100% opcional (NULL) para no afectar filas existentes.

  Seguro de re-ejecutar: cada ALTER está guardado con IF NOT EXISTS.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.paquetesNotaDebito') AND name = 'fechaSalida')
    ALTER TABLE dbo.paquetesNotaDebito ADD fechaSalida DATETIME NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.paquetesNotaDebitoAnulado') AND name = 'fechaSalida')
    ALTER TABLE dbo.paquetesNotaDebitoAnulado ADD fechaSalida DATETIME NULL;
GO
