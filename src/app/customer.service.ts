import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SessionService } from './session.service';
import { Customer } from './customer';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
	
	baseUrl: string;

  	constructor(private httpClient: HttpClient,
				private sessionService: SessionService)
	{
		this.baseUrl = this.sessionService.getRootPath() + 'Customer';
	}
	
	customerLogin(username: string, password: string): Observable<any>
	{
		return this.httpClient.get<any>(this.baseUrl + "/customerLogin?username=" + username + "&password=" + password).pipe
		(
			catchError(this.handleError)
		);
	}
	
	
	createNewCustomer(newCustomer: Customer): Observable<any>
	{		
		let createCustomerReq = {
			"customer": newCustomer,
		};
		
		return this.httpClient.put<any>(this.baseUrl, createCustomerReq, httpOptions).pipe
		(
			catchError(this.handleError)
		);
	}
	
	
	
	private handleError(error: HttpErrorResponse)
	{
		let errorMessage: string = "";
		
		if (error.error instanceof ErrorEvent) 
		{		
			errorMessage = "An unknown error has occurred: " + error.error.message;
		} 
		else 
		{		
			errorMessage = "A HTTP error has occurred: " + `HTTP ${error.status}: ${error.error.message}`;
		}
		
		return throwError(errorMessage);		
	}
}