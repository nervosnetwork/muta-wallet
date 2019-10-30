import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { Divider, List, message } from 'antd';
import styled from 'styled-components';
import { Muta, utils } from 'muta-sdk';
import AssetBalance from './AssetBalance';
import AccountSwitch from './AccountSwitch';

const BalanceWrapper = styled.div`
  text-align: center;
  max-width: 360px;
  margin: 0 auto;

  .copyable {
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

function useMuta({ chainId, endpoint }) {
  const [muta, setMuta] = useState(null);
  useEffect(() => {
    setMuta(new Muta({ endpoint, chainId }));
  }, [chainId, endpoint]);
  return muta;
}

export default function Account() {
  const { endpoint, chainId } = useStoreState(store => store.config);
  const { address, privateKey } = useStoreState(store => store.account.selectedAccount);
  const { assets } = useStoreState(store => store.asset);

  const muta = useMuta({ endpoint, chainId });

  if (!muta || !address) return null;

  async function handleTransfer({
    receiver,
    carryingAmount,
    feeCycle,
    feeAssetId,
    carryingAssetId,
    onTransferFinish,
  }) {
    const tx = await muta.client.prepareTransferTransaction({
      receiver,
      carryingAmount: utils.toHex(carryingAmount),
      feeCycle: utils.toHex(feeCycle),
      carryingAssetId,
      feeAssetId,
    });

    const account = muta.accountFromPrivateKey(privateKey);
    const signed = account.signTransaction(tx);
    await muta.client.sendTransferTransaction(signed);
    message.success(`transfer requested`);
    onTransferFinish();
  }

  function onFetchBalance(address, assetId) {
    return muta.client.getBalance(address, assetId);
  }

  return (
    <BalanceWrapper>
      <AccountSwitch />
      <Divider style={{margin: '8px 0'}}/>

      <List>
        {assets.map(assetId => (
          <List.Item key={assetId}>
            <AssetBalance
              assetId={assetId}
              address={address}
              onFetchBalance={onFetchBalance}
              onTransfer={handleTransfer}
            />
          </List.Item>
        ))}
      </List>
    </BalanceWrapper>
  );
}
