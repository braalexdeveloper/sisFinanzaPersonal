import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(title:string='¡Éxito!'){
  
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }

   // Método para mostrar una alerta de error
   showError(title: string = 'Error') {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showConfirm(message:string,title:string='¿Estas seguro?'){
    return Swal.fire({
      title:title,
      text:message,
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si',
      cancelButtonText:'Cancelar',
    })
  }
}
