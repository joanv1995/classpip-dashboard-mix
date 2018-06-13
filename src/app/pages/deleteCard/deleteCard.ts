import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Login, Group, Role, Questionnaire, Card, CollectionCard } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, BadgeService, CollectionService } from '../../shared/services/index';


@Component({
  /*selector: 'app-deleteQuestionnaire',*/
  templateUrl: './deleteCard.html',
  styleUrls: ['./deleteCard.scss']
})
export class DeleteCardComponent implements OnInit {

  public questionnaires: Array<Questionnaire>;

  animal: string;
  name: number;
  result: string;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public badgeService: BadgeService,
    public collectionService: CollectionService,

    public dialogRef: MatDialogRef<DeleteCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

  }

  cancel(): void {
    this.dialogRef.close();
  }

  deleteCard(): void {
    if (this.utilsService.role === Role.TEACHER) {

      this.loadingService.show();
      this.collectionService.deleteCard(this.data.name).subscribe(
        result => this.result
      );

      this.cancel();

    }
  }
}
