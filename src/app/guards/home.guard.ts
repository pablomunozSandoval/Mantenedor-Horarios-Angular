import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

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
      if (currentUrl === '/') {
        localStorage.setItem('fromHome', 'true');
      }
    });
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const fromHome = localStorage.getItem('fromHome');
    console.log('fromHome in canActivate:', fromHome);
    if (fromHome !== 'true') {
      this.router.navigate(['/']);
      return false;
    }
    localStorage.removeItem('fromHome');  // Reset the flag after navigation
    return true;
  }
}
