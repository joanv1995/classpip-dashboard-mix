import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Login, Group, Role, Questionnaire, CollectionCard, Profile } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, UserService, GroupService, AlertService, BadgeService, CollectionService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';


@Component({
  /*selector: 'app-deleteQuestionnaire',*/
  templateUrl: './deleteCollection.html',
  styleUrls: ['./deleteCollection.scss']
})
export class DeleteCollectionComponent implements OnInit {

  canDelete: boolean = false;
  animal: string;
  name: number;
  result: number;

  constructor(
    public userService: UserService,
    public translateService: TranslateService,
    public snackBar: MatSnackBar,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public collectionService: CollectionService,

    public dialogRef: MatDialogRef<DeleteCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

  }

  cancel(): void {
    this.dialogRef.close();
  }

  deleteCollection(): void {
    this.loadingService.show();

    this.collectionService.getCollection(this.data.name).subscribe(
      ((c: CollectionCard)=>{

        this.userService.getMyProfile().subscribe(
          ((pr: Profile)=>{

            if(pr.username != c.createdBy)
            {
              this.alertService.show(this.translateService.instant('COLLECTIONS.NOTOWNER'));
              this.cancel();

            }
            else{

              this.collectionService.deleteCollection(this.data.name).subscribe(
                ((value: any)  =>{
                  this.loadingService.hide();
                  switch(value.count)
                  {
                    case 1:
                      this.alertService.show(this.translateService.instant('COLLECTIONS.DELETED'))
                      break;
                    case 0:
                      this.alertService.show(this.translateService.instant('COLLECTIONS.NOTDELETED'))
                      break;
                    default:
                    break;
                  }
                }));
              }
                this.cancel();



          }),
      ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
      }));



      }),
      ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(this.translateService.instant('COLLECTIONS.NOTDELETED'))
          this.cancel();

        }));





  }
}
