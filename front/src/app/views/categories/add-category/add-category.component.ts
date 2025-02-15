import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ServiceService, ApiCategoryResponse } from '../service.service'; // Importa la interfaz
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryInterface } from '../category.interface';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  name: string = '';
  categoryCreated!:CategoryInterface;

  constructor(
    public modalRef: BsModalRef,
    private _categoryService: ServiceService,
    private alertServicio: AlertService
  ) {}

  onSubmit() {
    // Validación básica
    if (!this.name || this.name.trim() === '') {
      this.alertServicio.showError('El nombre de la categoría es requerido.');
      return;
    }

    // Llama al servicio para crear la categoría
    this._categoryService.addCategory({ name: this.name }).subscribe({
      next: (data: ApiCategoryResponse) => {
        console.log(data);
        this.alertServicio.showSuccess(data.message); // Muestra el mensaje de éxito
        this.categoryCreated=data.category;
        this.modalRef.hide(); // Cierra el modal después de la creación exitosa
      },
      error: (error) => {
        console.error(error);
        const errorMessage = error.error?.message || 'Error al crear la categoría. Inténtelo de nuevo más tarde.';
        this.alertServicio.showError(errorMessage); // Muestra el mensaje de error
      }
    });
  }
}