import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point, Card, CollectionCard } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService,PointService, GroupService, AlertService, QuestionnaireService, CollectionService } from '../../shared/services/index';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './createCollection.html',
  styleUrls: ['./createCollection.scss']
})
export class CreateCollectionComponent implements OnInit {
  public collectionId: string;
  public name: string;
  public num: number;

  public image: string;


  public newCollection: CollectionCard;
  public returnedCollection: CollectionCard;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointService: PointService,
    public collectionService: CollectionService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateCollectionComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

  }

  ngOnInit(): void {



  }
  createNewCollection(): void{

    if(this.name != "" && this.num &&  this.image!="")
    {
    this.newCollection = new CollectionCard();
    this.newCollection.name = this.name;
    this.newCollection.num = String(this.num);
    this.newCollection.image = this.image;
    this.newCollection.createdBy = this.utilsService.currentUser.id;

    this.loadingService.hide();

    this.collectionService.postCollection(this.newCollection).subscribe(
      ((returnedCollection: CollectionCard) => {
        this.returnedCollection = returnedCollection;
        this.loadingService.hide();
        this.snackbar.open("Nova col·lecció creada !");
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
