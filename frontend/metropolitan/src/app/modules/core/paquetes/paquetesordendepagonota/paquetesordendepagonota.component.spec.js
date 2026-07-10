"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var paquetesordendepagonota_component_1 = require("./paquetesordendepagonota.component");
describe('PaquetesordendepagonotaComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [paquetesordendepagonota_component_1.PaquetesordendepagonotaComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(paquetesordendepagonota_component_1.PaquetesordendepagonotaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=paquetesordendepagonota.component.spec.js.map