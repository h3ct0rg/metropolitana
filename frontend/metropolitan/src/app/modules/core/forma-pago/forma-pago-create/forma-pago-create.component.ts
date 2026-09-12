import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormaPagoService } from '../../services/forma-pago.services';
import { FormaPago } from '../../../../shared/model/forma-pago';

@Component({
  selector: 'app-forma-pago-create',
  templateUrl: './forma-pago-create.component.html',
  styleUrls: ['./forma-pago-create.component.css']
})
export class FormaPagoCreateComponent implements OnInit {
  public form: FormGroup;
  public formaPago: FormaPago;
  public isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formaPagoService: FormaPagoService
  ) {
    this.form = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      moneda: new FormControl('USD', [Validators.required]),
      areaTravelace: new FormControl(true),
      areaPaquetes: new FormControl(true),
      areaCarga: new FormControl(true),
      requiereCuentaBancaria: new FormControl(false),
      activo: new FormControl(true),
      orden: new FormControl(0)
    });

    this.formaPago = {
      id: 0, nombre: '', moneda: 'USD', areasAplicables: '', requiereCuentaBancaria: false,
      activo: true, orden: 0, createBy: 0, createDate: '0001-01-01T00:00:00'
    };
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.formaPagoService.getFormaPago(id).subscribe(result => {
        this.formaPago = result;
        const areas = (result.areasAplicables || '').split(',');
        this.form.patchValue({
          nombre: result.nombre,
          moneda: result.moneda,
          areaTravelace: areas.includes('TRAVELACE'),
          areaPaquetes: areas.includes('PAQUETES'),
          areaCarga: areas.includes('CARGA'),
          requiereCuentaBancaria: result.requiereCuentaBancaria,
          activo: result.activo,
          orden: result.orden
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/main/forma-pago']);
  }

  private buildAreas(): string {
    const areas = [];
    if (this.form.get('areaTravelace').value) areas.push('TRAVELACE');
    if (this.form.get('areaPaquetes').value) areas.push('PAQUETES');
    if (this.form.get('areaCarga').value) areas.push('CARGA');
    return areas.join(',');
  }

  saveFormaPago() {
    this.formaPago.nombre = this.form.get('nombre').value;
    this.formaPago.moneda = this.form.get('moneda').value;
    this.formaPago.areasAplicables = this.buildAreas();
    this.formaPago.requiereCuentaBancaria = this.form.get('requiereCuentaBancaria').value;
    this.formaPago.activo = this.form.get('activo').value;
    this.formaPago.orden = this.form.get('orden').value;

    if (this.isEdit) {
      this.formaPagoService.updateFormaPago(this.formaPago).subscribe(() => {
        this.router.navigate(['/main/forma-pago']);
      });
    } else {
      this.formaPagoService.saveFormaPago(this.formaPago).subscribe(() => {
        this.router.navigate(['/main/forma-pago']);
      });
    }
  }
}
