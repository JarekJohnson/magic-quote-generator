import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Model for a single quote
export interface Quote {
  quote: string;
  author: string;
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly apiUrl = 'https://dummyjson.com/quotes/random';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a random quote from the API.
   */
  getRandomQuote(): Observable<Quote> {
    return this.http.get<Quote>(this.apiUrl);
  }
}
