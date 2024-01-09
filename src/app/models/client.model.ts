import { IdentificationPK } from "./Identification-pk-model";

export class Client {
  identificationPK?: IdentificationPK;
  firstSurname?: string;
  secondSurname?: string;
  firstName?: string;
  secondName?: string;
  state?: boolean;
  localityID?: number;
  dealerId?: number;
  registrationDate?: Date;
  modificationDate?: Date;
}
