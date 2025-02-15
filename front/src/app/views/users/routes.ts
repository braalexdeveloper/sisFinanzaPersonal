import { Routes } from "@angular/router";

export const routes:Routes=[
    {
        path:'',
        children:[
            {
                path:'',
                loadComponent:()=> import('./list-users/list-users.component').then(m=>m.ListUsersComponent),
                data:{
                    title:'Usuarios'
                }
            }
        ]
    }
]