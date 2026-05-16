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
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef;
  @ViewChild('monthlyInscriptionsCanvas') monthlyInscriptionsCanvas!: ElementRef;
  @ViewChild('orgRankingCanvas') orgRankingCanvas!: ElementRef;
  
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
      },
      error: (err: any) => console.error('Error recoleccion:', err)
    });

    this.statsService.getPopularidadCategorias().subscribe({
      next: (data: any[]) => this.renderCategoryChart(data),
      error: (err: any) => console.error('Error categories:', err)
    });

    this.statsService.getMensuales().subscribe({
      next: (data: any[]) => this.renderMonthlyChart(data),
      error: (err: any) => console.error('Error monthly:', err)
    });

    this.statsService.getRankingOrganizaciones().subscribe({
      next: (data: any[]) => {
        this.renderRankingChart(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error ranking:', err);
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

  renderCategoryChart(data: any[]) {
    if (!this.categoryChartCanvas) return;
    const labels = data.map(item => item[0]);
    const values = data.map(item => item[1]);

    new Chart(this.categoryChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2', '#6f42c1', '#fd7e14']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  renderMonthlyChart(data: any[]) {
    if (!this.monthlyInscriptionsCanvas) return;
    const labels = data.map(item => item[0]).reverse(); // Date labels
    const values = data.map(item => item[1]).reverse();

    new Chart(this.monthlyInscriptionsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nuevas Inscripciones',
          data: values,
          backgroundColor: '#0d6efd'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  renderRankingChart(data: any[]) {
    if (!this.orgRankingCanvas) return;
    const labels = data.map(item => item[0]);
    const values = data.map(item => item[1]);

    new Chart(this.orgRankingCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Eventos Creados',
          data: values,
          backgroundColor: '#ffc107',
          indexAxis: 'y'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: { x: { beginAtZero: true } }
      }
    });
  }
}
