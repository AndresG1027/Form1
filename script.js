document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración Global Chart.js
    Chart.defaults.color = '#666';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.borderColor = 'transparent';

    // --- NAVEGACIÓN SPA (Cambio de Vistas) ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Feedback visual en botones
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Cambio de pantalla
            const targetId = item.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active');
                if(view.id === targetId) {
                    view.classList.add('active');
                }
            });
        });
    });

    // --- DATOS CONSTANTES (Aquí estaba el problema, ahora son fijos) ---
    const data = {
        total: 222348,
        region: [42, 39, 19],
        products: [57, 25, 18],
        sellers: {
            names: ['Cristina', 'Jhoselin', 'Matias', 'Stefany', 'Rivaldo', 'Luz'],
            // Definimos los datos EXACTOS para cada filtro. Ya no son aleatorios.
            datasets: {
                all:      [50590, 48510, 41915, 38373, 29358, 13602], // Total real
                systems:  [35000, 28000, 25000, 18000, 12000, 7842],  // Solo Sistemas
                devices:  [10500, 15000, 12000, 15373, 10000, 3760],  // Solo Dispositivos
                acc:      [5090,  5510,  4915,  5000,  7358,  2000]   // Solo Accesorios
            }
        }
    };

    // --- 1. ANIMACIÓN DEL KPI (Contador de Dinero) ---
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function para que frene suavemente al final
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const val = Math.floor(easeOut * (end - start) + start);
            obj.innerHTML = "Bs " + val.toLocaleString('es-BO');
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
    
    // Iniciar contador inicial
    const kpiElement = document.getElementById('totalSales');
    // Calculamos el total inicial sumando el array 'all'
    const initialTotal = data.sellers.datasets.all.reduce((a, b) => a + b, 0); 
    animateValue(kpiElement, 0, initialTotal, 1500);

    // --- 2. GRÁFICOS ---
    
    // Gráfico Región
    new Chart(document.getElementById('regionChart'), {
        type: 'doughnut',
        data: {
            labels: ['Oeste', 'Este', 'Central'],
            datasets: [{
                data: data.region,
                backgroundColor: ['#3b82f6', '#6366f1', '#a855f7'],
                borderWidth: 0, cutout: '75%', hoverOffset: 5
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Gráfico Productos
    new Chart(document.getElementById('productChart'), {
        type: 'pie',
        data: {
            labels: ['Sistemas', 'Dispositivos', 'Accesorios'],
            datasets: [{
                data: data.products,
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0, hoverOffset: 5
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Gráfico Vendedores (Barras)
    const ctxBar = document.getElementById('sellerChart').getContext('2d');
    const gradient = ctxBar.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#ec4899'); 
    gradient.addColorStop(1, '#8b5cf6');

    const sellerChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: data.sellers.names,
            datasets: [{
                data: data.sellers.datasets.all, // Carga inicial: TODOS
                backgroundColor: gradient, 
                borderRadius: 6, 
                barThickness: 18
            }]
        },
        options: {
            indexAxis: 'y', 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { grid: { display: false }, ticks: { color: '#fff', font: { size: 12 } } } }
        }
    });

    // --- 3. LÓGICA DE FILTROS CORREGIDA ---
    const filterButtons = document.querySelectorAll('.chip');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Si el botón ya está activo, NO HACER NADA (evita parpadeos y cambios innecesarios)
            if (this.classList.contains('active')) return;

            // Verificar que sea un botón de filtro (dentro de scroll-tabs)
            if(this.parentElement.classList.contains('scroll-tabs')) {
                
                // 1. Visual: Actualizar clase active
                filterButtons.forEach(b => {
                   if(b.parentElement.classList.contains('scroll-tabs')) b.classList.remove('active');
                });
                this.classList.add('active');
                
                // 2. Datos: Obtener el array FIJO correspondiente
                const filterKey = this.getAttribute('data-filter'); // 'all', 'systems', etc.
                const newData = data.sellers.datasets[filterKey];
                
                // 3. Actualizar Gráfico
                sellerChart.data.datasets[0].data = newData;
                sellerChart.update();
                
                // 4. Actualizar KPI (Sumando los valores reales del array)
                const currentTotal = parseInt(kpiElement.innerText.replace(/\D/g,'')); // Valor actual en pantalla
                const newTotal = newData.reduce((a, b) => a + b, 0); // Suma real del array seleccionado
                
                animateValue(kpiElement, currentTotal, newTotal, 600);
            }
        });
    });
});