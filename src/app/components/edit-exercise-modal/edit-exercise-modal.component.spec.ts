import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExersiseModalComponent } from './edit-exercise-modal.component';

describe('EditExcersiseModalComponent', () => {
  let component: EditExersiseModalComponent;
  let fixture: ComponentFixture<EditExersiseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExersiseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditExersiseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
