import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoCambioService } from '../../services/tipo-cambio.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';


@Component({
  selector: 'app-tipo-cambio-config',
  templateUrl: './tipo-cambio-config.component.html',
  styleUrls: ['./tipo-cambio-config.component.css']
})
export class TipoCambioConfigComponent implements OnInit {
  public form: FormGroup;
  public valorActual: number;
  public historial = [];
  public waitAction: boolean;

  constructor(private tipoCambioService: TipoCambioService, private storageService: StorageService) {
    this.form = new FormGroup({
      valor: new FormControl(null, [Validators.required, Validators.min(0.01)])
    });
  }

  ngOnInit() {
    this.chargeData();
  }

  chargeData() {
    this.waitAction = true;
    this.tipoCambioService.getActual().subscribe(result => {
      this.valorActual = result ? result.valor : null;
      this.waitAction = false;
    });
    this.tipoCambioService.getHistorial().subscribe(result => {
      this.historial = result;
    });
  }

  guardarTipoCambio() {
    const token = this.storageService.parse(IStorageKeys.Token);
    const nuevo = {
      valor: this.form.get('valor').value,
      createBy: token && token['userId'] ? Number(token['userId']) : 0
    };
    this.tipoCambioService.crearTipoCambio(nuevo).subscribe(() => {
      this.form.reset();
      this.chargeData();
    });
  }
}
