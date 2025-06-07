// src/app/services/label.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define your Label interface to match your C# model
export interface Label {
  id?: number; // Optional, as it's auto-generated for new labels
  name: string;
  color: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = 'https://localhost:7018/api/Label'; // <--- IMPORTANT: Replace with your actual API URL and port!

  constructor(private http: HttpClient) { }

  createLabel(label: Label): Observable<Label> {
    return this.http.post<Label>(this.apiUrl, label);
  }

  // You might add other methods here, e.g., getLabels, getLabelById, updateLabel, deleteLabel
  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.apiUrl);
  }
}