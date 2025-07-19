import type { EventoProximo } from '../types/cronograma';

interface EventosProximosProps {
    eventos: EventoProximo[];
}

const EventosProximos = ({ eventos }: EventosProximosProps) => {
    // Agrupar eventos por tipo
    const eventosPorTipo = eventos.reduce((acc, evento) => {
        if (!acc[evento.tipo]) {
            acc[evento.tipo] = [];
        }
        acc[evento.tipo].push(evento);
        return acc;
    }, {} as Record<string, EventoProximo[]>);

    return (
        <div className="eventos-proximos">
            {Object.entries(eventosPorTipo).map(([tipo, eventosDelTipo]) => (
                <div key={tipo} className="eventos-seccion">
                    <h3 className="eventos-seccion-titulo">{getTipoLabel(tipo)}</h3>
                    {eventosDelTipo.length === 0 ? (
                        <div className="empty-section">
                            <p>No hay actividades planificadas para mostrar en este momento.</p>
                        </div>
                    ) : (
                        <div className="eventos-grid">
                            {eventosDelTipo.map((evento, index) => (
                                tipo === 'vicerrectorado' ? (
                                    <div key={index} className="evento-card">
                                        <h3 className="evento-titulo">{evento.titulo}</h3>
                                        <div className="evento-fecha">{formatDate(evento.fecha)}</div>
                                    </div>
                                ) : (
                                    <div key={index} className="evento-card">
                                        <div className="evento-fecha">{formatDate(evento.fecha)}</div>
                                        <h3 className="evento-titulo">{evento.titulo}</h3>
                                        {evento.descripcion && (
                                            <p className="evento-descripcion">{evento.descripcion}</p>
                                        )}
                                        {evento.cursoResponsable && (
                                            <div className="evento-curso">{evento.cursoResponsable}</div>
                                        )}
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {/* Mostrar siempre la sección de Vicerrectorado si no existe en eventosPorTipo */}
            {!eventosPorTipo['vicerrectorado'] && (
                <div className="eventos-seccion">
                    <h3 className="eventos-seccion-titulo">{getTipoLabel('vicerrectorado')}</h3>
                    <div className="empty-section">
                        <p>No hay actividades planificadas para mostrar en este momento.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const getTipoLabel = (tipo: string) => {
    const labels: Record<string, { text: string; icon: string }> = {
        academico: { text: 'Académico', icon: '📚' },
        civico: { text: 'Cívico', icon: '🏛️' },
        vicerrectorado: { text: 'Documentos Solicitados', icon: '📋' }
    };
    return labels[tipo] ? `${labels[tipo].icon} ${labels[tipo].text}` : tipo;
};

const formatDate = (fecha: string) => {
    try {
        const date = new Date(fecha);
        return new Intl.DateTimeFormat('es-EC', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (e) {
        return fecha;
    }
};

export default EventosProximos;
