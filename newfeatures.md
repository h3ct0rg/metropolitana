Al hacer las ND, poder poner el tipo de cambio del día (no es lo mismo en UA que en Paquetes, por lo que cada uno debe ser diferente. Incluso dentro de paquetes podrían haber diferentes tc durante el mismo día)

Elegir la moneda en la que nos están pagando la ND y que se imprima en esa moneda (Si Pagan en BS, la Nota sale en Bs , si es en USD, sale en USD)

La OP entonces muestra solo las formas de pago que le corresponde a cada moneda:
EFECTIVO deberíamos tener 2, un Efectivo Dólares y otro efectivo Bolivianos por favor. 
Tarjeta de Crédito/Débito es en dólares.
Bancos en Bs (7): , ,
Bancos en USD (3): ,,
WE TRAVEL tb es en dólares
LINKSER es en Bolivianos.
creo q en esta parte tendriamos q mover las formas de pago a una tabla en la BD y poder configurarlas desde configuracion, inficando a q areas pertenece, q tipo de cambio maneja y usar esa info para mostrar y usarla en el front, toma en cuenta q debe mantenerse los mismos ids q tiene ahora en el front por q las notas antiguas ya estan generadas con estos ids y lus nuevos deben seguira los ids desde donde se quedo la ultima creada

Quitar la opción de CHEQUE.

Poder sacar TODO el reporte de ventas en ambas monedas: poner tildes para sacarlo en Bolivianos o en Dólares.

Aumentar "FLUJO DE CAJA", es decir , poder sacar un detalle , entre las fechas q necesite, de cuantos dolares y bolivianos ingresaron y a q cuentas.