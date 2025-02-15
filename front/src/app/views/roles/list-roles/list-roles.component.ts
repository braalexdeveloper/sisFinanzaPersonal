import { Component, OnInit } from '@angular/core';
import { RoleInterface } from '../role.interface';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddRoleComponent } from '../add-role/add-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { AlertService } from '../../../services/alert.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-roles',
  standalone:true,
  imports: [CommonModule,NgbPaginationModule],
  templateUrl: './list-roles.component.html',
  styleUrl: './list-roles.component.scss'
})
export class ListRolesComponent implements OnInit{
roles:RoleInterface[]=[];
modalRef:BsModalRef | undefined;

totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

constructor(
  private _roleService:RoleService,
  private modalService:BsModalService,
  private alert:AlertService
){}

ngOnInit(): void {
    this.getRoles();
}

getRoles(currentPage:number=1){
  this._roleService.getRoles(currentPage,this.pageSize).subscribe({
    next:(data)=>{
     console.log(data)
     this.roles=data.results;
     this.totalItems=data.count;
    },
    error:(error)=>{

    }
  })
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.getRoles(this.currentPage);
}

openModal(){
 this.modalRef=this.modalService.show(AddRoleComponent);
 this.modalRef.onHidden?.subscribe(()=>{
  if (this.modalRef?.content?.roleCreated) {
    this.getRoles();
  }
})
 
}

openModalEdit(role:RoleInterface){
  const initialState={role}
 this.modalRef=this.modalService.show(EditRoleComponent,{initialState});

 if(this.modalRef.content){
  this.modalRef.content.roleUpdated.subscribe((roleUpdate:RoleInterface)=>{
   let index=this.roles.findIndex(role => role.id===roleUpdate.id);
   if(index!==-1){
    this.roles[index]=roleUpdate;
   }
  })

 }
}

deleteRole(id:number){
  this.alert.showConfirm("El rol se eliminará permanentemente!").then((result)=>{
    if(result.isConfirmed){
      this._roleService.delete(id).subscribe({
        next:()=>{
          
          this.getRoles();
         },
         error:(error)=>{
      
      console.error('Error al eliminar el rol:', error);
            this.alert.showError('No se pudo eliminar el rol. Inténtelo de nuevo más tarde.');
         }
      });
    }
  })
}



}
