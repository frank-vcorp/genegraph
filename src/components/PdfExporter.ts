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
    pdf.text('DATOS CLÍNICOS DE LAS PERSONAS', margin, margin + 5);

    let yPosition = margin + 12;
    const lineHeight = 6;
    const pageContentHeight = pageHeight - margin * 2 - 12;

    pdf.setFontSize(10);

    genogram.persons.forEach((person, index) => {
      // Verificar si necesitamos nueva página
      if (yPosition + lineHeight * 5 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Nombre de la persona con identificador
      pdf.setFont('helvetica', 'bold');
      const statusIcon = person.attributes?.status === 'deceased' ? '(✝)' : person.attributes?.isPrimaryPatient ? '(⭐)' : '';
      pdf.text(`${index + 1}. ${person.name} ${statusIcon}`, margin, yPosition);
      yPosition += lineHeight;

      // Datos demográficos
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);

      const birthLabel = person.birthDate?.precision ? `${person.birthDate.precision === 'about' ? 'Aprox. ' : ''}${person.birthDate.date}` : 'No especificada';
      const deathLabel = person.deathDate?.precision ? `${person.deathDate.precision === 'about' ? 'Aprox. ' : ''}${person.deathDate.date}` : 'N/A';

      const details = [
        `Género: ${this.getGenderLabel(person.gender)}`,
        `Generación: ${person.generation || 'N/A'}`,
        `Nacimiento: ${birthLabel}`,
        person.attributes?.status === 'deceased' ? `Fallecimiento: ${deathLabel}` : '',
      ].filter(Boolean);

      details.forEach((detail) => {
        pdf.text(detail, margin + 5, yPosition);
        yPosition += lineHeight - 1;
      });

      // Condiciones médicas si existen
      if (person.medicalConditions && person.medicalConditions.length > 0) {
        yPosition += 1;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Condiciones médicas:', margin + 5, yPosition);
        yPosition += lineHeight - 2;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        person.medicalConditions.forEach((cond) => {
          const code = cond.code ? ` (${cond.code})` : '';
          pdf.text(`• ${cond.name}${code} - ${cond.status || 'activo'}`, margin + 8, yPosition);
          yPosition += lineHeight - 2;
        });
      }

      yPosition += 2;
    });

    // Agregar página con condiciones detalladas
    pdf.addPage();
    this.addConditionsPage(pdf, genogram, margin, pageWidth, pageHeight);

    // Agregar página con notas y metadata
    pdf.addPage();
    this.addNotesAndMetadataPage(pdf, genogram, margin, pageWidth, pageHeight);
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
   * Agregar página con condiciones médicas indexadas y timeline (Página 3)
   */
  private static addConditionsPage(
    pdf: jsPDF,
    genogram: Genogram,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): void {
    // Header
    pdf.setFillColor(231, 76, 60); // Rojo para sección clínica
    pdf.rect(0, 0, pageWidth, 15, 'F');

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('CONDICIONES MÉDICAS', margin, 10);

    pdf.setTextColor(0, 0, 0);

    let yPosition = margin + 8;
    const lineHeight = 5;
    const columnWidth = (pageWidth - margin * 2) / 2;

    // Recolectar todas las condiciones indexadas
    const conditionMap = new Map<string, Array<{ person: string; cond: any }>>();
    
    genogram.persons.forEach((person) => {
      if (person.medicalConditions && person.medicalConditions.length > 0) {
        const personName = person.name || 'Sin nombre';
        person.medicalConditions.forEach((cond) => {
          const key = cond.name || 'Sin especificar';
          if (!conditionMap.has(key)) {
            conditionMap.set(key, []);
          }
          conditionMap.get(key)!.push({ person: personName, cond });
        });
      }
    });

    if (conditionMap.size === 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 100, 100);
      pdf.text('No hay condiciones médicas registradas', margin, yPosition);
      return;
    }

    // Listar condiciones
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    let conditionIndex = 1;

    Array.from(conditionMap.entries()).forEach(([condName, cases]) => {
      if (yPosition + lineHeight * 4 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Condición
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`${conditionIndex}. ${condName}`, margin, yPosition);
      yPosition += lineHeight;

      // Detalles
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      cases.forEach((c) => {
        const code = c.cond.code ? `(${c.cond.code})` : '';
        const status = c.cond.status ? ` - ${c.cond.status}` : '';
        pdf.text(
          `• ${c.person}${code}${status}`,
          margin + 5,
          yPosition
        );
        yPosition += lineHeight - 1;
      });

      yPosition += 2;
      conditionIndex++;
    });
  }

  /**
   * Agregar página con notas y metadata (Página 4)
   */
  private static addNotesAndMetadataPage(
    pdf: jsPDF,
    genogram: Genogram,
    margin: number,
    pageWidth: number,
    pageHeight: number
  ): void {
    // Header
    pdf.setFillColor(46, 125, 50); // Verde para documentación
    pdf.rect(0, 0, pageWidth, 15, 'F');

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('NOTAS Y METADATA CLÍNICA', margin, 10);

    pdf.setTextColor(0, 0, 0);

    let yPosition = margin + 10;
    const lineHeight = 6;

    // Metadata
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('📋 Información del Genograma', margin, yPosition);
    yPosition += lineHeight + 2;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    const metadata: Array<[string, number]> = [
      [`Paciente Índice: ${genogram.pacientName || 'No especificado'}`, margin],
      [`Fecha de Generación: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, margin],
      [`Total de Personas: ${genogram.persons.length}`, margin],
      [`Total de Relaciones: ${genogram.connections.length}`, margin],
      [`Generaciones: ${Math.max(0, ...genogram.persons.map(p => p.generation || 0))} niveles`, margin],
    ];

    metadata.forEach(([text, xPos]) => {
      if (yPosition + lineHeight > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(text, xPos + 5, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 3;

    // Notas clínicas (si existen)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('📝 Notas Clínicas', margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    const notesText = genogram.notes || 'No hay notas adicionales registradas';
    const splitNotes = pdf.splitTextToSize(notesText, pageWidth - margin * 2 - 5);
    
    splitNotes.forEach((line: string) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    // Footer con firma
    yPosition = pageHeight - margin - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);

    const lines = [
      '─────────────────────────────────────────────────────────',
      'Documento generado automáticamente por GenGraph Pro',
      'Sistema de Genogramas Clínicos Digitales',
      `Versión: 2.0 • ${new Date().getFullYear()}`,
    ];

    lines.forEach((line) => {
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
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
