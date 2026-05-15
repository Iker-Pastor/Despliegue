import { Component, inject, signal, afterNextRender, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EstadisticasService, GlobalStats, Recoleccion } from '../../../services/estadisticas.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent {
  private readonly statsService = inject(EstadisticasService);
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  today = new Date();
  stats = signal<GlobalStats | null>(null);
  totalUsers = signal<number>(0);
  totalEvents = signal<number>(0);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      this.loadData();
    });
  }

  loadData() {
    this.isLoading.set(true);
    
    // Load counts and stats
    this.statsService.getGlobalStats().subscribe({
      next: (data: any) => this.stats.set(data),
      error: (err: any) => console.error('Error stats:', err)
    });

    this.statsService.getUsuariosCount().subscribe({
      next: (data: any) => this.totalUsers.set(data.count),
      error: (err: any) => console.error('Error users:', err)
    });

    this.statsService.getEventosCount().subscribe({
      next: (data: any) => this.totalEvents.set(data.count),
      error: (err: any) => console.error('Error events:', err)
    });

    // Load graph data
    this.statsService.getRecoleccionHistory().subscribe({
      next: (history: any) => {
        this.renderChart(history);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Error al cargar datos de recolección');
        this.isLoading.set(false);
      }
    });
  }

  renderChart(history: Recoleccion[]) {
    if (!this.chartCanvas) return;

    // Group by month (YYYY-MM) and sum amount
    const groupedData = history.reduce((acc: any, curr) => {
      const dateStr = curr.evento.fechaInicio.split(' ')[0]; // YYYY-MM-DD
      const month = dateStr ? dateStr.substring(0, 7) : 'Sin fecha'; // YYYY-MM
      acc[month] = (acc[month] || 0) + curr.cantidad_recolectada;
      return acc;
    }, {});

    // Sort months
    const sortedMonths = Object.keys(groupedData).sort();
    
    // Map to readable month names (e.g., "Ene 2026")
    const labels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    });
    
    const values = sortedMonths.map(m => groupedData[m]);

    new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'KG Recolectados',
          data: values,
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Kilogramos (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Fecha'
            }
          }
        }
      }
    });
  }
}
