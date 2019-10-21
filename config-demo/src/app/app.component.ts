import { Component, OnInit } from '@angular/core';
import { ServerTimeService } from './server-time.service';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'config-demo';

  serverTime: string;

  configValues: string;

  constructor(private serverTimeService: ServerTimeService, private configService: ConfigService) {}

  ngOnInit(): void {

    // Would be good to unsubscribe on destroy, but let's keep this simple.
    this.serverTimeService.getTime().subscribe(result => {
      this.serverTime = result;
    });

    this.configService.getConfig().subscribe(result => {
      this.configValues = JSON.stringify(result);
    });
  }
}
