import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    public hidePassword = false;
    togglePassword() {
        this.hidePassword = !this.hidePassword;
      }
}

