export interface TransactionInterface{
    id?:any;
    user_id:number;
    category_id:number;
    category?:any;
    amount:number;
    description:string;
    type:string;
    date:string;
}