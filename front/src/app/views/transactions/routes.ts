import { Routes } from "@angular/router";
import { ListTransactionComponent } from "./list-transaction/list-transaction.component";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListTransactionComponent,
                data:{
                    title:'Transacciones'
                }
            }
        ]
    }
]