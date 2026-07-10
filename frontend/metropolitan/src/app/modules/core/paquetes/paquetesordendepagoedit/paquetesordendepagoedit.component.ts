import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OrdenPago } from '../../../../shared/model/orden-pago';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { PaqueteOrdenPagoService } from '../../services/paquetes/paquete-orden-pago.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'app-paquetesordendepagoedit',
  templateUrl: './paquetesordendepagoedit.component.html',
  styleUrls: ['./paquetesordendepagoedit.component.css']
})
export class PaquetesordendepagoeditComponent implements OnInit {

  public form: FormGroup;
  token: any;
  ordenID: string;
  isEdit: boolean;
  localOrdenPago: OrdenPago;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private ordenPagoListService: PaqueteOrdenPagoService
  ) {
    this.form = new FormGroup({
      fechaRegistro: new FormControl(),
      numeroOrden: new FormControl(),
      montoPagado: new FormControl(),
      montoPagadoBs: new FormControl(),
      listaAccion: new FormControl()
    })
  }

  ngOnInit() {
    this.token = this.storage.get(IStorageKeys.Token);

    this.route.paramMap.subscribe(param => {
      let operadorParam = param;
      this.ordenID = operadorParam["params"].id;
      if (this.ordenID) {
        this.isEdit = true;
        this.ordenPagoListService.getOrdenPago(this.ordenID).subscribe(data => {
          if (data.anulado != 0) {
            this.form.get("listaAccion").setValue(data.anulado.toString());
            this.form.get("listaAccion").disable({ emitEvent: false, onlySelf: false });
          }
          this.form.get("fechaRegistro").setValue(data.fechaPago);
          this.form.get("numeroOrden").setValue(data.numeroPago);
          this.form.get("montoPagado").setValue(data.montoAPagar);
          this.form.get("montoPagadoBs").setValue(data.montoAPagar * 6.96);
          this.form.get("fechaRegistro").disable({ emitEvent: false, onlySelf: false });
          this.form.get("numeroOrden").disable({ emitEvent: false, onlySelf: false });
          this.form.get("montoPagado").disable({ emitEvent: false, onlySelf: false });
          this.form.get("montoPagadoBs").disable({ emitEvent: false, onlySelf: false });
          this.localOrdenPago = data;
        });
      }
    });
  }

  onChange() {

  }

  updateDatePayment() {

  }

  updateOrdenPago() {
    this.localOrdenPago.anulado = this.form.get("listaAccion").value;
    this.ordenPagoListService.updateOrdenPago(this.localOrdenPago).subscribe(result => {
      this.router.navigate(['/main/paquetes/reporte-orden-pago']);
    });
  }

}
