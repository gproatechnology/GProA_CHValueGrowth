/**
 * CHValueGrowth Dashboard JavaScript
 * Consume API y popula el dashboard con datos en tiempo real
 */

// Configuración global
const API_BASE = '/api/v1';

// Función para formatear precios en pesos mexicanos
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}

// Función para obtener datos de estadísticas
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/products/stats`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalProducts').textContent = data.total_products.toLocaleString();
            document.getElementById('avgPrice').textContent = formatPrice(data.stats.avg_price);
            document.getElementById('minPrice').textContent = formatPrice(data.stats.min_price);
            document.getElementById('maxPrice').textContent = formatPrice(data.stats.max_price);
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        document.getElementById('totalProducts').textContent = 'Error';
    }
}

// Función para obtener métricas del pipeline
async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE}/metrics`);
        const data = await response.json();

        if (data.success) {
            const pipeline = data.pipeline;
            document.getElementById('metricScraped').textContent = pipeline.scraped || 0;
            document.getElementById('metricNormalized').textContent = pipeline.normalized || 0;
            document.getElementById('metricSaved').textContent = pipeline.saved || 0;
            document.getElementById('metricDuplicates').textContent = pipeline.duplicates || 0;

            // Calcular quality score
            const quality = pipeline.quality_score || 0;
            document.getElementById('metricQuality').textContent = `${quality.toFixed(1)}%`;
        }
    } catch (error) {
        console.error('Error fetching metrics:', error);
    }
}

// Función para obtener productos recientes
async function fetchRecentProducts(limit = 10) {
    try {
        const response = await fetch(`${API_BASE}/products?page=1&limit=${limit}`);
        const data = await response.json();

        const tbody = document.getElementById('productsTable');

        if (data.success && data.data && data.data.length > 0) {
            tbody.innerHTML = data.data.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.brand || 'N/A'}</td>
                    <td>${product.size || 'N/A'}</td>
                    <td>${formatPrice(product.price)}</td>
                    <td>${product.source || 'N/A'}</td>
                </tr>
            `).join('');

            // Poblar filtros con datos únicos
            populateFilters(data.data);
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay productos disponibles</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('productsTable').innerHTML =
            '<tr><td colspan="5" class="loading">Error al cargar productos</td></tr>';
    }
}

// Poblar filtros con valores únicos
function populateFilters(products) {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const sizes = [...new Set(products.map(p => p.size).filter(Boolean))];

    const brandFilter = document.getElementById('brandFilter');
    const sizeFilter = document.getElementById('sizeFilter');

    // Limpiar opciones existentes (excepto la primera)
    while (brandFilter.options.length > 1) brandFilter.remove(1);
    while (sizeFilter.options.length > 1) sizeFilter.remove(1);

    // Añadir marcas
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });

    // Añadir tamaños
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeFilter.appendChild(option);
    });
}

// Gráfico de marcas (dona)
let brandChart = null;

async function fetchBrandChart() {
    try {
        const response = await fetch(`${API_BASE}/products/grouped?group_by=brand&limit=10`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            const ctx = document.getElementById('brandChart').getContext('2d');

            const labels = data.data.map(d => d.name);
            const counts = data.data.map(d => d.count);

            // Colores para el gráfico
            const colors = [
                '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
                '#22c55e', '#4ade80', '#86efac', '#f59e0b', '#fbbf24'
            ];

            if (brandChart) {
                brandChart.destroy();
            }

            brandChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: counts,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 15,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching brand chart:', error);
    }
}

// Gráfico de distribución de precios (barras)
let priceChart = null;

async function fetchPriceChart() {
    try {
        const response = await fetch(`${API_BASE}/products?page=1&limit=100`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            const ctx = document.getElementById('priceChart').getContext('2d');

            // Obtener precios
            const prices = data.data
                .map(p => p.price)
                .filter(p => p > 0)
                .sort((a, b) => a - b);

            if (prices.length === 0) return;

            // Crear rangos de precios
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const range = max - min;
            const numRanges = 5;
            const rangeSize = range / numRanges;

            const ranges = [];
            const rangeCounts = new Array(numRanges).fill(0);

            for (let i = 0; i < numRanges; i++) {
                const start = min + (i * rangeSize);
                const end = start + rangeSize;
                ranges.push(`${formatPrice(start)} - ${formatPrice(end)}`);
            }

            // Contar productos por rango
            prices.forEach(price => {
                const idx = Math.min(
                    Math.floor((price - min) / rangeSize),
                    numRanges - 1
                );
                rangeCounts[idx]++;
            });

            if (priceChart) {
                priceChart.destroy();
            }

            priceChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ranges,
                    datasets: [{
                        label: 'Productos',
                        data: rangeCounts,
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching price chart:', error);
    }
}

// Función principal de inicialización
async function initDashboard() {
    // Mostrar estado de carga
    document.getElementById('totalProducts').textContent = '...';
    document.getElementById('avgPrice').textContent = '...';
    document.getElementById('minPrice').textContent = '...';
    document.getElementById('maxPrice').textContent = '...';

    // Cargar todos los datos en paralelo
    await Promise.all([
        fetchStats(),
        fetchMetrics(),
        fetchRecentProducts(),
        fetchBrandChart(),
        fetchPriceChart()
    ]);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar dashboard
    initDashboard();

    // Botón de actualizar
    document.getElementById('refreshBtn').addEventListener('click', () => {
        initDashboard();
    });

    // Filtros
    document.getElementById('brandFilter').addEventListener('change', async (e) => {
        const brand = e.target.value;
        const size = document.getElementById('sizeFilter').value;

        // Rebuild URL con filtros
        let url = `${API_BASE}/products?page=1&limit=10`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (size) url += `&size=${encodeURIComponent(size)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const tbody = document.getElementById('productsTable');
            if (data.success && data.data && data.data.length > 0) {
                tbody.innerHTML = data.data.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.brand || 'N/A'}</td>
                        <td>${product.size || 'N/A'}</td>
                        <td>${formatPrice(product.price)}</td>
                        <td>${product.source || 'N/A'}</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay productos con estos filtros</td></tr>';
            }
        } catch (error) {
            console.error('Error filtering:', error);
        }
    });

    document.getElementById('sizeFilter').addEventListener('change', async (e) => {
        const size = e.target.value;
        const brand = document.getElementById('brandFilter').value;

        let url = `${API_BASE}/products?page=1&limit=10`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (size) url += `&size=${encodeURIComponent(size)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const tbody = document.getElementById('productsTable');
            if (data.success && data.data && data.data.length > 0) {
                tbody.innerHTML = data.data.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.brand || 'N/A'}</td>
                        <td>${product.size || 'N/A'}</td>
                        <td>${formatPrice(product.price)}</td>
                        <td>${product.source || 'N/A'}</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay productos con estos filtros</td></tr>';
            }
        } catch (error) {
            console.error('Error filtering:', error);
        }
    });
});