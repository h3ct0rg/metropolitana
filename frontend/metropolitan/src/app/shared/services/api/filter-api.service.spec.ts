import { TestBed } from '@angular/core/testing';

import { FilterApiService } from './filter-api.service';

describe('FilterApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterApiService = TestBed.get(FilterApiService);
    expect(service).toBeTruthy();
  });
});
