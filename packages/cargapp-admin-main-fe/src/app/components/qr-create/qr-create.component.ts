import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// QR
import { QRCodeComponent } from 'angularx-qrcode';

// Service
import { QrService, CrearQrDto, QrCreated } from '../../services/qr/qr.service';

export interface QrCreateDialogData {
  defaultSurtidor?: number;
}

@Component({
  selector: 'app-qr-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QRCodeComponent,
    // Material
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './qr-create.component.html',
  styleUrls: ['./qr-create.component.scss'],
})
export class QrCreateDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private qrService = inject(QrService);
  private dialogRef =
    inject<MatDialogRef<QrCreateDialogComponent, QrCreated | undefined>>(MatDialogRef);
  data = inject<QrCreateDialogData>(MAT_DIALOG_DATA);

  qrForm!: FormGroup;
  cargando = false;
  errorMsg = '';
  resultado?: QrCreated;

  @ViewChild(QRCodeComponent) qrCmp?: QRCodeComponent;

  surtidores = [1, 2, 3, 4];
  combustibles: Array<'Súper' | 'Premium' | 'Diésel'> = ['Súper', 'Premium', 'Diésel'];

  ngOnInit(): void {
    this.qrForm = this.fb.group({
      surtidor: [
        1,
        //[Validators.required]
      ],
      combustible: [
        'Súper', //[Validators.required]
      ],
      tipo: [
        'monto', // [Validators.required]
      ],
      monto: [
        0, //[Validators.min(1)]
      ],
      litros: [
        0, // [Validators.min(0.1)]
      ],
      venceMin: [
        30, // [Validators.required, Validators.min(1)]
      ],
      nota: [''],
    });

    this.qrForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      if (tipo === 'monto') {
        this.qrForm.get('monto')?.setValidators([Validators.required, Validators.min(1)]);
        this.qrForm.get('litros')?.clearValidators();
        this.qrForm.get('litros')?.setValue(0);
      } else {
        this.qrForm.get('litros')?.setValidators([Validators.required, Validators.min(0.1)]);
        this.qrForm.get('monto')?.clearValidators();
        this.qrForm.get('monto')?.setValue(0);
      }
      this.qrForm.get('monto')?.updateValueAndValidity();
      this.qrForm.get('litros')?.updateValueAndValidity();
    });
  }

  crear(): void {
    this.errorMsg = '';
    this.resultado = undefined;

    if (this.qrForm.invalid) {
      this.qrForm.markAllAsTouched();
      return;
    }

    const tipo = this.qrForm.value.tipo as 'monto' | 'litros';
    const dto: CrearQrDto = {
      surtidor: Number(this.qrForm.value.surtidor),
      combustible: this.qrForm.value.combustible,
      tipo,
      valor: tipo === 'monto' ? Number(this.qrForm.value.monto) : Number(this.qrForm.value.litros),
      venceMin: Number(this.qrForm.value.venceMin),
      nota: this.qrForm.value.nota || undefined,
    };

    this.cargando = true;
    this.qrService.crearQr(dto).subscribe({
      next: (res) => {
        // Si tu backend no manda paymentUrl, lo construimos:
        this.resultado = {
          ...res,
          paymentUrl: res.paymentUrl || `https://miestacion.com/pagar/${res.id}`,
        };
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMsg = 'No se pudo generar el QR. Intentá nuevamente.';
        this.cargando = false;
      },
    });
  }

  descargarPNG(): void {
    if (!this.qrCmp) return;
    // angularx-qrcode expone el elemento renderizado en qrcElement.nativeElement
    const canvas: HTMLCanvasElement = this.qrCmp.qrcElement.nativeElement as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${this.resultado?.id || 'qr'}.png`;
    a.click();
  }

  cerrar(): void {
    this.dialogRef.close(this.resultado);
  }

  resetForm(): void {
    this.qrForm.reset({
      surtidor: 1,
      combustible: 'Súper',
      tipo: 'monto',
      monto: 0,
      litros: 0,
      venceMin: 30,
      nota: '',
    });
    this.resultado = undefined;
    this.errorMsg = '';
  }

  imprimirQR(): void {
    window.print();
  }

  get mostrarCampoMonto(): boolean {
    return this.qrForm.get('tipo')?.value === 'monto';
  }
}
