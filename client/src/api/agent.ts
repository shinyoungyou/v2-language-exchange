import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { User, UserFormValues } from '@/models/user';
import { router } from '@/routes/Routes';
import { store } from '@/stores/store';
import { PaginatedResult } from '@/models/pagination';
import { Member, Photo } from '@/models/member';
import { Message } from '@/models/message';
import { Creds } from '@/models/creds';
import { MemberLocation } from '@/models/location';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) await sleep(100);    
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    console.log(error);
    
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors) {
                // Validation Error
                const modalStateErrors = [];
                
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                console.log(modalStateErrors);
                
                throw modalStateErrors.flat();
            } else {
                // Bad Request
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    patch: <T>(url: string, body: {}) => axios.patch<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    google: (accessToken: string) => 
        requests.post<User>(`/account/google?accessToken=${accessToken}`, {}),
    complete: (user: any) => requests.post<User>('/account/complete', user),
    changePassword: (creds: Creds) => requests.patch<User>(`/account/password`, creds),
}

const Members = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Member[]>>('/members', { params })
        .then(responseBody),
    details: (username: string) => requests.get<Member>(`/members/${username}`),
    update: (member: Partial<Member>) => requests.put<void>(`/members`, member),

    uploadPhoto: (file: any) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),

    listLocations: () => requests.get<MemberLocation[]>('/locations'),
    changeLocation: (next: {city:string;country:string;}) => requests.patch<User>(`/locations`, next),
}

const Messages = {
    listForUser: (params: URLSearchParams) => axios.get<PaginatedResult<Message[]>>(`/messages`, { params })
        .then(responseBody),
    delete: (id: number) => requests.del(`/messages/${id}`)
}

const agent = {
    Account,
    Members,
    Messages
}

export default agent;