import { Component, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { QuoteService, Quote } from './services/quote';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnDestroy {
  // Signals
  quote = signal<Quote | null>(null);
  isFading = signal<boolean>(false);
  favorites = signal<Quote[]>([]);

  // State
  autoActive = false;
  private autoSub: Subscription | null = null;

  constructor(private quoteService: QuoteService) {
    this.restoreFavorites();
    this.loadQuote();

    // Persist favorites to localStorage
    effect(() => {
      localStorage.setItem('favorites', JSON.stringify(this.favorites()));
    });
  }

  /** Loads a new random quote with fade animation */
  loadQuote(): void {
    this.isFading.set(true);
    setTimeout(() => {
      this.quoteService.getRandomQuote().subscribe((newQuote) => {
        this.quote.set(newQuote);
        this.isFading.set(false);
        console.log('New quote:', newQuote);
      });
    }, 200);
  }

  /** Saves the current quote to favorites if it's not already present */
  saveFavorite(): void {
    const current = this.quote();
    if (!current) return;

    const alreadySaved = this.favorites().some(
      (fav) => fav.quote === current.quote && fav.author === current.author
    );

    if (!alreadySaved) {
      this.favorites.update((prev) => [...prev, current]);
    }
  }

  /** Removes a quote from favorites by index */
  removeFavorite(index: number): void {
    this.favorites.update((list) => list.filter((_, i) => i !== index));
  }

  /** Loads any saved favorites from localStorage */
  private restoreFavorites(): void {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.favorites.set(parsed);
        }
      }
    } catch {
      console.warn('Failed to load favorites from localStorage.');
    }
  }

  /** Starts or stops automatic quote rotation */
  toggleAuto(): void {
    this.autoActive = !this.autoActive;

    if (this.autoActive) {
      console.log('Auto mode ON');
      this.autoSub = interval(10000).subscribe(() => this.loadQuote());
    } else {
      console.log('Auto mode OFF');
      this.autoSub?.unsubscribe();
      this.autoSub = null;
    }
  }

  ngOnDestroy(): void {
    this.autoSub?.unsubscribe();
  }
}
