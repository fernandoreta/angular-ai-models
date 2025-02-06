import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  name = 'Fernando';
  pronoun = 'Him/His';
  lastName = 'Wertt';
  savedArticles!: number;
  isEditing!: boolean;
  loggedIn = false;
  form: FormGroup;
  email: string = '';

  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }
  errorMessage = '';

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  
    if (!this.isEditing) {
      console.log('Datos guardados:', {
        name: this.name,
        lastName: this.lastName,
        pronoun: this.pronoun,
        savedArticles: this.savedArticles,
      });
    }
  }

  updateErrorMessage() {
    if (!this.email) {
      this.errorMessage = 'Email is mandatory';
    } else if (!this.email.includes('@')) {
      this.errorMessage = 'Enter a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado', this.form.value);
    }
  }

  submitEmail() {
    if (!this.errorMessage && this.email) {
      console.log('Correo enviado:', this.email);
    }
  }

  ngOnInit(): void {
    const articles = JSON.parse(localStorage.getItem('saved-texts') || '');
    this.savedArticles = articles.length ? articles.length : 0;
  }

}
