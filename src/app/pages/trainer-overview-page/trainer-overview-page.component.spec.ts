import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerOverviewPageComponent } from './trainer-overview-page.component';

describe('TrainerOverviewPageComponent', () => {
  let component: TrainerOverviewPageComponent;
  let fixture: ComponentFixture<TrainerOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerOverviewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainerOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
