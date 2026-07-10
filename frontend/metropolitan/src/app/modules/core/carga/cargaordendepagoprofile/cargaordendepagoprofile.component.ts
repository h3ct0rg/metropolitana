import { Component, OnInit, ViewChild } from '@angular/core';
import { CargaordendepagonotaComponent } from '../cargaordendepagonota/cargaordendepagonota.component';

@Component({
  selector: 'app-cargaordendepagoprofile',
  templateUrl: './cargaordendepagoprofile.component.html',
  styleUrls: ['./cargaordendepagoprofile.component.css']
})
export class CargaordendepagoprofileComponent implements OnInit {

  @ViewChild('listPays', { static: false }) childPays: CargaordendepagonotaComponent;

  constructor() { }

  ngOnInit() {
  }

}
