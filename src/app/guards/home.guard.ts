import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  private fromHome: boolean = false;

  constructor(private router: Router) {
    // Subscribe to router events to track navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (event.restoredState) {
        // Ignore popstate events
        return;
      }
      const currentUrl = event.url;
      if (currentUrl === '/horario') {
        this.fromHome = true;
      } else if (currentUrl === '/') {
        this.fromHome = true;
      }
    });
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.fromHome) {
      this.router.navigate(['/']);
      return false;
    }
    this.fromHome = false;  // Reset the flag after navigation
    return true;
  }
}
