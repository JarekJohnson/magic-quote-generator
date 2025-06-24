import { QuoteService } from './quote';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('QuoteService', () => {
  beforeEach(() => inject([], () => {}));

  it('should be created', () => {
    const injector = TestBed.configureTestingModule({
      providers: [
        QuoteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const service = injector.inject(QuoteService);
    expect(service).toBeTruthy();
  });
});
