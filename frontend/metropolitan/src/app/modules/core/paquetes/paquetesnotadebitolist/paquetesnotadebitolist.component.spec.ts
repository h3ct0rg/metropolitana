import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesnotadebitolistComponent } from './paquetesnotadebitolist.component';

describe('PaquetesnotadebitolistComponent', () => {
  let component: PaquetesnotadebitolistComponent;
  let fixture: ComponentFixture<PaquetesnotadebitolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesnotadebitolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesnotadebitolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
