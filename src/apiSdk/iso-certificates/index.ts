import axios from 'axios';
import queryString from 'query-string';
import { IsoCertificateInterface, IsoCertificateGetQueryInterface } from 'interfaces/iso-certificate';
import { GetQueryInterface } from '../../interfaces';

export const getIsoCertificates = async (query?: IsoCertificateGetQueryInterface) => {
  const response = await axios.get(`/api/iso-certificates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createIsoCertificate = async (isoCertificate: IsoCertificateInterface) => {
  const response = await axios.post('/api/iso-certificates', isoCertificate);
  return response.data;
};

export const updateIsoCertificateById = async (id: string, isoCertificate: IsoCertificateInterface) => {
  const response = await axios.put(`/api/iso-certificates/${id}`, isoCertificate);
  return response.data;
};

export const getIsoCertificateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/iso-certificates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteIsoCertificateById = async (id: string) => {
  const response = await axios.delete(`/api/iso-certificates/${id}`);
  return response.data;
};
