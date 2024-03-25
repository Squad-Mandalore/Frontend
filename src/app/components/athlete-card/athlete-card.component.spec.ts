import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AthleteCardComponent} from './athlete-card.component';

describe('AthleteCardComponent', () => {
    let component: AthleteCardComponent;
    let fixture: ComponentFixture<AthleteCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AthleteCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AthleteCardComponent);
        component = fixture.componentInstance;
        component.athlete = {
          id: 69,
          username: "ching",
          email: "chong@chang.de",
          firstname: "sching",
          lastname: "ling",
          created_at: "heute",
          created_by: "Ole",
          gender: "d",
          date_of_birth: "2012-02-42",
          last_password_change: "2012-02-42",
          last_edited_at: "2012-02-42",
          type: "2012-02-42",
          progress: 1,
          progress_points: 2,
          progress_medal: "urMom",
          number_bronze_medals: 69,
          number_silver_medals: 420,
          number_gold_medals: 187,
          has_swimming_certificate: false
        }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
