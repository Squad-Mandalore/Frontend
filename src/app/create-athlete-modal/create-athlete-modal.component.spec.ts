import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAthleteModalComponent} from './create-athlete-modal.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AthletesService} from "../shared/generated";
import {ReactiveFormsModule} from "@angular/forms";

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
    expect(component.displayAlert).toBeTruthy();

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
    expect(component.athleteData.birthday).toEqual('2005-11-10'); // Expected formatted date

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
    expect(component.athleteData.birthday).toEqual('2005-01-03'); // Expected formatted date
  });

});
