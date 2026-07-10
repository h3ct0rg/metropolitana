import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesordendepagoeditComponent } from './paquetesordendepagoedit.component';

describe('PaquetesordendepagoeditComponent', () => {
  let component: PaquetesordendepagoeditComponent;
  let fixture: ComponentFixture<PaquetesordendepagoeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaquetesordendepagoeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaquetesordendepagoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
