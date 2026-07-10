import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpaquetesComponent } from './counterpaquetes.component';

describe('CounterpaquetesComponent', () => {
  let component: CounterpaquetesComponent;
  let fixture: ComponentFixture<CounterpaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterpaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
