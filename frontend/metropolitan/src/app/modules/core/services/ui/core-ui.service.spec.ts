import { TestBed } from '@angular/core/testing';

import { CoreUiService } from './core-ui.service';

describe('CoreUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreUiService = TestBed.get(CoreUiService);
    expect(service).toBeTruthy();
  });
});
