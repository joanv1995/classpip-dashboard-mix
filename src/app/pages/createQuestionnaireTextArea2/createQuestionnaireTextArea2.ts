import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Question } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { CreateQuestionnaireTextArea1Component } from '../../pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';


@Component({
  /*selector: 'app-createQuestionnaireTest1',*/
  templateUrl: './createQuestionnaireTextArea2.html',
  styleUrls: ['./createQuestionnaireTextArea2.scss']
})
export class CreateQuestionnaireTextArea2Component implements OnInit {

  public questionnaires: Array<Questionnaire>;
  public myQuestionnaire: Questionnaire;
  public myQuestion: Question;
  public stringData = [];
  public numberData = [];
  public questionData = [];

  public numberQuestions: number;
  public num: number;
  public result: string;
  public selected: string;

  public question: string;
  public answer1: string;
  public answer2: string;
  public answer3: string;
  public answer4: string;
  public correctAnswer: string;
  public urlImage: string;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateQuestionnaireTextArea2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    this.stringData.push(data.stringData[0]);
    this.stringData.push(data.stringData[1]);
    this.numberData.push(data.numberData[0]);
    this.numberData.push(data.numberData[1]);
    this.numberQuestions = data.numberData[1];
    this.num = data.num;
  }

  ngOnInit(): void {

    if (this.utilsService.role === Role.TEACHER) {

      /*this.questionnaireService.show();*/
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

    this.num += 1;
    this.questionData.push(this.question);
    this.questionData.push(this.answer1);
    this.questionData.push(this.answer2);
    this.questionData.push(this.answer3);
    this.questionData.push(this.answer4);
    this.questionData.push(this.correctAnswer);
    this.questionData.push(this.selected);
    this.questionData.push(this.urlImage);

    if ( (this.num) < this.numberQuestions) {

      this.questionnaireService.postQuestionnaireQuestions(this.numberData, this.questionData).subscribe(
        ((value: Question) => this.myQuestion = value),
      ((error: Question) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      let dialogRef = this.dialog.open(CreateQuestionnaireTextArea1Component, {
            height: '600px',
            width: '700px',
            data: {stringData: this.stringData, numberData: this.numberData, questionData: this.questionData, num: this.num}
            });

      this.cancel();

    } else {

      this.questionnaireService.postQuestionnaireQuestions(this.numberData, this.questionData).subscribe(
        ((value: Question) => this.myQuestion = value),
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
