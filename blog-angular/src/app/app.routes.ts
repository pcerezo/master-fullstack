import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { ModuleWithProviders } from '@angular/core';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "inicio", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "registro", component: RegisterComponent },
    { path: "logout/:sure", component: LoginComponent},
    { path: "ajustes", component: UserSettingsComponent},
    { path: "**", component: ErrorComponent }
];

// Exportar configuración
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);