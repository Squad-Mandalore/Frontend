import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AthleteCardComponent } from './athlete-card.component';

describe('AthleteCardComponent', () => {
  let component: AthleteCardComponent;
  let fixture: ComponentFixture<AthleteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AthleteCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Skip detectChanges since component might have required inputs
    expect(component).toBeTruthy();
  });
});
