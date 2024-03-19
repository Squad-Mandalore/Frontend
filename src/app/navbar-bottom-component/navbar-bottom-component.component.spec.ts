import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBottomComponentComponent } from './navbar-bottom-component.component';
import { ActivatedRoute } from '@angular/router';

describe('NavbarBottomComponentComponent', () => {
    let component: NavbarBottomComponentComponent;
    let fixture: ComponentFixture<NavbarBottomComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarBottomComponentComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: { url: '/athleten' } } },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NavbarBottomComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
