"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var paquetesordendepagoedit_component_1 = require("./paquetesordendepagoedit.component");
describe('PaquetesordendepagoeditComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [paquetesordendepagoedit_component_1.PaquetesordendepagoeditComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(paquetesordendepagoedit_component_1.PaquetesordendepagoeditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=paquetesordendepagoedit.component.spec.js.map