import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteslistpaquetesComponent } from './clienteslistpaquetes.component';

describe('ClienteslistpaquetesComponent', () => {
  let component: ClienteslistpaquetesComponent;
  let fixture: ComponentFixture<ClienteslistpaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteslistpaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteslistpaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
