import { TestBed } from '@angular/core/testing';

import { GenericFormFieldService } from './generic-form-field.service';

describe('GenericFormFieldService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericFormFieldService = TestBed.get(GenericFormFieldService);
    expect(service).toBeTruthy();
  });
});
