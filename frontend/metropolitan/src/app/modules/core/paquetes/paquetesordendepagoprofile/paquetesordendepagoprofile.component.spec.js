"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var paquetesordendepagoprofile_component_1 = require("./paquetesordendepagoprofile.component");
describe('PaquetesordendepagoprofileComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [paquetesordendepagoprofile_component_1.PaquetesordendepagoprofileComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(paquetesordendepagoprofile_component_1.PaquetesordendepagoprofileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=paquetesordendepagoprofile.component.spec.js.map