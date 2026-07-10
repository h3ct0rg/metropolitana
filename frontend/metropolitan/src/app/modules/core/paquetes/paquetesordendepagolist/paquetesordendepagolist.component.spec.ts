import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesordendepagolistComponent } from './paquetesordendepagolist.component';

describe('PaquetesordendepagolistComponent', () => {
  let component: PaquetesordendepagolistComponent;
  let fixture: ComponentFixture<PaquetesordendepagolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesordendepagolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesordendepagolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
