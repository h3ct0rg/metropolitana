import { forwardRef } from '@angular/core';

export abstract class Parent {}

export abstract class FilterParent extends Parent {}

export function provideParentCmp(component: any, parentType?: any) {
    return { provide: parentType || Parent, useExisting: forwardRef(() => component) };
}
