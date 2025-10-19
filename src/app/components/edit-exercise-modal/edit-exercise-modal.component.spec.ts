import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RuleResponseSchema } from '../../shared/generated';

import { EditExerciseModalComponent } from './edit-exercise-modal.component';

describe('EditExerciseModalComponent', () => {
  let component: EditExerciseModalComponent;
  let fixture: ComponentFixture<EditExerciseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExerciseModalComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EditExerciseModalComponent);
    component = fixture.componentInstance;

    // Provide required inputs
    component.exercise = {
      id: '1',
      name: 'Test Exercise',
      category: 'Test Category',
      mask: 'Anzahl',
      gold: '100',
      silver: '80',
      bronze: '60',
      gender: 'male',
      from_age: 18,
      to_age: 65,
      year: 2025,
      exercise: 'Test Exercise',
    } as unknown as RuleResponseSchema;
    component.modals = {
      editExerciseModal: { isActive: false },
    };
    component.exercises = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
