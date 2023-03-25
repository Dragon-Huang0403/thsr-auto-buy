/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

import {paths} from '../docs/openapi';
import {baseUrl} from './constants';

export function createClient() {
  const client = axios.create({
    baseURL: baseUrl,
    params: {
      $format: 'JSON',
    },
  });
  return client as Client;
}

type Path = keyof paths & `${string}THSR${string}`;
type Response<P extends Path> =
  paths[P]['get']['responses'][200]['content']['application/json'];

export interface Client extends AxiosInstance {
  get: <P extends Path, T = Response<P>, R = AxiosResponse<T>, D = any>(
    url: P | Omit<string, P>,
    config?: AxiosRequestConfig<D>,
  ) => Promise<R>;
}
