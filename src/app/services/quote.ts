import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Quote {
  quote: string;
  author: string;
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private apiUrl = 'https://dummyjson.com/quotes/random';

  constructor(private http: HttpClient) {}

  getRandomQuote(): Observable<Quote> {
    return this.http.get<Quote>(this.apiUrl);
  }
}
