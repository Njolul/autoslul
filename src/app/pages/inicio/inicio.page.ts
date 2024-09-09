import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  usuarioCorreo: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { usuarioCorreo: string };
      this.usuarioCorreo = state.usuarioCorreo;
    }
  }
}

