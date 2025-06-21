// src/app/label.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Label } from './dashboard/model'; // Adjust path if your model.ts is elsewhere

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  // !! IMPORTANT: Update this URL to match your actual backend API endpoint !!
  // Example: 'http://localhost:5000/api/labels' or 'https://your-api.com/api/labels'
  // If your backend is not HTTPS, change https:// to http://
  private apiUrl = 'https://localhost:7018/api/Label'; // Your current URL

  constructor(private http: HttpClient) { }

  /**
   * Handles HTTP errors from API calls.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error.
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code.
      errorMessage = `Server Error: ${error.status} - ${error.message || ''}`;
      if (error.error && error.error.errors) {
        // Often, ASP.NET Core returns validation errors in 'errors' property
        for (const key in error.error.errors) {
          if (error.error.errors.hasOwnProperty(key)) {
            errorMessage += `\n ${key}: ${error.error.errors[key].join(', ')}`;
          }
        }
      } else if (error.error && typeof error.error === 'string') {
          // If the error response is a plain string
          errorMessage += `\n Details: ${error.error}`;
      }
    }
    console.error('LabelService Error:', errorMessage);
    // You can also re-throw a more user-friendly error message if needed
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Fetches all labels from the API.
   */
  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new label via the API.
   */
  createLabel(label: Label): Observable<Label> {
    // Note: The backend typically assigns the ID. We send a label object
    // and expect the created label with its new ID back.
    return this.http.post<Label>(this.apiUrl, label).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing label via the API using PUT.
   */
  putLabel(id: number, label: Label): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, label).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a label by its ID via the API.
   */
  deleteLabel(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError)
    );
  }
}