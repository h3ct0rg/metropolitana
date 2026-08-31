import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.services';
import { CuentaBancaria } from '../../../../shared/model/cuenta-bancaria';

@Component({
  selector: 'app-cuenta-bancaria-create',
  templateUrl: './cuenta-bancaria-create.component.html',
  styleUrls: ['./cuenta-bancaria-create.component.css']
})
export class CuentaBancariaCreateComponent implements OnInit {
  public form: FormGroup;
  public cuentaBancaria: CuentaBancaria;
  public isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cuentaBancariaService: CuentaBancariaService
  ) {
    this.form = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      moneda: new FormControl('USD', [Validators.required]),
      activo: new FormControl(true)
    });

    this.cuentaBancaria = {
      id: 0, nombre: '', moneda: 'USD', activo: true, createBy: 0, createDate: '0001-01-01T00:00:00'
    };
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cuentaBancariaService.getCuentaBancaria(id).subscribe(result => {
        this.cuentaBancaria = result;
        this.form.patchValue({
          nombre: result.nombre,
          moneda: result.moneda,
          activo: result.activo
        });
      });
    }
  }

  saveCuentaBancaria() {
    this.cuentaBancaria.nombre = this.form.get('nombre').value;
    this.cuentaBancaria.moneda = this.form.get('moneda').value;
    this.cuentaBancaria.activo = this.form.get('activo').value;

    if (this.isEdit) {
      this.cuentaBancariaService.updateCuentaBancaria(this.cuentaBancaria).subscribe(() => {
        this.router.navigate(['/main/cuenta-bancaria']);
      });
    } else {
      this.cuentaBancariaService.saveCuentaBancaria(this.cuentaBancaria).subscribe(() => {
        this.router.navigate(['/main/cuenta-bancaria']);
      });
    }
  }
}
