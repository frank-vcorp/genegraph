import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Genogram, Person, Connection, RelationType, EmotionalType } from '@/types/genogram';

export class PdfExporter {
  /**
   * Exportar genograma a PDF con template Classic (estilo GenoPro)
   */
  static async exportClassic(
    canvasElement: HTMLElement,
    genogram: Genogram,
    fileName: string = 'genograma_clasico'
  ): Promise<void> {
    try {
      // Capturar el canvas React Flow como imagen
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Márgenes
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Agregar encabezado clínico
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('GENOGRAMA CLÍNICO', margin, margin + 5);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Paciente: ${genogram.pacientName || 'Sin identificar'}`,
        margin,
        margin + 12
      );
      pdf.text(
        `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
        margin,
        margin + 18
      );

      // Agregar imagen del genograma
      const imgY = margin + 25;
      const imgHeight = contentHeight - 25;
      pdf.addImage(imgData, 'PNG', margin, imgY, contentWidth, imgHeight);

      // Agregar página con leyenda
      pdf.addPage();
      this.addLegendPage(pdf, margin);

      // Agregar página con datos de personas
      pdf.addPage();
      this.addPersonDataPage(pdf, genogram, margin, pageWidth, pageHeight);

      // Guardar PDF
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  /**
   * Exportar genograma a PDF con template Modern (amigable, iconografía)
   */
  static async exportModern(
    canvasElement: HTMLElement,
    genogram: Genogram,
    fileName: string = 'genograma_moderno'
  ): Promise<void> {
    try {
      // Capturar el canvas con fondo blanco
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Encabezado moderno (colorido)
      pdf.setFillColor(52, 152, 219); // Azul moderno
      pdf.rect(0, 0, pageWidth, 25, 'F');

      // Título
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('Mi Árbol Familiar', margin, 12);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `${genogram.pacientName || 'Sin identificar'} • ${new Date().toLocaleDateString(
          'es-ES'
        )}`,
        margin,
        19
      );

      // Volver a color negro para el contenido
      pdf.setTextColor(0, 0, 0);

      // Agregar imagen del genograma
      const imgY = 30;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - imgY - margin;
      pdf.addImage(imgData, 'PNG', margin, imgY, contentWidth, contentHeight);

      // Agregar página con información amigable
      pdf.addPage();
      this.addModernInfoPage(pdf, genogram, margin, pageWidth, pageHeight);

      // Guardar PDF
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  /**
   * Agregar página de leyenda (Classic)
   */
  private static addLegendPage(pdf: jsPDF, margin: number): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LEYENDA Y SÍMBOLOS', margin, margin + 5);

    let yPosition = margin + 15;
    const lineHeight = 7;
    const columnWidth = (pageWidth - margin * 2) / 2;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');

    // Sección: Género y Estado
    pdf.text('GÉNERO Y ESTADO', margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const genderItems = [
      '□ = Hombre',
      '○ = Mujer',
      '◇ = Género indeterminado',
      '× = Fallecido',
    ];

    genderItems.forEach((item) => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 3;
    pdf.setFont('helvetica', 'bold');
    pdf.text('RELACIONES', margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont('helvetica', 'normal');
    const relationItems = [
      '— = Matrimonio',
      '- - - = Unión Libre',
      '- × - = Separación',
      '- × × - = Divorcio',
    ];

    relationItems.forEach((item) => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    // Segunda columna
    yPosition = margin + 15;
    pdf.setFont('helvetica', 'bold');
    pdf.text('VÍNCULOS EMOCIONALES', margin + columnWidth, yPosition);
    yPosition += lineHeight;

    pdf.setFont('helvetica', 'normal');
    const emotionalItems = [
      '💚 = Muy cercano/Fusionado',
      '🧡 = Cercano',
      '❤️ = Amor/Caridad',
      '⚠️ = Conflictivo/Tenso',
      '🔴 = Distancia/Alienación',
    ];

    emotionalItems.forEach((item) => {
      pdf.text(item, margin + columnWidth + 5, yPosition);
      yPosition += lineHeight;
    });

    // Nota de footer
    yPosition = pageHeight - margin - 10;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'Este genograma fue generado automáticamente por GenGraph Pro',
      margin,
      yPosition
    );
  }

  /**
   * Agregar página con datos de personas (Classic)
   */
  private static addPersonDataPage(
    pdf: jsPDF,
    genogram: Genogram,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): void {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DE LAS PERSONAS', margin, margin + 5);

    let yPosition = margin + 12;
    const lineHeight = 6;
    const pageContentHeight = pageHeight - margin * 2 - 12;

    pdf.setFontSize(10);

    genogram.persons.forEach((person, index) => {
      // Verificar si necesitamos nueva página
      if (yPosition + lineHeight * 4 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Nombre de la persona
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${person.name}`, margin, yPosition);
      yPosition += lineHeight;

      // Datos
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);

      const details = [
        `Género: ${this.getGenderLabel(person.gender)}`,
        `Generación: ${person.generation}`,
        `Estado: ${this.getStatusLabel(person.attributes?.status)}`,
        person.attributes?.conditions && person.attributes.conditions.length > 0
          ? `Condiciones: ${person.attributes.conditions.join(', ')}`
          : '',
      ].filter(Boolean);

      details.forEach((detail) => {
        pdf.text(detail, margin + 5, yPosition);
        yPosition += lineHeight - 1;
      });

      yPosition += 2;
    });
  }

  /**
   * Agregar página con información amigable (Modern)
   */
  private static addModernInfoPage(
    pdf: jsPDF,
    genogram: Genogram,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): void {
    // Header colorido
    pdf.setFillColor(52, 152, 219);
    pdf.rect(0, 0, pageWidth, 20, 'F');

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Resumen Familiar', margin, 12);

    pdf.setTextColor(0, 0, 0);

    let yPosition = margin + 10;
    const lineHeight = 6;

    // Estadísticas
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('📊 Estadísticas', margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Total de personas: ${genogram.persons.length}`, margin + 5, yPosition);
    yPosition += lineHeight;
    pdf.text(
      `Total de relaciones: ${genogram.connections.length}`,
      margin + 5,
      yPosition
    );
    yPosition += lineHeight + 3;

    // Personas
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('👥 Miembros de la Familia', margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    genogram.persons.forEach((person) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      const icon = person.gender === 'male' ? '👨' : person.gender === 'female' ? '👩' : '👤';
      const status =
        person.attributes?.status === 'deceased'
          ? ' (✝️)'
          : person.attributes?.isPrimaryPatient
            ? ' ⭐'
            : '';

      pdf.text(`${icon} ${person.name}${status}`, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    // Footer
    yPosition = pageHeight - margin - 5;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      '✨ Creado con GenGraph Pro - Simplificando tus genogramas',
      margin,
      yPosition
    );
  }

  /**
   * Helpers para labels
   */
  private static getGenderLabel(gender: string): string {
    const labels: Record<string, string> = {
      male: 'Hombre',
      female: 'Mujer',
      other: 'Otro',
      pet: 'Mascota',
    };
    return labels[gender] || 'Indeterminado';
  }

  private static getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      alive: 'Vivo',
      deceased: 'Fallecido',
      unknown: 'Desconocido',
    };
    return labels[status || 'unknown'] || 'Desconocido';
  }

  /**
   * Obtener elemento canvas para exportar (busca el ReactFlow container)
   */
  static getCanvasElement(): HTMLElement | null {
    // Buscar el elemento principal de React Flow
    return document.querySelector('[role="img"]')?.closest('div') || null;
  }
}
