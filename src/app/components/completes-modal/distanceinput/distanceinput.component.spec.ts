import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceinputComponent } from './distanceinput.component';

describe('DistanceinputComponent', () => {
  let component: DistanceinputComponent;
  let fixture: ComponentFixture<DistanceinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistanceinputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistanceinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
