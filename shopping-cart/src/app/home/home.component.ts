import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showAd: boolean = false;

  constructor(private router: Router) {
    const hasSeenAd = localStorage.getItem('hasSeenAd');

    // Only show the ad if the user has NOT seen it in this session
    if (!hasSeenAd) {
      this.showAd = true;
      localStorage.setItem('hasSeenAd', 'true'); // set this immediately
      setTimeout(() => {
        this.showAd = false;
      }, 5000);
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('hasSeenAd'); // reset flag on logout
    this.router.navigate(['/login']);
  }

  closeAd(): void {
    this.showAd = false;
    localStorage.setItem('hasSeenAd', 'true'); // ensure it's stored
  }
}
