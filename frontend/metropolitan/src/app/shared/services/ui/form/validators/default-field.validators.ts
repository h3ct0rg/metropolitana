import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export class DefaultFieldValidators {
  static email = (control: AbstractControl): ValidationErrors | null => {
    // Email Regex provided by https://www.w3resource.com/javascript/form/email-validation.php
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    if (emailRegex.test(control.value)) {
      return null;
    }
    return {
      invalidEmail: true
    };
  }
  static password = (control: AbstractControl): ValidationErrors | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/;
    if (passwordRegex.test(control.value)) {
      return null;
    }
    return {
      invalidPassword: true
    };
  }
  static matchPasswords = (control: FormGroup): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value === confirmPassword.value ?
      null : { unmatchedPasswords: true };
  }
}
