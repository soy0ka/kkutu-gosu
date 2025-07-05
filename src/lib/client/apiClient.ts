/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatcher, request } from 'undici'
import { IncomingHttpHeaders } from 'undici/types/header'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type ApiClientOptions = {
	baseUrl?: string
	headers?: Record<string, string>
	timeout?: number
}

export type ApiResponse<T> = {
	data: T
	status: number
	headers: IncomingHttpHeaders
}

type RequestOptions = Omit<Dispatcher.RequestOptions, 'origin' | 'path' | 'method'> & {
	headers?: Record<string, string>
	body?: any
}

export class ApiClient {
	private readonly baseUrl: string
	private readonly defaultHeaders: Record<string, string>
	private readonly timeout: number

	constructor(options: ApiClientOptions) {
		this.baseUrl = options.baseUrl || ''
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...options.headers
		}
		this.timeout = options.timeout ?? 30_000 // default 30s
	}

	public get<T>(path: string, options: RequestOptions = {}) {
		return this.request<T>('GET', path, options)
	}

	public post<T>(path: string, data?: any, options: RequestOptions = {}) {
		return this.request<T>('POST', path, { ...options, body: data })
	}

	public put<T>(path: string, data?: any, options: RequestOptions = {}) {
		return this.request<T>('PUT', path, { ...options, body: data })
	}

	public delete<T>(path: string, options: RequestOptions = {}) {
		return this.request<T>('DELETE', path, options)
	}

	public patch<T>(path: string, data?: any, options: RequestOptions = {}) {
		return this.request<T>('PATCH', path, { ...options, body: data })
	}

	private async request<T>(
		method: HttpMethod,
		path: string,
		options: RequestOptions
	): Promise<ApiResponse<T>> {
		const url = `${this.baseUrl}${path}`
		const headers = {
			...this.defaultHeaders,
			...(options.headers ?? {})
		}

		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), this.timeout)

		try {
			const res = await request(url, {
				...options,
				method,
				headers,
				signal: controller.signal
			})

			const body = await res.body.json()

			return {
				data: body as T,
				status: res.statusCode,
				headers: res.headers
			}
		} catch (err) {
			if ((err as any)?.name === 'AbortError') {
				throw new Error(`Request to ${url} timed out after ${this.timeout}ms`)
			}
			throw err
		} finally {
			clearTimeout(timeoutId)
		}
	}
}
