import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getIsoCertificateById, updateIsoCertificateById } from 'apiSdk/iso-certificates';
import { Error } from 'components/error';
import { isoCertificateValidationSchema } from 'validationSchema/iso-certificates';
import { IsoCertificateInterface } from 'interfaces/iso-certificate';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function IsoCertificateEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<IsoCertificateInterface>(
    () => (id ? `/iso-certificates/${id}` : null),
    () => getIsoCertificateById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: IsoCertificateInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateIsoCertificateById(id, values);
      mutate(updated);
      resetForm();
      router.push('/iso-certificates');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<IsoCertificateInterface>({
    initialValues: data,
    validationSchema: isoCertificateValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Iso Certificate
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="certificate_name" mb="4" isInvalid={!!formik.errors?.certificate_name}>
              <FormLabel>Certificate Name</FormLabel>
              <Input
                type="text"
                name="certificate_name"
                value={formik.values?.certificate_name}
                onChange={formik.handleChange}
              />
              {formik.errors.certificate_name && <FormErrorMessage>{formik.errors?.certificate_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="validity_date" mb="4">
              <FormLabel>Validity Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.validity_date ? new Date(formik.values?.validity_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('validity_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'iso_certificate',
    operation: AccessOperationEnum.UPDATE,
  }),
)(IsoCertificateEditPage);
