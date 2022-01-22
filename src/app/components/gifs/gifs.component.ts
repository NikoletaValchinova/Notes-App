import { Component, OnInit } from '@angular/core';
import {NotesService} from "../../services/notes.service";
import {GifsService} from "../../services/gifs.service";

@Component({
  selector: 'app-gifs',
  templateUrl: './gifs.component.html',
  styleUrls: ['./gifs.component.scss']
})
export class GifsComponent implements OnInit {

  fetchedGifs = [];
  chosenGif: any;

  constructor(private gifsService: GifsService) { }

  ngOnInit(): void {
  }

  searchGif(searchTerm: HTMLInputElement) {
    this.gifsService.performSearch(searchTerm).subscribe(gifs => {
      this.fetchedGifs = gifs.data;
    });
  }

  getChosenGif() {
    return this.chosenGif;
  }

  addGif(gif: any) {
    this.chosenGif = gif;
    this.gifsService.selectGif(gif);
  }

  clearGifs(searchTerm: any) {
    searchTerm.value = '';
    this.fetchedGifs = [];
  }

  removeGif(gifId: string) {

  }
}
