import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalCreateComponent } from './sucursal-create.component';

describe('SucursalCreateComponent', () => {
  let component: SucursalCreateComponent;
  let fixture: ComponentFixture<SucursalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
