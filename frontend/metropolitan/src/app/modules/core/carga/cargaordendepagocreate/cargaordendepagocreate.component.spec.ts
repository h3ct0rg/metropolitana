import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesordendepagocreateComponent } from './paquetesordendepagocreate.component';

describe('PaquetesordendepagocreateComponent', () => {
  let component: PaquetesordendepagocreateComponent;
  let fixture: ComponentFixture<PaquetesordendepagocreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesordendepagocreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesordendepagocreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
