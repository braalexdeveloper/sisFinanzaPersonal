import { Routes } from "@angular/router";

export const routes:Routes=[
    {
        path:'',
        children:[
            {
                path:'',
                loadComponent:()=> import('./list-roles/list-roles.component').then(m=>m.ListRolesComponent),
                data:{
                    title:'Roles'
                }
            }
        ]
    }
]