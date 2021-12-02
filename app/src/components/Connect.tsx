import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React from 'react';

export function Connect() {
  const {
    status,
    availableInstallTypes,
    availableConnections,
    connect,
    install,
    disconnect,
  } = useWallet();

  return (
    <div>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <button
              key={'install-' + connectType}
              onClick={() => install(connectType)}
            >
              Install {connectType}
            </button>
          ))}
          {availableConnections.map(({ type, name, icon, identifier = '' }) => (
            <button
              key={'connection-' + type + identifier}
              onClick={() => connect(type, identifier)}
            >
              <img
                src={icon}
                alt={name}
                style={{ width: '1em', height: '1em' }}
              />
              {name} [{identifier}]
            </button>
          ))}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <button onClick={() => disconnect()}>Disconnect</button>
      )}
    </div>
  );
}
