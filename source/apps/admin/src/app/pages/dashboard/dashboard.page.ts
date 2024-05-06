import { Component, OnInit } from '@angular/core';
import { appConfig } from '@seyconel/config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'seyconel-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  appConfig = appConfig;

  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
