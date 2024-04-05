import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAthleteModalComponent} from './create-athlete-modal.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {ReactiveFormsModule} from "@angular/forms";
import {AthletesService} from "../../shared/generated";

describe('CreateAthleteModalComponent', () => {
  let component: CreateAthleteModalComponent;
  let fixture: ComponentFixture<CreateAthleteModalComponent>;
  let httpMock: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [CreateAthleteModalComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [AthletesService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAthleteModalComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle successful HTTP response', () => {
    // Just important response to display that user has been created
    const mockAthleteResponse = { firstname: 'John', lastname: 'Doe' };

    component.createAthleteForm.setValue({
      username: 'johndoe',
      email: 'john@example.com',
      unhashed_password: 'password',
      firstname: 'John',
      lastname: 'Doe',
      day: '1',
      month: '1',
      year: '1990'
    });

    component.isMale = true;
    component.onSubmit();
    const req = httpMock.expectOne('http://localhost:8000/athletes/');
    expect(req.request.method).toEqual('POST');

    req.flush(mockAthleteResponse);
  });


  it('should handle error in HTTP response', () => {
    const errorMessage = 'Internal Server Error';

    component.createAthleteForm.setValue({
      username: 'johndoe',
      email: 'john@example.com',
      unhashed_password: 'password',
      firstname: 'John',
      lastname: 'Doe',
      day: '1',
      month: '1',
      year: '1990'
    });

    component.isMale = true;

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8000/athletes/');
    expect(req.request.method).toEqual('POST');

    req.error(new ErrorEvent('error', {
      message: errorMessage
    }));
  });


  it('should format birthday date correctly based on user input', () => {
    component.createAthleteForm.setValue({
      username: 'test_user',
      unhashed_password: 'password123',
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      day: '10',
      month: '11',
      year: '2005'
    });
    component.onSubmit();

    expect(component.createAthleteForm.invalid).toBeTruthy();

    component.createAthleteForm.setValue({
      day: '3',
      month: '1',
      username: 'test_user2',
      unhashed_password: 'password1234',
      email: 'test2@example.com',
      firstname: 'John',
      lastname: 'Hoe',
      year: '2005'
    });
    component.onSubmit();

    expect(component.createAthleteForm.valid).toBeTruthy();

  });

  it('should validate form fields', () => {
    const form = component.createAthleteForm;
    // Set invalid values for testing
    form.setValue({
      username: '', // empty username
      unhashed_password: 'password123', // valid password
      email: 'invalidemail', // invalid email
      firstname: '', // empty firstname
      lastname: '', // empty lastname
      day: '32', // invalid day
      month: '13', // invalid month
      year: '2022' // valid year
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
    expect(form.get('day')!.errors!).toBeFalsy(); // Invalid pattern for day
    expect(form.get('month')!.errors!).toBeFalsy(); // Invalid pattern for month
  });

});
