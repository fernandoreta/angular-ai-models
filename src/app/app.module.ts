import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'material.module';
import { DialogAnimationsComponent } from './dialog-animations/dialog-animations.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogQuestionsComponent } from './dialog-questions/dialog-questions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotesComponent } from './notes/notes.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Auth, AuthModule } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDI6dLWcigQzqaCyaojCNMiYoAGoDjqTxk",
  authDomain: "instaread-5b968.firebaseapp.com",
  projectId: "instaread-5b968",
  storageBucket: "instaread-5b968.firebasestorage.app",
  messagingSenderId: "1051945646306",
  appId: "1:1051945646306:web:5b738b0b51850ed8d246bb",
  measurementId: "G-FGB9MNT7B8"
};

@NgModule({
  declarations: [
    AppComponent,
    DialogAnimationsComponent,
    DialogQuestionsComponent,
    DashboardComponent,
    NotesComponent,
    SearchComponent,
    ProfileComponent
  ],
  imports: [
    AuthModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
