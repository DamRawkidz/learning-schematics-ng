import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestingService } from './testing.service';

describe('TestingService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TestingService,
      ]
    });
  });

  it('should be created', inject([TestingService], (service: TestingService) => {
    expect(service).toBeTruthy();
  }));

});
