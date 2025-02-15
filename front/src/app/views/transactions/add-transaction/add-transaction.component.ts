import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ServiceService } from '../../categories/service.service';
import { CategoryInterface } from '../../categories/category.interface';
import { TransactionInterface } from '../transaction.interface';
import { TransactionService } from '../transaction.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-add-transaction',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit {

  user_id: number = 0;
  category: string = '';
  description: string = '';
  amount: number = 0;
  date: string = '';
  type: string = 'gasto';

  transactionCreated:boolean=false;

  categories: CategoryInterface[] = [];


  constructor(
    public modalRef: BsModalRef,
    private _CategoriesService: ServiceService,
    private _TransactionService: TransactionService,
    private alert:AlertService
  ) {

  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    this.user_id = user?.id;

    this._CategoriesService.allCategories(1).subscribe({
      next: (data) => {
        this.categories = data.results
        console.log(data)
      }
    });

    this.date = this.getCurrentDate();
  }


  onSubmit() {
    if(!this.type || !this.category || !this.date || !this.amount){
this.alert.showError("Debe llenar los campos obligatorios!");
return;
    }
    const transaction: TransactionInterface = {
      user_id: this.user_id,
      category_id: Number(this.category),
      amount: this.amount,
      description: this.description,
      type: this.type,
      date: this.date

    }

    this._TransactionService.create(transaction).subscribe({
      next: (data) => {
        console.log(data)
        this.transactionCreated=true;
        this.modalRef.hide();
        this.alert.showSuccess("Transacción registrada con Éxito!")
      },
      error: (error) => {
        console.log(error)
        this.alert.showError("Error al crear transacción!");
      }
    })

  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
