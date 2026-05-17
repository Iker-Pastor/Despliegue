
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-Z52QL2W3.js",
      "chunk-AEG7K7DS.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "redirectTo": "/dashboard/usuarios",
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "route": "/dashboard/eventos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "route": "/dashboard/noticias"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "route": "/dashboard/estadisticas"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "route": "/dashboard/organizaciones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XVQV3VCJ.js"
    ],
    "route": "/dashboard/logs"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7299, hash: '19d495560079e04a5972d06c6558f33f9f0cf890474117ca84f9fefbd8e7cc82', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1130, hash: 'e4bbf7f8e441359270a249e12d0bf5f9a09ac2972b04731c718145d1d95add10', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 21485, hash: '2643838fcabf84d9a476602bbd088c566768d7b64c316d7f1c52b4235f683cee', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'dashboard/organizaciones/index.html': {size: 27041, hash: '8e3a167470dafb87818a6c44f7e7a2548f54a9dbfd85a709c82e3be17b3895a4', text: () => import('./assets-chunks/dashboard_organizaciones_index_html.mjs').then(m => m.default)},
    'dashboard/logs/index.html': {size: 30695, hash: '3170d52566822ce4fedd0c6a8829e6153e0a3406e4e261697c6da587ee3bb6cf', text: () => import('./assets-chunks/dashboard_logs_index_html.mjs').then(m => m.default)},
    'dashboard/usuarios/index.html': {size: 27554, hash: '36e25e44cdc752fb448239e98034a475af5a4269252d3391dd99efa2f3ce4931', text: () => import('./assets-chunks/dashboard_usuarios_index_html.mjs').then(m => m.default)},
    'dashboard/eventos/index.html': {size: 27583, hash: 'e969e47cc0a47023d901735812ed365e0ae29cf5fbec18dbdcf1271ce56703f5', text: () => import('./assets-chunks/dashboard_eventos_index_html.mjs').then(m => m.default)},
    'dashboard/estadisticas/index.html': {size: 37495, hash: '7adf2d0a39467dea29fe4ec2803e142863bf88b68e703c7ddc60426ca6a27690', text: () => import('./assets-chunks/dashboard_estadisticas_index_html.mjs').then(m => m.default)},
    'dashboard/noticias/index.html': {size: 27566, hash: '24bf7a1eb60c32f4c437b421a9571517e09f0d6f7cf189a4689df18bdf923c6a', text: () => import('./assets-chunks/dashboard_noticias_index_html.mjs').then(m => m.default)},
    'styles-AHXXY74C.css': {size: 368719, hash: 'X1xklm+hXfg', text: () => import('./assets-chunks/styles-AHXXY74C_css.mjs').then(m => m.default)}
  },
};
