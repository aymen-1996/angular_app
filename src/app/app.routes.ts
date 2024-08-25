import { Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';

export const routes: Routes = [

    { path: 'table', component: TableComponent , data: { title: 'Table' }},
    {
        path: '**',
        redirectTo: 'table'
      }
];
