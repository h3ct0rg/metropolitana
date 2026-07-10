import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesReporteVentasComponent } from './paquetes-reporte-ventas.component';

describe('PaquetesReporteVentasComponent', () => {
  let component: PaquetesReporteVentasComponent;
  let fixture: ComponentFixture<PaquetesReporteVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesReporteVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesReporteVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
