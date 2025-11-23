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
            // 1. Actualizar Nav Visual
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // 2. Cambiar Vista
            const targetId = item.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active');
                if(view.id === targetId) {
                    view.classList.add('active');
                }
            });
        });
    });

    // --- DATOS Y GRÁFICOS (Igual que antes) ---
    const data = {
        total: 222348,
        region: [42, 39, 19],
        products: [57, 25, 18],
        sellers: {
            names: ['Cristina', 'Jhoselin', 'Matias', 'Stefany', 'Rivaldo', 'Luz'],
            values: [50590, 48510, 41915, 38373, 29358, 13602]
        }
    };

    // Animación KPI
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const val = Math.floor(progress * (end - start) + start);
            obj.innerHTML = "Bs " + val.toLocaleString('es-BO');
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
    animateValue(document.getElementById('totalSales'), 0, data.total, 1500);

    // Gráficos
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

    const ctxBar = document.getElementById('sellerChart').getContext('2d');
    const gradient = ctxBar.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#ec4899'); gradient.addColorStop(1, '#8b5cf6');

    const sellerChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: data.sellers.names,
            datasets: [{
                data: data.sellers.values,
                backgroundColor: gradient, borderRadius: 6, barThickness: 18
            }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { grid: { display: false }, ticks: { color: '#fff', font: { size: 12 } } } }
        }
    });

    // Funcionalidad Chips
    const buttons = document.querySelectorAll('.chip');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if(this.parentElement.classList.contains('scroll-tabs')) { // Solo para filtros, no perfil
                buttons.forEach(b => {
                   if(b.parentElement.classList.contains('scroll-tabs')) b.classList.remove('active');
                });
                this.classList.add('active');
                
                const factor = Math.random() * 0.6 + 0.4;
                const newData = data.sellers.values.map(v => Math.floor(v * factor));
                sellerChart.data.datasets[0].data = newData;
                sellerChart.update();
                
                const newTotal = newData.reduce((a, b) => a + b, 0) * 2;
                animateValue(document.getElementById('totalSales'), parseInt(document.getElementById('totalSales').innerText.replace(/\D/g,'')), newTotal, 600);
            }
        });
    });
});