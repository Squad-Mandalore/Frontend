import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PatchCompletesComponent } from './patch-completes-modal.component';

describe('PatchCompletesComponent', () => {
  let component: PatchCompletesComponent;
  let fixture: ComponentFixture<PatchCompletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatchCompletesComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PatchCompletesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Skip detectChanges since component has required inputs
    expect(component).toBeTruthy();
  });
});
