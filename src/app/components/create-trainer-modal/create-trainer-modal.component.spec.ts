import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateTrainerModalComponent } from './create-trainer-modal.component';

describe('CreateTrainerModalComponent', () => {
  let component: CreateTrainerModalComponent;
  let fixture: ComponentFixture<CreateTrainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrainerModalComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTrainerModalComponent);
    component = fixture.componentInstance;

    // Provide the required modal input
    component.modal = { title: 'Test Modal' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
