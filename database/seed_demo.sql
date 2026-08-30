/*
  Seed de datos demo para "demoTurismoDev" (correr DESPUÉS de database/schema.sql).

  Incluye:
  - 2 sucursales (La Paz, Santa Cruz)
  - 1 usuario admin (usuario/pass = admin/admin, idRole='1' -> ve y accede a todo en la app,
    ya que TODOS los chequeos isAdmin([...]) del frontend incluyen el rol '1')
  - Clientes/operadores/counters/proveedores demo por módulo (Travelace, Carga, Paquetes)
  - 7 notas de débito + sus órdenes de pago por módulo (5 en La Paz, 2 en Santa Cruz),
    con montos y splits (Argentina/Agencia/Counter/Metropolitana) consistentes entre sí,
    y fechas repartidas en los últimos meses para que los gráficos de tendencia mensual
    del dashboard financiero tengan datos con forma.
  - generalCode: correlativos ("notaVenta"/"notaVentaCarga"/"notaVentaPaquete" y
    "ordenPagoTravel"/"ordenPagoCarga"/"ordenPagoPaquete") seedeados por sucursal para que,
    si se crea una nota/orden nueva desde la app después del seed, el número siga sin chocar.

  ADVERTENCIA DE SEGURIDAD: el login de esta app compara la contraseña en texto plano
  (sin hash) contra usersCompany.pass. admin/admin es SOLO para este ambiente de demo —
  nunca usar credenciales así en algo expuesto a internet.
*/

USE demoTurismoDev;
GO

-------------------------------------------------------------------------------
-- Sucursales
-------------------------------------------------------------------------------
INSERT INTO dbo.sucursales (nombre, direccion, telefonos, email, idEncargado, createdby, modifyBy, createdate, modifydate)
VALUES
  ('La Paz', 'Av. 16 de Julio 1234', '2-2200000', 'lapaz@metropolitana-demo.com', 1, 1, 1, GETDATE(), GETDATE()),
  ('Santa Cruz', 'Av. San Martín 500', '3-3300000', 'santacruz@metropolitana-demo.com', 1, 1, 1, GETDATE(), GETDATE());
GO

-------------------------------------------------------------------------------
-- Usuario admin (ve todo: idRole='1' aparece en TODOS los chequeos isAdmin del frontend)
-------------------------------------------------------------------------------
INSERT INTO dbo.usersCompany (nombre, ci, email, usuario, pass, idRole, idSucursal, createdBy, createdDate, modifyBy, modifieDate)
VALUES
  ('Administrador', '1234567', 'admin@metropolitana-demo.com', 'admin', 'admin', '1', 1, 1, GETDATE(), 1, GETDATE());
GO

-------------------------------------------------------------------------------
-- Proveedor (compartida entre módulos)
-------------------------------------------------------------------------------
INSERT INTO dbo.proveedor (nombre, direccion, telefono, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Proveedor Andino', 'Zona Sur, La Paz', '2-2711111', 1, GETDATE(), 1, GETDATE()),
  ('Proveedor del Sur', 'Equipetrol, Santa Cruz', '3-3522222', 1, GETDATE(), 1, GETDATE());
GO

-------------------------------------------------------------------------------
-- MÓDULO TRAVELACE (Universal Assistance)
-------------------------------------------------------------------------------

INSERT INTO dbo.clients (nombre, telefonos, fax, contacto, ruc, direccion, casilla, cargo, idSucursal, idCiudad, createdby, modifyBy, createdate, modifydate)
VALUES
  ('Agencia Bolivia Tours', '2-2440001', '2-2440001', 'Roberto Salinas', '1023456011', 'Av. Camacho 100, La Paz', '0101', 'Gerente', 1, 1, 1, 1, GETDATE(), GETDATE()),
  ('Viajes Andinos SRL', '2-2440002', '2-2440002', 'Patricia Loza', '1023456012', 'Calle Sagárnaga 200, La Paz', '0102', 'Gerente', 1, 1, 1, 1, GETDATE(), GETDATE()),
  ('Turismo Sudamérica', '3-3440003', '3-3440003', 'Fernando Justiniano', '1023456013', 'Av. Cristo Redentor 300, Santa Cruz', '0201', 'Gerente', 2, 2, 1, 1, GETDATE(), GETDATE());
GO

INSERT INTO dbo.operador (nombre, direccion, telefono, porcentageArgentina, porcentajeAgencia, counterId, porcentajeMetropolitan, idSucursal, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Aerolíneas del Sur', 'Av. Arce 400, La Paz', '2-2550001', 40, 20, 1, 40, 1, 1, GETDATE(), 1, GETDATE()),
  ('Global Assist Operador', 'Av. 6 de Agosto 500, La Paz', '2-2550002', 35, 25, 2, 40, 1, 1, GETDATE(), 1, GETDATE()),
  ('Turismo Sur Operador', 'Av. Monseñor Rivero 600, Santa Cruz', '3-3550003', 40, 20, 3, 40, 2, 1, GETDATE(), 1, GETDATE());
GO

INSERT INTO dbo.counter (nombre, nombreCod, direccion, telefono, porcentajeNormal, porcentajeLowCost, porcentajeCorp, porcentajeEspecial, idAgencia, idsProveedores, idSucursal, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Counter Central La Paz', 'CTR1', 'Av. Arce 400, La Paz', '2-2660001', 10, 5, 8, 12, 1, '1', 1, 1, GETDATE(), 1, GETDATE()),
  ('Counter VIP La Paz', 'CTR2', 'Av. 6 de Agosto 500, La Paz', '2-2660002', 10, 5, 8, 12, 2, '1', 1, 1, GETDATE(), 1, GETDATE()),
  ('Counter Santa Cruz', 'CTR3', 'Av. Monseñor Rivero 600, Santa Cruz', '3-3660003', 10, 5, 8, 12, 3, '2', 2, 1, GETDATE(), 1, GETDATE());
GO

INSERT INTO dbo.travelaceNotaDebito
  (codCliente, codCounter, codOperador, codTipoCambio, fechaGestion, pasajero, servicios, voucher, fechaVencimiento,
   totalArgentina, totalAgencia, totalCounter, totalMetropolitan, total, montoNeto, concepto, isEspecial,
   codigoUnicoNota, estado, idSucursal, createdBy, createdDate, modifyBy, modifyDate, estadoEditado)
VALUES
  (1, 1, 1, 1, '2026-03-15', 'Juan Pérez',       'Asistencia al Viajero',       'TRV-0001', '2026-05-14', 320, 160, 80,  240, 800,  800,  'Emision Nota de Debito', 0, 1, 0, 1, 1, '2026-03-15', 1, '2026-03-15', 0),
  (2, 2, 2, 1, '2026-04-10', 'María Gómez',      'Seguro Médico Internacional','TRV-0002', '2026-06-09', 400, 200, 100, 300, 1000, 1000, 'Emision Nota de Debito', 0, 2, 0, 1, 1, '2026-04-10', 1, '2026-04-10', 0),
  (1, 1, 1, 1, '2026-05-05', 'Carlos Fernández', 'AMP Cobertura Total',        'TRV-0003', '2026-07-04', 480, 240, 120, 360, 1200, 1200, 'Emision Nota de Debito', 0, 3, 1, 1, 1, '2026-05-05', 1, '2026-05-05', 0),
  (2, 2, 2, 1, '2026-06-12', 'Ana Rodríguez',    'Seguro Nacional',            'TRV-0004', '2026-08-11', 600, 300, 150, 450, 1500, 1500, 'Emision Nota de Debito', 0, 4, 0, 1, 1, '2026-06-12', 1, '2026-06-12', 0),
  (1, 1, 1, 1, '2026-07-10', 'Luis Martínez',    'Asistencia al Viajero',      'TRV-0005', '2026-09-08', 800, 400, 200, 600, 2000, 2000, 'Emision Nota de Debito', 0, 5, 0, 1, 1, '2026-07-10', 1, '2026-07-10', 0),
  (3, 3, 3, 1, '2026-06-20', 'Sofía Vargas',     'Seguro Médico Internacional','TRV-0006', '2026-08-19', 400, 200, 100, 300, 1000, 1000, 'Emision Nota de Debito', 0, 1, 0, 2, 1, '2026-06-20', 1, '2026-06-20', 0),
  (3, 3, 3, 1, '2026-07-18', 'Diego Castro',     'AMP Cobertura Total',        'TRV-0007', '2026-09-16', 720, 360, 180, 540, 1800, 1800, 'Emision Nota de Debito', 0, 2, 0, 2, 1, '2026-07-18', 1, '2026-07-18', 0);
GO

INSERT INTO dbo.travelOrdenPago
  (fechaPago, montoAPagar, monedaPago, saldoDeudor, numeroPago, formaPago, numeroTarjeta, concepto, anulado,
   idNotaDebito, pagado, codProfile, idSucursal, createdBy, modifyBy, createDate, modifyDate)
VALUES
  ('2026-03-20', 800,  0, 0,    1, 1, 'N/A', 'Pago Nota de Debito', 0, 1, 1, 'DEMO', 1, 1, 1, '2026-03-15', '2026-03-20'),
  ('2026-04-15', 1000, 0, 0,    2, 1, 'N/A', 'Pago Nota de Debito', 0, 2, 1, 'DEMO', 1, 1, 1, '2026-04-10', '2026-04-15'),
  ('2026-06-17', 1500, 0, 1500, 4, 1, 'N/A', 'Pago Nota de Debito', 0, 4, 0, 'DEMO', 1, 1, 1, '2026-06-12', '2026-06-12'),
  ('2026-07-15', 2000, 0, 2000, 5, 1, 'N/A', 'Pago Nota de Debito', 0, 5, 0, 'DEMO', 1, 1, 1, '2026-07-10', '2026-07-10'),
  ('2026-06-25', 1000, 0, 0,    1, 1, 'N/A', 'Pago Nota de Debito', 0, 1, 1, 'DEMO', 2, 1, 1, '2026-06-20', '2026-06-25'),
  ('2026-07-23', 1800, 0, 1800, 2, 1, 'N/A', 'Pago Nota de Debito', 0, 2, 0, 'DEMO', 2, 1, 1, '2026-07-18', '2026-07-18');
GO

INSERT INTO dbo.generalCode (nombre, numero, sucursal)
VALUES
  ('notaVenta', 5, 1),
  ('notaVenta', 2, 2),
  ('ordenPagoTravel', 4, 1),
  ('ordenPagoTravel', 2, 2);
GO

-------------------------------------------------------------------------------
-- MÓDULO CARGA
-------------------------------------------------------------------------------

INSERT INTO dbo.clienteCarga (nombre, telefonos, fax, contacto, ruc, direccion, casilla, cargo, idSucursal, idCiudad, createdby, modifyBy, createdate, modifydate)
VALUES
  ('Agencia Bolivia Tours', '2-2440001', '2-2440001', 'Roberto Salinas', '1023456011', 'Av. Camacho 100, La Paz', '0101', 'Gerente', 1, 1, 1, 1, GETDATE(), GETDATE()),
  ('Viajes Andinos SRL', '2-2440002', '2-2440002', 'Patricia Loza', '1023456012', 'Calle Sagárnaga 200, La Paz', '0102', 'Gerente', 1, 1, 1, 1, GETDATE(), GETDATE()),
  ('Turismo Sudamérica', '3-3440003', '3-3440003', 'Fernando Justiniano', '1023456013', 'Av. Cristo Redentor 300, Santa Cruz', '0201', 'Gerente', 2, 2, 1, 1, GETDATE(), GETDATE());
GO

INSERT INTO dbo.operadorCarga (nombre, direccion, telefono, porcentageArgentina, porcentajeAgencia, counterId, porcentajeMetropolitan, idSucursal, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Aerolíneas del Sur', 'Av. Arce 400, La Paz', '2-2550001', 40, 20, 1, 40, 1, 1, GETDATE(), 1, GETDATE()),
  ('Global Assist Operador', 'Av. 6 de Agosto 500, La Paz', '2-2550002', 35, 25, 2, 40, 1, 1, GETDATE(), 1, GETDATE()),
  ('Turismo Sur Operador', 'Av. Monseñor Rivero 600, Santa Cruz', '3-3550003', 40, 20, 3, 40, 2, 1, GETDATE(), 1, GETDATE());
GO

INSERT INTO dbo.counterCarga (nombre, nombreCod, direccion, telefono, porcentajeNormal, porcentajeLowCost, porcentajeCorp, porcentajeEspecial, idAgencia, idsProveedores, idSucursal, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Counter Central La Paz', 'CTR1', 'Av. Arce 400, La Paz', '2-2660001', 10, 5, 8, 12, 1, '1', 1, 1, GETDATE(), 1, GETDATE()),
  ('Counter VIP La Paz', 'CTR2', 'Av. 6 de Agosto 500, La Paz', '2-2660002', 10, 5, 8, 12, 2, '1', 1, 1, GETDATE(), 1, GETDATE()),
  ('Counter Santa Cruz', 'CTR3', 'Av. Monseñor Rivero 600, Santa Cruz', '3-3660003', 10, 5, 8, 12, 3, '2', 2, 1, GETDATE(), 1, GETDATE());
GO

INSERT INTO dbo.cargaNotaDebito
  (codCliente, codCounter, codOperador, codTipoCambio, fechaGestion, pasajero, servicios, voucher, fechaVencimiento,
   totalArgentina, totalAgencia, totalCounter, totalMetropolitan, total, montoNeto, concepto, isEspecial,
   codigoUnicoNota, estado, idSucursal, createdBy, createdDate, modifyBy, modifyDate, estadoEditado)
VALUES
  (1, 1, 1, 1, '2026-03-15', 'Juan Pérez',       'Carga General',       'CRG-0001', '2026-05-14', 320, 160, 80,  240, 800,  800,  'Emision Nota de Debito', 0, 1, 0, 1, 1, '2026-03-15', 1, '2026-03-15', 0),
  (2, 2, 2, 1, '2026-04-10', 'María Gómez',      'Carga Refrigerada',   'CRG-0002', '2026-06-09', 400, 200, 100, 300, 1000, 1000, 'Emision Nota de Debito', 0, 2, 0, 1, 1, '2026-04-10', 1, '2026-04-10', 0),
  (1, 1, 1, 1, '2026-05-05', 'Carlos Fernández', 'Carga Sobredimensionada','CRG-0003', '2026-07-04', 480, 240, 120, 360, 1200, 1200, 'Emision Nota de Debito', 0, 3, 1, 1, 1, '2026-05-05', 1, '2026-05-05', 0),
  (2, 2, 2, 1, '2026-06-12', 'Ana Rodríguez',    'Carga General',       'CRG-0004', '2026-08-11', 600, 300, 150, 450, 1500, 1500, 'Emision Nota de Debito', 0, 4, 0, 1, 1, '2026-06-12', 1, '2026-06-12', 0),
  (1, 1, 1, 1, '2026-07-10', 'Luis Martínez',    'Carga Refrigerada',   'CRG-0005', '2026-09-08', 800, 400, 200, 600, 2000, 2000, 'Emision Nota de Debito', 0, 5, 0, 1, 1, '2026-07-10', 1, '2026-07-10', 0),
  (3, 3, 3, 1, '2026-06-20', 'Sofía Vargas',     'Carga General',       'CRG-0006', '2026-08-19', 400, 200, 100, 300, 1000, 1000, 'Emision Nota de Debito', 0, 1, 0, 2, 1, '2026-06-20', 1, '2026-06-20', 0),
  (3, 3, 3, 1, '2026-07-18', 'Diego Castro',     'Carga Sobredimensionada','CRG-0007', '2026-09-16', 720, 360, 180, 540, 1800, 1800, 'Emision Nota de Debito', 0, 2, 0, 2, 1, '2026-07-18', 1, '2026-07-18', 0);
GO

INSERT INTO dbo.cargaOrdenPago
  (fechaPago, montoAPagar, monedaPago, saldoDeudor, numeroPago, formaPago, numeroTarjeta, concepto, anulado,
   idNotaDebito, pagado, codProfile, idSucursal, createdBy, modifyBy, createDate, modifyDate)
VALUES
  ('2026-03-20', 800,  0, 0,    1, 1, 'N/A', 'Pago Nota de Debito', 0, 1, 1, 'DEMO', 1, 1, 1, '2026-03-15', '2026-03-20'),
  ('2026-04-15', 1000, 0, 0,    2, 1, 'N/A', 'Pago Nota de Debito', 0, 2, 1, 'DEMO', 1, 1, 1, '2026-04-10', '2026-04-15'),
  ('2026-06-17', 1500, 0, 1500, 4, 1, 'N/A', 'Pago Nota de Debito', 0, 4, 0, 'DEMO', 1, 1, 1, '2026-06-12', '2026-06-12'),
  ('2026-07-15', 2000, 0, 2000, 5, 1, 'N/A', 'Pago Nota de Debito', 0, 5, 0, 'DEMO', 1, 1, 1, '2026-07-10', '2026-07-10'),
  ('2026-06-25', 1000, 0, 0,    1, 1, 'N/A', 'Pago Nota de Debito', 0, 1, 1, 'DEMO', 2, 1, 1, '2026-06-20', '2026-06-25'),
  ('2026-07-23', 1800, 0, 1800, 2, 1, 'N/A', 'Pago Nota de Debito', 0, 2, 0, 'DEMO', 2, 1, 1, '2026-07-18', '2026-07-18');
GO

INSERT INTO dbo.generalCode (nombre, numero, sucursal)
VALUES
  ('notaVentaCarga', 5, 1),
  ('notaVentaCarga', 2, 2),
  ('ordenPagoCarga', 4, 1),
  ('ordenPagoCarga', 2, 2);
GO

-------------------------------------------------------------------------------
-- MÓDULO PAQUETES
-------------------------------------------------------------------------------

INSERT INTO dbo.clientePaquetes (nombre, telefonos, fax, contacto, ruc, direccion, casilla, cargo, idSucursal, idCiudad, createdby, modifyBy, createdate, modifydate)
VALUES
  ('Agencia Bolivia Tours', '2-2440001', '2-2440001', 'Roberto Salinas', '1023456011', 'Av. Camacho 100, La Paz', '0101', 'Gerente', 1, 1, 1, 1, GETDATE(), GETDATE()),
  ('Viajes Andinos SRL', '2-2440002', '2-2440002', 'Patricia Loza', '1023456012', 'Calle Sagárnaga 200, La Paz', '0102', 'Gerente', 1, 1, 1, 1, GETDATE(), GETDATE()),
  ('Turismo Sudamérica', '3-3440003', '3-3440003', 'Fernando Justiniano', '1023456013', 'Av. Cristo Redentor 300, Santa Cruz', '0201', 'Gerente', 2, 2, 1, 1, GETDATE(), GETDATE());
GO

INSERT INTO dbo.operadorPaquetes (nombre, direccion, telefono, porcentageArgentina, porcentajeAgencia, counterId, porcentajeMetropolitan, idSucursal, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Aerolíneas del Sur', 'Av. Arce 400, La Paz', '2-2550001', 40, 20, 1, 40, 1, 1, GETDATE(), 1, GETDATE()),
  ('Global Assist Operador', 'Av. 6 de Agosto 500, La Paz', '2-2550002', 35, 25, 2, 40, 1, 1, GETDATE(), 1, GETDATE()),
  ('Turismo Sur Operador', 'Av. Monseñor Rivero 600, Santa Cruz', '3-3550003', 40, 20, 3, 40, 2, 1, GETDATE(), 1, GETDATE());
GO

INSERT INTO dbo.counterPaquetes (nombre, nombreCod, direccion, telefono, porcentajeNormal, porcentajeLowCost, porcentajeCorp, porcentajeEspecial, idAgencia, idsProveedores, idSucursal, createdBy, createdDate, modifyBy, modifyDate)
VALUES
  ('Counter Central La Paz', 'CTR1', 'Av. Arce 400, La Paz', '2-2660001', 10, 5, 8, 12, 1, '1', 1, 1, GETDATE(), 1, GETDATE()),
  ('Counter VIP La Paz', 'CTR2', 'Av. 6 de Agosto 500, La Paz', '2-2660002', 10, 5, 8, 12, 2, '1', 1, 1, GETDATE(), 1, GETDATE()),
  ('Counter Santa Cruz', 'CTR3', 'Av. Monseñor Rivero 600, Santa Cruz', '3-3660003', 10, 5, 8, 12, 3, '2', 2, 1, GETDATE(), 1, GETDATE());
GO

INSERT INTO dbo.paquetesNotaDebito
  (codCliente, codCounter, codOperador, codTipoCambio, fechaGestion, pasajero, servicios, voucher, fechaVencimiento,
   totalArgentina, totalAgencia, totalCounter, totalMetropolitan, total, montoNeto, concepto, isEspecial,
   codigoUnicoNota, estado, idSucursal, createdBy, createdDate, modifyBy, modifyDate, estadoEditado)
VALUES
  (1, 1, 1, 1, '2026-03-15', 'Juan Pérez',       'Envío de Paquetería', 'PAQ-0001', '2026-05-14', 320, 160, 80,  240, 800,  800,  'Emision Nota de Debito', 0, 1, 0, 1, 1, '2026-03-15', 1, '2026-03-15', 0),
  (2, 2, 2, 1, '2026-04-10', 'María Gómez',      'Paquete Express',     'PAQ-0002', '2026-06-09', 400, 200, 100, 300, 1000, 1000, 'Emision Nota de Debito', 0, 2, 0, 1, 1, '2026-04-10', 1, '2026-04-10', 0),
  (1, 1, 1, 1, '2026-05-05', 'Carlos Fernández', 'Paquete Voluminoso',  'PAQ-0003', '2026-07-04', 480, 240, 120, 360, 1200, 1200, 'Emision Nota de Debito', 0, 3, 1, 1, 1, '2026-05-05', 1, '2026-05-05', 0),
  (2, 2, 2, 1, '2026-06-12', 'Ana Rodríguez',    'Envío de Paquetería', 'PAQ-0004', '2026-08-11', 600, 300, 150, 450, 1500, 1500, 'Emision Nota de Debito', 0, 4, 0, 1, 1, '2026-06-12', 1, '2026-06-12', 0),
  (1, 1, 1, 1, '2026-07-10', 'Luis Martínez',    'Paquete Express',     'PAQ-0005', '2026-09-08', 800, 400, 200, 600, 2000, 2000, 'Emision Nota de Debito', 0, 5, 0, 1, 1, '2026-07-10', 1, '2026-07-10', 0),
  (3, 3, 3, 1, '2026-06-20', 'Sofía Vargas',     'Envío de Paquetería', 'PAQ-0006', '2026-08-19', 400, 200, 100, 300, 1000, 1000, 'Emision Nota de Debito', 0, 1, 0, 2, 1, '2026-06-20', 1, '2026-06-20', 0),
  (3, 3, 3, 1, '2026-07-18', 'Diego Castro',     'Paquete Voluminoso',  'PAQ-0007', '2026-09-16', 720, 360, 180, 540, 1800, 1800, 'Emision Nota de Debito', 0, 2, 0, 2, 1, '2026-07-18', 1, '2026-07-18', 0);
GO

INSERT INTO dbo.paquetesOrdenPago
  (fechaPago, montoAPagar, monedaPago, saldoDeudor, numeroPago, formaPago, numeroTarjeta, concepto, anulado,
   idNotaDebito, pagado, codProfile, idSucursal, createdBy, modifyBy, createDate, modifyDate)
VALUES
  ('2026-03-20', 800,  0, 0,    1, 1, 'N/A', 'Pago Nota de Debito', 0, 1, 1, 'DEMO', 1, 1, 1, '2026-03-15', '2026-03-20'),
  ('2026-04-15', 1000, 0, 0,    2, 1, 'N/A', 'Pago Nota de Debito', 0, 2, 1, 'DEMO', 1, 1, 1, '2026-04-10', '2026-04-15'),
  ('2026-06-17', 1500, 0, 1500, 4, 1, 'N/A', 'Pago Nota de Debito', 0, 4, 0, 'DEMO', 1, 1, 1, '2026-06-12', '2026-06-12'),
  ('2026-07-15', 2000, 0, 2000, 5, 1, 'N/A', 'Pago Nota de Debito', 0, 5, 0, 'DEMO', 1, 1, 1, '2026-07-10', '2026-07-10'),
  ('2026-06-25', 1000, 0, 0,    1, 1, 'N/A', 'Pago Nota de Debito', 0, 1, 1, 'DEMO', 2, 1, 1, '2026-06-20', '2026-06-25'),
  ('2026-07-23', 1800, 0, 1800, 2, 1, 'N/A', 'Pago Nota de Debito', 0, 2, 0, 'DEMO', 2, 1, 1, '2026-07-18', '2026-07-18');
GO

INSERT INTO dbo.generalCode (nombre, numero, sucursal)
VALUES
  ('notaVentaPaquete', 5, 1),
  ('notaVentaPaquete', 2, 2),
  ('ordenPagoPaquete', 4, 1),
  ('ordenPagoPaquete', 2, 2);
GO
