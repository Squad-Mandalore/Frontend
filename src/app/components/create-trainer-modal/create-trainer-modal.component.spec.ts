import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainerModalComponent } from './create-trainer-modal.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CreateTrainerModalComponent', () => {
  let component: CreateTrainerModalComponent;
  let fixture: ComponentFixture<CreateTrainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrainerModalComponent],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
