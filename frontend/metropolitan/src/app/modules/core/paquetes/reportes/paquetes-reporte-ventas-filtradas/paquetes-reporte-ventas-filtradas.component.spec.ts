import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesReporteVentasFiltradasComponent } from './paquetes-reporte-ventas-filtradas.component';

describe('PaquetesReporteVentasFiltradasComponent', () => {
  let component: PaquetesReporteVentasFiltradasComponent;
  let fixture: ComponentFixture<PaquetesReporteVentasFiltradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesReporteVentasFiltradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesReporteVentasFiltradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
