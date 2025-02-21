import { Component, OnInit } from '@angular/core';
import { TransactionInterface } from '../transaction.interface';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../transaction.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { EditTransactionComponent } from '../edit-transaction/edit-transaction.component';
import { AlertService } from '../../../services/alert.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-list-transaction',
  standalone:true,
  imports: [CommonModule,FormsModule,NgbPaginationModule],
  templateUrl: './list-transaction.component.html',
  styleUrl: './list-transaction.component.scss'
})
export class ListTransactionComponent implements OnInit{
 transactions:TransactionInterface[]=[];
 totalItems:number=0;
 currentPage:number=1;
 pageSize:number=5;
user:any='';
date:any='';
type:string='';

totalIngresos:number=0;
totalGastos:number=0;

month:number | string='';

btnDeleteFilters:boolean=false;

 constructor(
  private _TransactionService:TransactionService,
  private modalService:BsModalService,
  private modalRef:BsModalRef,
  private alertService:AlertService,
  private pdfService:PdfService
 ){}

 ngOnInit(): void {
 this.user=JSON.parse(localStorage.getItem("user") || 'null');
     this.getTransactions();
 }

 getTransactions(){
 this._TransactionService.getTransactions(this.currentPage,this.pageSize,this.user.id,this.type,this.date,this.month).subscribe({
  next:(data)=>{
    this.transactions=data.results.transactions;
    this.totalItems=data.count;
    this.totalGastos=data.results?.total_gastos;
    this.totalIngresos=data.results?.total_ingresos;
    console.log(data)
  },
  error:(error)=>{
console.log(error)
  }
 })
 }

 handleType(){
  this.getTransactions();
  this.btnDeleteFilters=true;
 }

 handleDate(){
  console.log(this.date)
  this.getTransactions();
  this.btnDeleteFilters=true;
 }

 handleMonth(){
console.log(this.month)
this.getTransactions();
  this.btnDeleteFilters=true;
 }

 clearFilters(){
  this.date='';
  this.type='';
  this.month='';
  this.getTransactions();
  this.btnDeleteFilters=false;
 }

 generatePdf(){
  this._TransactionService.allTransactions(this.user.id,this.type,this.date,this.month).subscribe({
    next:(result)=>{
      this.pdfService.generatePdf(result,this.totalGastos,this.totalIngresos,this.type,this.month);
    }
  })
  
 }

 openModal(){
this.modalRef=this.modalService.show(AddTransactionComponent);

this.modalRef.onHidden?.subscribe(()=>{
  if(this.modalRef.content.transactionCreated){
    this.getTransactions();
  }
})
 }

 onPageChange(page:number):void{
   this.currentPage=page;
   this.getTransactions();
 }

 openModalEdit(transaction:TransactionInterface){
  const initialState={transaction}
this.modalRef=this.modalService.show(EditTransactionComponent,{initialState});

this.modalRef.content.transactionEdit.subscribe((result:TransactionInterface)=>{
  let index=this.transactions.findIndex(el=>el.id===result.id);
  this.transactions[index]=result;
})
 }

 deleteTransaction(id:number){
  this.alertService.showConfirm("Se borrarán los datos de manera definitiva!").then((result: any) => {
    if (result.isConfirmed) {
      this._TransactionService.delete(id).subscribe({
        next: () => {
          this.getTransactions();
        },
        error: (error) => {
          console.error('Error al eliminar la transacción:', error);
          this.alertService.showError('No se pudo eliminar la transacción. Inténtelo de nuevo más tarde.');
        }
      });
    }
  });
 }

}
