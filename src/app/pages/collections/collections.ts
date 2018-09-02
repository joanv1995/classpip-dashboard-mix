import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card, Student, Profile } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, UserService, GroupService, AlertService, CollectionService, SchoolService } from '../../shared/services/index';
import { CreateCollectionComponent } from '../createCollection/createCollection';
import { DeleteCollectionComponent } from '../deleteCollection/deleteCollection';

import { FormControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';




@Component({
  selector: 'app-collections',
  templateUrl: './collections.html',
  styleUrls: ['./collections.scss']
})
export class CollectionsComponent implements OnInit {

  public collId: string;
  public myControl = new FormControl();
  public returnUrl: string;
  public returnUrlStudent: string;

  public groupSelected: string;
  public groupAssign: string;
  public collectionSelected: string;
  public students: Array<Student>;
  public collections: Array<CollectionCard>;
  public mygroups: Array<Group>;
  public assignedGroups: Array<Group>;
  public groupArray: Array<Group>;


  public isTeacher: boolean = false;
  public resultCreate: string;
  public resultDeleteCollection: number;

  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public route2: ActivatedRoute,
    public router: Router,
    public router2: Router,
    public userService: UserService,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public groupService: GroupService,
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
   this.returnUrlStudent = this.route2.snapshot.queryParams['returnUrlStudent'] || '/collectionStudent';


    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
      //Mostrar colecciones que hay en la  (profesor)
      this.collectionService.getCollections().subscribe(
        ((collections: Array<CollectionCard>) => {
          this.collections = collections;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));


      }

   else if (this.utilsService.role === Role.STUDENT) {
      this.isTeacher = false;
      //Colecciones asignadas al estudiante
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
      //Ir a la pagina de cromos de la cleccion
      if(this.isTeacher)
      {

        this.userService.getMyProfile().subscribe(
          ((pr: Profile)=>{
            if(pr.username == collectionCard.createdBy){
            this.router.navigate([this.returnUrl, collectionCard.id]);
            }
            else{

              this.alertService.show(this.translateService.instant('COLLECTIONS.NOTEDITABLE'))

            }

          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));


          }
      else
      {

        this.router2.navigate([this.returnUrlStudent, collectionCard.id]);
      }


    }



  createCollection() {
    //Abrir ventana para crear nueva colección
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
    //Assignar colección a grupo de estudiantes
    if(!this.collectionSelected || !this.groupAssign){
      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
     }
    else{
    this.collectionService.getCollectionDetails(this.collectionSelected).subscribe(
      ((cardss: Array<Card>)=> {

         //
    this.collectionService.getCollection(+this.collectionSelected).subscribe(
      ((collection: CollectionCard)=> {

        if(cardss.length < +collection.num)
        {
          this.alertService.show(this.translateService.instant('COLLECTIONS.FAILASSIGN'));
        }

        else{

          this.collectionService.assignCollection(this.collectionSelected, this.groupAssign).subscribe(
            ((response: Response)=> {
              this.groupService.getMyGroupStudents(this.groupAssign).subscribe(students => {
                this.students = students;
                this.alertService.show(this.translateService.instant('COLLECTIONS.CORASSIGN'));
                this.students.forEach( (element) => {
                  this.collectionService.assignCollectionToStudent(element.id, this.collectionSelected).subscribe(response => {

                  })
                });

                this.groupAssign = "";
                this.collectionSelected = "";
              });

            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
              //this.snackbar.open("Col·lecció no assignada","Error",{duration:2000});

            }));
        }


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));



      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }



  }
 public  deleteCollection(){
    if(!this.collId)
    {
      this.alertService.show(this.translateService.instant('COLLECTIONS.NOTSELECTED'))
    }
    else{

      let dialogRef = this.dialog.open(DeleteCollectionComponent, {
        height: '400px',
        width: '600px',
        data: { name: this.collId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.resultDeleteCollection = result;
        this.collId = null;
        this.ngOnInit();
      });
    }
  }
  showNoAssignedGroups(){
    if(this.collectionSelected)
    {
      this.groupArray = Array<Group>();
      this.groupService.getMyGroups().subscribe(
        ((groups: Array<Group>)=>{
          this.mygroups = groups;
          this.loadingService.hide();

          this.collectionService.getAssignedGroups(this.collectionSelected).subscribe(
            ((value: Array<Group>)=>{
            this.assignedGroups = value;
            for (let i=0;i<this.mygroups.length;i++) {
              let exists: boolean = false;
              for (let j = 0; j < this.assignedGroups.length; j++) {
                if (this.mygroups[i].id === this.assignedGroups[j].id) {
                  exists = true;
                  break;
                }
              }
              if (!exists) {
                this.groupArray.push(this.mygroups[i]);
              }
            }
          })
        )


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));




    }




  }
}

