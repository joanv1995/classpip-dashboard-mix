import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point, Card } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService,PointService, GroupService, AlertService, QuestionnaireService, CollectionService } from '../../shared/services/index';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './createCard.html',
  styleUrls: ['./createCard.scss']
})
export class CreateCardComponent implements OnInit {
  public myControl: FormControl = new FormControl();
  public collectionId: string;
  public name: string;
  public rank: string;
  public ratio: string;

  public image: string;
  public newPoint: Point;
  public ranks = [];
  public pictures = [];
  public ratios = [];

  public newCard: Card;
  public returnedCard: Card;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointService: PointService,
    public collectionService: CollectionService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateCardComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    this.collectionId = data.name;

    this.ranks.push("diamante");
    this.ranks.push("oro");
    this.ranks.push("plata");
    this.ranks.push("bronce");


    this.ratios.push("raro");
    this.ratios.push("bajo");
    this.ratios.push("medio");
    this.ratios.push("alto");





  }

  ngOnInit(): void {



  }
  createNewCard(): void{

    if(this.name != "" && this.ratio != "" && this.rank != "" && this.image!="")
    {
    this.newCard = new Card();
    this.newCard.name = this.name;
    this.newCard.rank = this.rank;
    this.newCard.ratio = this.ratio;
    this.newCard.image = this.image;
    this.newCard.collectionId = this.collectionId;


    this.loadingService.hide();

    this.collectionService.postCard(this.newCard).subscribe(
      ((returnedCard: Card) => {
        this.returnedCard = returnedCard;
        this.loadingService.hide();
        this.snackbar.open("Nova carta creada i introduïda a la col·lecció !","",{duration:2000});

      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

      this.cancel();




    }
    else{
      this.snackbar.open("S'han d'omplir tots els camps", "Advertencia", {duration:2000})



    }





  }
  cancel(): void {
    this.dialogRef.close();
  }


}
