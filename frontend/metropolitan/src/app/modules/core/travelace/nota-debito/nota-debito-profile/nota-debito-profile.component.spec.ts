import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDebitoProfileComponent } from './nota-debito-profile.component';

describe('NotaDebitoProfileComponent', () => {
  let component: NotaDebitoProfileComponent;
  let fixture: ComponentFixture<NotaDebitoProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaDebitoProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaDebitoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
