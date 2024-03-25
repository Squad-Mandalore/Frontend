import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineMenuComponent } from './discipline-menu.component';

describe('DisciplineMenuComponent', () => {
  let component: DisciplineMenuComponent;
  let fixture: ComponentFixture<DisciplineMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplineMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisciplineMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
