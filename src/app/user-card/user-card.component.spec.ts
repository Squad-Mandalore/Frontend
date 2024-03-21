import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
    let component: UserCardComponent;
    let fixture: ComponentFixture<UserCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserCardComponent);
        component = fixture.componentInstance;
        component.user = {
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
