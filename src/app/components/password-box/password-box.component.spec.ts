import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasswordBoxComponent } from './password-box.component';

describe('PasswordBoxComponent', () => {
  let component: PasswordBoxComponent;
  let fixture: ComponentFixture<PasswordBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordBoxComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update password strength to "Nicht Zulässig" for a password with less than 12 characters', () => {
    component.onInput('1234'); // Less than 12 characters
    expect(component.strengthTextContent).toEqual('Nicht Zulässig');
    expect(component.strengthBarWidth).toEqual('0%');
    expect(component.strengthBarColor).toEqual('#FF0000');
  });

  it('should update password strength to "Schwach" when 1 of the 4 requirements are met', () => {
    component.onInput('aaaaaaaaaaaa'); // 12 characters
    expect(component.strengthTextContent).toEqual('Schwach');
    expect(component.strengthBarWidth).toEqual('25%');
    expect(component.strengthBarColor).toEqual('#FF0000');
  });

  it('should update password strength to "Medium" when 2 of the 4 requirements are met', () => {
    component.onInput('aaaaaaaaaaa1'); // 12 characters
    expect(component.strengthTextContent).toEqual('Mittel');
    expect(component.strengthBarWidth).toEqual('50%');
    expect(component.strengthBarColor).toEqual('#FF8000');
  });

  it('should update password strength to "Stark" when 3 of the 4 requirements are met (lower, upper, numbers)', () => {
    component.onInput('aaaaaaaaaa1?'); // 12 characters
    expect(component.strengthTextContent).toEqual('Stark');
    expect(component.strengthBarWidth).toEqual('75%');
    expect(component.strengthBarColor).toEqual('#80C000');
  });

  it('should update password strength to "Sehr stark" when 4 of the 4 requirements are met', () => {
    component.onInput('aaaaaaaaaA1?'); /// 12 characters
    expect(component.strengthTextContent).toEqual('Sehr stark');
    expect(component.strengthBarWidth).toEqual('100%');
    expect(component.strengthBarColor).toEqual('#00FF00');
  });

  it('should call onChange method when input value changes', () => {
    const onChangeSpy = spyOn(component, 'onChange');
    component.onInput('test123');
    expect(onChangeSpy).toHaveBeenCalledWith('test123');
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toEqual(true);
    component.setDisabledState(false);
    expect(component.disabled).toEqual(false);
  });

  it('should write value to input field', () => {
    const newValue = 'newPassword123';
    component.writeValue(newValue);
    expect(component.value).toEqual(newValue);
  });
});
