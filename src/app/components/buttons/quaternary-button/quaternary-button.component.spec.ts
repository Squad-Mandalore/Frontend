import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaternaryButtonComponent } from './quaternary-button.component';

describe('QuaternaryButtonComponent', () => {
  let component: QuaternaryButtonComponent;
  let fixture: ComponentFixture<QuaternaryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuaternaryButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuaternaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
