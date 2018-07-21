import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';
import{ TranslateService} from 'ng2-translate';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point, Card, CollectionCard, Badge, Profile } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, UserService, PointService, GroupService, AlertService, QuestionnaireService, CollectionService, BadgeService, SchoolService } from '../../shared/services/index';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './createCollection.html',
  styleUrls: ['./createCollection.scss']
})
export class CreateCollectionComponent implements OnInit {
  myControl = new FormControl();
  public collectionId: string;
  public name: string;
  public num: number;
  public result: number;

  public image: string;
  public badgeSelected: string;

  public badges: Array<Badge> = new Array<Badge>();


  public newCollection: CollectionCard;
  public returnedCollection: CollectionCard;

  constructor(
    public userService: UserService,
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointService: PointService,
    public schoolService: SchoolService,
    public collectionService: CollectionService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateCollectionComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

  }

  ngOnInit(): void {

    this.schoolService.getMySchoolBadges().subscribe(
      ((badges: Array<Badge>) => {
        this.badges = badges;
        this.loadingService.hide();


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));



  }
  createNewCollection(): void{

    if(this.name != "" && this.num &&  this.image!="")
    {
    this.newCollection = new CollectionCard();
    this.newCollection.name = this.name;
    this.newCollection.num = String(this.num);
    this.newCollection.image = this.image;
    this.userService.getMyProfile().subscribe(
      ((pr: Profile)=>{

        this.newCollection.createdBy = pr.username;

    if(this.badgeSelected!= "none")
    {
      this.newCollection.badgeId = this.badgeSelected;
    }
    else{
      this.newCollection.badgeId = null;
    }
    this.loadingService.hide();

    this.collectionService.postCollection(this.newCollection).subscribe(
      ((returnedCollection: CollectionCard) => {
        this.returnedCollection = returnedCollection;
        this.loadingService.hide();
        this.alertService.show(this.translateService.instant('COLLECTIONS.CREATED'));

        this.dialogRef.afterClosed().subscribe(result => {
          this.result = result;
          this.ngOnInit();
        });
        this.cancel();

      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

      })
    ),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      });

    }
    else{
      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }


}
