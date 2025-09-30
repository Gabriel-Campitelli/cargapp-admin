import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { QrCreateDialogComponent } from '../qr-create/qr-create.component';
import { QrCreated } from '../../services/qr/qr.service';

interface QRCode {
  id: string;
  surtidor: number;
  combustible: string;
  monto: number;
  estado: 'Pendiente' | 'Pagado' | 'Vencido';
  creado: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private dialog = inject(MatDialog);

  filtrosForm: FormGroup;
  surtidores = [1, 2, 3, 4];
  qrs: QRCode[] = [
    {
      id: 'TX-001',
      surtidor: 1,
      combustible: 'Súper',
      monto: 20000,
      estado: 'Pendiente',
      creado: new Date(),
    },
    {
      id: 'TX-002',
      surtidor: 2,
      combustible: 'Premium',
      monto: 35000,
      estado: 'Pagado',
      creado: new Date(),
    },
    {
      id: 'TX-003',
      surtidor: 3,
      combustible: 'Diésel',
      monto: 18000,
      estado: 'Vencido',
      creado: new Date(),
    },
  ];
  qrsFiltrados: QRCode[] = [];

  constructor(private readonly router: Router, private fb: FormBuilder) {
    this.filtrosForm = this.fb.group({
      estado: [''],
      surtidor: [''],
      fechaDesde: [''],
      fechaHasta: [''],
    });
  }

  ngOnInit() {
    this.qrsFiltrados = [...this.qrs];

    // Auto-filtrar cuando cambien los valores
    this.filtrosForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    const filtros = this.filtrosForm.value;
    this.qrsFiltrados = this.qrs.filter((qr) => {
      return (
        (!filtros.estado || qr.estado === filtros.estado) &&
        (!filtros.surtidor || qr.surtidor.toString() === filtros.surtidor)
      );
      // Agregar filtros de fecha si es necesario
    });
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.qrsFiltrados = [...this.qrs];
  }

  verQR(qr: QRCode) {
    // Abrir modal o navegar a detalle
    console.log('Ver QR:', qr);
  }

  imprimirQR(qr: QRCode) {
    // Lógica de impresión
    console.log('Imprimir QR:', qr);
  }

  cancelarQR(qr: QRCode) {
    if (confirm('¿Estás seguro de cancelar este QR?')) {
      qr.estado = 'Vencido';
      // Llamar al backend para actualizar
    }
  }

  abrirCrearQr(defaultSurtidor?: number) {
    const ref = this.dialog.open(QrCreateDialogComponent, {
      width: '680px',
      maxWidth: '95vw',
      disableClose: true,
      data: { defaultSurtidor },
    });

    ref.afterClosed().subscribe((res?: QrCreated) => {
      if (res) {
        // refrescá la tabla: cargar de backend o insertar el nuevo al inicio
        console.log('QR creado:', res);
      }
    });
  }
}
