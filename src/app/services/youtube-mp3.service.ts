import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YoutubeMp3Service {
  private apiUrl = '/download-mp3.php';

  constructor(private http: HttpClient) { }

  downloadMp3(url: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'download');
    formData.append('url', url);

    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erreur inconnue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur réseau: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur (${error.status}): ${error.statusText}`;
      try {
        const jsonError = error.error;
        if (jsonError && jsonError.message) {
          errorMessage = jsonError.message;
        }
      } catch (e) {}
    }
    
    return throwError(() => ({ 
      message: errorMessage,
      status: error.status,
      error: error.error 
    }));
  }
}
