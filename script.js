// Configuración global de Chart.js para estilo oscuro
Chart.defaults.color = '#94a3b8'; // Color de texto global
Chart.defaults.font.family = "'Segoe UI', sans-serif";

// --- DATOS ---
// Extraídos de la imagen original

// Datos Región
const regionData = {
    labels: ['Oeste', 'Este', 'Central'],
    datasets: [{
        data: [92505, 86883, 42960],
        backgroundColor: ['#38bdf8', '#6366f1', '#a855f7'], // Palette azul/indigo/violeta
        borderWidth: 0,
        hoverOffset: 4
    }]
};

// Datos Producto
const productData = {
    labels: ['Sistemas', 'Dispositivos', 'Accesorios'],
    datasets: [{
        data: [125842, 56624, 39882],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], // Verde/Ambar/Rojo (Semáforo suave)
        borderWidth: 0,
        cutout: '65%' // Estilo Dona
    }]
};

// Datos Vendedores (Ordenados de mayor a menor para mejor visualización)
const sellerLabels = ['Cristina', 'Jhoselin', 'Matias', 'Stefany', 'Rivaldo', 'Luz'];
const sellerValues = [50590, 48510, 41915, 38373, 29358, 13602];

const sellerData = {
    labels: sellerLabels,
    datasets: [{
        label: 'Ventas (Bs)',
        data: sellerValues,
        backgroundColor: '#ec4899', // Rosa moderno
        borderRadius: 4, // Bordes suaves en las barras
        barPercentage: 0.6 // Grosor de barra elegante
    }]
};


// --- INICIALIZACIÓN DE GRÁFICOS ---

// 1. Gráfico de Región (Pie)
new Chart(document.getElementById('regionChart'), {
    type: 'pie',
    data: regionData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' }
        }
    }
});

// 2. Gráfico de Producto (Doughnut)
new Chart(document.getElementById('productChart'), {
    type: 'doughnut',
    data: productData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' }
        }
    }
});

// 3. Gráfico de Vendedores (Bar Horizontal) -> Corrección Técnica de UX
new Chart(document.getElementById('sellerChart'), {
    type: 'bar',
    data: sellerData,
    options: {
        indexAxis: 'y', // <--- ESTO HACE LAS BARRAS HORIZONTALES
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Ocultamos leyenda porque el eje Y ya tiene los nombres
            tooltip: {
                callbacks: {
                    label: function(context) {
                        // Formato de moneda en el tooltip
                        return ' Bs ' + context.raw.toLocaleString('es-BO');
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { color: '#334155', drawBorder: false },
                ticks: { color: '#94a3b8' }
            },
            y: {
                grid: { display: false }, // Limpiamos líneas horizontales
                ticks: { 
                    font: { size: 14, weight: '500' },
                    color: '#f8fafc' // Nombres en blanco para resaltar
                }
            }
        }
    }
});