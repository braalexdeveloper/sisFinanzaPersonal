import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryInterface } from './category.interface';
//import { environment } from '../environments/environment';

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryInterface[];
}

export interface ApiCategoryResponse {
  message: string;
  category: CategoryInterface;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  //private readonly api = environment.apiUrl;
  api:string='http://127.0.0.1:8000/api/'
  private readonly CATEGORIES_ENDPOINT = 'categories/';

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

  constructor(private http: HttpClient) {}

  allCategories(page: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.api}${this.CATEGORIES_ENDPOINT}?page=${page}`,{headers:this.getHeaders()}).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error('Error fetching categories'));
      })
    );
  }

  addCategory(category: CategoryInterface): Observable<ApiCategoryResponse> {
    return this.http.post<ApiCategoryResponse>(`${this.api}${this.CATEGORIES_ENDPOINT}`, category,{headers:this.getHeaders()}).pipe(
      catchError((error) => {
        console.error('Error creating category:', error);
        return throwError(() => new Error('Error creating category'));
      })
    );
  }

  updateCategory(id: number, category: CategoryInterface): Observable<ApiCategoryResponse> {
    return this.http.put<ApiCategoryResponse>(`${this.api}${this.CATEGORIES_ENDPOINT}${id}/`, category,{headers:this.getHeaders()}).pipe(
      catchError((error) => {
        console.error('Error updating category:', error);
        return throwError(() => new Error('Error updating category'));
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}${this.CATEGORIES_ENDPOINT}${id}/`,{headers:this.getHeaders()}).pipe(
      catchError((error) => {
        console.error('Error deleting category:', error);
        return throwError(() => new Error('Error deleting category'));
      })
    );
  }
}