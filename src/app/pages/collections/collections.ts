import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, GroupService, AlertService, CollectionService, SchoolService } from '../../shared/services/index';
import { CreateCollectionComponent } from '../createCollection/createCollection';
import { DeleteCollectionComponent } from '../deleteCollection/deleteCollection';

import { FormControl } from '@angular/forms';




@Component({
  selector: 'app-collections',
  templateUrl: './collections.html',
  styleUrls: ['./collections.scss']
})
export class CollectionsComponent implements OnInit {

  public collId: string;
  public myControl = new FormControl();
  public returnUrl: string;
  public groupSelected: string;
  public collectionSelected: string;

  public collections: Array<CollectionCard>;
  public mygroups: Array<Group>;

  public isTeacher: boolean = false;
  public resultCreate: string;
  public resultDeleteCollection: number;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public groupServivce: GroupService,
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


    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
      this.collectionService.getCollections().subscribe(
        ((collections: Array<CollectionCard>) => {
          this.collections = collections;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

        this.groupServivce.getMyGroups().subscribe(
          ((groups: Array<Group>)=>{
            this.mygroups = groups;
            this.loadingService.hide();


          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));

      }

   else if (this.utilsService.role === Role.STUDENT) {
      this.isTeacher = false;
      this.collectionService.getMyCollections().subscribe(
        ((collections: Array<CollectionCard>) => {
          this.collections = collections;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));



      }
  }
    goToCollectionDetails(collectionCard) {


      this.router.navigate([this.returnUrl, collectionCard.id]);

    }



  createCollection() {
    const dialogRef = this.dialog.open(CreateCollectionComponent, {
      height: '600px',
      width: '800px',
    });


    dialogRef.afterClosed().subscribe(result => {
      this.resultCreate = result;
      this.ngOnInit();
    });
  }

  assignCollectionToGroup(){

    this.collectionService.assignCollection(this.collectionSelected, this.groupSelected).subscribe(
      ((response: Response)=> {

        this.snackbar.open("Col·lecció assignada correctament","",{duration:2000});


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
        this.snackbar.open("Col·lecció no assignada","Error",{duration:2000});

      }));

  }
 public  deleteCollection(){
    if(this.collId.length > 0)
    {
      let dialogRef = this.dialog.open(DeleteCollectionComponent, {
        height: '400px',
        width: '600px',
        data: { name: this.collId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.resultDeleteCollection = result;
        this.ngOnInit();
      });
    }
    else{

      this.snackbar.open("Introduir identificador d'Insígnia", "Error",{duration:2000});

    }





  }
}

