import { Component, Input, Output , EventEmitter, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RoleService } from '../role.service';
import { AlertService } from '../../../services/alert.service';
import { RoleInterface } from '../role.interface';


@Component({
  selector: 'app-edit-role',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent implements OnInit{
  @Input() role!:RoleInterface;
  @Output() roleUpdated=new EventEmitter<RoleInterface>();

  name:string='';

  constructor(
    public modalRef:BsModalRef,
    private _roleService:RoleService,
    private alert:AlertService
  ){
  
  }
  ngOnInit(): void {
      if(this.role){
        this.name=this.role.name;
      }
  }

  onSubmit(){
   if(!this.name || this.name.trim()===''){
    this.alert.showError("El campo nombre es obligatorio!");
    return;
   }

   this._roleService.update(this.role.id,{name:this.name}).subscribe({
    next:(data)=>{
      this.roleUpdated.emit(data.role);
      this.modalRef.hide();
      this.alert.showSuccess("Rol editado correctamente!")
    },
    error:(error)=>{
console.log(error);
this.alert.showError("Error al editar rol!");
    }
   })
  }


}
