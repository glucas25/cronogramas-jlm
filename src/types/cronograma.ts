export interface Cronograma {
    [key: string]: string | number | null;
}

export type CronogramaTipo = 'inicio' | 'academico' | 'civico' | 'vicerrectorado' | 'talleres' | 'visitas';

export interface CronogramasState extends Record<CronogramaTipo, Cronograma[]> {}

export interface EventoProximo {
    tipo: CronogramaTipo;
    titulo: string;
    fecha: string;
    descripcion?: string;
    cursoResponsable?: string;
}

export const sheetUrls: Partial<Record<CronogramaTipo, string>> = {
    academico: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=0&single=true&output=csv',
    civico: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=674664369&single=true&output=csv',
    vicerrectorado: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=1699425020&single=true&output=csv',
    talleres: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=1516163317&single=true&output=csv',
    visitas: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=877634632&single=true&output=csv'
};
