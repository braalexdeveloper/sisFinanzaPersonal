import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';

import { TransactionInterface } from '../transaction.interface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryInterface } from '../../categories/category.interface';
import { ServiceService } from '../../categories/service.service';
import { TransactionService } from '../transaction.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-edit-transaction',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.scss'
})
export class EditTransactionComponent implements OnInit{
@Input() transaction!:TransactionInterface;
@Output() transactionEdit=new EventEmitter<TransactionInterface>();

user_id!:number;
category!:number;
description:string='';
amount:number=0;
type:string='';
date:string='';

categories:CategoryInterface[]=[];

constructor(
  public modalRef:BsModalRef,
  private _categoryService:ServiceService,
  private _TransactionService:TransactionService,
  private alert:AlertService
){}

ngOnInit(): void {

  this._categoryService.allCategories(1).subscribe((data:any)=>{
    this.categories=data.results;
  })
    let user=JSON.parse(localStorage.getItem("user") || 'null');
    if(user){
      this.user_id=user.id;
    }
    this.description=this.transaction.description;
    this.amount=this.transaction.amount;
    this.type=this.transaction.type;
    this.category=this.transaction.category.id;
    this.date=this.transaction.date;


}

onSubmit(){
  if(!this.type || !this.category || !this.date || !this.amount){
    this.alert.showError("Debe llenar los campos obligatorios!");
    return;
        }
  
    const transactionRequest: TransactionInterface = {
      user_id: this.user_id,
      category_id: Number(this.category),
      amount: this.amount,
      description: this.description,
      type: this.type,
      date: this.date

    }
  
 this._TransactionService.update(this.transaction.id,transactionRequest).subscribe({
  next: (data) => {
    console.log(data)
    this.transactionEdit.emit(data.transaction);
    this.modalRef.hide();
    this.alert.showSuccess("Transacción editada con Éxito!")
  },
  error: (error) => {
    console.log(error)
    this.alert.showError("Error al editar transacción!");
  }
})
}
}
