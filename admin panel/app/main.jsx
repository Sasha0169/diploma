import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { appTheme, KottsterApp } from '@kottster/react';
import '@kottster/react/dist/style.css';

import schema from '../kottster-app.json';

const pageEntries = import.meta.glob('./pages/**/index.jsx', { eager: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider 
      theme={appTheme} 
      defaultColorScheme='light' 
      forceColorScheme='light'
    >
      <KottsterApp 
        schema={schema} 
        pageEntries={pageEntries}
      />
    </MantineProvider>
  </React.StrictMode>
);