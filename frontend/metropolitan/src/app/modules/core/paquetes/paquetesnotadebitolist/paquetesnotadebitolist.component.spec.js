"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var paquetesnotadebitolist_component_1 = require("./paquetesnotadebitolist.component");
describe('PaquetesnotadebitolistComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [paquetesnotadebitolist_component_1.PaquetesnotadebitolistComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(paquetesnotadebitolist_component_1.PaquetesnotadebitolistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=paquetesnotadebitolist.component.spec.js.map