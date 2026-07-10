import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesordendepagonotaComponent } from './paquetesordendepagonota.component';

describe('PaquetesordendepagonotaComponent', () => {
  let component: PaquetesordendepagonotaComponent;
  let fixture: ComponentFixture<PaquetesordendepagonotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesordendepagonotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesordendepagonotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
