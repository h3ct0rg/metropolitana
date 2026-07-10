import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { IFormMap, IFormValidationProps, IFormValidation } from './form-field';

@Injectable()
export class GenericFormFieldService {
  formValidation: IFormValidation<IFormValidationProps>;
  constructor(private fb: FormBuilder) { }
  getFormControlByName = (name: string, form: FormGroup): AbstractControl => {
    return form.get(name);
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
    return this.getFormFieldValidation(name).errors || null;
  }
  getFormFieldValidators = (name: string): ValidatorFn[] => {
    return this.getFormFieldValidation(name).validators || null;
  }
  getFormFieldNamesList = (formMap: any) => {
    return Object.keys(formMap).map(key => formMap[key]);
  }
  getFormFieldValidation = (name: string): IFormValidationProps => {
    return this.formValidation[name];
  }
  getForm = (formMap: any, formValidators?: ValidatorFn | ValidatorFn[]): FormGroup => {
    const formGroup = this.getFormFieldNamesList(formMap).reduce((fGroup, fieldName) => {
      let validators: ValidatorFn[] = [];
      if (this.formValidation[fieldName]) {
        validators = this.formValidation[fieldName].validators;
      }
      fGroup[fieldName] = this.fb.control('', validators);
      return fGroup;
    }, {});
    if (formValidators) {
      return this.fb.group(formGroup, {validators: formValidators});
    }
    return this.fb.group(formGroup);
  }
  getInitialFormValidationConfig = (formMap: any) => {
    return this.getFormFieldNamesList(formMap).reduce((fValidation, fieldName) => {
      (fValidation[fieldName] as IFormValidationProps) = {errors: {}, validators: []};
      return fValidation;
    }, {});
  }
}
