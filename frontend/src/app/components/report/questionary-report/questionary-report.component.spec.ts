import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryReportComponent } from './questionary-report.component';

describe('QuestionaryReportComponent', () => {
  let component: QuestionaryReportComponent;
  let fixture: ComponentFixture<QuestionaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
