let currentTab = 'academico';
let cronogramas = {
    academico: [],
    civico: [],
    vicerrectorado: []
};

// URLs específicas para cada hoja de Google Sheets
const sheetUrls = {
    academico: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=0&single=true&output=csv',
    civico: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=674664369&single=true&output=csv',
    vicerrectorado: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-RxjI3ooOjEWIWs-4Uiw4Tm7hHe4KZE-861pSZ-vju9b4F9RuldAQkRmy8jXkLLbMCqoJL9E8oE04/pub?gid=1699425020&single=true&output=csv'
};

// Configurar eventos de pestañas
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTab = this.getAttribute('data-tab');
        loadData(); // Cargar datos automáticamente al cambiar de pestaña
    });
});

async function loadData() {
    const url = sheetUrls[currentTab];
    
    if (!url) {
        showError('URL no configurada para este cronograma.');
        return;
    }

    showLoading();

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
            complete: function(results) {
                if (results.errors.length > 0) {
                    console.error('Errores al parsear CSV:', results.errors);
                }
                
                // Limpiar headers (remover espacios)
                const cleanData = results.data.map(row => {
                    const cleanRow = {};
                    Object.keys(row).forEach(key => {
                        const cleanKey = key.trim();
                        cleanRow[cleanKey] = row[key];
                    });
                    return cleanRow;
                });

                // Filtrar filas vacías
                const filteredData = cleanData.filter(row => {
                    return Object.values(row).some(value => 
                        value !== null && value !== undefined && value !== ''
                    );
                });
                
                cronogramas[currentTab] = filteredData;
                renderTable();
            },
            error: function(error) {
                showError('Error al procesar los datos: ' + error.message);
            }
        });

    } catch (error) {
        showError('Error al cargar los datos: ' + error.message + '. Verifica que el Google Sheet esté publicado correctamente.');
    }
}

function showLoading() {
    document.getElementById('content').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando cronograma ${currentTab}...</p>
        </div>
    `;
}

function showError(message) {
    document.getElementById('content').innerHTML = `
        <div class="error">
            ⚠️ ${message}
        </div>
        <div class="empty-state">
            <div style="font-size: 4rem; margin-bottom: 20px;">📊</div>
            <h3>Error al cargar datos</h3>
            <p>Verifica que el Google Sheet esté publicado correctamente y que contenga las hojas correspondientes.</p>
        </div>
    `;
}

function renderTable() {
    const data = cronogramas[currentTab];
    const content = document.getElementById('content');

    if (!data || data.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4rem; margin-bottom: 20px;">📋</div>
                <h3>No hay datos disponibles</h3>
                <p>No se encontraron datos en la hoja ${currentTab}. Verifica que la hoja contenga información.</p>
            </div>
        `;
        return;
    }

    let tableHtml = '';
    
    if (currentTab === 'academico') {
        tableHtml = renderAcademicoTable(data);
    } else if (currentTab === 'civico') {
        tableHtml = renderCivicoTable(data);
    } else if (currentTab === 'vicerrectorado') {
        tableHtml = renderVicerrectoradoTable(data);
    }

    content.innerHTML = `
        <div class="table-container">
            <div class="table-wrapper">
                ${tableHtml}
            </div>
        </div>
    `;
}

function renderAcademicoTable(data) {
    // Detectar las columnas disponibles
    const availableColumns = Object.keys(data[0] || {}).filter(key => key.trim() !== '');
    
    if (availableColumns.length === 0) {
        return `<div class="empty-state"><p>No se detectaron columnas válidas en los datos.</p></div>`;
    }

    let html = '<table><thead><tr>';
    
    availableColumns.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach((row, index) => {
        const statusClass = index % 3 === 0 ? 'status-active' : index % 3 === 1 ? 'status-pending' : 'status-completed';
        html += '<tr>';
        
        availableColumns.forEach((column, colIndex) => {
            const value = row[column] || '';
            if (colIndex === 0) {
                html += `<td><span class="status-indicator ${statusClass}"></span>${value}</td>`;
            } else {
                html += `<td>${value}</td>`;
            }
        });
        
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

function renderCivicoTable(data) {
    // Detectar las columnas disponibles
    const availableColumns = Object.keys(data[0] || {}).filter(key => key.trim() !== '');
    
    if (availableColumns.length === 0) {
        return `<div class="empty-state"><p>No se detectaron columnas válidas en los datos.</p></div>`;
    }

    let html = '<table><thead><tr>';
    
    availableColumns.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach((row, index) => {
        const statusClass = index % 3 === 0 ? 'status-active' : index % 3 === 1 ? 'status-pending' : 'status-completed';
        html += '<tr>';
        
        availableColumns.forEach((column, colIndex) => {
            const value = row[column] || '';
            if (colIndex === 0) {
                html += `<td><span class="status-indicator ${statusClass}"></span>${value}</td>`;
            } else {
                html += `<td>${value}</td>`;
            }
        });
        
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

function renderVicerrectoradoTable(data) {
    // Detectar las columnas disponibles
    const availableColumns = Object.keys(data[0] || {}).filter(key => key.trim() !== '');
    
    if (availableColumns.length === 0) {
        return `<div class="empty-state"><p>No se detectaron columnas válidas en los datos.</p></div>`;
    }

    let html = '<table><thead><tr>';
    
    availableColumns.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach((row, index) => {
        const statusClass = index % 3 === 0 ? 'status-active' : index % 3 === 1 ? 'status-pending' : 'status-completed';
        html += '<tr>';
        
        availableColumns.forEach((column, colIndex) => {
            const value = row[column] || '';
            if (colIndex === 0) {
                html += `<td><span class="status-indicator ${statusClass}"></span>${value}</td>`;
            } else {
                html += `<td>${value}</td>`;
            }
        });
        
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

// Cargar datos iniciales al abrir la página
document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Cargar cronograma académico por defecto
});