import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateCompletesComponent } from './create-completes-modal.component';

describe('CreateExerciseComponent', () => {
  let component: CreateCompletesComponent;
  let fixture: ComponentFixture<CreateCompletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCompletesComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCompletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
