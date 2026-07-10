import { Component, OnInit, SkipSelf, Self, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../../services/authentication.services';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from './../../../../shared/services/local-data/storage';
import { LoginFormService, LoginFormFieldNames } from '../../services/ui/login-form.service';
import { IDynamicInputField, IInputType, IInputGroupTypes, IInputExtraFn } from './../../../../shared/services/ui/form-field';
import { NzMessageService } from 'ng-zorro-antd';
import { LogsService } from '../../../core/services/Logs/logs.services';
import { Logs } from '../../../../shared/model/Logs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  userFieldConfig: IDynamicInputField;
  passwordFieldConfig: IDynamicInputField;
  passwordVisible = false;
  form: FormGroup;
  logs: Logs;
  waitAction = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private storage: StorageService,
    private loginFormService: LoginFormService,
    private message: NzMessageService,
    private logsService: LogsService
  ) {
    this.form = new FormGroup({
      usuario: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit() {    
  }

  login() {
    let usuario = this.form.get("usuario").value;
    let password = this.form.get("password").value;
    this.authenticationService.login(usuario, password).subscribe(
      data => {
        
        this.waitAction = false;
        this.storage.set(IStorageKeys.CurrentUser, this.storage.stringify(data));
        const currentUser = this.storage.parse(IStorageKeys.CurrentUser);
        const currentUserBodyToken = currentUser._body;
        this.storage.set(
          IStorageKeys.Token, this.storage.stringify(this.storage.parseByValue(currentUserBodyToken)));
        const token = this.storage.parse(IStorageKeys.Token);
        const tokenInfo = token;
        this.storage.set(IStorageKeys.TokenInfo, this.storage.stringify(tokenInfo));

        this.logs = {
          id: "00000000-0000-0000-0000-000000000000",
          eventShoot: "Login",
          fromEvent: "Login Page",
          idSucursal: token["sucursal"],
          itemUsed: "",
          userEvent: token["userId"],
          createDate: "1/1/2020 01:01:00"
        }
        this.logsService.saveLogItem(this.logs).subscribe(success => {
          this.router.navigate(['./main']);
        });
        
      },
      error => {
        this.message.create('error', "Usuario o Password Incorrecto");
      })
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
