import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, GroupService, AlertService, PointRelationService, PointService, BadgeService, SchoolService } from '../../shared/services/index';



@Component({
  selector: 'app-pointsbadges',
  templateUrl: './pointsbadges.html',
  styleUrls: ['./pointsbadges.scss']
})
export class PointsBadgesComponent implements OnInit {

  public returnUrl:string;
  public badges: Array<Badge>
  public stringData = [];
  public numberData = [];

  public name: string;
  public time: number;
  public number: number;
  public date: string;
  public selected: string;
  public result: string;
  public num = 0;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointRelationService: PointRelationService,
    public pointService: PointService,
    public badgeService: BadgeService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PointsBadgesComponent>)
   // @Inject(MAT_DIALOG_DATA) public data: any)
   {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pointsbadges';
   this.loadingService.show();

    if (this.utilsService.role === Role.TEACHER) {
      this.schoolService.getMySchoolBadges().subscribe(
        ((badges: Array<Badge>) => {
          this.badges = badges;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      this.loadingService.show();

    }
  }

  /*cancel(): void {
    this.dialogRef.close();

  }*/

}
