import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseOverviewComponent } from './exercise-overview-page.component';

describe('ExerciseOverviewPageComponent', () => {
  let component: ExerciseOverviewComponent;
  let fixture: ComponentFixture<ExerciseOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
