import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProfitCounterComponent } from './report-profit-counter.component';

describe('ReportProfitCounterComponent', () => {
  let component: ReportProfitCounterComponent;
  let fixture: ComponentFixture<ReportProfitCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProfitCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProfitCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
