import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosChartComponent } from './gastos-chart.component';

describe('GastosChartComponent', () => {
  let component: GastosChartComponent;
  let fixture: ComponentFixture<GastosChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
