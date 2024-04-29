import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPasswordChangeModalComponent } from './initial-password-change-modal.component';

describe('InitialPasswordChangeModalComponent', () => {
  let component: InitialPasswordChangeModalComponent;
  let fixture: ComponentFixture<InitialPasswordChangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialPasswordChangeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialPasswordChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
