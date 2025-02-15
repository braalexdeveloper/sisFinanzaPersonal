import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  username:string='';
  email:string='';
  password:string='';
  image:File | null=null;
  imgUrl:string='';
 idUser:number=0; 
  constructor(
    private authService:AuthService,
    private alert:AlertService,
    private router:Router
  ){}

  ngOnInit(): void {
      this.authService.user$.subscribe(el=>{
        if(el){
          this.username=el.username;
          this.email=el.email;
          this.idUser=el.id;
          this.imgUrl=el.image;
        }
        
      })
  }

  onSubmit(){
    if(!this.username || !this.email || !this.password){
    this.alert.showError("Llenar los campos requeridos");
    return;
    }
    const user=new FormData();
    user.append("username",this.username)
    user.append("email",this.email);
    user.append("password",this.password);

    if(this.image){
      user.append("image",this.image,this.image.name);
    }
    

   this.authService.updateProfile(this.idUser,user).subscribe({
    next:(data)=>{
console.log(data)
this.authService.setUser(data.user);
this.alert.showSuccess(data.message);
    },
    error:(error)=>{
console.log(error);
this.alert.showError("Error al actualizar perfil!")
    }
   })
  }

  imageChange(event:any){
   if(event.target.files.length>0){
    this.image=event.target.files[0];
   }
  }

  close(){
this.router.navigate(['/dashboard'])
  }

}


