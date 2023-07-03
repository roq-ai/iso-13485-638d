import * as yup from 'yup';

export const isoCertificateValidationSchema = yup.object().shape({
  certificate_name: yup.string().required(),
  validity_date: yup.date().required(),
  organization_id: yup.string().nullable(),
});
