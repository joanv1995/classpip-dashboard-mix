import { Component, OnInit } from '@angular/core';
import { School, Role, Login, Profile } from '../../shared/models/index';
import { UtilsService, SchoolService, AlertService, LoadingService, UserService } from '../../shared/services/index';
import { AppConfig } from '../../app.config';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LanguageComponent } from '../../pages/language/language';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  public profile: Profile;
  public school: School;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public translateService: TranslateService,
    public loadingService: LoadingService,
    public userService: UserService,
    public dialog: MatDialog
  ) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

 public choose() {
    const dialogRef = this.dialog.open(LanguageComponent, {
      height: '390px',
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {

    this.loadingService.show();
    this.userService.getMyProfile().subscribe(
      ((profile: Profile) => {
        this.profile = profile;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    if (this.utilsService.role === Role.TEACHER) {

      this.schoolService.getMySchool().subscribe(
        ((school: School) => {
          this.loadingService.hide();
          this.school = school;
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
}
