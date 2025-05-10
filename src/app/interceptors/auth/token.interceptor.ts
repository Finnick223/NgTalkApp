import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageKeys } from '@Enums/local-storage-keys';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(LocalStorageKeys.AUTH_TOKEN);

  if (token) {
    const reqWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(reqWithToken);
  }

  return next(req);
};
