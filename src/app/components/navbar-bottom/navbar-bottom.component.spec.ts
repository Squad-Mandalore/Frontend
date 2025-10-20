import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NavbarBottomComponent } from './navbar-bottom.component';

describe('NavbarBottomComponentComponent', () => {
  let component: NavbarBottomComponent;
  let fixture: ComponentFixture<NavbarBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarBottomComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ toString: () => 'athleten' }],
            },
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
