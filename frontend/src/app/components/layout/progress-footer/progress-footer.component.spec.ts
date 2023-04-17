import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressFooterComponent } from './progress-footer.component';

describe('ProgressFooterComponent', () => {
  let component: ProgressFooterComponent;
  let fixture: ComponentFixture<ProgressFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
