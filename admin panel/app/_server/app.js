import { createApp } from '@kottster/server';
import { dataSourceRegistry } from './data-sources/registry';
import schema from '../../kottster-app.json';

export const app = createApp({
  schema,

  /* 
   * For security, consider moving the secret key to an environment variable: 
   * https://kottster.app/docs/deploying#before-you-deploy
   */
  secretKey: 'bLLvnindf3BZZO8slIHWaNaA',
});

app.registerDataSources(dataSourceRegistry);