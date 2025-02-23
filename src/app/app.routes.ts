import { Routes, provideRouter} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { authGuard } from './guard/auth.guard';
import { CategoryComponent } from './pages/category/category.component';
import { ItemsComponent } from './pages/items/items.component';
import { BillsComponent } from './pages/bills/bills.component';
import { GenerateBillComponent } from './pages/generate-bill/generate-bill.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { ExpenseCategoryComponent } from './pages/expense-category/expense-category.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { ReportsComponent } from './pages/reports/reports.component';



 const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'',
    component:LayoutComponent,
    children:[
               {
                  path:'dashboard',
                  component: DashboardComponent,
                  canActivate: [authGuard]
                },
              ]
  },
  {
    path:'users',
    component: UsersComponent,
    canActivate: [authGuard]
  },
  {
     path:'shops',
     component: ShopsComponent,
     canActivate: [authGuard]
  },
  {
     path:'category',
     component: CategoryComponent,
     canActivate: [authGuard]
 },
 {
     path:'items',
     component: ItemsComponent,
     canActivate: [authGuard]
 },
 {
      path:'bills',
      component: BillsComponent,
      canActivate: [authGuard]
 },
 {
      path:'generate-bill',
      component: GenerateBillComponent,
      canActivate: [authGuard]
 },
  {
      path:'invoice',
      component: InvoiceComponent,
      canActivate: [authGuard]
 },
 {
      path:'logout',
      component: LogoutComponent,
      canActivate: [authGuard]
 },
{
      path:'expense-category',
      component: ExpenseCategoryComponent,
      canActivate: [authGuard]
},
{
      path:'expense',
      component: ExpenseComponent,
      canActivate: [authGuard]
},
{
      path:'reports',
      component: ReportsComponent,
      canActivate: [authGuard]
}
];
export const appRouter = provideRouter(routes);
