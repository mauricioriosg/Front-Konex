import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Client } from "src/app/models/client.model";
import { Dealer } from "src/app/models/dealer.model";
import { IdentificationType } from "src/app/models/indetificationtype.model";
import { locality } from "src/app/models/locality.model";
import { Response } from "src/app/models/utils/response.model";
import { ClientService } from "src/app/service/client.service";

@Component({
  selector: "consulta",
  templateUrl: "./consulta.component.html",
  styleUrls: ["./consulta.component.css"],
})
export class ConsultaComponent implements OnInit {
  config: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 100,
  };
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: "<--",
    nextLabel: "-->",
    screenReaderPaginationLabel: "Pagination",
    screenReaderPageLabel: "page",
    screenReaderCurrentLabel: `You're on page`,
  };

  public messageResponse: any = "";
  public clients: Array<Client> = [];
  public identificationTypes: IdentificationType[] = [];

  public localities: Array<locality> = [];
  public dealerList: Array<Dealer> = [];

  constructor(
    private clientService: ClientService,
    private router: Router,
    private employeeForm: FormBuilder,
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

  public filterClients: FormGroup = this.employeeForm.group({
    surname: [""],
    secondSurname: [""],
    firstName: [""],
    otherNames: [""],
    localityID: [""],
    identificationType: [""],
    identificationNumber: [""],
    dealerId: [""],
    state: ["ACTIVO"],
  });

  ngOnInit() {
    localStorage.removeItem("employeeToEdit");
    this.loadClients();
    this.chargeLists();
    this.filterClients.controls["state"].disable();
  }

  chargeLists() {
    this.spinner.show();
    this.clientService
      .getLocalities()
      .subscribe((response: Response<locality>) => {
        if (response.data && response.data.length > 0) {
          this.localities = response.data;
          console.log(
            "🚀 ~ CreacionComponent ~ .subscribe ~ this.localities:",
            this.localities
          );
        }
        this.spinner.hide();
      });
    this.spinner.show();
    this.clientService
      .getDealerList()
      .subscribe((response: Response<Dealer>) => {
        if (response.data && response.data.length > 0) {
          this.dealerList = response.data;
          console.log(
            "🚀 ~ CreacionComponent ~ .subscribe ~ this.dealerList:",
            this.dealerList
          );
        }
        this.spinner.hide();
      });
  }

  loadClients() {
    this.spinner.show();
    this.clientService
      .getClients({
        perPage: this.config.itemsPerPage,
        currentPage: this.config.currentPage,
      })
      .subscribe(
        (response: Response<Client>) => {
          if (response.data && response.data.length > 0) {
            this.clients = response.data;
            console.log(
              "🚀 ~ ConsultaComponent ~ .subscribe ~ this.clients:",
              this.clients
            );
          } else if (response.data && response.data.length == 0) {
            this.clients = [];
          }
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.hide();
        }
      );
  }

  getClients() {
    let params = {
      currentPage: this.config.currentPage,
      perPage: this.config.itemsPerPage,
    };
    Object.keys(this.filterClients.controls).forEach((control) => {
      if (this.filterClients.controls[control].value != "") {
        params = {
          [control]: this.filterClients.controls[control].value,
          ...params,
        };
      }
    });
    if (Object.keys(params).length > 0) {
      this.clientService.getClients(params).subscribe(
        (response: Response<Client>) => {
          if (response.data && response.data.length > 0) {
            this.clients = response.data;
          }
        },
        (error: any) => {
          if (error.status == 404) {
            this.clients = [];
          }
        }
      );
    } else {
      this.clientService
        .getClients()
        .subscribe((response: Response<Client>) => {
          if (response.data && response.data.length > 0) {
            this.clients = response.data;
          }
        });
    }
  }

  goToCreate(edit: boolean = false, employee?: Client) {
    if (edit) localStorage.setItem("employeeToEdit", JSON.stringify(employee));
    this.router.navigateByUrl("/creacion");
  }

  deleteEmployee(employeeId: any) {
    this.clientService
      .deleteClient(employeeId)
      .subscribe((response: Response<Client>) => {
        if (response.ok) {
          this.messageResponse = response.message;
          this.loadClients();
        }
      });
  }

  onPageChange(event: any) {
    this.config.currentPage = event;
    this.loadClients();
  }
}
