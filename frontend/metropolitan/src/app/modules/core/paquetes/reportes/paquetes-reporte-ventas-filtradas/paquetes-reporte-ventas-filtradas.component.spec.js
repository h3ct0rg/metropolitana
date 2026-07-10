"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var paquetes_reporte_ventas_filtradas_component_1 = require("./paquetes-reporte-ventas-filtradas.component");
describe('PaquetesReporteVentasFiltradasComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [paquetes_reporte_ventas_filtradas_component_1.PaquetesReporteVentasFiltradasComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(paquetes_reporte_ventas_filtradas_component_1.PaquetesReporteVentasFiltradasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=paquetes-reporte-ventas-filtradas.component.spec.js.map