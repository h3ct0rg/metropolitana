import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesordendepareporteComponent } from './paquetesordendepareporte.component';

describe('PaquetesordendepareporteComponent', () => {
  let component: PaquetesordendepareporteComponent;
  let fixture: ComponentFixture<PaquetesordendepareporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesordendepareporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesordendepareporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
