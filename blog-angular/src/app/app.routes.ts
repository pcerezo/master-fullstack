import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { ModuleWithProviders } from '@angular/core';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "inicio", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "registro", component: RegisterComponent },
    { path: "logout/:sure", component: LoginComponent},
    { path: "ajustes", component: UserSettingsComponent},
    { path: "crear-categoria", component: CategoryNewComponent},
    { path: "lista-categorias", component: CategoryListComponent},
    //{ path: "categoria/{id}", component: CategoryDetailsComponent},
    { path: "crear-post", component: PostNewComponent},
    { path: "editar-post/:id", component: PostEditComponent},
    { path: "entrada/:id", component: PostDetailsComponent},
    { path: "**", component: ErrorComponent }
];

// Exportar configuración
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);