import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(data:any[],filename:string){
    const doc=new jsPDF();

    //Agregar contenido al pdf
    doc.text('Reporte de Transacciones',10,10);
    let yPosition=20;

    data.forEach((transaction)=>{
      doc.text(
        `ID:${transaction.id}, Categoria:${transaction.category.name} Tipo:${transaction.type}, Monto:${transaction.amount}, Fecha:${transaction.date}`,
        10,
        yPosition
      );
      yPosition+=10;
    });

    doc.save(`${filename}.pdf`);
  }
}
