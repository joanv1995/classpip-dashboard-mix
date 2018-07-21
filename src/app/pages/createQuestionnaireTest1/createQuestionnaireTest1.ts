import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Question } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { CreateQuestionnaireTest2Component } from '../../pages/createQuestionnaireTest2/createQuestionnaireTest2';
import { TranslateService} from 'ng2-translate'

@Component({
  /*selector: 'app-createQuestionnaireTest1',*/
  templateUrl: './createQuestionnaireTest1.html',
  styleUrls: ['./createQuestionnaireTest1.scss']
})
export class CreateQuestionnaireTest1Component implements OnInit {

  public questionnaires: Array<Questionnaire>;
  public myQuestionnaire: Questionnaire;
  public myQuestions: Array<Question>;
  public stringData = [];
  public numberData = [];
  public questionData = [];
  public numberQuestions: number;
  public num: number;
  public result: string;
  public question: string;
  public answer1: string;
  public answer2: string;
  public answer3: string;
  public answer4: string;
  public correctAnswer: string;

  constructor(
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateQuestionnaireTest1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    for (var i =0; i < data.stringData.length; i++)
    {
      this.stringData.push(data.stringData[i]);

    }
    for (var i =0; i < data.numberData.length; i++)
    {
      this.numberData.push(data.numberData[i]);

    }
    this.numberQuestions = data.numberData[1];
    this.num = data.num;
  }

  ngOnInit(): void {

    if (this.utilsService.role === Role.TEACHER) {

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

  createQuestionnaire(): void {

    this.questionData = [];

  if(!this.question || !this.correctAnswer || !this.answer1 || !this.answer2 || !this.answer3 || !this.answer4)
  {
    this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));

  }
  else{


    this.questionData.push(this.question);
    this.questionData.push(this.answer1);
    this.questionData.push(this.answer2);
    this.questionData.push(this.answer3);
    this.questionData.push(this.answer4);

    if(this.questionData.indexOf(this.correctAnswer) == -1)
    {
      this.alertService.show(this.translateService.instant('QUESTIONNAIRE.CORRECTANSWERERROR'));


    }
    else{

    this.num += 1;
    this.questionData.push(this.correctAnswer);
    this.questionData.push('test');

    if ( (this.num) < this.numberQuestions) {



      this.questionnaireService.saveQuestionAnswersCorrectAnswer(this.numberData, this.questionData).subscribe(
        ((value: Array<Question>) => this.myQuestions = value),
      ((error: Question) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      let dialogRef = this.dialog.open(CreateQuestionnaireTest2Component, {
            height: '600px',
            width: '700px',
            data: {stringData: this.stringData, numberData: this.numberData, questionData: this.questionData, num: this.num}
            });

      this.cancel();

    } else {

      this.questionnaireService.saveQuestionAnswersCorrectAnswer(this.numberData, this.questionData).subscribe(
        ((value: Array<Question>) => {this.myQuestions = value;
          this.alertService.show(this.translateService.instant('QUESTIONNAIRE.CREATED'));
        }),
      ((error: Question) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
      }));

      this.dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      this.ngOnInit();


      });
        this.cancel();
    }
  }
}
  }
}
