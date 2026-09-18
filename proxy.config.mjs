const backendHost = '127.0.0.1';
const backendPort = 8080;

/**
 * @type {import('vite').CommonServerOptions['proxy']}
 */
export default {
  '^/(api|management|v3/api-docs|h2-console)': {
    target: `http://${backendHost}:${backendPort}`,
    xfwd: true,
  },
};
