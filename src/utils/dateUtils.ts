export function extractStartDate(dateRange: string): Date | null {
    // Maneja formatos como "05 - 09 de mayo" o "05-09 de mayo"
    const match = dateRange.match(/(\d{1,2})\s*-\s*\d{1,2}\s+de\s+(\w+)/i);
    if (!match) return null;

    const [, day, month] = match;
    const months: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    const monthIndex = months[month.toLowerCase()];
    if (monthIndex === undefined) return null;

    // Usamos el año actual si no se especifica
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, monthIndex, parseInt(day));
}

/**
 * Extrae la fecha inicial y final de un string de fecha tipo "10-14 de junio" o "12 de junio".
 * Devuelve un objeto con start y end como Date, o null si no se puede parsear.
 */
export function extractDateRange(dateRange: string): { start: Date, end: Date } | null {
    const months: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    const currentYear = new Date().getFullYear();
    // Rango: "10-14 de junio"
    const rangeMatch = dateRange.match(/(\d{1,2})\s*-\s*(\d{1,2})\s+de\s+(\w+)/i);
    if (rangeMatch) {
        const [, startDay, endDay, month] = rangeMatch;
        const monthIndex = months[month.toLowerCase()];
        if (monthIndex === undefined) return null;
        return {
            start: new Date(currentYear, monthIndex, parseInt(startDay)),
            end: new Date(currentYear, monthIndex, parseInt(endDay))
        };
    }
    // Fecha simple: "12 de junio"
    const singleMatch = dateRange.match(/(\d{1,2})\s+de\s+(\w+)/i);
    if (singleMatch) {
        const [, day, month] = singleMatch;
        const monthIndex = months[month.toLowerCase()];
        if (monthIndex === undefined) return null;
        const date = new Date(currentYear, monthIndex, parseInt(day));
        return { start: date, end: date };
    }
    return null;
}
