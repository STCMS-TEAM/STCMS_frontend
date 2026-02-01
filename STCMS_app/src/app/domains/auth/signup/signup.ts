import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth';
import { Router } from '@angular/router';
import { User } from '../../../core/models/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private authService = inject(AuthService);
  private router = inject(Router);
  submitted = false;
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
    phone_number: new FormControl('', [Validators.required, Validators.pattern(/^[\d+\-\(\) ]+$/)]),
  });
  get name() {
    return this.registerForm.get('name');
  }
  get last_name() {
    return this.registerForm.get('last_name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get gender() {
    return this.registerForm.get('gender');
  }
  get birthDate() {
    return this.registerForm.get('birthDate');
  }
  get phone_number() {
    return this.registerForm.get('phone_number');
  }

  onSubmit() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.submitted = true;
      const formValue = this.registerForm.value;
      const user: User = {
        name: formValue.name!,
        last_name: formValue.last_name!,
        email: formValue.email!,
        password: formValue.password!,
        gender: formValue.gender!,
        birthDate: new Date(formValue.birthDate!), // convert string to number
        phone_number: formValue.phone_number!,
      }; // cast to User type
      this.authService.register(user); // pass the entire object
    } else {
      console.warn('Form is invalid');
    }
  }
}
