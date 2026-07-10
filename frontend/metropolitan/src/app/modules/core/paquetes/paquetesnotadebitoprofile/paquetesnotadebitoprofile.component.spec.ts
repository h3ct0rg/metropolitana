import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesnotadebitoprofileComponent } from './paquetesnotadebitoprofile.component';

describe('PaquetesnotadebitoprofileComponent', () => {
  let component: PaquetesnotadebitoprofileComponent;
  let fixture: ComponentFixture<PaquetesnotadebitoprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesnotadebitoprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesnotadebitoprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
