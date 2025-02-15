import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleInterface } from './role.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
//private readonly api = environment.apiUrl;
api:string='http://127.0.0.1:8000/api/'
private readonly ROLES_ENDPOINT = 'roles/';

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

  getRoles(currentPage:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.api}${this.ROLES_ENDPOINT}?page=${currentPage}&page_size=${pageSize}`,{headers:this.getHeaders()})
  }

  create(role:RoleInterface):Observable<any>{
    return this.http.post(`${this.api}${this.ROLES_ENDPOINT}`,role,{headers:this.getHeaders()})
  }

  update(id:number,role:RoleInterface):Observable<any>{
return this.http.put(`${this.api}${this.ROLES_ENDPOINT}${id}/`,role,{headers:this.getHeaders()})
  }

  delete(id:number):Observable<any>{
    return this.http.delete(`${this.api}${this.ROLES_ENDPOINT}${id}/`,{headers:this.getHeaders()})
  }
}
