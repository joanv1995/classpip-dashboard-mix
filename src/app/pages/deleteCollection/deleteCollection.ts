import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Login, Group, Role, Questionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, BadgeService, CollectionService } from '../../shared/services/index';


@Component({
  /*selector: 'app-deleteQuestionnaire',*/
  templateUrl: './deleteCollection.html',
  styleUrls: ['./deleteCollection.scss']
})
export class DeleteCollectionComponent implements OnInit {


  animal: string;
  name: number;
  result: number;

  constructor(
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
      this.collectionService.deleteCollection(this.data.name).subscribe(
       (( result: number) => {
         this.result = result;
        this.snackBar.open("Col·lecció eliminada");
       }

      ),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));;
      this.cancel();


  }
}
