import { TestBed } from '@angular/core/testing';

import { DefaultFieldValidators } from './default-field.validators';

describe('DefaultField.ValidatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultFieldValidators = TestBed.get(DefaultFieldValidators);
    expect(service).toBeTruthy();
  });
});
