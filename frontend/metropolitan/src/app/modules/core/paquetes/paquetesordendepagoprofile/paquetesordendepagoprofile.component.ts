import { Component, OnInit, ViewChild } from '@angular/core';
import { PaquetesordendepagonotaComponent } from '../paquetesordendepagonota/paquetesordendepagonota.component';

@Component({
  selector: 'app-paquetesordendepagoprofile',
  templateUrl: './paquetesordendepagoprofile.component.html',
  styleUrls: ['./paquetesordendepagoprofile.component.css']
})
export class PaquetesordendepagoprofileComponent implements OnInit {

  @ViewChild('listPays', { static: false }) childPays: PaquetesordendepagonotaComponent;

  constructor() { }

  ngOnInit() {
  }

}
