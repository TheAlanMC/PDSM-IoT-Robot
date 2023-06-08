import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  loginForm: FormGroup;

  

  constructor(private formBuilder: FormBuilder) { 
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.loginForm.value.username;
    console.log('Username:', username);
    
  }
}
