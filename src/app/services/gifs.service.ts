import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private readonly giphySearchLink = "https://api.giphy.com/v1/gifs/search?api_key=SB5egM2FiNFq5Yv3Z6fuVXg7Ut3edBXq&limit=10&q=";
  private readonly giphyFindByIdLink = "https://api.giphy.com/v1/gifs?api_key=SB5egM2FiNFq5Yv3Z6fuVXg7Ut3edBXq&ids="

  private chosenGifBehaviorSubject = new BehaviorSubject(null);
  chosenGif = this.chosenGifBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  performSearch(searchTerm: HTMLInputElement): Observable<any> {
    const apiLink = this.giphySearchLink + searchTerm.value;

    return this.httpClient.get(apiLink);
  }

  selectGif(gif: any) {
    this.chosenGifBehaviorSubject.next(gif);
  }

  getSelectedGif() {
    return this.chosenGif;
  }

  getGifById(gifId: string): Observable<any> {
      const apiLink = this.giphyFindByIdLink + gifId;

      return this.httpClient.get(apiLink);
  }
}
