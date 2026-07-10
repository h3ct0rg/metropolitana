"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var reporte_ventas_filtradas_component_1 = require("./reporte-ventas-filtradas.component");
describe('ReporteVentasFiltradasComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [reporte_ventas_filtradas_component_1.ReporteVentasFiltradasComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(reporte_ventas_filtradas_component_1.ReporteVentasFiltradasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=reporte-ventas-filtradas.component.spec.js.map