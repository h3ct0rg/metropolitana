import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesnotadebitoComponent } from './paquetesnotadebito.component';

describe('PaquetesnotadebitoComponent', () => {
  let component: PaquetesnotadebitoComponent;
  let fixture: ComponentFixture<PaquetesnotadebitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesnotadebitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesnotadebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
