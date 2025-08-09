import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WasusiService {

  private _httpClient = inject(HttpClient);

  constructor() { }

  getKNN( n:number=3, horanum:number=12, diasemana:number=2, semanyo:number=2, semanyoplus:number=0, semanyominus:number=0, long:number=1 ): Observable<any> {

    const options = {params: new HttpParams()
      .set('n',n)
      .set('horanum',horanum)
      .set('diasemana',diasemana)
      .set('semanaanyo',semanyo)
      .set('semanaanyoplus',semanyoplus)
      .set('semanaanyominus',semanyominus)
      .set('long',long)}
    return this._httpClient.get(environment.apiUrl+'/knn', options );

  }

  getControl( P:number[]=[0], tl:number=0, ps:number=0, max:number=0, min:number=0, long:number=1, wcm:number=1, ppc:number=1, constA:number=1, constB:number=1, constC:number=1) {
    const options = {params: new HttpParams()
      .set('P',P.toString())
      .set('tl',tl)
      .set('ps',ps)
      .set('max',max)
      .set('min',min)
      .set('min',min)
      .set('long',long)
      .set('wcm',wcm)
      .set('ppc',ppc)
      .set('constA',constA)
      .set('constB',constB)
      .set('constC',constC)
    }
    return this._httpClient.get(environment.apiUrl+'/control', options );
  }
}
