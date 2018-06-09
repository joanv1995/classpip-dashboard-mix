import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { DeleteQuestionnaireComponent } from '../../pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from '../../pages/createQuestionnaire/createQuestionnaire';


@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.html',
  styleUrls: ['./questionnaires.scss']
})
export class QuestionnairesComponent implements OnInit {

  public questionnaires: Array<Questionnaire>;
  private returnUrl: string;

  animal: number;
  name: number;
  resultCreate: number;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

 public ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/questionnaire';

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

 public openDialog(): void {
    let dialogRef = this.dialog.open(DeleteQuestionnaireComponent, {
      height: '400px',
      width: '600px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.ngOnInit();
    });
  }

 public refresh(): void {
    window.location.reload();
  }

 public createQuestionnaire() {
    const dialogRef = this.dialog.open(CreateQuestionnaireComponent, {
      height: '600px',
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resultCreate = result;
      this.ngOnInit();
    });
  }

  public goToQuestionnaireDetail(questionnaire: Questionnaire): void {

    this.router.navigate([this.returnUrl, questionnaire.id]);
  }

}
