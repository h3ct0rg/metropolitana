import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DefaultFieldValidators } from './../../../../shared/services/ui/form/validators/default-field.validators';
import { IFormValidation, IFormValidationProps, IFormMap } from './../../../../shared/services/ui/form-field';

export enum ResetPasswordFieldNames {
  NewPassword = 'newPassword',
  ConfirmPassword = 'confirmPassword'
}

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordFormService {
  formValidation: IFormValidation<IFormValidationProps>;
  constructor(private fb: FormBuilder) {
    this.setResetPasswordFormValidationConfig();
  }
  checkFormValidity = (form: FormGroup): void => {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        form.controls[i].markAsDirty();
        form.controls[i].updateValueAndValidity();
      }
    }
  }
  getFormFieldErrors = (name: string): IFormMap => {
    return this.getFormFieldValidation(name).errors;
  }
  getFormFieldNamesList = () => {
    return Object.keys(ResetPasswordFieldNames).map(key => ResetPasswordFieldNames[key]);
  }
  getFormFieldValidation = (name: string): IFormValidationProps => {
    return this.formValidation[name];
  }
  getResetPasswordFieldForm = (): FormGroup => {
    const formGroup = this.getFormFieldNamesList().reduce((fGroup, fieldName) => {
      let validators: ValidatorFn[] = [];
      if (this.formValidation[fieldName]) {
        validators = this.formValidation[fieldName].validators;
      }
      fGroup[fieldName] = this.fb.control('', validators);
      return fGroup;
    }, {});
    return this.fb.group(formGroup, {validators: DefaultFieldValidators.matchPasswords});
  }
  setResetPasswordFormValidationConfig = (): void => {
    this.formValidation = this.getFormFieldNamesList().reduce((fValidation, fieldName) => {
      (fValidation[fieldName] as IFormValidationProps) = {errors: {}, validators: []};
      return fValidation;
    }, {});

    this.formValidation = Object.keys(this.formValidation).reduce((fValidation, field) => {
      switch (field) {
        case ResetPasswordFieldNames.NewPassword: {
          fValidation[field] = {
            errors: {
              required: {
                message: 'resetPwd.form.pwd1.errors.required'
              },
              invalidPassword: {
                message: 'resetPwd.form.pwd1.errors.invalidPassword'
              }
            },
            validators: [
              Validators.required,
              DefaultFieldValidators.password
            ]
          };
          break;
        }
        case ResetPasswordFieldNames.ConfirmPassword: {
          fValidation[field] = {
            errors: {
              required: {
                message: 'resetPwd.form.pwd2.errors.required'
              },
              invalidPassword: {
                message: 'resetPwd.form.pwd2.errors.invalidPassword'
              }
            },
            validators: [
              Validators.required,
              DefaultFieldValidators.password
            ]
          };
          break;
        }
        default:
          break;
      }
      return fValidation;
    }, {});
  }
}
