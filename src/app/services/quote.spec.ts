import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QuoteService } from './quote';

describe('QuoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuoteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(QuoteService);
    expect(service).toBeTruthy();
  });
});
