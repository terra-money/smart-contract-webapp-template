import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';
import { Connect } from 'components/Connect';
import { Query } from 'components/Query';
import { Tx } from 'components/Tx';
import { ContractsProvider } from 'contexts/contracts';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  return (
    <div>
      <header>
        <Connect />
        <Query />
        <Tx />
      </header>
    </div>
  );
}

const queryClient = new QueryClient();

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <WalletProvider {...chainOptions}>
        <ContractsProvider>
          <App />
        </ContractsProvider>
      </WalletProvider>
    </QueryClientProvider>,
    document.getElementById('root'),
  );
});
