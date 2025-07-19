import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import type { CronogramaTipo, EventoProximo, Cronograma } from './types/cronograma';
import { useCronogramas } from './hooks/useCronogramas';
import Header from './components/Header';
import TabSelector from './components/TabSelector';
import EventosProximos from './components/EventosProximos';
import './App.css';
import { extractDateRange } from './utils/dateUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Función para parsear fechas en español
const parseSpanishDate = (fechaStr: string): Date => {
  const months: { [key: string]: number } = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
    'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
    'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
  };
  
  // Formato: "dd de mes del yyyy"
  const match = fechaStr.match(/(\d{1,2})\s+de\s+(\w+)\s+del\s+(\d{4})/i);
  if (match) {
    const [, day, month, year] = match;
    const monthIndex = months[month.toLowerCase()];
    if (monthIndex !== undefined) {
      return new Date(parseInt(year), monthIndex, parseInt(day));
    }
  }
  
  // Si no coincide, intentar con Date() normal
  return new Date(fechaStr);
};

const INSTITUCION = "Unidad Educativa Fiscal Juan León Mera";

function exportarPDF(tab: CronogramaTipo, datos: Cronograma[]) {
  const doc = new jsPDF();
  const titulos: Record<CronogramaTipo, string> = {
    inicio: "Eventos Próximos",
    academico: "Cronograma Escolar",
    civico: "Momentos Cívicos",
    vicerrectorado: "Documentos Solicitados"
  };

  // Encabezado
  doc.setFontSize(16);
  // Centrar el nombre de la institución
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(INSTITUCION);
  doc.text(INSTITUCION, (pageWidth - textWidth) / 2, 15);
  doc.setFontSize(12);
  doc.text(titulos[tab], 14, 25);

  // Preparar columnas y filas
  const columnas = Object.keys(datos[0] || {}).filter(
    h => !h.toUpperCase().includes('CURRENT') && !h.toUpperCase().includes('UPCOMING')
  );
  const filas = datos.map(row => columnas.map(col => row[col] ?? ''));

  // Tabla
  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: 30
  });

  // Pie de página con la fecha de impresión
  const fechaImpresion = new Date().toLocaleDateString('es-EC', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(10);
  doc.text(`Fecha de impresión: ${fechaImpresion}`, 14, doc.internal.pageSize.getHeight() - 10);

  doc.save(`${titulos[tab]}.pdf`);
}

function App() {
  const [currentTab, setCurrentTab] = useState<CronogramaTipo>('inicio');
  const { cronogramas, loading, error, loadData } = useCronogramas();

  // LOG TEMPORAL para depuración de columnas de Vicerrectorado
  console.log('Vicerrectorado:', cronogramas['vicerrectorado']);

  useEffect(() => {
    // Cargar todos los cronogramas al iniciar la aplicación
    const loadAllData = async () => {
      const tipos: CronogramaTipo[] = ['academico', 'civico', 'vicerrectorado'];
      await Promise.all(tipos.map(tipo => loadData(tipo)));
    };
    
    loadAllData();
  }, [loadData]);

  // Mantener la carga individual al cambiar de tab por si hay actualizaciones
  useEffect(() => {
    if (currentTab !== 'inicio') {
      loadData(currentTab);
    }
  }, [currentTab, loadData]);
  
  const eventosProximos = useMemo(() => {
    const eventos: EventoProximo[] = [];
    const tipos: CronogramaTipo[] = ['academico', 'civico', 'vicerrectorado'];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar la fecha actual
    
    tipos.forEach(tipo => {
      const items: Cronograma[] = cronogramas[tipo] || [];
      const eventosDelTipo: EventoProximo[] = [];

      items.forEach(item => {
        if (tipo === 'vicerrectorado') {
          // Mapeo especial para Vicerrectorado
          const titulo = String(item['Documento'] || '');
          const fecha = String(item['Fecha de entrega'] || '');
          console.log('Procesando Vicerrectorado:', { titulo, fecha, item });
          if (titulo && fecha) {
            // Para Vicerrectorado, mostrar solo eventos futuros
            const fechaEvento = parseSpanishDate(fecha);
            
            console.log('parseSpanishDate resultado:', fechaEvento, 'para fecha:', fecha);
            console.log('Fecha evento Vicerrectorado:', fechaEvento, 'Today:', today, 'Es válida:', fechaEvento >= today);
            
            if (fechaEvento >= today) {
              eventosDelTipo.push({
                tipo,
                titulo,
                fecha
              });
            }
          }
          return;
        }
        if (tipo === 'civico') {
          console.log('Campos disponibles en evento cívico:', Object.keys(item));
          console.log('Valores del evento cívico:', item);
        }
        const titulo = String(item['Actividades'] || '');
        
        // Ignorar actividades formativas
        if (titulo.toLowerCase().includes('actividades formativas')) {
          return;
        }

        // Extraer la fecha del string
        const fechaStr = String(item['Fecha'] || '');
        const months: { [key: string]: number } = {
          'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
          'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
          'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };
        
        let fecha: Date;
        
        // Intenta diferentes formatos de fecha
        const rangoMatch = fechaStr.match(/(\d{1,2})\s*-\s*\d{1,2}\s+de\s+(\w+)/i);
        const singleMatch = fechaStr.match(/(\d{1,2})\s+de\s+(\w+)/i);
        
        if (rangoMatch) {
          // Formato: "4-8 de agosto"
          const [, day, month] = rangoMatch;
          const monthIndex = months[month.toLowerCase()];
          if (monthIndex !== undefined) {
            fecha = new Date(today.getFullYear(), monthIndex, parseInt(day));
          } else {
            fecha = new Date(fechaStr);
          }
        } else if (singleMatch) {
          // Formato: "4 de agosto"
          const [, day, month] = singleMatch;
          const monthIndex = months[month.toLowerCase()];
          if (monthIndex !== undefined) {
            fecha = new Date(today.getFullYear(), monthIndex, parseInt(day));
          } else {
            fecha = new Date(fechaStr);
          }
        } else {
          // Otros formatos
          fecha = new Date(fechaStr);
        }

        // Para eventos académicos y cívicos, solo mostrar eventos actuales o futuros
        if (tipo === 'academico' || tipo === 'civico') {
          if (fecha >= today) {
            const descripcion = tipo === 'civico' 
              ? String(item['Tema'] || '')
              : item['Observaciones'] ? String(item['Observaciones']) : undefined;
              
            // Intentar diferentes variantes del nombre de la columna para el curso responsable
            const cursoResponsable = tipo === 'civico' 
              ? String(item['Curso Responsable'] || '')
              : undefined;
            
            eventosDelTipo.push({
              tipo,
              titulo,
              fecha: String(item['Fecha'] || ''),
              descripcion,
              cursoResponsable
            });
          }
        } else {
          // Para otros tipos de eventos, mostrar todos
          eventosDelTipo.push({
            tipo,
            titulo,
            fecha: String(item['Fecha'] || ''),
            descripcion: item['Observaciones'] ? String(item['Observaciones']) : undefined
          });
        }
      });

      // Ordenar eventos por fecha y limitar a 3 por tipo
      eventosDelTipo.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      eventosDelTipo.splice(3); // Limitar a 3 eventos por tipo

      eventos.push(...eventosDelTipo);
    });

    return eventos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [cronogramas]);

  const handleTabChange = (tab: CronogramaTipo) => {
    setCurrentTab(tab);
  };

  const renderContent = (): React.ReactNode => {
    if (currentTab === 'inicio') {
      if (loading) {
        return (
          <div className="empty-state">
            <div className="loading">Cargando eventos próximos...</div>
          </div>
        );
      }

      if (eventosProximos.length === 0) {
        return (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
            <h3>No hay eventos próximos</h3>
            <p>No hay eventos programados para mostrar en este momento.</p>
          </div>
        );
      }

      return <EventosProximos eventos={eventosProximos} />;
    }

    if (loading) {
      return (
        <div className="empty-state">
          <div className="loading">Cargando datos...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="empty-state">
          <div className="error">{error}</div>
        </div>
      );
    }

    if (!cronogramas[currentTab] || cronogramas[currentTab].length === 0) {
      return (
        <div className="empty-state">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
          <h3>Sistema de Cronogramas Institucionales</h3>
          <p>No hay datos disponibles para mostrar en este momento.</p>
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <a
            href="#"
            className="pdf-link"
            onClick={e => {
              e.preventDefault();
              exportarPDF(currentTab, cronogramas[currentTab]);
            }}
          >
            Descargar PDF
          </a>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(cronogramas[currentTab][0])
                  .filter(header => !header.toUpperCase().includes('CURRENT') && !header.toUpperCase().includes('UPCOMING'))
                  .map((header) => {
                    console.log('Column header:', header);
                    return <th key={header}>{header}</th>;
                  })}
              </tr>
            </thead>
            <tbody>
              {cronogramas[currentTab].map((row: Cronograma, index: number) => {
                let isCurrentWeek = false;
                if (currentTab === 'academico' && row['Fecha']) {
                  const range = extractDateRange(String(row['Fecha']));
                  if (range) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (today >= range.start && today <= range.end) {
                      isCurrentWeek = true;
                    }
                  }
                }
                // Para cívico: resaltar la fila de la siguiente semana
                if (currentTab === 'civico' && row['Fecha']) {
                  const fechaStr = String(row['Fecha']);
                  const range = extractDateRange(fechaStr);
                  let fechaEvento: Date | null = null;
                  if (range) {
                    fechaEvento = range.start;
                  } else {
                    // Intentar parsear como fecha simple
                    const date = new Date(fechaStr);
                    if (!isNaN(date.getTime())) {
                      fechaEvento = date;
                    }
                  }
                  if (fechaEvento) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    // Calcular el lunes de la semana siguiente
                    const dayOfWeek = today.getDay();
                    const daysUntilNextMonday = ((8 - dayOfWeek) % 7) || 7;
                    const nextMonday = new Date(today);
                    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
                    // Calcular el domingo de la semana siguiente
                    const nextSunday = new Date(nextMonday);
                    nextSunday.setDate(nextMonday.getDate() + 6);
                    if (fechaEvento >= nextMonday && fechaEvento <= nextSunday) {
                      isCurrentWeek = true;
                    }
                  }
                }
                // Para vicerrectorado: resaltar la fila cuya fecha de entrega sea hoy o futura
                if (currentTab === 'vicerrectorado' && row['Fecha de entrega']) {
                  const fechaStr = String(row['Fecha de entrega']);
                  const range = extractDateRange(fechaStr);
                  let fechaEntrega: Date | null = null;
                  if (range) {
                    fechaEntrega = range.start;
                  } else {
                    // Intentar parsear como fecha simple
                    const date = new Date(fechaStr);
                    if (!isNaN(date.getTime())) {
                      fechaEntrega = date;
                    }
                  }
                  if (fechaEntrega) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (fechaEntrega >= today) {
                      isCurrentWeek = true;
                    }
                  }
                }
                return (
                  <tr key={index} className={isCurrentWeek ? 'current-week' : ''}>
                    {Object.entries(row)
                      .filter(([key]) => !key.toUpperCase().includes('CURRENT') && !key.toUpperCase().includes('UPCOMING'))
                      .map(([_, value], cellIndex) => (
                        <td key={cellIndex}>{value !== null ? String(value) : ''}</td>
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Header />
      <div className="controls">
        <TabSelector currentTab={currentTab} onTabChange={handleTabChange} />
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default App;
