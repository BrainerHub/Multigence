import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridorReportComponent } from './corridor-report.component';

describe('CorridorReportComponent', () => {
  let component: CorridorReportComponent;
  let fixture: ComponentFixture<CorridorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorridorReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorridorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
