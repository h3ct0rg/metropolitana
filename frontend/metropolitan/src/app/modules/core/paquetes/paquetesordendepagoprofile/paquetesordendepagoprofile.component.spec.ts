import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesordendepagoprofileComponent } from './paquetesordendepagoprofile.component';

describe('PaquetesordendepagoprofileComponent', () => {
  let component: PaquetesordendepagoprofileComponent;
  let fixture: ComponentFixture<PaquetesordendepagoprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesordendepagoprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesordendepagoprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
