import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";

import { CreateNoteComponent } from "./components/create-note/create-note.component";
import { LoginComponent } from "./components/login/login.component";
import { NoteListComponent } from "./components/note-list/note-list.component";
import { RegisterComponent } from "./components/register/register.component";

const appRoutes : Routes = [
    { path: 'note-list', component: NoteListComponent },
    { path: 'create-note', component: CreateNoteComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent}
  ];
  
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}