import { Badge, BadgeRelation } from ".";

export class ResultBadges {

  private _badge: Badge;
  private _relationBadge: BadgeRelation;




  constructor(relationBadge?: BadgeRelation, badge?: Badge) {

    this._relationBadge = relationBadge;
    this._badge = badge;


  }

  /* tslint:disable */
  static toObject(object: any): ResultBadges {
    /* tslint:enable */
    let result: ResultBadges = new ResultBadges();
    if (object != null) {
      result.badge = object.badge;
      result.relationBadge = object.relationBadge;

    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<ResultBadges> {
    /* tslint:enable */
    let resultArray: Array<ResultBadges> = new Array<ResultBadges>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(ResultBadges.toObject(object[i]));
      }
    }
    return resultArray;
  }



  public get badge(): Badge {
    return this._badge;
  }

  public set badge(value: Badge) {
    this._badge = value;
  }
  public get relationBadge(): BadgeRelation {
    return this._relationBadge;
  }

  public set relationBadge(value: BadgeRelation) {
    this._relationBadge = value;
  }


}
