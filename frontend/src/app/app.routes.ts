import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks'
    },

    {
        path: 'tasks',
        loadComponent: () =>
            import(
                './tasks/pages/task-page/task-page'
            )
                .then(
                    module => module.TaskPage
                )
    },

    {
        path: 'tasks/:taskId/edit',
        loadComponent: () =>
            import(
                './tasks/pages/task-edit-page/task-edit-page'
            )
                .then(
                    module =>
                        module.TaskEditPage
                )
    },

    {
        path: '**',
        redirectTo: 'tasks'
    }

];
