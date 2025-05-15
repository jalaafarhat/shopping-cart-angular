import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successPopup: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Clear error message when typing
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successPopup = false;

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) => u.email === email);

    if (!user) {
      this.errorMessage = 'Email not found.';
      return;
    }

    if (user.password !== password) {
      this.errorMessage = 'Wrong password.';
      return;
    }

    // Success
    this.successPopup = true;
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }
}
