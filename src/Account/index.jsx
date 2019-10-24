import React from 'react';
import { useStoreState } from 'easy-peasy';
import Unlock from './Unlock';
import Balance from './Account';
import { copyTextToClipboard } from '../utils';
import { message } from 'antd';

export default function Accounts() {
  const { unlocked } = useStoreState(store => store.wallet);

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto' }}>{unlocked ? <Balance /> : <Unlock />}</div>
  );
}

export function copy(text) {
  copyTextToClipboard(text);
  message.info('copied ', 1);
}
