import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteCardComponent } from './athlete-card.component';

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
            id: '1',
            username: 'test1',
            email: 'test1@example.com',
            firstname: 'John',
            lastname: 'Doe',
            created_at: '2024-02-26',
            last_password_change: '2024-02-26',
            last_edited_at: '2024-02-26',
            gender: 'm',
            has_disease: false,
            birthday: '2024-02-25',
            trainer_id: 'tsa;lk',
            type: 'athlete',
        }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
