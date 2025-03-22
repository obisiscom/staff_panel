import { API } from "@/constants/api";
import { IDataResult } from "../results/IDataResult";
import { ErrorDataResult } from "../results/ErrorDataResult";
import { SuccessDataResult } from "../results/SuccessDataResult";


export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export class ApiClient {
    private baseUrl: string;
    private headers: HeadersInit;

    /**
     * ApiClient constructor
     * @param baseUrl - API'nin temel URL'i
     * @param defaultHeaders - Varsayılan HTTP başlıkları
     */
    constructor(defaultHeaders: HeadersInit = {}) {
        this.baseUrl = API.BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
    }

    /**
     * HTTP isteği yapan genel metod
     * @param method - HTTP metodu (GET, POST, PUT, DELETE, vb.)
     * @param endpoint - İstek yapılacak endpoint
     * @param data - İstek gövdesi (body) için veri
     * @param additionalHeaders - Ek HTTP başlıkları
     * @returns Promise<IDataResult<T>> - İstek sonucu
     */
    private async request<T>(
        method: HttpMethod,
        endpoint: string,
        data?: any,
        additionalHeaders?: HeadersInit
    ): Promise<IDataResult<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers = { ...this.headers, ...additionalHeaders };

            const options: RequestInit = {
                method,
                headers,
                credentials: 'include',
            };

            // Body ekle (GET ve DELETE isteklerinde body olmaz)
            if (method !== HttpMethod.GET && method !== HttpMethod.DELETE && data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            // JSON olarak yanıtı parse et
            let responseData: any = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            }

            // Başarılı yanıt kontrolü
            if (response.ok) {
                // API'den gelen yapı IDataResult şeklindeyse direkt kullan
                if (responseData && 'success' in responseData && 'data' in responseData) {
                    return responseData as IDataResult<T>;
                }

                // API kendi IDataResult yapısında yanıt vermiyorsa, yanıtı bizim yapımıza dönüştür
                return new SuccessDataResult<T>(
                    responseData as T,
                    `${method} request to ${endpoint} successful`
                );
            } else {
                // Hata yanıtı
                let errorMessage = 'An error occurred';

                // API'den gelen hata mesajını değerlendir
                if (responseData) {
                    if (typeof responseData === 'string') {
                        errorMessage = responseData;
                    } else if ('message' in responseData) {
                        errorMessage = responseData.message;
                    } else if ('error' in responseData) {
                        errorMessage = responseData.error;
                    }
                } else {
                    errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
                }

                return new ErrorDataResult<T>(null, errorMessage);
            }
        } catch (error) {
            // İstek hatası
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return new ErrorDataResult<T>(null, errorMessage);
        }
    }

    /**
     * GET isteği
     * @param endpoint - İstek yapılacak endpoint
     * @param headers - Ek HTTP başlıkları
     * @returns Promise<IDataResult<T>> - İstek sonucu
     */
    public async get<T>(endpoint: string, headers?: HeadersInit): Promise<IDataResult<T>> {
        return this.request<T>(HttpMethod.GET, endpoint, undefined, headers);
    }

    /**
     * POST isteği
     * @param endpoint - İstek yapılacak endpoint
     * @param data - İstek gövdesi için veri
     * @param headers - Ek HTTP başlıkları
     * @returns Promise<IDataResult<T>> - İstek sonucu
     */
    public async post<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<IDataResult<T>> {
        return this.request<T>(HttpMethod.POST, endpoint, data, headers);
    }

    /**
     * PUT isteği
     * @param endpoint - İstek yapılacak endpoint
     * @param data - İstek gövdesi için veri
     * @param headers - Ek HTTP başlıkları
     * @returns Promise<IDataResult<T>> - İstek sonucu
     */
    public async put<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<IDataResult<T>> {
        return this.request<T>(HttpMethod.PUT, endpoint, data, headers);
    }

    /**
     * DELETE isteği
     * @param endpoint - İstek yapılacak endpoint
     * @param headers - Ek HTTP başlıkları
     * @returns Promise<IDataResult<T>> - İstek sonucu
     */
    public async delete<T>(endpoint: string, headers?: HeadersInit): Promise<IDataResult<T>> {
        return this.request<T>(HttpMethod.DELETE, endpoint, undefined, headers);
    }

    /**
     * PATCH isteği
     * @param endpoint - İstek yapılacak endpoint
     * @param data - İstek gövdesi için veri
     * @param headers - Ek HTTP başlıkları
     * @returns Promise<IDataResult<T>> - İstek sonucu
     */
    public async patch<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<IDataResult<T>> {
        return this.request<T>(HttpMethod.PATCH, endpoint, data, headers);
    }

    /**
     * Token ekleyerek yeni bir instance oluşturur
     * @param token - JWT veya diğer authorization token
     * @returns ApiClient - Authorization header'ı eklenmiş yeni bir ApiClient
     */
    public withToken(token: string): ApiClient {
        return new ApiClient({
            ...this.headers,
            'Authorization': `Bearer ${token}`
        });
    }
}