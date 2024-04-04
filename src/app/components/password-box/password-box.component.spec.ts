import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordBoxComponent } from './password-box.component';

describe('PasswordBoxComponent', () => {
    let component: PasswordBoxComponent;
    let fixture: ComponentFixture<PasswordBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PasswordBoxComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PasswordBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update password strength to "Schwach" for a password with less than 5 characters', () => {
        component.onInput('1234'); // Less than 5 characters
        expect(component.strengthTextContent).toEqual('Schwach');
        expect(component.strengthBarWidth).toEqual('20%');
        expect(component.strengthBarColor).toEqual('#ff6347');
    });

    it('should update password strength to "Mittel" for a password with 5 to 9 characters', () => {
        component.onInput('abcd123'); // 7 characters
        expect(component.strengthTextContent).toEqual('Mittel');
        expect(component.strengthBarWidth).toEqual('50%');
        expect(component.strengthBarColor).toEqual('#ffa500');
    });

    it('should update password strength to "Gut" for a password with 10 to 11 characters', () => {
        component.onInput('strongPwd12'); // 10 characters
        expect(component.strengthTextContent).toEqual('Gut');
        expect(component.strengthBarWidth).toEqual('70%');
        expect(component.strengthBarColor).toEqual('#2ecc71');
    });

    it('should update password strength to "Sehr stark" for a password with 12 or more characters', () => {
        component.onInput('VeryStrongPwd!'); // 13 characters
        expect(component.strengthTextContent).toEqual('Sehr stark');
        expect(component.strengthBarWidth).toEqual('100%');
        expect(component.strengthBarColor).toEqual('#2ecc71');
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
