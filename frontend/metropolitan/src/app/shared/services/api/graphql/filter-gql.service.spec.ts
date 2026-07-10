import { TestBed } from '@angular/core/testing';

import { FilterGqlService } from './filter-gql.service';

describe('FilterGqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterGqlService = TestBed.get(FilterGqlService);
    expect(service).toBeTruthy();
  });
});
