// =============================================
// VARIABLES GLOBALES
// =============================================
let sucursalesParaguay = [];
let kpisData = [];
let historicalData = {};
let currentCharts = {
    eficiencia: null,
    calidad: null,
    experiencia: null
};
let historicalValues = {};
let expandedGroups = {
    perspectiva: {},
    proceso: {}
};

// =============================================
// FUNCIONES PRINCIPALES
// =============================================

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const [sucursalesResponse, kpisResponse, historicalResponse] = await Promise.all([
            fetchData('./data/sucursales.json'),
            fetchData('./data/Kpis.json'),
            fetchData('./data/historical.json')
        ]);

        sucursalesParaguay = sucursalesResponse;
        kpisData = kpisResponse;
        historicalData = historicalResponse;
        
        const lastMonthIndex = historicalData.labels.length - 1;
        const lastMonth = historicalData.labels[lastMonthIndex];
        const lastMonthFormatted = formatPeriodForSelect(lastMonth);
        document.getElementById('periodo-select').value = lastMonthFormatted;
        
        generateHistoricalValues();
        loadSucursales();
        setupEventListeners();
        updateDashboard();
        renderMiniCharts();
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos. Por favor recarga la página.');
    }
});

function formatPeriodForSelect(monthLabel) {
    const [month, year] = monthLabel.split(' ');
    const monthMap = {
        'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dic': '12'
    };
    return `${year}-${monthMap[month]}`;
}

function getCurrentMonthFromPeriod(period) {
    const [year, month] = period.split('-');
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthName = monthNames[parseInt(month) - 1];
    return `${monthName} ${year}`;
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`Error al cargar ${url}:`, error);
        return null;
    }
}

function generateHistoricalValues() {
    const kpiIds = kpisData.map(kpi => kpi.id);
    const months = historicalData.labels;
    
    kpiIds.forEach(id => {
        historicalValues[id] = {};
        months.forEach((month, index) => {
            const kpi = kpisData.find(k => k.id === id);
            if (kpi) {
                const baseValue = kpi.valorActual;
                const variation = (Math.random() * 0.2 - 0.1) * baseValue;
                historicalValues[id][month] = Math.max(0, baseValue + variation);
                
                if (kpi.unidad.includes("Porcentaje")) {
                    historicalValues[id][month] = Math.min(100, historicalValues[id][month]);
                }
            }
        });
    });
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
    
    if (sucursalesParaguay.length > 0) {
        updateOficiales(sucursalesParaguay[0].id);
    }
}

function updateOficiales(sucursalId) {
    const select = document.getElementById('oficial-select');
    select.innerHTML = '<option value="todos">Todos los oficiales</option>';
    
    if (sucursalId === 'todas') return;
    
    const sucursal = sucursalesParaguay.find(s => s.id == sucursalId);
    if (sucursal && sucursal.oficiales) {
        sucursal.oficiales.forEach(oficial => {
            const option = document.createElement('option');
            option.value = oficial;
            option.textContent = oficial;
            select.appendChild(option);
        });
    }
}

function setupEventListeners() {
    document.getElementById('sucursal-select').addEventListener('change', function() {
        updateOficiales(this.value);
        updateDashboard();
    });
    
    document.getElementById('oficial-select').addEventListener('change', updateDashboard);
    document.getElementById('perspectiva-select').addEventListener('change', updateDashboard);
    document.getElementById('periodo-select').addEventListener('change', updateDashboard);
    
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

    document.getElementById('kpi-table').addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-group') || e.target.closest('.toggle-group')) {
            const button = e.target.classList.contains('toggle-group') ? e.target : e.target.closest('.toggle-group');
            const groupId = button.getAttribute('data-group-id');
            const groupType = button.getAttribute('data-group-type');
            toggleGroup(groupId, groupType, button);
        }
    });
}

function toggleGroup(groupId, groupType, element) {
    const rows = document.querySelectorAll(`tr[data-parent-id="${groupId}"][data-parent-type="${groupType}"]`);
    const icon = element.querySelector('i');
    
    expandedGroups[groupType][groupId] = !expandedGroups[groupType][groupId];
    
    rows.forEach(row => {
        if (!expandedGroups[groupType][groupId]) {
            row.style.display = 'none';
            icon.classList.remove('bi-dash-square');
            icon.classList.add('bi-plus-square');
        } else {
            row.style.display = '';
            icon.classList.remove('bi-plus-square');
            icon.classList.add('bi-dash-square');
        }
    });
}

function updateDashboard() {
    const sucursalId = document.getElementById('sucursal-select').value;
    const oficial = document.getElementById('oficial-select').value;
    const perspectiva = document.getElementById('perspectiva-select').value;
    const periodo = document.getElementById('periodo-select').value;
    
    const currentMonth = getCurrentMonthFromPeriod(periodo);
    const currentMonthIndex = historicalData.labels.indexOf(currentMonth);
    
    if (currentMonthIndex === -1) {
        console.error('Mes no encontrado:', currentMonth);
        return;
    }
    
    let filteredKpis = kpisData;
    
    if (perspectiva !== 'todas') {
        const perspectivaFilter = perspectiva === 'Experiencia' ? 'Satisfacción del Cliente' : perspectiva;
        filteredKpis = filteredKpis.filter(kpi => kpi.perspectiva === perspectivaFilter);
    }
    
    let variationFactor = 1;
    
    if (sucursalId !== 'todas') {
        const sucursal = sucursalesParaguay.find(s => s.id == sucursalId);
        if (sucursal) {
            variationFactor *= 0.9 + (sucursal.id % 10) * 0.02;
        }
    }
    
    if (oficial !== 'todos') {
        variationFactor *= 0.95 + (oficial.length % 10) * 0.01;
    }
    
    filteredKpis = filteredKpis.map(kpi => {
        const baseValue = historicalValues[kpi.id]?.[currentMonth] || kpi.valorActual;
        const baseBudget = kpi.valorBudget;
        
        const adjustedValue = baseValue * variationFactor;
        const adjustedBudget = baseBudget * (variationFactor > 1 ? variationFactor * 0.98 : variationFactor * 1.02);
        
        let finalValue = adjustedValue;
        let finalBudget = adjustedBudget;
        
        if (kpi.unidad.includes("Porcentaje")) {
            finalValue = Math.min(100, Math.max(0, finalValue));
            finalBudget = Math.min(100, Math.max(0, finalBudget));
        } else if (kpi.unidad.includes("Horas") || kpi.unidad.includes("Minutos")) {
            finalValue = Math.max(0, finalValue);
            finalBudget = Math.max(0, finalBudget);
        }
        
        return {
            ...kpi,
            valorActual: finalValue,
            valorBudget: finalBudget
        };
    });
    
    // Obtener valores de las tarjetas principales
    let eficienciaValue = historicalData.eficiencia[currentMonthIndex] * variationFactor;
    let calidadValue = historicalData.calidad[currentMonthIndex] * variationFactor;
    let experienciaValue = historicalData.experiencia[currentMonthIndex] * variationFactor;
    
    eficienciaValue = Math.min(100, eficienciaValue);
    calidadValue = Math.min(100, calidadValue);
    experienciaValue = Math.min(100, experienciaValue);
    
    // Actualizar tarjetas
    updateKpiCard('eficiencia', eficienciaValue, 85, currentMonth);
    updateKpiCard('calidad', calidadValue, 90, currentMonth);
    updateKpiCard('experiencia', experienciaValue, 88, currentMonth);
    
    // Actualizar tabla con los mismos valores de las tarjetas
    updateKpiTable(filteredKpis, currentMonth, {
        'Eficiencia': eficienciaValue,
        'Calidad': calidadValue,
        'Satisfacción del Cliente': experienciaValue
    });
    
    updateMiniCharts(currentMonthIndex);
}

function updateKpiCard(kpiType, value, target, currentMonth) {
    const valueElement = document.getElementById(`${kpiType}-value`);
    const indicatorElement = document.getElementById(`${kpiType}-indicator`);
    const progressElement = document.getElementById(`${kpiType}-progress`);
    
    const roundedValue = Math.round(value * 100) / 100;
    valueElement.textContent = `${roundedValue}%`;
    
    let indicator = "🔴";
    if (value >= 90) {
        indicator = "🟢";
        progressElement.classList.remove('bg-warning', 'bg-danger');
        progressElement.classList.add('bg-success');
    } else if (value >= 70) {
        indicator = "🟡";
        progressElement.classList.remove('bg-success', 'bg-danger');
        progressElement.classList.add('bg-warning');
    } else {
        progressElement.classList.remove('bg-success', 'bg-warning');
        progressElement.classList.add('bg-danger');
    }
    
    indicatorElement.textContent = indicator;
    progressElement.style.width = `${Math.min(value, 100)}%`;
    
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

function updateKpiTable(kpis, currentMonth, cardValues) {
    const tbody = document.querySelector('#kpi-table tbody');
    tbody.innerHTML = '';
    
    const groupedData = {};
    
    // Agrupar KPIs por perspectiva y proceso
    kpis.forEach(kpi => {
        if (!groupedData[kpi.perspectiva]) {
            groupedData[kpi.perspectiva] = {
                kpis: [],
                procesos: {}
            };
            expandedGroups.perspectiva[kpi.perspectiva] = false;
        }
        
        if (!groupedData[kpi.perspectiva].procesos[kpi.proceso]) {
            groupedData[kpi.perspectiva].procesos[kpi.proceso] = {
                kpis: [],
                cumplimientoTotal: 0,
                count: 0
            };
            expandedGroups.proceso[kpi.proceso] = false;
        }
        
        groupedData[kpi.perspectiva].kpis.push(kpi);
        groupedData[kpi.perspectiva].procesos[kpi.proceso].kpis.push(kpi);
    });

    // Calcular promedios y renderizar la tabla
    Object.keys(groupedData).forEach(perspectiva => {
        // Usar el valor de la tarjeta para la perspectiva
        const perspectivaCumplimiento = cardValues[perspectiva];
        const perspectivaEstado = determinarEstado(perspectivaCumplimiento);

        // Crear fila de perspectiva
        const perspectivaRow = document.createElement('tr');
        perspectivaRow.className = 'perspectiva-row';
        perspectivaRow.innerHTML = `
            <td>${perspectiva}</td>
            <td colspan="2">
                <button class="btn btn-sm toggle-group" data-group-id="${perspectiva}" data-group-type="perspectiva">
                    <i class="bi ${expandedGroups.perspectiva[perspectiva] ? 'bi-dash-square' : 'bi-plus-square'}"></i> 
                    ${perspectiva}
                </button>
            </td>
            <td></td>
            <td>${formatToTwoDecimals(perspectivaCumplimiento)}%</td>
            <td>${perspectivaEstado}</td>
        `;
        tbody.appendChild(perspectivaRow);
        
        // Procesar cada proceso dentro de la perspectiva
        Object.keys(groupedData[perspectiva].procesos).forEach(proceso => {
            const procesoKPIs = groupedData[perspectiva].procesos[proceso].kpis;
            const procesoCumplimiento = calcularPromedioCumplimiento(procesoKPIs);
            const procesoEstado = determinarEstado(procesoCumplimiento);

            // Crear fila de proceso
            const procesoRow = document.createElement('tr');
            procesoRow.className = 'proceso-row';
            procesoRow.setAttribute('data-parent-id', perspectiva);
            procesoRow.setAttribute('data-parent-type', 'perspectiva');
            procesoRow.style.display = expandedGroups.perspectiva[perspectiva] ? '' : 'none';
            procesoRow.innerHTML = `
                <td>${perspectiva}</td>
                <td colspan="2" style="padding-left: 30px;">
                    <button class="btn btn-sm toggle-group" data-group-id="${proceso}" data-group-type="proceso">
                        <i class="bi ${expandedGroups.proceso[proceso] ? 'bi-dash-square' : 'bi-plus-square'}"></i> 
                        ${proceso}
                    </button>
                </td>
                <td></td>
                <td>${formatToTwoDecimals(procesoCumplimiento)}%</td>
                <td>${procesoEstado}</td>
            `;
            tbody.appendChild(procesoRow);
            
            // Procesar cada KPI dentro del proceso
            procesoKPIs.forEach(kpi => {
                const isMenorEsMejor = kpi.menorEsMejor || 
                                     kpi.unidad.includes("Horas") || 
                                     kpi.unidad.includes("Minutos") ||
                                     kpi.nombre.includes("Error");
                
                const cumplimiento = isMenorEsMejor
                    ? (kpi.valorBudget / kpi.valorActual) * 100
                    : (kpi.valorActual / kpi.valorBudget) * 100;
                
                const estado = determinarEstado(cumplimiento);

                const valorActualFormatted = formatValue(kpi.valorActual, kpi.unidad);
                const valorBudgetFormatted = formatValue(kpi.valorBudget, kpi.unidad);

                const kpiRow = document.createElement('tr');
                kpiRow.className = 'kpi-row';
                kpiRow.setAttribute('data-parent-id', proceso);
                kpiRow.setAttribute('data-parent-type', 'proceso');
                kpiRow.style.display = (expandedGroups.perspectiva[perspectiva] && expandedGroups.proceso[proceso]) ? '' : 'none';
                kpiRow.innerHTML = `
                    <td>${kpi.perspectiva}</td>
                    <td style="padding-left: 60px;"><span class="kpi-name" data-kpi-id="${kpi.id}">${kpi.nombre}</span></td>
                    <td>${valorActualFormatted}</td>
                    <td>${valorBudgetFormatted}</td>
                    <td>${formatToTwoDecimals(cumplimiento)}%</td>
                    <td>${estado}</td>
                `;
                tbody.appendChild(kpiRow);
            });
        });
    });
}

function calcularPromedioCumplimiento(kpis) {
    let totalCumplimiento = 0;
    let count = 0;
    
    kpis.forEach(kpi => {
        const isMenorEsMejor = kpi.menorEsMejor || 
                             kpi.unidad.includes("Horas") || 
                             kpi.unidad.includes("Minutos") ||
                             kpi.nombre.includes("Error");
        
        const cumplimiento = isMenorEsMejor
            ? (kpi.valorBudget / kpi.valorActual) * 100
            : (kpi.valorActual / kpi.valorBudget) * 100;
        
        totalCumplimiento += cumplimiento;
        count++;
    });
    
    return count > 0 ? totalCumplimiento / count : 0;
}

function determinarEstado(cumplimiento) {
    if (cumplimiento >= 90) {
        return '<span class="badge bg-success">Excelente</span>';
    } else if (cumplimiento >= 70) {
        return '<span class="badge bg-warning">Aceptable</span>';
    } else {
        return '<span class="badge bg-danger">Crítico</span>';
    }
}

function formatValue(value, unit) {
    const formatted = parseFloat(Math.round(value * 100) / 100).toFixed(2);
    
    if (unit.includes("Porcentaje")) {
        return `${formatted}%`;
    } else if (unit.includes("Horas")) {
        return `${formatted} h`;
    } else if (unit.includes("Minutos")) {
        return `${formatted} min`;
    }
    return formatted;
}

function formatToTwoDecimals(value) {
    return parseFloat(Math.round(value * 100) / 100).toFixed(2);
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

function renderMiniCharts() {
    const eficienciaCtx = document.getElementById('eficienciaChart').getContext('2d');
    const calidadCtx = document.getElementById('calidadChart').getContext('2d');
    const experienciaCtx = document.getElementById('experienciaChart').getContext('2d');
    
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false,
                min: 50,
                max: 100
            }
        },
        elements: {
            point: {
                radius: 0
            },
            line: {
                tension: 0.4,
                borderWidth: 2
            }
        }
    };
    
    currentCharts.eficiencia = new Chart(eficienciaCtx, {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [{
                data: historicalData.eficiencia,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true
            }]
        },
        options: commonOptions
    });
    
    currentCharts.calidad = new Chart(calidadCtx, {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [{
                data: historicalData.calidad,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true
            }]
        },
        options: commonOptions
    });
    
    currentCharts.experiencia = new Chart(experienciaCtx, {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [{
                data: historicalData.experiencia,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                fill: true
            }]
        },
        options: commonOptions
    });
}

function updateMiniCharts(currentMonthIndex) {
    Object.values(currentCharts).forEach(chart => {
        if (chart) {
            chart.data.datasets.forEach(dataset => {
                dataset.pointBackgroundColor = dataset.data.map((_, i) => 
                    i === currentMonthIndex ? '#ff0000' : 'transparent'
                );
                dataset.pointRadius = dataset.data.map((_, i) => 
                    i === currentMonthIndex ? 3 : 0
                );
            });
            chart.update();
        }
    });
}

function showTooltip(element) {
    const kpiId = parseInt(element.getAttribute('data-kpi-id'));
    const kpi = kpisData.find(k => k.id === kpiId);
    
    if (!kpi) return;
    
    const tooltip = document.getElementById('kpi-tooltip');
    document.getElementById('tooltip-title').textContent = kpi.nombre;
    document.getElementById('tooltip-objective').textContent = kpi.objetivo || 'No disponible';
    document.getElementById('tooltip-formula').textContent = kpi.formula || 'No disponible';
    document.getElementById('tooltip-unit').textContent = kpi.unidad;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    document.getElementById('kpi-tooltip').style.display = 'none';
}
