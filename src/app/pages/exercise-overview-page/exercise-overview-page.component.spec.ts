import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseOverviewPageComponent } from './exercise-overview-page.component';

describe('ExerciseOverviewPageComponent', () => {
  let component: ExerciseOverviewPageComponent;
  let fixture: ComponentFixture<ExerciseOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseOverviewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
