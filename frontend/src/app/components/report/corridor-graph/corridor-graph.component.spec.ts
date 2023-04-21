import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridorGraphComponent } from './corridor-graph.component';

describe('CorridorGraphComponent', () => {
  let component: CorridorGraphComponent;
  let fixture: ComponentFixture<CorridorGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorridorGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorridorGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
