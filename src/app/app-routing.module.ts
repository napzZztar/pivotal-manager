import {HomeComponent} from './components/home/home.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TaskManagerComponent} from './components/task-manager/task-manager.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'task-manager',
    component: TaskManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
