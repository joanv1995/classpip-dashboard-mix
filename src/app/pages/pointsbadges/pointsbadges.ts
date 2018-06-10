import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, GroupService, AlertService, PointRelationService, PointService, BadgeService, SchoolService } from '../../shared/services/index';
import { CreatePointComponent } from '../../pages/createPoint/createPoint';
import { DeletePointComponent } from '../../pages/deletePoint/deletePoint';
import { CreateBadgeComponent } from '../../pages/createBadge/createBadge';
import { DeleteBadgeComponent } from '../../pages/deleteBadge/deleteBadge';



@Component({
  selector: 'app-pointsbadges',
  templateUrl: './pointsbadges.html',
  styleUrls: ['./pointsbadges.scss']
})
export class PointsBadgesComponent implements OnInit {

  public returnUrl: string;

  public badges: Array<Badge>;
  public badgeId: string;
  public resultDeleteBadge: number;

  public points: Array<Point>;
  public pointId: string;
  public resultDeletePoint: number;

  public resultCreate: string;

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
    public snackbar: MatSnackBar
    )
   {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pointsbadges';

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

        this.schoolService.getMySchoolPoints().subscribe(
          ((points: Array<Point>) => {
            this.points = points;
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));


    }

  }
  public createPoint() {
    const dialogRef = this.dialog.open(CreatePointComponent, {
      height: '600px',
      width: '700px',
    });


    dialogRef.afterClosed().subscribe(result => {
      this.resultCreate = result;
      this.ngOnInit();
    });
  }
  public deletePoint() {

    if(this.pointId.length > 0)
    {
      let dialogRef = this.dialog.open(DeletePointComponent, {
        height: '400px',
        width: '600px',
        data: { name: this.pointId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.resultDeletePoint = result;
        this.ngOnInit();
      });
    }
    else{

      this.snackbar.open("Introduir identificador de Punt", "Error",{duration:2000});

    }
  }

  public createBadge() {
    const dialogRef = this.dialog.open(CreateBadgeComponent, {
      height: '600px',
      width: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.resultCreate = result;
      this.ngOnInit();
    });
  }
  public deleteBadge() {

    if(this.badgeId.length > 0)
    {
      let dialogRef = this.dialog.open(DeleteBadgeComponent, {
        height: '400px',
        width: '600px',
        data: { name: this.badgeId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.resultDeleteBadge = result;
        this.ngOnInit();
      });
    }
    else{

      this.snackbar.open("Introduir identificador d'Insígnia", "Error",{duration:2000});

    }
  }
  /*cancel(): void {
    this.dialogRef.close();

  }*/

}
