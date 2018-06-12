import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Question, Badge} from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService, BadgeService, SchoolService } from '../../shared/services/index';
import { CreateQuestionnaireTest1Component } from '../../pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTextArea1Component } from '../../pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';

@Component({
  /*selector: 'app-createQuestionnaireTest1',*/
  templateUrl: './createQuestionnaireBadgesAssignment.html',
  styleUrls: ['./createQuestionnaireBadgesAssignment.scss']
})
export class CreateQuestionnaireBadgesAssignmentComponent implements OnInit {

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

  public badges: Array<Badge>;
  public badgesArray = [];

  public ins1: string;
  public ins2: string;
  public ins3: string;

  public ins1t: string;
  public ins2t: string;
  public ins3t: string;


  device: any = [];
  public ind: number;
  public selectedType: string;
  constructor(
    public snackbar: MatSnackBar,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public schoolService: SchoolService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateQuestionnaireBadgesAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

    this.selectedType = data.stringSelected;

    for (var i =0; i < data.stringData.length; i++)
    {
      this.stringData.push(data.stringData[i]);

    }
    for (var i =0; i < data.numberData.length; i++)
    {
      this.numberData.push(data.numberData[i]);

    }

    this.num = data.num;
    for(this.ind=0;this.ind<=100;this.ind++)
    {
      this.options.push(this.ind);

    }


  }

  onChange(value) {
  if (value.checked === true) {
    this.assigned = 1;
  } else
  {
    this.assigned = 0;
  }
};
  ngOnInit(): void {
    if (this.utilsService.role === Role.TEACHER) {
      this.schoolService.getMySchoolBadges().subscribe(
        ((badges: Array<Badge>) => {
          this.badges = badges;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
    }




  createQuestionnaire(): void{

    this.setBadges();


    switch (this.selectedType)
     {


      case 'optionRespuestaMultiple':
         /*Save new Questionnaire*/
        this.questionnaireService.saveQuestionnaire(this.stringData, this.badgesArray).subscribe(
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
        this.questionnaireService.saveQuestionnaire(this.stringData, this.badgesArray).subscribe(
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
  public setBadges(): void{

    if(this.assigned == 1)
    {

      for(var i = 0; i < this.badges.length; i++)
      {
        if(this.ins1 == this.badges[i].name){

          this.ins1t = this.badges[i].id;

        }
        if(this.ins2 == this.badges[i].name){
          this.ins2t = this.badges[i].id;


        }
        if(this.ins3 == this.badges[i].name){
          this.ins3t = this.badges[i].id;
        }


      }



      this.badgesArray.push(this.ins1t);
      this.badgesArray.push(this.ins2t);
      this.badgesArray.push(this.ins3t);


    }
    else
    {
      this.badgesArray.push("0");
    }


  }
}
