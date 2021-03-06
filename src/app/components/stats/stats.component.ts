import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Stats} from '../../models/stats';
import {GameService} from '../../services/game.service';
import {Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy, AfterViewInit {
  // @ts-ignore
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  dataSource: MatTableDataSource<Stats>;
  displayedColumns: string[] = ['winCount', 'user'];
  subscriptions: Subscription[] = [];

  constructor(private gameService: GameService,
              private notificationService: NotificationService) {
    this.dataSource = new MatTableDataSource<Stats>();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.gameService.getGameStats().subscribe((resp) => {
        this.dataSource = new MatTableDataSource<Stats>(resp);
      },
      (() => {
        this.notificationService.createNotification('Unable to fetch statistics.');
      })));
  }

}
