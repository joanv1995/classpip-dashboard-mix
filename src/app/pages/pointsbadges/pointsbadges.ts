import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import {FormControl, FormsModule} from '@angular/forms';

import { Login, Group, Role, Questionnaire, Point, Badge, Student, PointRelation, BadgeRelation } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, BadgeRelationService, GroupService, AlertService, PointRelationService, PointService, BadgeService, SchoolService } from '../../shared/services/index';
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
  myControl = new FormControl();
  public returnUrl: string;

  public badges: Array<Badge>;
  public badgeId: string;
  public resultDeleteBadge: number;

  public mygroups: Array<Group>;
  public mystudents: Array<Student>;
  public groupSelected: string;
  public studentSelected: string;
  public groupSelected2: string;
  public studentSelected2: string;
  public pointSelected: string;
  public badgeSelected: string;
  public valueSelected: number;
  public points: Array<Point>;
  public pointId: string;
  public resultDeletePoint: number;

  public responsePointRelation: PointRelation;
  public responseBadgeRelation: BadgeRelation;


  public resultCreate: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public groupService: GroupService,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointRelationService: PointRelationService,
    public badgeRelationService: BadgeRelationService,
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


      this.groupService.getMyGroups().subscribe(
        ((mygroups: Array<Group>) => {
          this.mygroups = mygroups;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));



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
  public openStudents(){


          if( this.groupSelected)
          {
            this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
            ((mystudents: Array<Student>) => {
              this.mystudents = mystudents;
              this.loadingService.hide();


            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
          }

  }
  public openStudents2(){


    if( this.groupSelected2)
    {
      this.groupService.getMyGroupStudents(this.groupSelected2).subscribe(
      ((mystudents: Array<Student>) => {
        this.mystudents = mystudents;
        this.loadingService.hide();


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }

}
sendBadgeRelation(){


  if(!this.groupSelected2 || !this.studentSelected2 || !this.badgeSelected)
  {

    this.snackbar.open("S'han d'omplir tots els camps", "Insígnia no assignada",{duration:2000})

  }
 else {
  this.badgeRelationService.postBadgeRelation(this.badgeSelected,this.studentSelected2,this.utilsService.currentSchool.id,this.groupSelected2,1).subscribe(
    ((responseBadgeRelation: BadgeRelation) => {
      this.responseBadgeRelation = responseBadgeRelation;
      this.loadingService.hide();

      this.snackbar.open("Insígnia guardada !");


    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));



  }





}
  sendPointRelation()
  {
    if(!this.groupSelected || !this.studentSelected || !this.pointSelected || !this.valueSelected)
    {

      this.snackbar.open("S'han d'omplir tots els camps", "Punts no enviants",{duration:2000})

    }
   else {
    this.pointRelationService.postPointRelation(this.pointSelected,this.studentSelected,this.utilsService.currentSchool.id,this.groupSelected,this.valueSelected).subscribe(
      ((responsePointRelation: PointRelation) => {
        this.responsePointRelation = responsePointRelation;
        this.loadingService.hide();

        this.snackbar.open("Punts guardats !");


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
