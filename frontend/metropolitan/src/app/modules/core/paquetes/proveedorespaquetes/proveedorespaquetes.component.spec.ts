import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorespaquetesComponent } from './proveedorespaquetes.component';

describe('ProveedorespaquetesComponent', () => {
  let component: ProveedorespaquetesComponent;
  let fixture: ComponentFixture<ProveedorespaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedorespaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorespaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
