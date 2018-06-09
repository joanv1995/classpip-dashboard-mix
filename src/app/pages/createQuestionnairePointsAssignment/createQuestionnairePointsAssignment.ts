import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Question } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { CreateQuestionnaireTest1Component } from '../../pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTextArea1Component } from '../../pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';

@Component({
  /*selector: 'app-createQuestionnaireTest1',*/
  templateUrl: './createQuestionnairePointsAssignment.html',
  styleUrls: ['./createQuestionnairePointsAssignment.scss']
})
export class CreateQuestionnairePointsAssignmentComponent implements OnInit {
  myControl: FormControl = new FormControl();
  assigned: number = 0;

  public options = [];
  public questionnaires: Array<Questionnaire>;
  public myQuestionnaire: Questionnaire;
  public myQuestions: Array<Question>;
  public stringData = [];
  public numberData = [];
  public questionData = [];
  public numberQuestions: number;
  public num: number;
  public result: string;

  public points = [];
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public e: number;
  public f: number;
  public g: number;

  device: any = [];
  public ind: number;
  public selectedType: string;
  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateQuestionnairePointsAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

    this.selectedType = data.stringSelected;
    this.stringData.push(data.stringData[0]);
    this.stringData.push(data.stringData[1]);
    this.numberData.push(data.numberData[0]);
    this.numberData.push(data.numberData[1]);
    this.numberQuestions = data.numberData[1];
    this.num = data.num;

    for(this.ind=0;this.ind<=100;this.ind++)
    {
      this.options.push(this.ind);

    }


  }

  onChange(value) {
  if (value.checked == true) {
    this.assigned = 1;
    console.log(1);
  } else {
    this.assigned = 0;
    console.log(0);
  }
};
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
  createQuestionnaire(): void{

    if(this.assigned == 1)
    {

      this.points.push(this.a);
      this.points.push(this.b);
      this.points.push(this.c);
      this.points.push(this.d);
      this.points.push(this.e);
      this.points.push(this.f);
      this.points.push(this.g);

    this.stringData.push(this.points);
    }
    else if(this.assigned == 0)
    {
    this.points.push(0);
    this.points.push(0);
    this.points.push(0);
    this.points.push(0);
    this.points.push(0);
    this.points.push(0);
    this.points.push(0);



    this.stringData.push(this.points);
    }
    switch (this.selectedType)
     {
      case 'optionRespuestaMultiple':
         /*Save new Questionnaire*/
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
                    /*Save new Questionnaire*/
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
    }




}
  cancel(): void {
    this.dialogRef.close();
  }
}
