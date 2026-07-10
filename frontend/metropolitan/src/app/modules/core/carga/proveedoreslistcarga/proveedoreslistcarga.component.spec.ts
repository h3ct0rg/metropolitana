import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoreslistpaquetesComponent } from './proveedoreslistpaquetes.component';

describe('ProveedoreslistpaquetesComponent', () => {
  let component: ProveedoreslistpaquetesComponent;
  let fixture: ComponentFixture<ProveedoreslistpaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedoreslistpaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedoreslistpaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
