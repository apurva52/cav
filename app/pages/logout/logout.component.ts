import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { Router, RouterEvent, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LogoutComponent implements OnInit {

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
  //   const me = this;
  //   me.router.events.subscribe((re: RouterEvent) => {
  //     me.onRouterEvent(re);
  //   });
  //   me.sesionService.logout();
  }

  // private onRouterEvent(event: RouterEvent) {
  //   const me = this;
  //   if (event instanceof NavigationStart) {
  //     if (event.url === '/logout') {
  //       me.sesionService.logout();
  //     }
  //   }
  // }
}
