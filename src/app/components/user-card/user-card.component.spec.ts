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
          id: 1,
          firstname: "Long",
          lastname: "schlong",
          type: "cheesse",
        }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
