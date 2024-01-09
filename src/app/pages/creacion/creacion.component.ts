import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Client } from "src/app/models/client.model";
import { locality } from "src/app/models/locality.model";
import { IdentificationType } from "src/app/models/indetificationtype.model";
import { Response } from "src/app/models/utils/response.model";
import { ClientService } from "src/app/service/client.service";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { IdentificationPK } from "src/app/models/Identification-pk-model";
import { Dealer } from "src/app/models/dealer.model";

@Component({
  selector: "creacion",
  templateUrl: "./creacion.component.html",
  styleUrls: ["./creacion.component.css"],
})
export class CreacionComponent implements OnInit {
  messageResponse: any = "";
  public maxDate: Date = new Date();
  public minDate: Date = moment(new Date()).add(-1, "months").toDate();

  public createClient: FormGroup = this.clientForm.group({
    firstSurname: ["", [Validators.required, Validators.pattern]],
    secondSurname: ["", [Validators.required, Validators.pattern]],
    firstName: ["", [Validators.required, Validators.pattern]],
    secondName: ["", [Validators.pattern]],
    localityID: ["", [Validators.required]],
    identificationType: [""],
    identificationNumber: ["", [Validators.pattern]],
    dealerId: ["", Validators.required],
    state: ["ACTIVO", Validators.required],
    registrationDate: [null],
    modificationDate: [null],
  });

  public identificationTypes: IdentificationType[] = [];

  public localities: Array<locality> = [];
  public dealerList: Array<Dealer> = [];

  public clientEdit: Client = new Client();

  public isEdit: boolean = false;

  dealerIdTemp = 0;
  localityIdTemp = 0;

  constructor(
    private clientForm: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.identificationTypes = [
      {
        identificationTypeId: "C",
        identificationTypeName: "CÉDULA DE CIUDADANÍA",
      },
      {
        identificationTypeId: "T",
        identificationTypeName: "TARJETA DE IDENTIDAD",
      },
      {
        identificationTypeId: "E",
        identificationTypeName: "CÉDULA DE EXTRANJERÍA",
      },
    ];
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createClient.controls;
  }

  ngOnInit() {
    this.spinner.show();
    this.chargeInitInfo();
    this.chargeLists();
  }

  chargeInitInfo() {
    let employeeToEdit = localStorage.getItem("employeeToEdit");
    if (employeeToEdit) {
      this.editEmployee(JSON.parse(employeeToEdit));
    } else {
      this.createClient.controls["state"].disable();
      let dateTimeNow = moment(new Date()).format().substring(0, 16);
      this.createClient.controls["registrationDate"].setValue(dateTimeNow);
    }
    this.createClient.controls["registrationDate"].disable();
  }

  chargeLists() {
    this.spinner.show();
    this.clientService
      .getLocalities()
      .subscribe((response: Response<locality>) => {
        if (response.data && response.data.length > 0) {
          this.localities = response.data;
          if (this.isEdit) {
            this.createClient.controls["localityID"].setValue(
              this.dealerIdTemp
            );
          }
        }
        this.spinner.hide();
      });
    this.spinner.show();
    this.clientService
      .getDealerList()
      .subscribe((response: Response<Dealer>) => {
        if (response.data && response.data.length > 0) {
          this.dealerList = response.data;
          if (this.isEdit) {
            this.createClient.controls["dealerId"].setValue(this.dealerIdTemp);
          }
        }
        this.spinner.hide();
      });
  }

  editEmployee(client: Client) {
    this.clientEdit = client;
    this.isEdit = true;
    this.createClient.controls["firstSurname"].setValue(client.firstSurname);
    this.createClient.controls["secondSurname"].setValue(client.secondSurname);
    this.createClient.controls["firstName"].setValue(client.firstName);
    this.createClient.controls["secondName"].setValue(client.secondName);

    this.createClient.controls["identificationType"].setValue(
      client.identificationPK?.documentType
    );
    this.createClient.controls["identificationNumber"].setValue(
      client.identificationPK?.document
    );
    this.createClient.controls["localityID"].setValue(client.localityID);
    this.createClient.controls["dealerId"].setValue(client.dealerId);
    this.dealerIdTemp = client.dealerId!;
    this.localityIdTemp = client.localityID!;
    this.createClient.controls["state"].setValue(
      client.state === true ? "ACTIVO" : "INACTIVO"
    );
    this.createClient.controls["registrationDate"].setValue(
      moment(client.registrationDate).format().substring(0, 16)
    );
    if (client.modificationDate) {
      this.createClient.controls["modificationDate"].setValue(
        moment(client.modificationDate).format().substring(0, 16)
      );
      this.createClient.controls["modificationDate"].disable();
    }
    localStorage.removeItem("clientToEdit");
  }

  goToCancel() {
    localStorage.clear();
    this.goToConsulta();
  }

  goToConsulta() {
    this.router.navigateByUrl("/consulta");
  }

  onSubmit() {
    this.spinner.show();
    let client: Client = new Client();
    let identificationPK: IdentificationPK = new IdentificationPK();
    client.firstSurname = this.createClient.controls["firstSurname"].value;
    client.secondSurname = this.createClient.controls["secondSurname"].value;
    client.firstName = this.createClient.controls["firstName"].value;
    client.secondName = this.createClient.controls["secondName"].value;

    identificationPK.documentType =
      this.createClient.controls["identificationType"].value;
    identificationPK.document =
      this.createClient.controls["identificationNumber"].value;

    client.identificationPK = identificationPK;

    client.localityID = this.createClient.controls["localityID"].value;
    client.dealerId = this.createClient.controls["dealerId"].value;
    client.state =
      this.createClient.controls["state"].value === "ACTIVO" ? true : false;
    client.registrationDate =
      this.createClient.controls["registrationDate"].value;
    client.modificationDate =
      this.createClient.controls["modificationDate"].value;

    if (!this.isEdit) {
      this.clientService
        .postClient(client)
        .subscribe((response: Response<Client>) => {
          if (response.ok && response.data) {
            console.log(response);
            this.messageResponse = response.message;
            localStorage.clear();
            this.spinner.hide();
          }
        });
    } else {
      this.clientService
        .putClient(client)
        .subscribe((response: Response<Client>) => {
          if (response.ok && response.data) {
            this.messageResponse = response.message;
            localStorage.clear();
            this.spinner.hide();
          }
        });
    }
  }
}
