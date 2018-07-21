import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService,PointService, GroupService, AlertService, QuestionnaireService, BadgeService, CollectionService } from '../../shared/services/index';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './questionnaireAwards.html',
  styleUrls: ['./questionnaireAwards.scss']
})
export class QuestionnaireAwardsComponent implements OnInit {


  public value: number;
  public bb: Array<Badge> = new Array<Badge>();
  public quest: Questionnaire = new Questionnaire();
  public badges = [];
  public collection: CollectionCard = new CollectionCard();

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public badgeService: BadgeService,
    public pointService: PointService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public collectionService: CollectionService,
    public dialogRef: MatDialogRef<QuestionnaireAwardsComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.quest = data.questionnaireObj;
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

    if(this.quest.badges){
    for(let i = 0; i< this.quest.badges.length; i++)
    {
      this.badgeService.getBadge(+this.quest.badges[i]).subscribe(
        ((badge: Badge)=>{
          this.loadingService.hide();
          this.bb.push(badge);
          this.badges.push(badge.name);


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));


      };
      this.collectionService.getCollection(this.quest.packCards[0]).subscribe(
        ((collection: CollectionCard)=>{
          this.collection = collection;



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

}
