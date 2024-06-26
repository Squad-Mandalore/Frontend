import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {NavbarBottomComponent} from "./navbar-bottom.component";

describe('NavbarBottomComponentComponent', () => {
  let component: NavbarBottomComponent;
  let fixture: ComponentFixture<NavbarBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarBottomComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { url: '/athleten' } } },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
