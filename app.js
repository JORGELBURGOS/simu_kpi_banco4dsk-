// ========================
// Lógica de Cumplimiento personalizada (con nombre normalizado)
// ========================
const indicadoresMenorEsMejor = [
    "clientes con riesgo alto",
    "rendimiento del canal simplificado",
    "reintentos de activacion",
    "tasa de reprocesos por errores o documentacion incompleta",
    "de derivaciones innecesarias a gestion comercial",
    "modificacion sin reproceso de datos actualizados sin necesidad de correccion",
    "de flujos sin errores tecnicos en servicios",
    "tiempo al checkpoint promedio hasta senal de actualizacion registrada",
    "de procesos cancelados por inconsistencias en datos o falta de consentimiento",
    "tasa de errores en validaciones cruzadas entre core y crm",
    "de rechazos por inconsistencias en formato de consentimiento",
    "abandono durante el onboarding",
    "de actualizaciones resueltas en una sola interaccion",
    "de procesos sin reclamos o solicitudes de ayuda"
];

function normalizarNombre(nombre) {
    return nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
                 .replace(/[^a-z0-9\s%]/gi, "").trim();
}

function evaluarCumplimiento(indicador, valor, objetivo) {
    const nombre = normalizarNombre(indicador.Nombre);
    const valorNum = parseFloat(valor);
    const objetivoNum = parseFloat(objetivo);
    if (isNaN(valorNum) || isNaN(objetivoNum)) return "sin_dato";

    const esMenorMejor = indicadoresMenorEsMejor.includes(nombre);

    if (esMenorMejor) {
        if (valorNum <= objetivoNum) return "cumple";
        else if (valorNum <= objetivoNum * 1.2) return "alerta";
        else return "incumple";
    } else {
        if (valorNum >= objetivoNum) return "cumple";
        else if (valorNum >= objetivoNum * 0.8) return "alerta";
        else return "incumple";
    }
}

function calcularCumplimientoRelativo(indicador, valor, objetivo) {
    const nombre = normalizarNombre(indicador.Nombre);
    const valorNum = parseFloat(valor);
    const objetivoNum = parseFloat(objetivo);
    if (isNaN(valorNum) || isNaN(objetivoNum) || valorNum === 0) return 0;

    const esMenorMejor = indicadoresMenorEsMejor.includes(nombre);

    if (esMenorMejor) {
        return (objetivoNum / valorNum) * 100;
    } else {
        return (valorNum / objetivoNum) * 100;
    }
}


// =============================================
// DATOS COMPLETOS EMBEBIDOS
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
        { id: 3, proceso: "Alta de cliente", perspectiva: "Eficiencia", nombre: "Clientes con Riesgo Alto", objetivo: "Detectar qué proporción de clientes reciben categorización de riesgo alto durante el alta.", unidad: "Porcentaje (%)", formula: "Clientes Riesgo Alto / Total Clientes * 100", granularidad: "Segmento - Canal", tiempo: "Mensual", valorActual: 5, valorBudget: 3 },
        { id: 4, proceso: "Alta de cliente", perspectiva: "Eficiencia", nombre: "Regularizaciones Pendientes", objetivo: "Cuantificar cuántos clientes quedan con requerimientos pendientes luego del alta inicial.", unidad: "Cantidad (n)", formula: "Total Clientes Pendientes Regularización", granularidad: "Tipo de requerimiento - Canal", tiempo: "Mensual", valorActual: 8, valorBudget: 5 },
        { id: 5, proceso: "Alta de cuenta", perspectiva: "Eficiencia", nombre: "Tiempo hasta Activación de Cuenta", objetivo: "Medir el tiempo total desde la solicitud hasta la activación efectiva de la cuenta.", unidad: "Horas", formula: "Fecha y Hora Activación - Fecha y Hora Solicitud", granularidad: "Tipo de cuenta - Canal - Sucursal", tiempo: "Mensual", valorActual: 24, valorBudget: 18 },
        { id: 6, proceso: "Alta de cuenta", perspectiva: "Eficiencia", nombre: "Tasa de Cuentas Activadas", objetivo: "Cuantificar el porcentaje de solicitudes de cuentas que se activan exitosamente.", unidad: "Porcentaje (%)", formula: "Cuentas Activadas / Solicitudes Totales * 100", granularidad: "Producto - Canal - Segmento", tiempo: "Mensual", valorActual: 92, valorBudget: 95 },
        { id: 7, proceso: "Alta de cuenta", perspectiva: "Calidad", nombre: "Errores de Carga de Datos", objetivo: "Medir la frecuencia de errores durante la carga manual de datos para la cuenta.", unidad: "Porcentaje (%)", formula: "Errores Detectados / Total Cargas * 100", granularidad: "Campo - Canal - Oficial", tiempo: "Mensual", valorActual: 2.5, valorBudget: 1.5 },
        { id: 8, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Calidad", nombre: "% de formularios completados correctamente al primer intento", objetivo: "Validación de errores evitables en la primera carga", unidad: "Porcentaje (%)", formula: "Cantidad de casos que cumplen la condición / Total de casos * 100", granularidad: "Segmento - Canal - Producto", tiempo: "Mensual", valorActual: 88, valorBudget: 92 },
        { id: 9, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Calidad", nombre: "% de cumplimiento completo del checklist documental sin excepciones", objetivo: "Cumplimiento sin documentos salvados por comentarios", unidad: "Porcentaje (%)", formula: "Cantidad de casos que cumplen la condición / Total de casos * 100", granularidad: "Segmento - Canal - Producto", tiempo: "Mensual", valorActual: 95, valorBudget: 97 },
        { id: 10, proceso: "Alta de cliente", perspectiva: "Satisfacción del Cliente", nombre: "Satisfacción del Onboarding", objetivo: "Medir cómo valoran los clientes el proceso de alta, desde la carga hasta la confirmación.", unidad: "Puntaje promedio (1 a 5)", formula: "Promedio de encuestas post-onboarding", granularidad: "Canal - Segmento - Oficial", tiempo: "Mensual", valorActual: 4.2, valorBudget: 4.5 },
        { id: 11, proceso: "Alta de cliente", perspectiva: "Satisfacción del Cliente", nombre: "Abandono durante el Onboarding", objetivo: "Medir cuántos clientes inician pero no completan el proceso de alta.", unidad: "Porcentaje (%)", formula: "(Clientes que inician y no finalizan) / Total que inician * 100", granularidad: "Etapa abandonada - Canal", tiempo: "Mensual", valorActual: 15, valorBudget: 10 },
        { id: 12, proceso: "Alta de cuenta", perspectiva: "Satisfacción del Cliente", nombre: "Tiempo Percibido de Apertura", objetivo: "Medir cómo percibe el cliente el tiempo que llevó abrir la cuenta.", unidad: "Promedio (minutos percibidos)", formula: "Encuesta post-apertura o tiempo declarado", granularidad: "Canal - Tipo de cuenta", tiempo: "Mensual", valorActual: 45, valorBudget: 30 },
        { id: 13, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Satisfacción del Cliente", nombre: "Tiempo promedio de respuesta desde solicitud hasta contacto del ejecutivo", objetivo: "Desde creación de solicitud hasta primer contacto o acción", unidad: "Minutos", formula: "∑(Fecha y hora del primer contacto del ejecutivo−Fecha y hora de la solicitud) / Cantidad total de solicitudes con contacto registrado", granularidad: "Segmento - Canal - Producto", tiempo: "Mensual", valorActual: 120, valorBudget: 60 },
        { id: 14, proceso: "Alta de cliente", perspectiva: "Eficiencia", nombre: "Rendimiento del Canal Simplificado", objetivo: "Medir la eficiencia del canal simplificado de onboarding", unidad: "Porcentaje (%)", formula: "Clientes completados por canal simplificado / Total clientes * 100", granularidad: "Canal - Segmento", tiempo: "Mensual", valorActual: 65, valorBudget: 70 },
        { id: 15, proceso: "Alta de cuenta", perspectiva: "Eficiencia", nombre: "Reintentos de Activación", objetivo: "Cuantificar los reintentos necesarios para activar una cuenta", unidad: "Promedio (n)", formula: "Total reintentos / Total cuentas activadas", granularidad: "Tipo de cuenta - Canal", tiempo: "Mensual", valorActual: 1.2, valorBudget: 0.8 },
        { id: 16, proceso: "Alta de cuenta", perspectiva: "Eficiencia", nombre: "Digitalización Exitosa de Documentación", objetivo: "Medir el éxito en la digitalización de documentos", unidad: "Porcentaje (%)", formula: "Documentos digitalizados correctamente / Total documentos * 100", granularidad: "Tipo de documento - Canal", tiempo: "Mensual", valorActual: 88, valorBudget: 92 },
        { id: 17, proceso: "Alta de cuenta", perspectiva: "Eficiencia", nombre: "Uso de Canal Automatizado", objetivo: "Medir la adopción del canal automatizado", unidad: "Porcentaje (%)", formula: "Transacciones por canal automatizado / Total transacciones * 100", granularidad: "Tipo de transacción - Segmento", tiempo: "Mensual", valorActual: 75, valorBudget: 80 },
        { id: 18, proceso: "Alta de cuenta", perspectiva: "Satisfacción del Cliente", nombre: "Incidencias Post-Apertura", objetivo: "Problemas reportados después de la apertura de cuenta", unidad: "Porcentaje (%)", formula: "Cuentas con incidencias / Total cuentas abiertas * 100", granularidad: "Tipo de incidencia - Canal", tiempo: "Mensual", valorActual: 10, valorBudget: 7 },
        { id: 19, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Eficiencia", nombre: "Tiempo promedio desde solicitud hasta desembolso", objetivo: "Medir la eficiencia del proceso de desembolso", unidad: "Minutos", formula: "∑(Tiempo desembolso - Tiempo solicitud) / Total solicitudes", granularidad: "Producto - Canal - Segmento", tiempo: "Mensual", valorActual: 180, valorBudget: 120 },
        { id: 20, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Eficiencia", nombre: "Tasa de re-procesos por errores o documentación incompleta", objetivo: "Medir la necesidad de reprocesos", unidad: "Cantidad", formula: "Total reprocesos", granularidad: "Tipo de error - Canal", tiempo: "Mensual", valorActual: 5, valorBudget: 3 },
        { id: 21, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Eficiencia", nombre: "% de solicitudes autogestionadas por motor de riesgo (PF)", objetivo: "Medir la automatización del proceso", unidad: "Porcentaje (%)", formula: "Solicitudes autogestionadas / Total solicitudes * 100", granularidad: "Producto - Segmento", tiempo: "Mensual", valorActual: 70, valorBudget: 80 },
        { id: 22, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Eficiencia", nombre: "% de derivaciones innecesarias a Gestión Comercial", objetivo: "Medir la eficiencia en la derivación", unidad: "Porcentaje (%)", formula: "Derivaciones innecesarias / Total derivaciones * 100", granularidad: "Producto - Canal", tiempo: "Mensual", valorActual: 15, valorBudget: 10 },
        { id: 23, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Calidad", nombre: "% de procesos cancelados por inconsistencias en datos o falta de consentimiento", objetivo: "Medir la calidad de los datos ingresados", unidad: "Porcentaje (%)", formula: "Procesos cancelados / Total procesos * 100", granularidad: "Tipo de inconsistencia - Canal", tiempo: "Mensual", valorActual: 8, valorBudget: 5 },
        { id: 24, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Calidad", nombre: "Tasa de errores en validaciones cruzadas entre CORE y CRM", objetivo: "Medir la consistencia entre sistemas", unidad: "Cantidad", formula: "Errores detectados en validación cruzada", granularidad: "Tipo de validación", tiempo: "Mensual", valorActual: 3, valorBudget: 2 },
        { id: 25, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Satisfacción del Cliente", nombre: "% de clientes que reciben confirmación automática del consentimiento de datos", objetivo: "Medir la transparencia del proceso", unidad: "Porcentaje (%)", formula: "Clientes con confirmación automática / Total clientes * 100", granularidad: "Canal - Producto", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        { id: 26, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Satisfacción del Cliente", nombre: "% de desembolsos realizados en la fecha pactada con el cliente", objetivo: "Medir el cumplimiento de plazos", unidad: "Porcentaje (%)", formula: "Desembolsos a tiempo / Total desembolsos * 100", granularidad: "Producto - Canal", tiempo: "Mensual", valorActual: 92, valorBudget: 95 },
        { id: 27, proceso: "Solicitud de préstamos y línea de crédito", perspectiva: "Satisfacción del Cliente", nombre: "% de clientes que completan el proceso sin recontacto posterior", objetivo: "Medir la eficiencia en la comunicación", unidad: "Porcentaje (%)", formula: "Clientes sin recontacto / Total clientes * 100", granularidad: "Canal - Producto", tiempo: "Mensual", valorActual: 75, valorBudget: 85 },
        { id: 28, proceso: "Actualización de Perfil", perspectiva: "Eficiencia", nombre: "Pulso del Perfil: Tiempo medio de actualización completada", objetivo: "Medir la velocidad de actualización", unidad: "Minutos", formula: "∑(Tiempo actualización) / Total actualizaciones", granularidad: "Tipo de actualización - Canal", tiempo: "Mensual", valorActual: 30, valorBudget: 20 },
        { id: 29, proceso: "Actualización de Perfil", perspectiva: "Eficiencia", nombre: "Velocidad de Sintonía: % de actualizaciones completadas sin reintentos", objetivo: "Medir la eficiencia en actualizaciones", unidad: "Porcentaje (%)", formula: "Actualizaciones sin reintentos / Total actualizaciones * 100", granularidad: "Tipo de actualización", tiempo: "Mensual", valorActual: 88, valorBudget: 92 },
        { id: 30, proceso: "Actualización de Perfil", perspectiva: "Eficiencia", nombre: "Agilidad sin Fricción: % de validaciones automáticas exitosas", objetivo: "Medir la efectividad de las validaciones automáticas", unidad: "Porcentaje (%)", formula: "Validaciones automáticas exitosas / Total validaciones * 100", granularidad: "Tipo de validación", tiempo: "Mensual", valorActual: 80, valorBudget: 85 },
        { id: 31, proceso: "Actualización de Perfil", perspectiva: "Eficiencia", nombre: "Tiempo al Consentimiento: promedio hasta obtener aprobación del cliente", objetivo: "Medir la velocidad de obtención de consentimientos", unidad: "Minutos", formula: "∑(Tiempo consentimiento) / Total consentimientos", granularidad: "Tipo de consentimiento - Canal", tiempo: "Mensual", valorActual: 45, valorBudget: 30 },
        { id: 32, proceso: "Actualización de Perfil", perspectiva: "Calidad", nombre: "Perfil en Foco: % de actualizaciones sin errores de carga", objetivo: "Medir la calidad de los datos ingresados", unidad: "Porcentaje (%)", formula: "Actualizaciones sin errores / Total actualizaciones * 100", granularidad: "Campo actualizado - Canal", tiempo: "Mensual", valorActual: 90, valorBudget: 95 },
        { id: 33, proceso: "Actualización de Perfil", perspectiva: "Calidad", nombre: "Rastro Digital: % de campos actualizados con trazabilidad completa", objetivo: "Medir la trazabilidad de los cambios", unidad: "Porcentaje (%)", formula: "Campos con trazabilidad / Total campos actualizados * 100", granularidad: "Tipo de campo", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        { id: 34, proceso: "Actualización de Perfil", perspectiva: "Calidad", nombre: "Integridad Consistente: % de coincidencia entre CRM y CORE", objetivo: "Medir la consistencia entre sistemas", unidad: "Porcentaje (%)", formula: "Campos coincidentes / Total campos * 100", granularidad: "Tipo de campo", tiempo: "Mensual", valorActual: 92, valorBudget: 95 },
        { id: 35, proceso: "Actualización de Perfil", perspectiva: "Calidad", nombre: "Alertas Evitadas: % de procesos sin incidentes o tickets derivados", objetivo: "Medir la calidad del proceso", unidad: "Porcentaje (%)", formula: "Procesos sin incidentes / Total procesos * 100", granularidad: "Tipo de actualización", tiempo: "Mensual", valorActual: 88, valorBudget: 92 },
        { id: 36, proceso: "Actualización de Perfil", perspectiva: "Satisfacción del Cliente", nombre: "Trámite Sin Vueltas: % de actualizaciones resueltas en una sola interacción", objetivo: "Medir la eficiencia desde la perspectiva del cliente", unidad: "Porcentaje (%)", formula: "Actualizaciones en una interacción / Total actualizaciones * 100", granularidad: "Canal - Tipo de actualización", tiempo: "Mensual", valorActual: 82, valorBudget: 88 },
        { id: 37, proceso: "Actualización de Perfil", perspectiva: "Satisfacción del Cliente", nombre: "Consentimiento Sin Fricción: % de clientes que aprueban en primer intento", objetivo: "Medir la facilidad de obtención de consentimientos", unidad: "Porcentaje (%)", formula: "Consentimientos en primer intento / Total consentimientos * 100", granularidad: "Tipo de consentimiento", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        { id: 38, proceso: "Actualización de Perfil", perspectiva: "Satisfacción del Cliente", nombre: "Tiempo de Espera Invisible: % de confirmaciones enviadas dentro de las 2hs", objetivo: "Medir la prontitud en las confirmaciones", unidad: "Porcentaje (%)", formula: "Confirmaciones en menos de 2 horas / Total confirmaciones * 100", granularidad: "Canal", tiempo: "Mensual", valorActual: 90, valorBudget: 95 },
        { id: 39, proceso: "Actualización de Perfil", perspectiva: "Satisfacción del Cliente", nombre: "Actualización Empática: % de clientes que completan sin asistencia manual", objetivo: "Medir la facilidad de uso del sistema", unidad: "Porcentaje (%)", formula: "Actualizaciones autogestionadas / Total actualizaciones * 100", granularidad: "Canal - Tipo de actualización", tiempo: "Mensual", valorActual: 75, valorBudget: 80 },
        { id: 40, proceso: "Modificaciones de datos de Contacto", perspectiva: "Eficiencia", nombre: "Velocidad de Actualización: tiempo medio hasta confirmación del cambio", objetivo: "Medir la velocidad de actualización", unidad: "Minutos", formula: "∑(Tiempo confirmación - Tiempo solicitud) / Total modificaciones", granularidad: "Tipo de modificación - Canal", tiempo: "Mensual", valorActual: 25, valorBudget: 20 },
        { id: 41, proceso: "Modificaciones de datos de Contacto", perspectiva: "Eficiencia", nombre: "Modificación Sin Reproceso: % de datos actualizados sin necesidad de corrección", objetivo: "Medir la calidad de las modificaciones", unidad: "Porcentaje (%)", formula: "Modificaciones correctas / Total modificaciones * 100", granularidad: "Tipo de modificación", tiempo: "Mensual", valorActual: 90, valorBudget: 93 },
        { id: 42, proceso: "Modificaciones de datos de Contacto", perspectiva: "Eficiencia", nombre: "Flujo Sin Trazas Rojas: % de flujos sin errores técnicos en servicios", objetivo: "Medir la estabilidad técnica", unidad: "Porcentaje (%)", formula: "Flujos sin errores / Total flujos * 100", granularidad: "Tipo de servicio", tiempo: "Mensual", valorActual: 95, valorBudget: 97 },
        { id: 43, proceso: "Modificaciones de datos de Contacto", perspectiva: "Eficiencia", nombre: "Tiempo al Checkpoint: promedio hasta señal de actualización registrada", objetivo: "Medir la velocidad de registro", unidad: "Minutos", formula: "∑(Tiempo registro - Tiempo solicitud) / Total modificaciones", granularidad: "Sistema destino", tiempo: "Mensual", valorActual: 15, valorBudget: 10 },
        { id: 44, proceso: "Modificaciones de datos de Contacto", perspectiva: "Calidad", nombre: "Integridad Sincrónica: % de coincidencia post-cambio entre CRM y CORE", objetivo: "Medir la consistencia entre sistemas", unidad: "Porcentaje (%)", formula: "Campos coincidentes / Total campos modificados * 100", granularidad: "Tipo de campo", tiempo: "Mensual", valorActual: 93, valorBudget: 96 },
        { id: 45, proceso: "Modificaciones de datos de Contacto", perspectiva: "Calidad", nombre: "Consistencia Consentida: % de cambios acompañados por documentación válida", objetivo: "Medir el cumplimiento documental", unidad: "Porcentaje (%)", formula: "Cambios con documentación / Total cambios * 100", granularidad: "Tipo de modificación", tiempo: "Mensual", valorActual: 88, valorBudget: 92 },
        { id: 46, proceso: "Modificaciones de datos de Contacto", perspectiva: "Calidad", nombre: "Sincronía Legal: % de rechazos por inconsistencias en formato de consentimiento", objetivo: "Medir la calidad de los consentimientos", unidad: "Porcentaje (%)", formula: "Rechazos por consentimiento / Total rechazos * 100", granularidad: "Tipo de consentimiento", tiempo: "Mensual", valorActual: 5, valorBudget: 3 },
        { id: 47, proceso: "Modificaciones de datos de Contacto", perspectiva: "Calidad", nombre: "Rastreo Completo: % de cambios trazables por usuario, canal y timestamp", objetivo: "Medir la trazabilidad", unidad: "Porcentaje (%)", formula: "Cambios trazables / Total cambios * 100", granularidad: "Tipo de modificación", tiempo: "Mensual", valorActual: 98, valorBudget: 99 },
        { id: 48, proceso: "Modificaciones de datos de Contacto", perspectiva: "Satisfacción del Cliente", nombre: "Cambio Express: % de clientes que confirman el cambio en menos de 2 horas", objetivo: "Medir la velocidad percibida", unidad: "Porcentaje (%)", formula: "Cambios rápidos / Total cambios * 100", granularidad: "Canal - Tipo de modificación", tiempo: "Mensual", valorActual: 80, valorBudget: 85 },
        { id: 49, proceso: "Modificaciones de datos de Contacto", perspectiva: "Satisfacción del Cliente", nombre: "Modificación Sin Contacto: % de cambios realizados sin intervención de operador", objetivo: "Medir la autogestión", unidad: "Porcentaje (%)", formula: "Cambios autogestionados / Total cambios * 100", granularidad: "Canal", tiempo: "Mensual", valorActual: 70, valorBudget: 75 },
        { id: 50, proceso: "Modificaciones de datos de Contacto", perspectiva: "Satisfacción del Cliente", nombre: "Confirmación Transparente: % de clientes que reciben notificación de éxito", objetivo: "Medir la transparencia", unidad: "Porcentaje (%)", formula: "Clientes notificados / Total clientes * 100", granularidad: "Canal", tiempo: "Mensual", valorActual: 90, valorBudget: 95 },
        { id: 51, proceso: "Modificaciones de datos de Contacto", perspectiva: "Satisfacción del Cliente", nombre: "Fricción Cero: % de procesos sin reclamos o solicitudes de ayuda", objetivo: "Medir la satisfacción indirecta", unidad: "Porcentaje (%)", formula: "Procesos sin reclamos / Total procesos * 100", granularidad: "Canal - Tipo de modificación", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        { id: 52, proceso: "Solicitud de Seguros", perspectiva: "Eficiencia", nombre: "Despegue Asegurado: tiempo promedio de carga a emisión", objetivo: "Medir la velocidad del proceso", unidad: "Minutos", formula: "∑(Tiempo emisión - Tiempo carga) / Total pólizas", granularidad: "Tipo de seguro - Canal", tiempo: "Mensual", valorActual: 60, valorBudget: 45 },
        { id: 53, proceso: "Solicitud de Seguros", perspectiva: "Eficiencia", nombre: "Solicitud sin Desvíos: % de procesos sin reintentos ni errores", objetivo: "Medir la eficiencia del proceso", unidad: "Porcentaje (%)", formula: "Procesos limpios / Total procesos * 100", granularidad: "Tipo de seguro", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        { id: 54, proceso: "Solicitud de Seguros", perspectiva: "Eficiencia", nombre: "Validación en Piloto Automático: % de verificaciones realizadas sin intervención", objetivo: "Medir la automatización", unidad: "Porcentaje (%)", formula: "Verificaciones automáticas / Total verificaciones * 100", granularidad: "Tipo de verificación", tiempo: "Mensual", valorActual: 75, valorBudget: 80 },
        { id: 55, proceso: "Solicitud de Seguros", perspectiva: "Eficiencia", nombre: "Tiempo hasta Vinculación: demora promedio hasta linkeo con producto financiero", objetivo: "Medir la integración con productos financieros", unidad: "Minutos", formula: "∑(Tiempo vinculación) / Total vinculaciones", granularidad: "Producto vinculado", tiempo: "Mensual", valorActual: 30, valorBudget: 25 },
        { id: 56, proceso: "Solicitud de Seguros", perspectiva: "Calidad", nombre: "Consistencia de Cobertura: % de pólizas con datos coincidentes entre CRM y aseguradora", objetivo: "Medir la consistencia de datos", unidad: "Porcentaje (%)", formula: "Pólizas consistentes / Total pólizas * 100", granularidad: "Tipo de seguro", tiempo: "Mensual", valorActual: 92, valorBudget: 95 },
        { id: 57, proceso: "Solicitud de Seguros", perspectiva: "Calidad", nombre: "Cierre Sin Bordes: % de procesos que llegan a emisión sin requerir intervención manual", objetivo: "Medir la automatización completa", unidad: "Porcentaje (%)", formula: "Procesos automáticos / Total procesos * 100", granularidad: "Tipo de seguro", tiempo: "Mensual", valorActual: 80, valorBudget: 85 },
        { id: 58, proceso: "Solicitud de Seguros", perspectiva: "Calidad", nombre: "Checklist Cumplido: % de solicitudes con documentación completa", objetivo: "Medir la completitud documental", unidad: "Porcentaje (%)", formula: "Solicitudes completas / Total solicitudes * 100", granularidad: "Tipo de seguro", tiempo: "Mensual", valorActual: 88, valorBudget: 92 },
        { id: 59, proceso: "Solicitud de Seguros", perspectiva: "Calidad", nombre: "Desvíos Reportados: % de casos que generan incidente durante la solicitud", objetivo: "Medir los problemas durante el proceso", unidad: "Porcentaje (%)", formula: "Casos con incidentes / Total casos * 100", granularidad: "Tipo de incidente", tiempo: "Mensual", valorActual: 10, valorBudget: 7 },
        { id: 60, proceso: "Solicitud de Seguros", perspectiva: "Satisfacción del Cliente", nombre: "Cobertura en un Click: % de solicitudes resueltas sin intervención de un asesor", objetivo: "Medir la autogestión", unidad: "Porcentaje (%)", formula: "Solicitudes autogestionadas / Total solicitudes * 100", granularidad: "Canal - Tipo de seguro", tiempo: "Mensual", valorActual: 65, valorBudget: 70 },
        { id: 61, proceso: "Solicitud de Seguros", perspectiva: "Satisfacción del Cliente", nombre: "Notificación Instantánea: % de clientes que reciben confirmación en menos de 15 minutos", objetivo: "Medir la prontitud en confirmaciones", unidad: "Porcentaje (%)", formula: "Clientes con confirmación rápida / Total clientes * 100", granularidad: "Canal", tiempo: "Mensual", valorActual: 75, valorBudget: 80 },
        { id: 62, proceso: "Solicitud de Seguros", perspectiva: "Satisfacción del Cliente", nombre: "Proceso Transparente: % de clientes con visibilidad en tiempo real del estado", objetivo: "Medir la transparencia", unidad: "Porcentaje (%)", formula: "Clientes con visibilidad / Total clientes * 100", granularidad: "Canal", tiempo: "Mensual", valorActual: 85, valorBudget: 90 },
        { id: 63, proceso: "Solicitud de Seguros", perspectiva: "Satisfacción del Cliente", nombre: "Sin Fricciones: % de casos sin contacto posterior al alta", objetivo: "Medir la satisfacción indirecta", unidad: "Porcentaje (%)", formula: "Casos sin recontacto / Total casos * 100", granularidad: "Canal - Tipo de seguro", tiempo: "Mensual", valorActual: 80, valorBudget: 85 }
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
            fetchData('./data/kpis.json'),
            fetchData('./data/historical.json')
        ]);

        sucursalesParaguay = sucursalesResponse || localData.sucursales;
        kpisData = kpisResponse || localData.kpis;
        historicalData = historicalResponse || localData.historical;
        
        // Inicializar con el último mes disponible
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
        loadDefaultData();
        
        // Inicializar con el último mes disponible
        const lastMonthIndex = historicalData.labels.length - 1;
        const lastMonth = historicalData.labels[lastMonthIndex];
        const lastMonthFormatted = formatPeriodForSelect(lastMonth);
        document.getElementById('periodo-select').value = lastMonthFormatted;
        
        generateHistoricalValues();
        loadSucursales();
        setupEventListeners();
        updateDashboard();
        renderMiniCharts();
    }
});

// Función para formatear el período para el selector
function formatPeriodForSelect(monthLabel) {
    const [month, year] = monthLabel.split(' ');
    const monthMap = {
        'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dic': '12'
    };
    return `${year}-${monthMap[month]}`;
}

// Función para obtener el mes actual desde el período seleccionado
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

function loadDefaultData() {
    sucursalesParaguay = localData.sucursales;
    kpisData = localData.kpis;
    historicalData = localData.historical;
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
    
    // Obtener el mes actual seleccionado
    const currentMonth = getCurrentMonthFromPeriod(periodo);
    const currentMonthIndex = historicalData.labels.indexOf(currentMonth);
    
    // Validar que el índice sea válido
    if (currentMonthIndex === -1) {
        console.error('Mes no encontrado:', currentMonth);
        return;
    }
    
    // Filtrar KPIs según perspectiva
    let filteredKpis = kpisData;
    
    // Aplicar filtro de perspectiva
    if (perspectiva !== 'todas') {
        const perspectivaFilter = perspectiva === 'Experiencia' ? 'Satisfacción del Cliente' : perspectiva;
        filteredKpis = filteredKpis.filter(kpi => kpi.perspectiva === perspectivaFilter);
    }
    
    // Calcular variación basada en sucursal y oficial
    let variationFactor = 1;
    
    // Variación por sucursal
    if (sucursalId !== 'todas') {
        const sucursal = sucursalesParaguay.find(s => s.id == sucursalId);
        if (sucursal) {
            // Cada sucursal tiene un factor de variación basado en su ID
            variationFactor *= 0.9 + (sucursal.id % 10) * 0.02;
        }
    }
    
    // Variación por oficial
    if (oficial !== 'todos') {
        // Cada oficial tiene un factor de variación basado en la longitud de su nombre
        variationFactor *= 0.95 + (oficial.length % 10) * 0.01;
    }
    
    // Aplicar variación a los KPIs
    filteredKpis = filteredKpis.map(kpi => {
        // Obtener el valor histórico base para este KPI en el mes seleccionado
        const baseValue = historicalValues[kpi.id]?.[currentMonth] || kpi.valorActual;
        const baseBudget = kpi.valorBudget;
        
        // Aplicar variación
        const adjustedValue = baseValue * variationFactor;
        const adjustedBudget = baseBudget * (variationFactor > 1 ? variationFactor * 0.98 : variationFactor * 1.02);
        
        // Asegurar que los valores estén dentro de rangos razonables
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
    
    // Calcular valores agregados para las tarjetas principales
    let eficienciaValue = historicalData.eficiencia[currentMonthIndex] * variationFactor;
    let calidadValue = historicalData.calidad[currentMonthIndex] * variationFactor;
    let experienciaValue = historicalData.experiencia[currentMonthIndex] * variationFactor;
    
    // Asegurar que no excedan 100%
    eficienciaValue = Math.min(100, eficienciaValue);
    calidadValue = Math.min(100, calidadValue);
    experienciaValue = Math.min(100, experienciaValue);
    
    // Actualizar tarjetas con los valores del mes seleccionado
    updateKpiCard('eficiencia', eficienciaValue, 85, currentMonth);
    updateKpiCard('calidad', calidadValue, 90, currentMonth);
    updateKpiCard('experiencia', experienciaValue, 88, currentMonth);
    
    // Actualizar tabla con los KPIs filtrados
    updateKpiTable(filteredKpis, currentMonth);
    
    // Actualizar mini gráficos
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

function updateKpiTable(kpis, currentMonth) {
    const tbody = document.querySelector('#kpi-table tbody');
    tbody.innerHTML = '';
    
    const groupedData = {};
    
    kpis.forEach(kpi => {
        if (!groupedData[kpi.perspectiva]) {
            groupedData[kpi.perspectiva] = {};
            expandedGroups.perspectiva[kpi.perspectiva] = false; // Inicialmente cerrado
        }
        
        if (!groupedData[kpi.perspectiva][kpi.proceso]) {
            groupedData[kpi.perspectiva][kpi.proceso] = [];
            expandedGroups.proceso[kpi.proceso] = false; // Inicialmente cerrado
        }
        
        groupedData[kpi.perspectiva][kpi.proceso].push(kpi);
    });
    
    Object.keys(groupedData).forEach(perspectiva => {
        const perspectivaRow = document.createElement('tr');
        perspectivaRow.className = 'perspectiva-row';
        perspectivaRow.innerHTML = `
            <td colspan="6">
                <button class="btn btn-sm toggle-group" data-group-id="${perspectiva}" data-group-type="perspectiva">
                    <i class="bi ${expandedGroups.perspectiva[perspectiva] ? 'bi-dash-square' : 'bi-plus-square'}"></i> 
                    ${perspectiva}
                </button>
            </td>
        `;
        tbody.appendChild(perspectivaRow);
        
        Object.keys(groupedData[perspectiva]).forEach(proceso => {
            const procesoRow = document.createElement('tr');
            procesoRow.className = 'proceso-row';
            procesoRow.setAttribute('data-parent-id', perspectiva);
            procesoRow.setAttribute('data-parent-type', 'perspectiva');
            procesoRow.style.display = expandedGroups.perspectiva[perspectiva] ? '' : 'none';
            procesoRow.innerHTML = `
                <td colspan="6" style="padding-left: 30px;">
                    <button class="btn btn-sm toggle-group" data-group-id="${proceso}" data-group-type="proceso">
                        <i class="bi ${expandedGroups.proceso[proceso] ? 'bi-dash-square' : 'bi-plus-square'}"></i> 
                        ${proceso}
                    </button>
                </td>
            `;
            tbody.appendChild(procesoRow);
            
            groupedData[perspectiva][proceso].forEach(kpi => {
                const cumplimiento = formatToTwoDecimals(
                    kpi.unidad.includes("Horas") || kpi.unidad.includes("Minutos") || kpi.nombre.includes("Errores")
                    ? (kpi.valorBudget / kpi.valorActual) * 100
                    : (kpi.valorActual / kpi.valorBudget) * 100
                );

                let estado = cumplimiento >= 90 ? '<span class="badge bg-success">Excelente</span>' 
                          : cumplimiento >= 70 ? '<span class="badge bg-warning">Aceptable</span>' 
                          : '<span class="badge bg-danger">Crítico</span>';

                let valorActualFormatted = formatValue(kpi.valorActual, kpi.unidad);
                let valorBudgetFormatted = formatValue(kpi.valorBudget, kpi.unidad);

                const kpiRow = document.createElement('tr');
                kpiRow.className = 'kpi-row';
                kpiRow.setAttribute('data-parent-id', proceso);
                kpiRow.setAttribute('data-parent-type', 'proceso');
                kpiRow.style.display = (expandedGroups.perspectiva[perspectiva] && expandedGroups.proceso[proceso]) ? '' : 'none';
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
