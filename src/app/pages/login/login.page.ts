import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticateService } from '@shared/services/authenticate.service';
import { Credentials } from '@shared/interfaces/users.interface';
import { Router } from '@angular/router';
import to from 'await-to-js';
import { LoadingService } from '@app/shared/services/loading.service';
import { PagesService } from '@shared/services/pages.service';
import { KEY_USER_LOGGED } from '@shared/utils/constants';
import { StorageService } from '@shared/services/storage.service';
import { ModalInfoComponent } from '@shared/components/modal-info/modal-info.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(ModalInfoComponent) modalInfo: ModalInfoComponent;

  formLogin: FormGroup;

  isErrorLogin = false;

  isResetForm = false;

  constructor(
    private fb: FormBuilder,
    private authenticateService: AuthenticateService,
    private router: Router,
    private loadingService: LoadingService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.formLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}')]
        ],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.createValuesChanges();
  }

  createValuesChanges(): void {
    this.formLogin.valueChanges.subscribe(() => {
      if (this.isErrorLogin && !this.isResetForm) {
        this.isErrorLogin = false;
      }

      if (this.isResetForm) {
        this.isResetForm = false;
      }
    });
  }

  get emailNotValid(): boolean {
    return this.formLogin.get('email').invalid && this.formLogin.get('email').touched;
  }

  get passwordNotValid(): boolean {
    return this.formLogin.get('password').invalid && this.formLogin.get('password').touched;
  }

  async login(): Promise<void> {
    if (this.formLogin.invalid) {
      Object.values(this.formLogin.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      const dataLogin: Credentials = this.formLogin.getRawValue();
      await this.loadingService.createLoading('Iniciando sesión...');

      const [error, responseToken] = await to(this.authenticateService.authenticate(dataLogin).toPromise());

      if (error) {
        this.isErrorLogin = true;
        this.isResetForm = true;
        this.formLogin.get('password').reset();
        this.openModalInfo('Error de Conexión', 'Fallo de comunicación con la plataforma', true);
      } else {
        await this.authenticateService.getProfileUser().toPromise();

        if (PagesService.test) {
          localStorage.setItem(KEY_USER_LOGGED, JSON.stringify(this.authenticateService.getUserLogin()));
        } else {
          await this.storageService.setStorage(KEY_USER_LOGGED, JSON.stringify(this.authenticateService.getUserLogin()));
        }

        this.formLogin.reset();
        this.router.navigate(['/job-list']);
      }

      this.loadingService.loading.dismiss();
    }
  }

  openModalInfo(title: string, description: string, isSuccess: boolean): void {
    this.modalInfo.openModal(title, description, isSuccess);
  }
}
