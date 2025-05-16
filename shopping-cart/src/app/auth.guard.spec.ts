import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerSpy }],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access if user is logged in', () => {
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({ email: 'test@example.com' })
    );
    expect(guard.canActivate()).toBeTrue();
  });

  it('should deny access and redirect if user is not logged in', () => {
    localStorage.removeItem('loggedInUser');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
