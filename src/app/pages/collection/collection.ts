import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, GroupService, AlertService, CollectionService, SchoolService } from '../../shared/services/index';
import { CreateCardComponent } from '../createCard/createCard';
import { DeleteCardComponent } from '../deleteCard/deleteCard';




@Component({
  //selector: 'app-collections',
  templateUrl: './collection.html',
  styleUrls: ['./collection.scss']
})
export class CollectionComponent implements OnInit {

  public returnUrl: string;
  public result: number;
  public collectionCards: Array<Card>;
  public cardId: string;

  public sub: any;
  public collectionCardId: string;


  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public collectionService: CollectionService,
    public loadingService: LoadingService,
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
      this.collectionService.getCollectionDetails(this.collectionCardId).subscribe(
        ((collectionCards: Array<Card>) => {
          this.collectionCards = collectionCards;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));




    }

  }



  createCard() {


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
  deleteCard() {


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
  /*

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
