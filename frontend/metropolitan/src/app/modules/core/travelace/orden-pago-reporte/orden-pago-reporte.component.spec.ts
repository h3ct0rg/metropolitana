import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenPagoReporteComponent } from './orden-pago-reporte.component';

describe('OrdenPagoReporteComponent', () => {
  let component: OrdenPagoReporteComponent;
  let fixture: ComponentFixture<OrdenPagoReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenPagoReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenPagoReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
