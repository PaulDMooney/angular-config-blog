import { Component, OnInit } from '@angular/core';
import { ServerTimeService } from './server-time.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'config-demo';

  serverTime: string;

  constructor(private serverTimeService: ServerTimeService) {}

  ngOnInit(): void {

    // Would be good to unsubscribe on destroy, but let's keep this simple.
    this.serverTimeService.getTime().subscribe(result => {
      this.serverTime = result;
    });
  }
}
