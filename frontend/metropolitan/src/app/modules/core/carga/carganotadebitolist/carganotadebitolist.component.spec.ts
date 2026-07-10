import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarganotadebitolistComponent } from './carganotadebitolist.component';

describe('PaquetesnotadebitolistComponent', () => {
  let component: CarganotadebitolistComponent;
  let fixture: ComponentFixture<CarganotadebitolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarganotadebitolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarganotadebitolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
