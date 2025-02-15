import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private readonly api = environment.apiUrl;
  api: string = 'http://127.0.0.1:8000/api/'

  /*private userSubject!: BehaviorSubject<any>;
  user$ = this.userSubject?.asObservable();*/
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const savedUser = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<any>(savedUser ? JSON.parse(savedUser) : null);
    this.user$ = this.userSubject.asObservable(); // <-- Asegúrate de asignarlo después de inicializar
  }



  setUser(user: any) {
    // Guarda el usuario en localStorage y actualiza el BehaviorSubject
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next({...user});
  }

  getUser() {
    return this.userSubject.value;
  }



  private getHeaders(isMultipart: boolean = false): HttpHeaders {
    const token = JSON.parse(localStorage.getItem("token") || 'null');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    if (!isMultipart) {
      headers = headers.set('Content-Type', 'application/json');
    }
  
    return headers;
  }
  

  login(user: any): Observable<any> {
    return this.http.post(`${this.api}token/`, user);
  }

  register(newUser: any) {
    return this.http.post(`${this.api}users/register/`, newUser);
  }

  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.api}users/${id}`, { headers: this.getHeaders() })
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }


  updateProfile(id:number,user:FormData): Observable<any> {
    return this.http.put(`${this.api}users/${id}/`,user, { headers: this.getHeaders(true) })
  }

}
