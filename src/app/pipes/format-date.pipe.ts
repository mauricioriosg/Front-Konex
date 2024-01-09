import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let date = new Date(value);
    let dateFormat = moment(date).format("MM/DD/YYYY, HH:mm");
    if(dateFormat === "Invalid date") {
        dateFormat = "--";
    }
    return dateFormat;
  }
}