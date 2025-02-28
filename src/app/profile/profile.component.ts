import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { UtilsService } from 'src/services/utils.service';
import { UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';

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
  email = '';
  password = '';

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private utilsService: UtilsService,
    private router: Router
  ) {
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

  onRegisterSubmit() {
    if (this.form.valid) {
    this.registerService.register(this.form.value)
      .then(userCredential => {
        this.setToken(userCredential);
        this.utilsService.openSnackBar(`Logged In as ${userCredential.user.email}`);
      })
      .catch(error => {
        this.utilsService.openSnackBar(error.message);
      });
    }
  }

  login() {
    if (!this.errorMessage && this.email && this.password) {
      this.registerService.login(this.email, this.password)
        .then(res => {
          this.setToken(res);
          const route = `dashboard`;
          this.router.navigate([route]);
          this.utilsService.openSnackBar(`Logged In as ${res.user.email}`);
        }).catch(error => {
          this.utilsService.openSnackBar(error.message);
        });
    }
  }

  setToken(res: UserCredential) {
    res.user.getIdToken().then(token => {
      this.registerService.setCookie(token);
    });
  }

  ngOnInit(): void {
    this.loggedIn = document.cookie ? true : false;
    const savedText = localStorage.getItem('saved-texts');
    const articles = savedText ? JSON.parse(savedText) : [];
    this.savedArticles = articles.length ? articles.length : 0;
  }

}
