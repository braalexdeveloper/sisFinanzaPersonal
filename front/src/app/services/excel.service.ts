import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {
    // Crear una hoja vacía
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    // Agregar título en A1
    const title = [['📊 Reporte de Transacciones']];
    XLSX.utils.sheet_add_aoa(worksheet, title, { origin: 'A1' });

    // Fusionar celdas para centrar el título
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(data[0]).length - 1 } }];

    // Agregar datos en A3
    XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A3', skipHeader: false });

    // Aplicar filtro automático a los encabezados
    worksheet['!autofilter'] = { ref: `A3:${XLSX.utils.encode_col(Object.keys(data[0]).length - 1)}3` };

    // Ajustar tamaño de columnas automáticamente
    worksheet['!cols'] = Object.keys(data[0]).map(() => ({ wch: 20 }));

    // Crear el libro de Excel
    const workbook: XLSX.WorkBook = {
      Sheets: { Datos: worksheet },
      SheetNames: ['Datos']
    };

    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
  }
}
