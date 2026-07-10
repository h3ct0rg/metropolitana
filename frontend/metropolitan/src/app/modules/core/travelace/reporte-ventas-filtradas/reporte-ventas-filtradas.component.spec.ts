import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasFiltradasComponent } from './reporte-ventas-filtradas.component';

describe('ReporteVentasFiltradasComponent', () => {
  let component: ReporteVentasFiltradasComponent;
  let fixture: ComponentFixture<ReporteVentasFiltradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteVentasFiltradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVentasFiltradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
