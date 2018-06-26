import { Point, PointRelation } from ".";

export class ResultPoints {

  private _point: Point;
  private _relationPoint: PointRelation;




  constructor(relationPoint?: PointRelation, point?: Point) {

    this._relationPoint = relationPoint;
    this._point = point;


  }

  /* tslint:disable */
  static toObject(object: any): ResultPoints {
    /* tslint:enable */
    let result: ResultPoints = new ResultPoints();
    if (object != null) {
      result.point = object.point;
      result.relationPoint = object.relationPoint;

    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<ResultPoints> {
    /* tslint:enable */
    let resultArray: Array<ResultPoints> = new Array<ResultPoints>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(ResultPoints.toObject(object[i]));
      }
    }
    return resultArray;
  }



  public get point(): Point {
    return this._point;
  }

  public set point(value: Point) {
    this._point = value;
  }
  public get relationPoint(): PointRelation {
    return this._relationPoint;
  }

  public set relationPoint(value: PointRelation) {
    this._relationPoint = value;
  }


}
