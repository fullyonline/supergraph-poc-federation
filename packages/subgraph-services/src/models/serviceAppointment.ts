import { CostUnit } from "./costUnit";
import {Status} from "../gqlSchema";

export class ServiceAppointment {
    sender: string;
    reportnr: string;
    patientNumber: string;
    caseNumber: number;
    costUnit: CostUnit;
    status: Status;
  
    constructor(sender: string, reportnr: string, patientNumber: string, caseNumber: number, costUnit: CostUnit, status: Status) {
      this.sender = sender;
      this.reportnr = reportnr;
      this.patientNumber = patientNumber;
      this.caseNumber = caseNumber;
      this.costUnit = costUnit;
      this.status = status;
    }
  }