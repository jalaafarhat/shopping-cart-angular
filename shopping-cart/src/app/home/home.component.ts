import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showAd: boolean = true;
  constructor(private router: Router) {
    // Auto-close ad after 5 seconds if user doesn't click "Close"
    setTimeout(() => {
      this.showAd = false;
    }, 5000);
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
  closeAd(): void {
    this.showAd = false;
  }
}
