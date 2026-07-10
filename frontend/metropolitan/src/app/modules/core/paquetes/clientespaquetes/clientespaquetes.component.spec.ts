import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientespaquetesComponent } from './clientespaquetes.component';

describe('ClientespaquetesComponent', () => {
  let component: ClientespaquetesComponent;
  let fixture: ComponentFixture<ClientespaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientespaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientespaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
