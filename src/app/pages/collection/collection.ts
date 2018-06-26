import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card, Student } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, GroupService, AlertService, CollectionService, SchoolService } from '../../shared/services/index';
import { CreateCardComponent } from '../createCard/createCard';
import { DeleteCardComponent } from '../deleteCard/deleteCard';
import { FormControl } from '@angular/forms';




@Component({
  //selector: 'app-collections',
  templateUrl: './collection.html',
  styleUrls: ['./collection.scss']
})
export class CollectionComponent implements OnInit {
  myControl = new FormControl();
  isTeacher: boolean = false;
  public cardSelected: string;
  public optionType: string;
  public groupSelected: string;
  public studentSelected: string;
  public returnUrl: string;
  public result: number;
  public collectionCards: Array<Card>;
  public collectionGroups: Array<Group>;
  public collectionStudents: Array<Student>;
  public cardId: string;

  public sub: any;
  public collectionCardId: string;
  public cards = [];
  public options = ["Assignar una carta","Assignar tres cartes aleatòries","Assignar cinc cartes aleatòries"];



  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public collectionService: CollectionService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
    )
   {



    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/collection';

   this.sub = this.route.params.subscribe(params => {
    this.collectionCardId = params['id'];
  });

    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
      this.collectionService.getCollectionDetails(this.collectionCardId).subscribe(
        ((collectionCards: Array<Card>) => {
          this.collectionCards = collectionCards;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

       this.collectionService.getAssignedGroups(this.collectionCardId).subscribe(
          ((groups: Array<Group>) => {
            this.collectionGroups = groups;
            this.loadingService.hide();




          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));

    }

  }



 public createCard() {


      let dialogRef = this.dialog.open(CreateCardComponent, {
        height: '600px',
        width: '800px',
        data: { name: this.collectionCardId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.result = result;
        this.ngOnInit();
      });

  }
 public deleteCard() {


    let dialogRef = this.dialog.open(DeleteCardComponent, {
      height: '600px',
      width: '800px',
      data: { name: this.cardId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      this.ngOnInit();
    });

  }
  public showStudents(){

    if(this.groupSelected)
    {



      this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
        ((students: Array<Student>) => {
          this.collectionStudents = students;
          this.loadingService.hide();





        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));





    }
  }
  public assignCardsToStudent(){

    if(this.optionType)
    {
    switch (this.optionType){
      case "Assignar una carta":
      if(this.studentSelected && this.cardSelected && this.groupSelected)
      {
        this.collectionService.assignCardToStudent(this.studentSelected,this.cardSelected).subscribe(
          ((collectionCards: Array<Card>) => {
            this.loadingService.hide();

            this.snackbar.open("Carta assignada correctament","",{duration:2000})


          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      }
      else{
        this.snackbar.open("S'han d'omplir tots els camps", "Error",{duration:2000});


      }


      case "Assignar tres cartes aleatòries":



      if(this.studentSelected  && this.groupSelected)
      {
        for(var i = 0; i < 3;i++)
        {
        var numcard = this.randomNumber(1,this.collectionCards.length -1);

          this.collectionService.assignCardToStudent(this.studentSelected, numcard).subscribe(
            ((collectionCards: Array<Card>) => {
              this.loadingService.hide();




            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));



        }


      }
      else{
        this.snackbar.open("S'han d'omplir tots els camps", "Error",{duration:2000});


      }

      case "Assignar tres cartes aleatòries":


      if(this.studentSelected  && this.groupSelected)
      {
        for(var i = 0; i < 5;i++)
        {
          var numcard = this.randomNumber(0,this.collectionCards.length)

          this.collectionService.assignCardToStudent(this.studentSelected, numcard).subscribe(
            ((collectionCards: Array<Card>) => {
              this.loadingService.hide();




            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));



        }


      }

      else{
        this.snackbar.open("S'han d'omplir tots els camps", "Error",{duration:2000});


      }
    }
  }
  else{
    this.snackbar.open("S'ha d'escollir un tipus d'assignació", "Error",{duration:2000});


    }

  }
  public randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

}
