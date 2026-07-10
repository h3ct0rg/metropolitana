import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { IFormValidation, IFormValidationProps, IFormMap } from './../../../../shared/services/ui/form-field';
import { DefaultFieldValidators } from './../../../../shared/services/ui/form/validators/default-field.validators';
import { GenericFormFieldService } from './../../../../shared/services/ui/generic-form-field.service';

export enum LoginFormFieldNames {
  User = 'user',
  Password = 'password'
}

@Injectable({
  providedIn: 'root'
})
export class LoginFormService {
  constructor(private genericFormFieldService: GenericFormFieldService) {
    this.setLoginFormValidationConfig();
  }
  checkFormValidity = (form: FormGroup): void => {
    this.genericFormFieldService.checkFormValidity(form);
  }
  getFormFieldErrors = (name: string): IFormMap => {
    return this.genericFormFieldService.getFormFieldErrors(name);
  }
  getFormFieldNamesList = () => {
    return this.genericFormFieldService.getFormFieldNamesList(LoginFormFieldNames);
  }
  getFormFieldValidation = (name: string): IFormValidationProps => {
    return this.genericFormFieldService.getFormFieldValidation(name);
  }
  getLoginFieldForm = (): FormGroup => {
    return this.genericFormFieldService.getForm(LoginFormFieldNames);
  }
  setLoginFormValidationConfig = (): void => {
    this.genericFormFieldService.formValidation = this.genericFormFieldService.getInitialFormValidationConfig(LoginFormFieldNames);

    this.genericFormFieldService.formValidation = Object.keys(this.genericFormFieldService.formValidation).reduce((fValidation, field) => {
      switch (field) {
        case LoginFormFieldNames.User: {
          fValidation[field] = {
            errors: {
              required: {
                message: 'errors.common.required'
              },
              invalidEmail: {
                message: 'login.form.email.error'
              }
            },
            validators: [
              Validators.required,
              DefaultFieldValidators.email
            ]
          };
          break;
        }
        case LoginFormFieldNames.Password: {
          fValidation[field] = {
            errors: {
              required: {
                message: 'errors.common.required'
              },
              invalidPassword: {
                message: 'login.form.pwd.error'
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
