import { HDWallet } from 'muta-sdk';
import React, { useMemo, useState } from 'react';
import { Button, Card } from 'antd';

export default function MnemonicCreator({ onSubmit }) {
  const [created, setCreated] = useState(false);
  const mnemonic = useMemo(() => HDWallet.generateMnemonic(), undefined);
  return (
    <Card
      title="Keep mnemonics "
      actions={[
        <Button type="danger" disabled={!created} onClick={onSubmit}>
          I have kept them on a stone!
        </Button>,
      ]}
    >
      {created ? (
        <p>
          <strong>{mnemonic}</strong>
        </p>
      ) : (
        <div>
          <p>
            You will see 12 mnemonic word, this 12 words is very important, missing them and you
            will miss your Muta asset
          </p>
          <Button type="danger" onClick={() => setCreated(true)}>
            OK, I know
          </Button>
        </div>
      )}
    </Card>
  );
}
