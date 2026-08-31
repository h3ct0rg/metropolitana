/*
  0004_orden_pago_tipo_cambio.sql

  Agrega el valor real del tipo de cambio a cada Orden de Pago, en los 3
  módulos (travelace, paquetes, carga) y en sus tablas "Anulado".

  La OP ya tenía `monedaPago` (INT) desde siempre -- esa columna existente se
  reutiliza tal cual, solo empieza a tener significado real. Lo que falta es
  la tasa: una OP puede pagarse en una fecha distinta a la de su ND, con una
  tasa distinta, y una vez que esa OP puntual queda pagada (pagado=1) esa tasa
  debe quedar congelada específicamente en su propia fila -- no alcanza con
  la tasa guardada en la ND (ver 0003).

  Seguro de re-ejecutar: cada ALTER está guardado con IF NOT EXISTS.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- Travelace (UA)
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.travelOrdenPago') AND name = 'tipoCambioValor')
    ALTER TABLE dbo.travelOrdenPago ADD tipoCambioValor FLOAT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.travelOrdenPagoAnulado') AND name = 'tipoCambioValor')
    ALTER TABLE dbo.travelOrdenPagoAnulado ADD tipoCambioValor FLOAT NULL;
GO

-- Paquetes
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.paquetesOrdenPago') AND name = 'tipoCambioValor')
    ALTER TABLE dbo.paquetesOrdenPago ADD tipoCambioValor FLOAT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.paquetesOrdenPagoAnulado') AND name = 'tipoCambioValor')
    ALTER TABLE dbo.paquetesOrdenPagoAnulado ADD tipoCambioValor FLOAT NULL;
GO

-- Carga
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.cargaOrdenPago') AND name = 'tipoCambioValor')
    ALTER TABLE dbo.cargaOrdenPago ADD tipoCambioValor FLOAT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.cargaOrdenPagoAnulado') AND name = 'tipoCambioValor')
    ALTER TABLE dbo.cargaOrdenPagoAnulado ADD tipoCambioValor FLOAT NULL;
GO
