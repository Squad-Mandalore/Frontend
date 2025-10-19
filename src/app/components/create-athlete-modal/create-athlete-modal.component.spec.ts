import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAthleteModalComponent } from './create-athlete-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { AthletesService } from '../../shared/generated';
import { UtilService } from '../../shared/service-util';

describe('CreateAthleteModalComponent', () => {
  let component: CreateAthleteModalComponent;
  let fixture: ComponentFixture<CreateAthleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateAthleteModalComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [AthletesService, UtilService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAthleteModalComponent);
    component = fixture.componentInstance;

    // Provide required input
    component.modal = { title: 'Test Modal' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit athleteCallback when form is valid and submitted', () => {
    spyOn(component.athleteCallback, 'emit');

    component.createAthleteForm.setValue({
      username: 'johndoe',
      email: 'john@example.com',
      unhashed_password: 'password12345', // valid 12+ character password
      firstname: 'John',
      lastname: 'Doe',
      gender: 'm',
      birthday: '1990-01-01',
    });

    component.isMale = true;
    fixture.detectChanges(); // Trigger change detection to update password-box validation

    component.onSubmit();

    expect(component.athleteCallback.emit).toHaveBeenCalledWith(
      component.createAthleteForm,
    );
  });

  it('should not emit athleteCallback when form is invalid', () => {
    spyOn(component.athleteCallback, 'emit');

    component.createAthleteForm.setValue({
      username: '', // invalid - empty username
      email: 'invalid-email', // invalid email format
      unhashed_password: 'short', // invalid - too short password
      firstname: '',
      lastname: '',
      gender: 'm',
      birthday: '',
    });

    component.isMale = true;
    fixture.detectChanges();

    component.onSubmit();

    expect(component.athleteCallback.emit).not.toHaveBeenCalled();
  });

  it('should validate birthday format correctly', () => {
    component.createAthleteForm.setValue({
      username: 'test_user',
      unhashed_password: 'password123',
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      gender: 'm',
      birthday: '', // Invalid empty birthday
    });
    component.onSubmit();

    expect(component.createAthleteForm.invalid).toBeTruthy();

    component.createAthleteForm.setValue({
      username: 'test_user2',
      unhashed_password: 'password1234',
      email: 'test2@example.com',
      firstname: 'John',
      lastname: 'Hoe',
      gender: 'm',
      birthday: '2005-01-03',
    });
    component.onSubmit();

    expect(component.createAthleteForm.valid).toBeTruthy();
  });

  it('should validate form fields', () => {
    const form = component.createAthleteForm;
    // Set invalid values for testing
    form.setValue({
      username: '', // empty username
      unhashed_password: 'password12345', // valid password (12+ chars)
      email: 'invalidemail', // invalid email
      firstname: '', // empty firstname
      lastname: '', // empty lastname
      gender: 'm', // valid gender
      birthday: '', // empty birthday
    });

    // Trigger form submission
    component.onSubmit();

    // Expect the form to be invalid due to invalid inputs
    expect(form.invalid).toBe(true);

    // Expect appropriate error messages for each invalid field
    expect(form.get('username')!.errors!).toBeTruthy();
    expect(form.get('unhashed_password')!.errors).toBeNull(); // No error for password
    expect(form.get('email')!.errors!).toBeTruthy();
    expect(form.get('firstname')!.errors!).toBeTruthy();
    expect(form.get('lastname')!.errors!).toBeTruthy();
    expect(form.get('gender')!.errors).toBeNull(); // No error for gender
    expect(form.get('birthday')!.errors!).toBeTruthy(); // Error for empty birthday
  });
});
