import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point, Card, CollectionCard, Badge } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService,PointService,GroupService, AlertService, QuestionnaireService, CollectionService, BadgeService, SchoolService } from '../../shared/services/index';



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

  public image: string;
  public badgeSelected: string;

  public badges: Array<Badge> = new Array<Badge>();


  public newCollection: CollectionCard;
  public returnedCollection: CollectionCard;

  constructor(
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
    this.newCollection.createdBy = String(this.utilsService.currentUser.userId);
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
        this.snackbar.open("Nova col·lecció creada !","",{duration:2000});
        this.cancel();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));




    }
    else{
      this.snackbar.open("S'han d'omplir tots els camps", "Advertencia", {duration:2000})



    }





  }
  cancel(): void {
    this.dialogRef.close();
  }


}
