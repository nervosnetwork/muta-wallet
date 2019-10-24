import React, { useState } from 'react';
import { Button, Card, Row, Col } from 'antd';
import MnemonicCreator from './MnenmoicCreator';
import MnemonicImporter from './MnemonicImporter';

function ChoiceGuide({ onSelect }) {
  return (
    <div>
      <h1>I want to ...</h1>

      <Row gutter={16} style={{ padding: '16px' }}>
        <Col span={12}>
          <Card
            title="Create new onw"
            actions={[
              <Button icon="plus" onClick={() => onSelect('create')}>
                Create
              </Button>,
            ]}
          >
            Create a new wallet.
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Import from existing"
            actions={[
              <Button icon="import" onClick={() => onSelect('import')}>
                Import
              </Button>,
            ]}
          >
            Import from existing 12 mnemonics
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default function Guide() {
  const [step, setStep] = useState('choice');

  return (
    <div>
      {step === 'choice' && <ChoiceGuide onSelect={setStep} />}
      {step === 'create' && <MnemonicCreator onSubmit={() => setStep('import')} />}
      {step === 'import' && <MnemonicImporter />}
    </div>
  );
}
