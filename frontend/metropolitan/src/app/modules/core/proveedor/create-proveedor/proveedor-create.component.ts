import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from "@angular/forms";
import { ProveedorService } from '../../services/proveedor.services';
import { Proveedor } from '../../../../shared/model/proveedor';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'proveedor-create',
  templateUrl: './proveedor-create.component.html',
  styleUrls: ['./proveedor-create.component.css']
})
export class ProveedorCreateComponent implements OnInit {

  public form: FormGroup;
  private proveedor: Proveedor;
  private proveedorId: number;
  private isEdit: boolean;
  constructor(private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = new FormGroup({
      nombreProveedor: new FormControl(),
      direccionProveedor: new FormControl(),
      telefonoProveedor: new FormControl(),
    });
    this.proveedor = {
      id: 0,
      name: "test",
      telefono: "32344",
      direccion : "44534534",
      createBy: 0,
      modify: 0,
      createDate: "0001-01-01T00:00:00",
      modifyDate: "0001-01-01T00:00:00"
    };
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      let proveedorParam = param;
      this.proveedorId = proveedorParam["params"].id;
      if (this.proveedorId) {
        this.isEdit = true;
        this.loadFarmInformation(this.proveedorId);
      }
    });

  }

  loadFarmInformation(clienteId) {
    this.proveedorService.getProveedor(clienteId).subscribe((result) => {
      this.proveedorId = clienteId;
      this.form.get("nombreProveedor").setValue(result.name);
      this.form.get("telefonoProveedor").setValue(result.telefono);
      this.form.get("direccionProveedor").setValue(result.direccion);      
    });

  }

  saveProveedor() {
    
    this.proveedor.name = this.form.get("nombreProveedor").value;
    this.proveedor.telefono = this.form.get("telefonoProveedor").value;
    this.proveedor.direccion = this.form.get("direccionProveedor").value;
    if (this.isEdit) {
      this.proveedor.id = this.proveedorId;
      this.proveedorService.updateProveedor(this.proveedor).subscribe((data) => {
        this.router.navigate(['/main/proveedor']);
      });
    }
    else {
      this.proveedorService.savetProveedorItem(this.proveedor).subscribe((data) => {
        this.router.navigate(['/main/proveedor']);
      });
    }
  }
}
