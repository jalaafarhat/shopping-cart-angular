import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'shopping-cart';
  ngOnInit(): void {
    const alreadyInitialized = sessionStorage.getItem('initialized');

    if (!alreadyInitialized) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('hasSeenAd');
      sessionStorage.setItem('initialized', 'true');
    }
  }
}
