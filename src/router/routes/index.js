// ** Routes Imports
import DashboardRoutes from './Dashboards'
import AppRoutes from './Apps'
import TablesRoutes from './Tables'
// import FormRoutes from './Forms'
 import PagesRoutes from './Pages'
// import ChartMapsRoutes from './ChartsMaps'
// import UiElementRoutes from './UiElements'
// import ExtensionsRoutes from './Extensions'
// import PageLayoutsRoutes from './PageLayouts'

// ** Document title
const TemplateTitle = '%s'

// ** Default Route
const DefaultRoute = '/apps/order/list'

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...AppRoutes,
  ...TablesRoutes,
  ...PagesRoutes,
  //...UiElementRoutes,
  //...ExtensionsRoutes,
  //...PageLayoutsRoutes,
  //...FormRoutes,
  //...ChartMapsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
