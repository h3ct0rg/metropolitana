import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'usuario-list',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.css']
})
export class UsuarioListComponent implements OnInit {
  listOfData = [];

  constructor(private usuarioService: UsuarioService) {

  }

  ngOnInit() {
    this.chargeDataCLient();
  }
  chargeDataCLient() {
    this.usuarioService.getUsersList().subscribe((data: []) => {
      this.listOfData = data;
    });
  }

}
