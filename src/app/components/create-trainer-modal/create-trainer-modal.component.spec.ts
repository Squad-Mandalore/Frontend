import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainerModalComponent } from './create-trainer-modal.component';

describe('CreateTrainerModalComponent', () => {
  let component: CreateTrainerModalComponent;
  let fixture: ComponentFixture<CreateTrainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrainerModalComponent]
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
