import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Modernize Angular Admin Tempplate';

  constructor(private router: Router) {
    this.router.events.subscribe((e: Event) => {
      try {
        if (e instanceof NavigationStart) {
          // eslint-disable-next-line no-console
          console.debug('[Router] NavigationStart', e.url);
        } else if (e instanceof NavigationEnd) {
          // eslint-disable-next-line no-console
          console.debug('[Router] NavigationEnd', e.url);
        } else if (e instanceof NavigationCancel) {
          // eslint-disable-next-line no-console
          console.debug('[Router] NavigationCancel', e.url, 'reason:', (e as any).reason || 'n/a');
        } else if (e instanceof NavigationError) {
          // eslint-disable-next-line no-console
          console.error('[Router] NavigationError', e.url, e.error);
        }
      } catch (err) {}
    });
  }
}
