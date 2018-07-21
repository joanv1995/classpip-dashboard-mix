import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import { Login, Group, Role, Questionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';

import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { DeleteQuestionnaireComponent } from '../../pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from '../../pages/createQuestionnaire/createQuestionnaire';
import { QuestionnaireAwardsComponent } from '../questionnaireAwards/questionnaireAwards';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.html',
  styleUrls: ['./questionnaires.scss']
})
export class QuestionnairesComponent implements OnInit {
  ques: Questionnaire;
  public questionnaires: Array<Questionnaire>;
  private returnUrl: string;
  valueQuests:  Array<Questionnaire> = new Array<Questionnaire>();
  myQuests: Array<Questionnaire> = new Array<Questionnaire>();
  animal: number;
  myGroups: Array<Group> = new Array<Group>();
  name: number;
  resultCreate: number;
  resultAwards: number;
  device: any = [];
  isTeacher: boolean = false;

  constructor(
    public translateService: TranslateService,
    public snackbar: MatSnackBar,
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

 public ngOnInit(): void {

    //Mostramos la lista de questionarios
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/questionnaire';
    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
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
    else if(this.utilsService.role === Role.STUDENT){

      this.questionnaireService.getAllQuestionnaires().subscribe(
        ((valueQuests: Array<Questionnaire>)=>{
          this.valueQuests = valueQuests;
          for (let q of this.valueQuests)
          {
            this.groupService.getMyGroups().subscribe(
              ((gg: Array<Group>)=>{
                this.myGroups = gg;
                for (let g of this.myGroups)
                {
                  if(q.groupid == g.id )
                  {
                      this.myQuests.push(q);
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

  }

  //Abrimos ventana para eliminar cuestionario
 public deleteQuestionnaire(): void {

    if(!this.name){

      this.alertService.show(this.translateService.instant('QUESTIONNAIRE.NOTSELECTED'));

    }
    else
      {
        let dialogRef = this.dialog.open(DeleteQuestionnaireComponent, {
          height: '400px',
          width: '600px',
          data: { name: this.name, animal: this.animal}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.animal = result;
          this.name = null;
          this.ngOnInit();
        });
      }
  }

 public refresh(): void {
    window.location.reload();
  }

//Abrimos ventana para crear nuevo questionario
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

  //Dirigimos a pagina de cartas de la colección
  public goToQuestionnaireDetail(questionnaire: Questionnaire): void {

    this.router.navigate([this.returnUrl, questionnaire.id]);
  }
  //Activamos / desactivamos cuestionario
  public onChange(value, quest: Questionnaire) {

    //Actualizar estado del questionario (activo o no activo)
    this.questionnaireService.updateQuestionnaire(quest.id,quest.name,quest.date,quest.groupid,quest.points,value.checked,quest.badges).subscribe(
      ((ques: Questionnaire)=>{
        this.ques = ques;
        this.loadingService.hide();

        this.utilsService.currentQuestionnaire.active?this.alertService.show(quest.name+this.translateService.instant('QUESTIONNAIRE.ACTIVE')):
        this.alertService.show(quest.name+this.translateService.instant('QUESTIONNAIRE.DEACTIVATE'));

      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
  //Abrimos ventana con los premios ganados segun nota del cuestionario
  public showAwards(questionnaire: Questionnaire){
    const dialogRef = this.dialog.open(QuestionnaireAwardsComponent, {
      height: '600px',
      width: '700px',
      data: { questionnaireObj: questionnaire}

    });

    dialogRef.afterClosed().subscribe(result => {
      this.resultAwards = result;
      this.ngOnInit();
    });

  }




}
