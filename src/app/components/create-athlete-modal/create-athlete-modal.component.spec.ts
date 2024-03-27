import { ComponentFixture, TestBed } from '@angular/core/testing';
import {CreateAthleteModalComponent} from "./create-athlete-modal.component";

describe('CreateAthleteModalComponent', () => {
  let component: CreateAthleteModalComponent;
  let fixture: ComponentFixture<CreateAthleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAthleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAthleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
