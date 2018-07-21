import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Question, Badge, CollectionCard} from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService,CollectionService, GroupService, AlertService, QuestionnaireService, BadgeService, SchoolService } from '../../shared/services/index';
import { CreateQuestionnaireTest1Component } from '../../pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTextArea1Component } from '../../pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
import { TranslateService } from 'ng2-translate';

@Component({
  /*selector: 'app-createQuestionnaireTest1',*/
  templateUrl: './createQuestionnairePackCardsAssignment.html',
  styleUrls: ['./createQuestionnairePackCardsAssignment.scss']
})
export class CreateQuestionnairePackCardsAssignmentComponent implements OnInit {

  myControl: FormControl = new FormControl();

  assigned: number = 0;
  public collectionSelected: string;
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
  public badgesArray = [];
  public collections: Array<CollectionCard> = new Array<CollectionCard>();
  public packCards = [];

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
    public translateService: TranslateService,
    public groupService: GroupService,
    public snackbar: MatSnackBar,
    public collectionService: CollectionService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public schoolService: SchoolService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateQuestionnairePackCardsAssignmentComponent>,
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
    for(this.ind=0;this.ind<=10;this.ind++)
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

    this.collectionService.getCollections().subscribe(
      ((collections: Array<CollectionCard>) => {
        this.loadingService.hide();
        for(let c of collections)
        {
          this.collectionService.getAssignedGroups(c.id).subscribe(
            ((groups: Array<Group>) => {
             this.loadingService.hide();

             for(let g of groups)
              {
                if(g.id === this.stringData[2])
                {
                  this.collections.push(c);

                }

              }


            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        }


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));



    }




  createQuestionnaire(): void{
    if(this.stringData[2] != null)
    {
    this.setCards();
    }
    else{
      this.packCards = null;
      this.stringData.push(this.packCards);

    }
    this.questionnaireService.saveQuestionnaire(this.stringData).subscribe(
      ((value: Questionnaire) => this.myQuestionnaire = value),
    ((error: Questionnaire) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));

    switch (this.selectedType)
     {


      case 'optionRespuestaMultiple':


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
  setCards()
  {

    if(this.assigned == 1)
    {

      if(!this.collectionSelected){

        this.alertService.show(this.translateService.instant('QUESTIONNAIRE.NOASSIGNEDCOLLECTION'));


      }
      else
      {

      this.packCards.push(+this.collectionSelected)
      this.ins1 == null?this.packCards.push(0):this.packCards.push(this.ins1);
      this.ins2 == null?this.packCards.push(0):this.packCards.push(this.ins2);
      this.ins3 == null?this.packCards.push(0):this.packCards.push(this.ins3);
      }


    }
    else
    {
      this.packCards = null;
    }
    this.stringData.push(this.packCards);
  }

}
