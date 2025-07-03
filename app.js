// =============================================
// DATOS EMBEBIDOS (como respaldo)
// =============================================
const localData = {
    sucursales: [
        { id: 1, nombre: "Asunción - Centro", oficiales: ["Juan Pérez", "María González", "Carlos López"] },
        { id: 2, nombre: "Ciudad del Este", oficiales: ["Roberto Martínez", "Ana Rodríguez", "Luis Fernández"] },
        { id: 3, nombre: "San Lorenzo", oficiales: ["Pedro Gómez", "Sofía Díaz", "Miguel Sánchez"] },
        { id: 4, nombre: "Luque", oficiales: ["José Ramírez", "Laura Álvarez", "Andrés Torres"] },
        { id: 5, nombre: "Capiatá", oficiales: ["Daniel Ruiz", "Patricia Herrera", "Fernando Castro"] },
        { id: 6, nombre: "Lambaré", oficiales: ["Ricardo Ortega", "Elena Mendoza", "Jorge Vargas"] },
        { id: 7, nombre: "Fernando de la Mora", oficiales: ["Alberto Medina", "Silvia Romero", "Hugo Guzmán"] },
        { id: 8, nombre: "Encarnación", oficiales: ["Mario Rojas", "Claudia Silva", "Raúl Flores"] },
        { id: 9, nombre: "Concepción", oficiales: ["Eduardo Acosta", "Verónica Vega", "Oscar Méndez"] },
        { id: 10, nombre: "Pedro Juan Caballero", oficiales: ["Santiago Cortés", "Natalia Paredes", "Felipe Ríos"] },
        { id: 11, nombre: "Coronel Oviedo", oficiales: ["Gustavo Núñez", "Carolina Miranda", "Diego Valdez"] },
        { id: 12, nombre: "Villarrica", oficiales: ["Hernán Peña", "Adriana Cordero", "Walter Rivas"] },
        { id: 13, nombre: "Pilar", oficiales: ["Mauricio Aguirre", "Lucía Figueroa", "Esteban Molina"] },
        { id: 14, nombre: "Caaguazú", oficiales: ["Federico Juárez", "Gabriela Espinoza", "Renato Campos"] },
        { id: 15, nombre: "Itauguá", oficiales: ["Armando Salazar", "Daniela Montes", "Rodrigo León"] },
        { id: 16, nombre: "Mariano Roque Alonso", oficiales: ["Arturo Delgado", "Marina Cervantes", "Gerardo Ponce"] },
        { id: 17, nombre: "Presidente Franco", oficiales: ["Víctor Cabrera", "Isabel Valenzuela", "Nicolás Cáceres"] },
        { id: 18, nombre: "Ayolas", oficiales: ["Omar Carrasco", "Rosa Segura", "Héctor Navarro"] },
        { id: 19, nombre: "Santa Rita", oficiales: ["Rubén Mora", "Beatriz Santana", "Emanuel Fuentes"] },
        { id: 20, nombre: "Caacupé", oficiales: ["Fabián Reyes", "Leticia Bustamante", "Sergio Orellana"] },
        { id: 21, nombre: "San Juan Bautista", oficiales: ["Iván Ávila", "Yolanda Méndez", "César Zúñiga"] },
        { id: 22, nombre: "Areguá", oficiales: ["Rolando Tapia", "Nora Salinas", "Marcelo Contreras"] },
        { id: 23, nombre: "Villeta", oficiales: ["Ernesto Moya", "Olga Lara", "Alfonso Osorio"] },
        { id: 24, nombre: "Paraguarí", oficiales: ["Julio Ferreyra", "Eva Roldán", "Tomás Palma"] }
    ],
    kpis: [
        { id: 1, proceso: "Alta de cliente", perspectiva: "Eficiencia", nombre: "Tiempo de Onboarding del Cliente", objetivo: "Medir el tiempo total desde la carga inicial hasta la creación del cliente en el sistema.", unidad: "Horas", formula: "Fecha y Hora Creación - Fecha y Hora Inicio Onboarding", granularidad: "Segmento - Canal - Oficial", tiempo: "Mensual", valorActual: 12.5, valorBudget: 10.0 },
        { id: 2, proceso: "Alta de cliente", perspectiva: "Eficiencia", nombre: "Validaciones Automáticas Exitosas", objetivo: "Medir cuántos clientes pasan exitosamente por controles automáticos (ej. DNI, AFIP, Sancionados).", unidad: "Porcentaje (%)", formula: "Validaciones OK / Total Clientes * 100", granularidad: "Tipo de validación - Canal", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        // ... (resto de los KPIs originales)
    ],
    historical: {
        labels: ["Jun 2024", "Jul 2024", "Ago 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dic 2024", "Ene 2025", "Feb 2025", "Mar 2025", "Abr 2025", "May 2025", "Jun 2025"],
        eficiencia: [78, 80, 82, 81, 83, 84, 85, 86, 87, 88, 89, 90, 91],
        calidad: [85, 86, 87, 86, 88, 89, 90, 91, 92, 93, 94, 95, 96],
        experiencia: [72, 74, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]
    }
};

// =============================================
// VARIABLES GLOBALES
// =============================================
let sucursalesParaguay = localData.sucursales;
let kpisData = localData.kpis;
let historicalData = localData.historical;
let currentChart = null;
let isMatrizView = false;
let historicalValues = {};

// Generar datos históricos para todos los KPIs
function generateHistoricalValues() {
    const kpiIds = kpisData.map(kpi => kpi.id);
    const months = historicalData.labels;
    
    kpiIds.forEach(id => {
        historicalValues[id] = {};
        months.forEach((month, index) => {
            // Generar valores aleatorios basados en el valor actual con cierta variación
            const kpi = kpisData.find(k => k.id === id);
            const baseValue = kpi.valorActual;
            const variation = (Math.random() * 0.2 - 0.1) * baseValue; // ±10% de variación
            historicalValues[id][month] = Math.max(0, baseValue + variation);
            
            // Asegurar que los porcentajes no excedan 100%
            if (kpi.unidad.includes("Porcentaje")) {
                historicalValues[id][month] = Math.min(100, historicalValues[id][month]);
            }
        });
    });
}

// =============================================
// FUNCIONES PRINCIPALES
// =============================================

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Intenta cargar datos externos primero
        const [sucursalesResponse, kpisResponse, historicalResponse] = await Promise.all([
            fetchData('./data/sucursales.json'),
            fetchData('./data/kpis.json'),
            fetchData('./data/historical.json')
        ]);

        // Usa datos externos si están disponibles, de lo contrario usa los datos locales
        sucursalesParaguay = sucursalesResponse || localData.sucursales;
        kpisData = kpisResponse || localData.kpis;
        historicalData = historicalResponse || localData.historical;
        
        // Generar datos históricos para todos los KPIs
        generateHistoricalValues();
        
        // Inicializa la aplicación
        loadSucursales();
        setupEventListeners();
        updateDashboard();
        renderHistoricalChart();
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        // Usa datos locales si hay algún error
        loadDefaultData();
        generateHistoricalValues();
        loadSucursales();
        setupEventListeners();
        updateDashboard();
        renderHistoricalChart();
    }
});

// Función mejorada para cargar datos
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`No se pudo cargar ${url}, usando datos locales`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.warn(`Error al cargar ${url}:`, error);
        return null;
    }
}

function loadDefaultData() {
    sucursalesParaguay = localData.sucursales;
    kpisData = localData.kpis;
    historicalData = localData.historical;
}

function loadSucursales() {
    const select = document.getElementById('sucursal-select');
    select.innerHTML = '<option value="todas">Todas las sucursales</option>';
    
    sucursalesParaguay.forEach(sucursal => {
        const option = document.createElement('option');
        option.value = sucursal.id;
        option.textContent = sucursal.nombre;
        select.appendChild(option);
    });
    
    // Cargar oficiales para la primera sucursal
    if (sucursalesParaguay.length > 0) {
        updateOficiales(sucursalesParaguay[0].id);
    }
}

function updateOficiales(sucursalId) {
    const select = document.getElementById('oficial-select');
    select.innerHTML = '<option value="todos">Todos los oficiales</option>';
    
    if (sucursalId === 'todas') return;
    
    const sucursal = sucursalesParaguay.find(s => s.id == sucursalId);
    if (sucursal) {
        sucursal.oficiales.forEach(oficial => {
            const option = document.createElement('option');
            option.value = oficial;
            option.textContent = oficial;
            select.appendChild(option);
        });
    }
}

function setupEventListeners() {
    // Filtros
    document.getElementById('sucursal-select').addEventListener('change', function() {
        updateOficiales(this.value);
        updateDashboard();
    });
    
    document.getElementById('oficial-select').addEventListener('change', updateDashboard);
    document.getElementById('perspectiva-select').addEventListener('change', updateDashboard);
    document.getElementById('periodo-select').addEventListener('change', updateDashboard);
    
    // Menú
    document.getElementById('dashboard-link').addEventListener('click', function(e) {
        e.preventDefault();
        switchToDashboard();
    });
    
    document.getElementById('matriz-link').addEventListener('click', function(e) {
        e.preventDefault();
        switchToMatriz();
    });
    
    // Tooltips para los KPIs
    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('kpi-name')) {
            showTooltip(e.target);
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('kpi-name')) {
            hideTooltip();
        }
    });

    // Event delegation para el drill-down
    document.getElementById('kpi-table').addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-group')) {
            const groupId = e.target.getAttribute('data-group-id');
            const groupType = e.target.getAttribute('data-group-type');
            toggleGroup(groupId, groupType, e.target);
        }
    });
}

function toggleGroup(groupId, groupType, element) {
    const rows = document.querySelectorAll(`tr[data-parent-id="${groupId}"][data-parent-type="${groupType}"]`);
    const icon = element.querySelector('i');
    
    rows.forEach(row => {
        if (row.style.display === 'none') {
            row.style.display = '';
            icon.classList.remove('bi-plus-square');
            icon.classList.add('bi-dash-square');
        } else {
            row.style.display = 'none';
            icon.classList.remove('bi-dash-square');
            icon.classList.add('bi-plus-square');
        }
    });
}

function switchToDashboard() {
    isMatrizView = false;
    document.getElementById('dashboard-title').textContent = 'Red de Sucursales - KPIs';
    document.getElementById('filtros-sucursal').style.display = 'block';
    updateDashboard();
}

function switchToMatriz() {
    isMatrizView = true;
    document.getElementById('dashboard-title').textContent = 'Casa Matriz - KPIs Centrales';
    document.getElementById('filtros-sucursal').style.display = 'none';
    updateDashboard();
}

function getHistoricalValue(kpiId, month) {
    return historicalValues[kpiId]?.[month] || 0;
}

function getPreviousMonth(currentMonth) {
    const months = historicalData.labels;
    const currentIndex = months.indexOf(currentMonth);
    return currentIndex > 0 ? months[currentIndex - 1] : null;
}

function getPreviousQuarter(currentMonth) {
    const months = historicalData.labels;
    const currentIndex = months.indexOf(currentMonth);
    return currentIndex >= 3 ? months[currentIndex - 3] : null;
}

function getPreviousYear(currentMonth) {
    const months = historicalData.labels;
    const currentIndex = months.indexOf(currentMonth);
    return currentIndex >= 12 ? months[currentIndex - 12] : null;
}

function formatToTwoDecimals(value) {
    return parseFloat(Math.round(value * 100) / 100).toFixed(2);
}

function updateDashboard() {
    // Obtener filtros actuales
    const sucursalId = document.getElementById('sucursal-select').value;
    const oficial = document.getElementById('oficial-select').value;
    const perspectiva = document.getElementById('perspectiva-select').value;
    const periodo = document.getElementById('periodo-select').value;
    const currentMonth = historicalData.labels.find(label => label === `${periodo.split('-')[1]} ${periodo.split('-')[0]}`) || historicalData.labels[historicalData.labels.length - 1];
    
    // Filtrar KPIs según perspectiva seleccionada
    let filteredKpis = kpisData;
    
    if (perspectiva !== 'todas') {
        filteredKpis = kpisData.filter(kpi => kpi.perspectiva === perspectiva);
    }
    
    // Ajustar valores según sucursal/oficial seleccionado
    if (sucursalId !== 'todas' || oficial !== 'todos') {
        filteredKpis = filteredKpis.map(kpi => {
            // Aplicar variación basada en la selección
            let variation = 1;
            
            if (sucursalId !== 'todas') {
                const sucursal = sucursalesParaguay.find(s => s.id == sucursalId);
                if (sucursal) {
                    // Variación basada en ID de sucursal (ejemplo)
                    variation *= 0.95 + (sucursal.id % 10) * 0.02;
                }
            }
            
            if (oficial !== 'todos') {
                // Variación basada en el oficial (ejemplo)
                variation *= 0.97 + (oficial.length % 10) * 0.006;
            }
            
            // Crear copia del KPI con valores ajustados
            return {
                ...kpi,
                valorActual: kpi.valorActual * variation,
                valorBudget: kpi.valorBudget * (variation > 1 ? variation * 0.98 : variation * 1.02)
            };
        });
    }
    
    // Calcular KPIs consolidados con valores ajustados
    const eficienciaKpis = filteredKpis.filter(kpi => kpi.perspectiva === "Eficiencia");
    const calidadKpis = filteredKpis.filter(kpi => kpi.perspectiva === "Calidad");
    const experienciaKpis = filteredKpis.filter(kpi => kpi.perspectiva === "Satisfacción del Cliente");
    
    const eficienciaValue = calculateConsolidatedKpi(eficienciaKpis);
    const calidadValue = calculateConsolidatedKpi(calidadKpis);
    const experienciaValue = calculateConsolidatedKpi(experienciaKpis);
    
    // Actualizar tarjetas con comparaciones históricas
    updateKpiCard('eficiencia', eficienciaValue, 85, currentMonth);
    updateKpiCard('calidad', calidadValue, 90, currentMonth);
    updateKpiCard('experiencia', experienciaValue, 88, currentMonth);
    
    // Actualizar tabla con drill-down
    updateKpiTable(filteredKpis, currentMonth);
    
    // Actualizar gráfico histórico
    updateHistoricalChart();
}

function calculateConsolidatedKpi(kpis) {
    if (kpis.length === 0) return 0;
    
    let totalCumplimiento = 0;
    
    kpis.forEach(kpi => {
        // Para métricas donde menor es mejor (como tiempos o errores), invertimos la relación
        if (kpi.unidad.includes("Horas") || kpi.unidad.includes("Minutos") || kpi.nombre.includes("Errores")) {
            totalCumplimiento += (kpi.valorBudget / kpi.valorActual) * 100;
        } else {
            totalCumplimiento += (kpi.valorActual / kpi.valorBudget) * 100;
        }
    });
    
    return totalCumplimiento / kpis.length;
}

function updateKpiCard(kpiType, value, target, currentMonth) {
    const valueElement = document.getElementById(`${kpiType}-value`);
    const indicatorElement = document.getElementById(`${kpiType}-indicator`);
    const progressElement = document.getElementById(`${kpiType}-progress`);
    
    // Redondear a 2 decimales
    const roundedValue = Math.round(value * 100) / 100;
    valueElement.textContent = `${roundedValue}%`;
    
    // Determinar color del semáforo
    let indicator = "🔴"; // Rojo por defecto
    if (value >= 90) {
        indicator = "🟢"; // Verde
        progressElement.classList.remove('bg-warning', 'bg-danger');
        progressElement.classList.add('bg-success');
    } else if (value >= 70) {
        indicator = "🟡"; // Amarillo
        progressElement.classList.remove('bg-success', 'bg-danger');
        progressElement.classList.add('bg-warning');
    } else {
        progressElement.classList.remove('bg-success', 'bg-warning');
        progressElement.classList.add('bg-danger');
    }
    
    indicatorElement.textContent = indicator;
    
    // Actualizar barra de progreso (limitada al 100%)
    const progressWidth = Math.min(value, 100);
    progressElement.style.width = `${progressWidth}%`;
    
    // Actualizar comparaciones históricas
    const previousMonth = getPreviousMonth(currentMonth);
    const previousQuarter = getPreviousQuarter(currentMonth);
    const previousYear = getPreviousYear(currentMonth);
    
    if (previousMonth) {
        const prevValue = historicalData[kpiType][historicalData.labels.indexOf(previousMonth)];
        document.getElementById(`${kpiType}-mes-anterior`).textContent = `${prevValue}%`;
    }
    
    if (previousQuarter) {
        const quarterValue = historicalData[kpiType][historicalData.labels.indexOf(previousQuarter)];
        document.getElementById(`${kpiType}-trimestre-anterior`).textContent = `${quarterValue}%`;
    }
    
    if (previousYear) {
        const yearValue = historicalData[kpiType][historicalData.labels.indexOf(previousYear)];
        document.getElementById(`${kpiType}-ano-anterior`).textContent = `${yearValue}%`;
    }
}

function updateKpiTable(kpis, currentMonth) {
    const tbody = document.querySelector('#kpi-table tbody');
    tbody.innerHTML = '';
    
    // Agrupar KPIs por perspectiva y luego por proceso
    const groupedData = {};
    
    kpis.forEach(kpi => {
        if (!groupedData[kpi.perspectiva]) {
            groupedData[kpi.perspectiva] = {};
        }
        
        if (!groupedData[kpi.perspectiva][kpi.proceso]) {
            groupedData[kpi.perspectiva][kpi.proceso] = [];
        }
        
        groupedData[kpi.perspectiva][kpi.proceso].push(kpi);
    });
    
    // Generar filas para la tabla con estructura jerárquica
    Object.keys(groupedData).forEach(perspectiva => {
        // Fila de perspectiva (grupo principal)
        const perspectivaRow = document.createElement('tr');
        perspectivaRow.className = 'perspectiva-row';
        perspectivaRow.innerHTML = `
            <td colspan="6">
                <button class="btn btn-sm toggle-group" data-group-id="${perspectiva}" data-group-type="perspectiva">
                    <i class="bi bi-dash-square"></i> ${perspectiva}
                </button>
            </td>
        `;
        tbody.appendChild(perspectivaRow);
        
        // Filas de procesos (subgrupos)
        Object.keys(groupedData[perspectiva]).forEach(proceso => {
            const procesoRow = document.createElement('tr');
            procesoRow.className = 'proceso-row';
            procesoRow.setAttribute('data-parent-id', perspectiva);
            procesoRow.setAttribute('data-parent-type', 'perspectiva');
            procesoRow.innerHTML = `
                <td colspan="6" style="padding-left: 30px;">
                    <button class="btn btn-sm toggle-group" data-group-id="${proceso}" data-group-type="proceso">
                        <i class="bi bi-dash-square"></i> ${proceso}
                    </button>
                </td>
            `;
            tbody.appendChild(procesoRow);
            
            // Filas de KPIs individuales
            groupedData[perspectiva][proceso].forEach(kpi => {
                const cumplimiento = formatToTwoDecimals(
                    kpi.unidad.includes("Horas") || kpi.unidad.includes("Minutos") || kpi.nombre.includes("Errores")
                    ? (kpi.valorBudget / kpi.valorActual) * 100
                    : (kpi.valorActual / kpi.valorBudget) * 100
                );

                let estado = cumplimiento >= 90 ? '<span class="badge bg-success">Excelente</span>' 
                          : cumplimiento >= 70 ? '<span class="badge bg-warning">Aceptable</span>' 
                          : '<span class="badge bg-danger">Crítico</span>';

                let valorActualFormatted = kpi.unidad.includes("Porcentaje") 
                    ? `${formatToTwoDecimals(kpi.valorActual)}%`
                    : kpi.unidad.includes("Horas") || kpi.unidad.includes("Minutos")
                    ? `${formatToTwoDecimals(kpi.valorActual)} ${kpi.unidad.includes("Horas") ? "h" : "min"}`
                    : formatToTwoDecimals(kpi.valorActual);

                let valorBudgetFormatted = kpi.unidad.includes("Porcentaje") 
                    ? `${formatToTwoDecimals(kpi.valorBudget)}%`
                    : kpi.unidad.includes("Horas") || kpi.unidad.includes("Minutos")
                    ? `${formatToTwoDecimals(kpi.valorBudget)} ${kpi.unidad.includes("Horas") ? "h" : "min"}`
                    : formatToTwoDecimals(kpi.valorBudget);

                const kpiRow = document.createElement('tr');
                kpiRow.className = 'kpi-row';
                kpiRow.setAttribute('data-parent-id', proceso);
                kpiRow.setAttribute('data-parent-type', 'proceso');
                kpiRow.style.paddingLeft = '60px';
                kpiRow.innerHTML = `
                    <td>${kpi.perspectiva}</td>
                    <td style="padding-left: 60px;"><span class="kpi-name" data-kpi-id="${kpi.id}">${kpi.nombre}</span></td>
                    <td>${valorActualFormatted}</td>
                    <td>${valorBudgetFormatted}</td>
                    <td>${cumplimiento}%</td>
                    <td>${estado}</td>
                `;
                tbody.appendChild(kpiRow);
            });
        });
    });
}

function renderHistoricalChart() {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [
                {
                    label: 'Eficiencia',
                    data: historicalData.eficiencia,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Calidad',
                    data: historicalData.calidad,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Experiencia',
                    data: historicalData.experiencia,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Porcentaje de Cumplimiento'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function updateHistoricalChart() {
    if (!currentChart) return;
    
    const periodo = document.getElementById('periodo-select').value;
    const currentMonth = historicalData.labels.find(label => label === `${periodo.split('-')[1]} ${periodo.split('-')[0]}`) || historicalData.labels[historicalData.labels.length - 1];
    const currentIndex = historicalData.labels.indexOf(currentMonth);
    
    // Resaltar el mes actual en el gráfico
    currentChart.data.datasets.forEach(dataset => {
        dataset.pointBackgroundColor = dataset.data.map((_, i) => 
            i === currentIndex ? '#ff0000' : dataset.borderColor
        );
        dataset.pointRadius = dataset.data.map((_, i) => 
            i === currentIndex ? 6 : 3
        );
    });
    
    currentChart.update();
}

function showTooltip(element) {
    const kpiId = parseInt(element.getAttribute('data-kpi-id'));
    const kpi = kpisData.find(k => k.id === kpiId);
    
    if (!kpi) return;
    
    const tooltip = document.getElementById('kpi-tooltip');
    document.getElementById('tooltip-title').textContent = kpi.nombre;
    document.getElementById('tooltip-objective').textContent = kpi.objetivo;
    document.getElementById('tooltip-formula').textContent = kpi.formula;
    document.getElementById('tooltip-unit').textContent = kpi.unidad;
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    document.getElementById('kpi-tooltip').style.display = 'none';
}