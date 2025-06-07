import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
   imports: [
    CommonModule,
    RouterOutlet, 
    Dashboard 
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected title = 'demo-app';
}