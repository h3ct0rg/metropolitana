"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var paquetes_reporte_ventas_component_1 = require("./paquetes-reporte-ventas.component");
describe('PaquetesReporteVentasComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [paquetes_reporte_ventas_component_1.PaquetesReporteVentasComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(paquetes_reporte_ventas_component_1.PaquetesReporteVentasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=paquetes-reporte-ventas.component.spec.js.map