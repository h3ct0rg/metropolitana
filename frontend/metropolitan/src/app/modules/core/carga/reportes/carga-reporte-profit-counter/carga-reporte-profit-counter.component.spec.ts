import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesReporteProfitCounterComponent } from './paquetes-reporte-profit-counter.component';

describe('PaquetesReporteProfitCounterComponent', () => {
  let component: PaquetesReporteProfitCounterComponent;
  let fixture: ComponentFixture<PaquetesReporteProfitCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesReporteProfitCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesReporteProfitCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
