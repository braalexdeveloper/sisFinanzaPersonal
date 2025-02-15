import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterModule,CommonModule,ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading:boolean=false;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) { }

  onSubmit() {
    if(!this.username || !this.password){
      this.alert.showError("El usuario y contraseña son obligatorios");
      return;
    }
    this.isLoading=true;

    this._authService.login({ username: this.username, password: this.password }).subscribe({
      next: (data) => {
        console.log(data)
        localStorage.setItem("token", JSON.stringify(data.access));
        this.profile(data.id);
        this.router.navigate([""]);
      },
      error: (error) => {
        this.isLoading=false;
        console.log(error);
        this.alert.showError("Error al loguearse: "+error.error.detail)
      }
    })
  }

  profile(id: number){
    this._authService.getProfile(id).subscribe({
      next: (data) => {
        console.log(data)
        
        this._authService.setUser(data);
        this.isLoading=false;
      },
      error: (error) => {
        this.isLoading=false;
        console.log(error);
        this.alert.showError("error al obtener datos del perfil")
      }
    })
  }

}


