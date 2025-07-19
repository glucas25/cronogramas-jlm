import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import type { Cronograma, CronogramaTipo, CronogramasState } from '../types/cronograma';
import { sheetUrls } from '../types/cronograma';

export const useCronogramas = () => {
    const [cronogramas, setCronogramas] = useState<CronogramasState>({
        inicio: [],
        academico: [],
        civico: [],
        vicerrectorado: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async (tipo: CronogramaTipo) => {
        const url = sheetUrls[tipo];
        
        if (!url) {
            setError('URL no configurada para este cronograma.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('Errores al parsear CSV:', results.errors);
                    }
                    
                    // Limpiar headers y remover columnas no deseadas
                    const cleanData = (results.data as Record<string, unknown>[]).map(row => {
                        const cleanRow: Cronograma = {};
                        Object.keys(row).forEach(key => {
                            const cleanKey = key.trim();
                            // No incluir columnas que contengan current o upcoming
                            if (!cleanKey.toUpperCase().includes('CURRENT') && !cleanKey.toUpperCase().includes('UPCOMING')) {
                                cleanRow[cleanKey] = row[key] as string | number | null;
                            }
                        });
                        return cleanRow;
                    });

                    // Filtrar filas vacías
                    const filteredData = cleanData.filter(row => {
                        return Object.values(row).some(value => 
                            value !== null && value !== undefined && value !== ''
                        );
                    });
                    
                    setCronogramas(prev => ({
                        ...prev,
                        [tipo]: filteredData
                    }));
                    setLoading(false);
                },
                error: (error: Error) => {
                    setError('Error al procesar los datos: ' + error.message);
                    setLoading(false);
                }
            });

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            setError('Error al cargar los datos: ' + message + '. Verifica que el Google Sheet esté publicado correctamente.');
            setLoading(false);
        }
    }, []);

    return {
        cronogramas,
        loading,
        error,
        loadData
    };
};
