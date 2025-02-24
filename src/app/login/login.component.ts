import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl<string | null>('', Validators.required)
})

  onSubmit(event: Event) {
    if (this.form.valid) {
      this.router.navigate([''])
      const userName = this.form.value.username;
      localStorage.setItem('username', userName || '')
      console.log(userName)
    }
  }
}
