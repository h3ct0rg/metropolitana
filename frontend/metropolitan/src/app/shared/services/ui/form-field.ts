import { ValidatorFn } from '@angular/forms';

export class FormField {
}
// Add input types
export enum IInputType {
    Text = 'text',
    Password = 'password',
    Number = 'number'
}

export enum IInputGroupTypes {
    User = 'user',
    Password = 'password',
    quantity = 'quantity',
    hectarea = 'Ha',
    meter = 'm',
    meterHectarea = 'm/Ha',
    quantityqq = 'qq',
}

export interface IDropdownField {
    value: string;
    label: string;
}

export interface IFormValidationErrorType {
    type: string;
    value: string;
}

export interface IPasswordInput {
    isVisible: boolean;
}

export interface IInputExtraFn {
    password: IPasswordInput;
}

export interface IFormValidationMap {
    message: string;
    msgValues?: string[];
}

export interface IFormMap {
    [key: string]: IFormValidationMap;
    required?: IFormValidationMap;
}

export interface IFormValidationProps {
    errors: IFormMap | null;
    validators: ValidatorFn[] | null;
}

export interface IFormValidation<T> {
    [key: string]: T;
}

export interface ISelectionField {
    id?: string|number;
    label: string;
    value: string;
}
export interface IDynamicInputField {
    id?: string;
    label: string;
    value: string;
    type?: string;
    inputSize?: string;
    inputGroupType?: string | null;
    data?: ISelectionField[] | null;
    placeholder?: string;
    errors?: IFormMap;
    inputPrefix?: string | null;
    inputSuffix?: string | null;
    extraFn?: IInputExtraFn | null;
    class?: string | null;
    disabled?: boolean;
}
