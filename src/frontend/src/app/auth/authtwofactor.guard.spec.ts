import { TestBed, async, inject } from '@angular/core/testing';

import { AuthtwofactorGuard } from './authtwofactor.guard';

describe('AuthtwofactorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthtwofactorGuard]
    });
  });

  it('should ...', inject([AuthtwofactorGuard], (guard: AuthtwofactorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
