import { Routes } from "@angular/router";


export const routes:Routes=[
    {
        path:'',
        children:[
            {
                path:'',
                loadComponent:()=> import('./list-categories/list-categories.component').then(m => m.ListCategoriesComponent),
                data:{
                    title:'Categorias'
                }
                
            },
            {
                path:'create',
                loadComponent:()=> import('./add-category/add-category.component').then(m=>m.AddCategoryComponent)
            },
            {
                path:'edit',
                loadComponent:()=>import('./edit-category/edit-category.component').then(m=>m.EditCategoryComponent)
            }
        ]
    }
]