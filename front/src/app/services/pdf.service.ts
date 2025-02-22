import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(data: any[], totalGastos: number, totalIngresos: number, type: string, month: any) {
    const doc = new jsPDF();
    let months = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

    let title: string = '';
    if (type === "ingreso") {
      title = "Reporte de Ingresos";
    } else if (type === "gasto") {
      title = "Reporte de Gastos";
    } else {
      title = "Reporte de Gastos e Ingresos";
    }

    if (month !== "") {
      title += ` - ${months[month]}`;
    }
    //Agregar titulo
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);//Color Azul
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 15);

    //Agregar logo
    const logo = new Image();
    logo.src = 'assets/logo2.png';
    doc.addImage(logo, 'PNG', 150, 10, 40, 15);

    //Agregar total
    doc.setFontSize(14);
    doc.setTextColor(112, 112, 112);
    if (type === "gasto" || type === '') {
      doc.text('Total Gasto: ', 14, 30);
      doc.text(`S/${totalGastos}`, 45, 30);
    }

    if (type === "ingreso" || type === '') {
      doc.text('Total Ingresos: ', 14, 38);
      doc.text(`S/${totalIngresos}`, 53, 38);
    }


    //Crear tabla
    const columns = ['ID', 'Categoría', 'Tipo', 'Monto', 'Fecha'];
    const rows = data.map((transaction) => [
      transaction.id,
      transaction.category.name,
      transaction.type,
      `$${transaction.amount}`,
      transaction.date,
    ]);



    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 45, // Posición de inicio de la tabla
      theme: 'striped', // Estilo de la tabla
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [41, 128, 185], // Color de fondo del encabezado
        textColor: [255, 255, 255], // Color del texto del encabezado
      },
      alternateRowStyles: {
        fillColor: [220, 220, 220], // Color de fondo de filas alternas
      },
    });

    doc.save(`${title}.pdf`);
  }
}
