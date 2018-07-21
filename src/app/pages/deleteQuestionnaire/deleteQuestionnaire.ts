import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Login, Group, Role, Questionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';


@Component({
  /*selector: 'app-deleteQuestionnaire',*/
  templateUrl: './deleteQuestionnaire.html',
  styleUrls: ['./deleteQuestionnaire.scss']
})
export class DeleteQuestionnaireComponent implements OnInit {

  public questionnaires: Array<Questionnaire>;

  name: number;
  result: string;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public translateService: TranslateService,
    public questionnaireService: QuestionnaireService,
    public dialogRef: MatDialogRef<DeleteQuestionnaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

    if (this.utilsService.role === Role.TEACHER) {

      this.loadingService.show();
      this.questionnaireService.getQuestionnaires().subscribe(
        ((questionnaires: Array<Questionnaire>) => {
          this.questionnaires = questionnaires;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  deleteQuestionnaire(): void {
    if (this.utilsService.role === Role.TEACHER) {


      this.loadingService.show();
      this.questionnaireService.deleteQuestionnaire(this.data.name).subscribe(
        ((value: any)  =>{
          switch(value.count)
          {
            case 1:
              this.alertService.show(this.translateService.instant('QUESTIONNAIRE.DELETED'))
              break;
            case 0:
              this.alertService.show(this.translateService.instant('QUESTIONNAIRE.NOTDELETED'))
              break;
            default:
            break;
          }
        }));
        this.cancel();



      }
    }
}
