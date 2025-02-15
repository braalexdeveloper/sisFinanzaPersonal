import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [FormsModule,ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class RegisterComponent {

  username:string='';
  email:string='';
  password:string='';

  constructor(
    private authService:AuthService,
    private alert:AlertService,
    private router:Router
  ) { }

  onSubmit(){
    if(!this.username || !this.email || !this.password){
    this.alert.showError("Debe llenar todos los campos!");
    return;
    }
    let newUser={
      username:this.username,
      email:this.email,
      password:this.password
    }
this.authService.register(newUser).subscribe({
  next:(data:any)=>{
    console.log(data)
    this.alert.showSuccess(data.message);
    this.router.navigate(['/login']);
  },
  error:(error)=>{
 console.log(error)
 this.alert.showError("Error al Registrarse")
  }
})
   
  }
}
