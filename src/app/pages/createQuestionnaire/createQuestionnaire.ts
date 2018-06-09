import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { CreateQuestionnaireTest1Component } from '../../pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTextArea1Component } from '../../pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
import { CreateQuestionnairePointsAssignmentComponent } from '../createQuestionnairePointsAssignment/createQuestionnairePointsAssignment';


@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './createQuestionnaire.html',
  styleUrls: ['./createQuestionnaire.scss']
})
export class CreateQuestionnaireComponent implements OnInit {

  public questionnaires: Array<Questionnaire>;
  public myQuestionnaire: Questionnaire;
  public stringData = [];
  public numberData = [];

  public name: string;
  public time: number;
  public number: number;
  public date: string;
  public selected: string;
  public result: string;
  public num = 0;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateQuestionnaireComponent>,
    public dialogRef1: MatDialogRef<CreateQuestionnairePointsAssignmentComponent>,


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

  createQuestionnaire(): void {

    this.stringData.push(this.name);
    this.stringData.push(this.date);
    this.numberData.push(this.time);
    this.numberData.push(this.number);



    let dialogRef1 = this.dialog.open(CreateQuestionnairePointsAssignmentComponent, {
    height: '600px',
    width: '700px',
    data: {stringSelected: this.selected, stringData: this.stringData, numberData: this.numberData, num: this.num}
    });

    dialogRef1.afterClosed().subscribe(result => {
      this.result = result;
      this.ngOnInit();
    });
    this.cancel();



    /*
    switch (this.selected) {
          case 'optionRespuestaMultiple':
             /*Save new Questionnaire
            this.questionnaireService.saveQuestionnaire(this.stringData).subscribe(
              ((value: Questionnaire) => this.myQuestionnaire = value),
            ((error: Questionnaire) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));

            let dialogRef1 = this.dialog.open(CreateQuestionnaireTest1Component, {
            height: '600px',
            width: '700px',
            data: {stringData: this.stringData, numberData: this.numberData, num: this.num}
            });

            dialogRef1.afterClosed().subscribe(result => {
              this.result = result;
              this.ngOnInit();
            });
            this.cancel();
            break;
          case 'optionRespuestaAbierta':
                        /*Save new Questionnaire
            this.questionnaireService.saveQuestionnaire(this.stringData).subscribe(
              ((value: Questionnaire) => this.myQuestionnaire = value),
            ((error: Questionnaire) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
            let dialogRef2 = this.dialog.open(CreateQuestionnaireTextArea1Component, {
              height: '600px',
              width: '700px',
              data: {stringData: this.stringData, numberData: this.numberData, num: this.num}
            });

            dialogRef2.afterClosed().subscribe(result => {
              this.result = result;
              this.ngOnInit();
            });
            this.cancel();
            break;
          default:
            break;
        }*/
  }
}
