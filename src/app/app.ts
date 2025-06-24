import { Component, signal, OnDestroy, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService, Quote } from './services/quote';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnDestroy {
  quote = signal<Quote | null>(null);
  isFading = signal<boolean>(false);
  autoActive = false;
  autoSub: Subscription | null = null;

  favorites = signal<{ quote: string; author: string }[]>([]);

  constructor(private quoteService: QuoteService) {
    this.loadFavoritesFromLocalStorage();
    this.loadQuote();

    // Save to localStorage whenever favorites change
    effect(() => {
      const favs = this.favorites();
      localStorage.setItem('favorites', JSON.stringify(favs));
    });
  }

  loadQuote() {
    this.isFading.set(true);
    setTimeout(() => {
      this.quoteService.getRandomQuote().subscribe((newQuote) => {
        this.quote.set(newQuote);
        this.isFading.set(false);
        console.log('New quote:', newQuote);
      });
    }, 200);
  }

  saveFavorite() {
    const current = this.quote();
    if (!current) return;

    const exists = this.favorites().some(
      (fav) => fav.quote === current.quote && fav.author === current.author
    );
    if (!exists) {
      this.favorites.update((favs) => [
        ...favs,
        { quote: current.quote, author: current.author },
      ]);
    }
  }

  removeFavorite(index: number) {
    this.favorites.update((favs) => favs.filter((_, i) => i !== index));
  }

  loadFavoritesFromLocalStorage() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.favorites.set(parsed);
      } catch {
        console.warn('Failed to parse favorites from localStorage.');
      }
    }
  }

  toggleAuto() {
    this.autoActive = !this.autoActive;

    if (this.autoActive) {
      console.log('🌠 Auto mode ON');
      this.autoSub = interval(10000).subscribe(() => {
        this.loadQuote();
      });
    } else {
      console.log('🛑 Auto mode OFF');
      this.autoSub?.unsubscribe();
      this.autoSub = null;
    }
  }

  ngOnDestroy() {
    this.autoSub?.unsubscribe();
  }
}
