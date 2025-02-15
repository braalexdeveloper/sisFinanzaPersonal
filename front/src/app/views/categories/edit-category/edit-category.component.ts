import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ServiceService, ApiCategoryResponse } from '../service.service'; // Importa la interfaz
import { AlertService } from 'src/app/services/alert.service';
import { CategoryInterface } from '../category.interface';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent implements OnInit {
  @Input() category!: CategoryInterface; // Categoría a editar
  @Output() categoryUpdated = new EventEmitter<CategoryInterface>(); // Evento para emitir la categoría actualizada
  name: string = '';

  constructor(
    public modalRef: BsModalRef,
    private _categoryService: ServiceService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (this.category) {
      this.name = this.category.name; // Inicializa el campo del formulario con el nombre de la categoría
    }
  }

  onSubmit() {
    // Validación básica
    if (!this.name || this.name.trim() === '') {
      this.alertService.showError('El nombre de la categoría es requerido.');
      return;
    }

    // Llama al servicio para actualizar la categoría
    this._categoryService.updateCategory(this.category.id, { name: this.name }).subscribe({
      next: (data: ApiCategoryResponse) => {
        console.log(data);
        this.categoryUpdated.emit(data.category); // Emite la categoría actualizada
        this.alertService.showSuccess(data.message); // Muestra el mensaje de éxito
        this.modalRef.hide(); // Cierra el modal después de la actualización exitosa
      },
      error: (error) => {
        console.error(error);
        const errorMessage = error.error?.message || 'Error al actualizar la categoría. Inténtelo de nuevo más tarde.';
        this.alertService.showError(errorMessage); // Muestra el mensaje de error
      }
    });
  }
}