import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridorLegendItemComponent } from './corridor-legend-item.component';

describe('CorridorLegendItemComponent', () => {
  let component: CorridorLegendItemComponent;
  let fixture: ComponentFixture<CorridorLegendItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorridorLegendItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorridorLegendItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
