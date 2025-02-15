import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionInterface } from './transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  //private readonly api = environment.apiUrl;
api:string='http://127.0.0.1:8000/api/'
private readonly TRANSACTIONS_ENDPOINT = 'transactions/';
  constructor(
    private http:HttpClient
  ) { }

  private getHeaders():HttpHeaders{
    const token=JSON.parse(localStorage.getItem("token") || 'null');
    if(token){
     return new HttpHeaders({
       'Content-Type':'application/json',
       Authorization:`Bearer ${token}`
     });
    }else{
     return new HttpHeaders({
       'Content-Type':'application/json',
     });
    }
   }
   
  getTransactions(page:number=1,pageSize:number,user_id:number,type?:string,date?:string):Observable<any>{
    return this.http.get(`${this.api}${this.TRANSACTIONS_ENDPOINT}?user_id=${user_id}&page=${page}&page_size=${pageSize}&type=${type}&date=${date}`,{headers:this.getHeaders()});
  }

  create(transaction:TransactionInterface):Observable<any>{
    return this.http.post(`${this.api}${this.TRANSACTIONS_ENDPOINT}`,transaction,{headers:this.getHeaders()});
  }

  update(id:number,transaction:TransactionInterface):Observable<any>{
    return this.http.put(`${this.api}${this.TRANSACTIONS_ENDPOINT}${id}/`,transaction,{headers:this.getHeaders()});
  }

  delete(id:number):Observable<any>{
    return this.http.delete(`${this.api}${this.TRANSACTIONS_ENDPOINT}${id}/`,{headers:this.getHeaders()});
  }

  getExpenses(user_id:number):Observable<any>{
    return this.http.get(`${this.api}${this.TRANSACTIONS_ENDPOINT}total_expenses/?user_id=${user_id}`,{headers:this.getHeaders()})
  }
}
