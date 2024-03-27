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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
