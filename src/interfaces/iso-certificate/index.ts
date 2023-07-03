import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface IsoCertificateInterface {
  id?: string;
  certificate_name: string;
  validity_date: any;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface IsoCertificateGetQueryInterface extends GetQueryInterface {
  id?: string;
  certificate_name?: string;
  organization_id?: string;
}
