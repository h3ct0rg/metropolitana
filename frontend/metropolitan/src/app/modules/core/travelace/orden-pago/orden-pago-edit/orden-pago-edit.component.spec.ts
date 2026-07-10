import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenPagoEditComponent } from './orden-pago-edit.component';

describe('OrdenPagoEditComponent', () => {
  let component: OrdenPagoEditComponent;
  let fixture: ComponentFixture<OrdenPagoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenPagoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenPagoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
