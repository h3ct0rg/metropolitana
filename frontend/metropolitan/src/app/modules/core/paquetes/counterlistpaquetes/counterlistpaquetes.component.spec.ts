import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterlistpaquetesComponent } from './counterlistpaquetes.component';

describe('CounterlistpaquetesComponent', () => {
  let component: CounterlistpaquetesComponent;
  let fixture: ComponentFixture<CounterlistpaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterlistpaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterlistpaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
