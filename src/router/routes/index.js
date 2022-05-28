// ** Routes Imports
import DashboardRoutes from './Dashboards'
import AppRoutes from './Apps'
// import FormRoutes from './Forms'
// import PagesRoutes from './Pages'
// import TablesRoutes from './Tables'
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
  ...AppRoutes
  //...PagesRoutes,
  //...UiElementRoutes,
  //...ExtensionsRoutes,
  //...PageLayoutsRoutes,
  //...FormRoutes,
  //...TablesRoutes,
  //...ChartMapsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
