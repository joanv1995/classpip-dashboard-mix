import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Login, Group, Role, Questionnaire, Question, Answer, ResultQuestionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { DeleteQuestionnaireComponent } from '../../pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from '../../pages/createQuestionnaire/createQuestionnaire';

@Component({
  /*selector: 'app-questionnaireResults',*/
  templateUrl: './questionnaireResults.html',
  styleUrls: ['./questionnaireResults.scss']
})
export class QuestionnaireResultsComponent implements OnInit {

  public resultsQuestionnaire: Array<ResultQuestionnaire>;
  public myQuestions: Array<Question>;
  public myAnswers1: Array<Answer>;
  public myAnswers2: Array<Answer>;
  public myAnswers3: Array<Answer>;
  public myAnswers4: Array<Answer>;
  private returnUrl: string;
  public questionnaireId: string;
  private sub: any;
  public items: string[] = [];

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

  this.sub = this.route.params.subscribe(params => {
      this.questionnaireId = params['id'];
    });

    if (this.utilsService.role === Role.TEACHER) {

      this.questionnaireService.getResultsQuestionnaire(this.questionnaireId).subscribe(
        ((resultsQuestionnaire: Array<ResultQuestionnaire>) => {
          this.resultsQuestionnaire = resultsQuestionnaire;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
}







