import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchCompletesModalComponent } from './patch-completes-modal.component';

describe('PatchCompletesModalComponent', () => {
  let component: PatchCompletesModalComponent;
  let fixture: ComponentFixture<PatchCompletesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatchCompletesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatchCompletesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
