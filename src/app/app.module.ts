import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material-module';

import { AppComponent } from './app.component';
import { CreateNoteComponent } from './components/create-note/create-note.component';
import { NoteListComponent } from './components/note-list/note-list.component';
import { NoteItemComponent } from './components/note-list/note-item/note-item.component';
import { ConfirmationDialog } from './components/confirmation-dialog/confirmation-dialog';
import { ChooseTagDialog } from './components/choose-tag-dialog/choose-tag-dialog';
import { MenuComponent } from './components/menu/menu.component';
import { NotesService } from './services/notes.service';
import { AppRoutingModule } from './app-routing.module';
import { MenuService } from './services/menu.service';
import { TextareaResizeDirective } from './directives/textarea-resize.directive';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddFolderDialog } from './components/add-folder-dialog/add-folder-dialog';
import { GifsComponent } from './components/gifs/gifs.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateNoteComponent,
    NoteListComponent,
    NoteItemComponent,
    ConfirmationDialog,
    ChooseTagDialog,
    MenuComponent,
    TextareaResizeDirective,
    LoginComponent,
    RegisterComponent,
    AddFolderDialog,
    GifsComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [NotesService, MenuService],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialog, ChooseTagDialog, AddFolderDialog]
})
export class AppModule { }
