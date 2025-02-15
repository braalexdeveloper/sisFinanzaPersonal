import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryInterface } from '../category.interface';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.scss'
})
export class ListCategoriesComponent implements OnInit {
  allCategories: CategoryInterface[] = [];
  totalPages: number = 0;
  arrayPages: number[] = [];
  numPag: number = 1;
  pageSize: number = 5;

  modalRef: BsModalRef | undefined;

  constructor(
    private _categoriesService: ServiceService,
    private modalService: BsModalService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(page: number = 1): void {
    this.numPag = page;
    this._categoriesService.allCategories(page).subscribe({
      next: (data) => {
        console.log(data); // Verificar la respuesta de la API
        this.allCategories = data.results; // Ajustar según la estructura de la API
        this.updatePagination(data);
      },
      error: (error) => {
        console.error('Error al obtener las categorías:', error);
        this.alertService.showError('No se pudieron cargar las categorías. Inténtelo de nuevo más tarde.');
      }
    });
  }

  private updatePagination(data: any): void {
    this.totalPages = Math.ceil(data.count / this.pageSize);
    this.arrayPages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  next(): void {
    this.numPag += 1;
    this.getCategories(this.numPag);
  }

  prev(): void {
    this.numPag -= 1;
    this.getCategories(this.numPag);
  }

  openModal(): void {
    this.modalRef = this.modalService.show(AddCategoryComponent);
    this.modalRef.onHidden?.subscribe(() => {
      if (this.modalRef?.content?.categoryCreated) {
        this.getCategories();
      }
    });
  }

  openModalEdit(category: CategoryInterface): void {
    const initialState = { category };
    this.modalRef = this.modalService.show(EditCategoryComponent, { initialState });

    if (this.modalRef.content) {
      this.modalRef.content.categoryUpdated.subscribe((updatedCategory: CategoryInterface) => {
        const index = this.allCategories.findIndex((cat) => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.allCategories[index] = updatedCategory;
        }
      });
    }
  }

  deleteCategory(id: number): void {
    this.alertService.showConfirm("Se borrarán los datos de manera definitiva!").then((result: any) => {
      if (result.isConfirmed) {
        this._categoriesService.deleteCategory(id).subscribe({
          next: () => {
            this.getCategories();
          },
          error: (error) => {
            console.error('Error al eliminar la categoría:', error);
            this.alertService.showError('No se pudo eliminar la categoría. Inténtelo de nuevo más tarde.');
          }
        });
      }
    });
  }
}