
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
      "chunk-WMSI6VRR.js"
    ],
    "route": "/login"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7170, hash: '52b8eb70cd0661c232e14585a905eb0d3827df448fc4bca2c3263fb5d790cb4f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1001, hash: '64aa8225ced1ae5e9a026268825b4f4ac54da2321a08870fc87484f0248baaad', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 21289, hash: 'c8ad96b13d30e084a2e24a8f2b00fb01e305292689e428dc73ec2b4361196a14', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-5GTLQRZL.css': {size: 368743, hash: 'NVk4d5iIDzM', text: () => import('./assets-chunks/styles-5GTLQRZL_css.mjs').then(m => m.default)}
  },
};
