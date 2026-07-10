import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenPagoProfileComponent } from './orden-pago-profile.component';

describe('OrdenPagoProfileComponent', () => {
  let component: OrdenPagoProfileComponent;
  let fixture: ComponentFixture<OrdenPagoProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenPagoProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenPagoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
