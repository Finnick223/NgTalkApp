import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@Environments/environment.development';
import { LoginPayload } from '@Interfaces/payloads/auth/login-payload.interface';
import { LoginResponse } from '@Interfaces/responses/auth/login-response.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.httpClient
      .post(`${ENVIRONMENT.api_url}/login`, payload)
      .pipe(map((response) => response as LoginResponse));
  }
}
