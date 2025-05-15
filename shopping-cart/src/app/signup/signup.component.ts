import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  mismatchError: boolean = false;
  successPopup: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[A-Z]).+$'), // at least one uppercase letter
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
    // clear "user exists" error when email changes
    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });

    // trigger form revalidation when confirmPassword changes
    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.signupForm.updateValueAndValidity({ onlySelf: false });
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.signupForm.invalid) return;

    const { email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.some((u: any) => u.email === email);

    if (exists) {
      this.errorMessage = 'User already exists';
      return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));

    this.successPopup = true;

    // redirect after 2s
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
