import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateExerciseModalComponent } from './create-exercise-modal.component';

describe('CreateExerciseModalComponent', () => {
  let component: CreateExerciseModalComponent;
  let fixture: ComponentFixture<CreateExerciseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExerciseModalComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExerciseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
