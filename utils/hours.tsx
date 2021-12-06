import moment from "moment";

export class Hour {
  constructor(startTime: number, disabled: boolean = false) {
    this.startTime = startTime;
    this.endTime = startTime + 1;
    this.disabled = disabled;
  }
  startTime: number;
  endTime: number;
  disabled: boolean;

  render = () => `${this.startTime}:00 - ${this.endTime}:00`;
  checkDisabled = (dates: Array<moment.Moment>) => {
    try {
      this.disabled = false;
      for (const date of dates) {
        this.disabled =
          parseInt(
            moment(date).utc().locale("tr").startOf("hour").format("HH")
          ) === this.startTime;
        if (this.disabled) break;
      }
      return this.disabled;
    } catch (error) {
      return this.disabled;
    }
  };
}
class Hours {
  readonly keys = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  values: any = {};
  constructor() {
    this.keys.map((hour: number) => (this.values[hour] = new Hour(hour)));
  }
}

export const hours = new Hours();
