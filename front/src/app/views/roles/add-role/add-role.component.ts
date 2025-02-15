import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RoleService } from '../role.service';
import { FormsModule } from '@angular/forms';
import {AlertService} from '../../../services/alert.service'
import { RoleInterface } from '../role.interface';

@Component({
  selector: 'app-add-role',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss'
})
export class AddRoleComponent {

  name:string=''
  roleCreated!:RoleInterface;

  constructor(
    public modalRef:BsModalRef,
    private _roleService:RoleService,
    private alert:AlertService
  ){

  }

  onSubmit(){
    if(!this.name || this.name.trim()===''){
this.alert.showError("El campo nombre es obligatorio!")
return
    }

    this._roleService.create({name:this.name}).subscribe({
      next:(data)=>{
       console.log(data)
       this.roleCreated=data.role;
       this.modalRef.hide();
       this.alert.showSuccess("Rol creado correctamente!");
      },
      error:(error)=>{
        console.log(error)
      this.alert.showError("error al crear role")
      }})
    }
  
}
