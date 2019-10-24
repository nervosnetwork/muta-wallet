import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Tag, Tooltip, Typography } from 'antd';
import { Formik } from 'formik';
import { Form, Input, InputNumber, SubmitButton } from '@jbuschke/formik-antd';
import { useSpring, animated } from 'react-spring';
import { copy } from './';
import { validateAccountAddress, validateRequired } from '../validate';

const FormItem = Form.Item;

function Amount({ value }) {
  const props = useSpring({ value });
  return <animated.span>{props.value.interpolate(x => Math.ceil(x))}</animated.span>;
}

function TransferModal({ assetId, visible, onCancel, onSubmit }) {
  return (
    <Modal title="Transfer" visible={visible} onCancel={onCancel} footer={null}>
      <Formik
        onSubmit={onSubmit}
        initialValues={{ feeAssetId: assetId, feeCycle: 0xff, receiver: '', carryingAmount: 0 }}
        render={() => (
          <Form>
            <FormItem name="receiver" label="Receiver" required validate={validateAccountAddress}>
              <Input name="receiver" placeholder="receiver" />
            </FormItem>
            <FormItem name="carryingAmount" label="Amount" required validate={validateRequired}>
              <InputNumber name="carryingAmount" placeholder="receiver" />
            </FormItem>
            <FormItem name="feeCycle" label="Cycle fee" required validate={validateRequired}>
              <InputNumber name="feeCycle" placeholder="Cycle fee" />
            </FormItem>
            <FormItem name="feeAssetId" label="Fee Asset" required validate={validateRequired}>
              <Input name="feeAssetId" />
            </FormItem>
            <SubmitButton>OK</SubmitButton>
          </Form>
        )}
      />
    </Modal>
  );
}

export default function AssetBalance({ assetId, address, onFetchBalance, onTransfer }) {
  const [shown, setShown] = useState(false);
  const [balance, setBalance] = useState(0);

  async function refreshBalance(address) {
    const newBalance = await onFetchBalance(address, assetId);
    setBalance(newBalance);
  }

  useEffect(() => {
    refreshBalance(address);
    const interval = setInterval(() => refreshBalance(address), 1000);
    return () => clearInterval(interval);
  }, [address, onFetchBalance]);

  function showTransferModal() {
    setShown(true);
  }

  function closeTransferModal() {
    setShown(false);
  }

  function handleSubmit({ carryingAmount, receiver, feeAssetId, feeCycle }, { setSubmitting }) {
    if (onTransfer) {
      onTransfer({
        carryingAmount,
        receiver,
        feeAssetId,
        feeCycle,
        carryingAssetId: assetId,
        onTransferFinish() {
          setSubmitting(false);
          closeTransferModal();
        },
      });
    }
  }

  const asset = (
    <Tooltip title="asset id">
      <Tag
        style={{ marginLeft: '8px' }}
        className="copyable"
        size="large"
        color="gold"
        onClick={() => copy(assetId)}
      >
        {assetId.slice(0, 8)}
      </Tag>
    </Tooltip>
  );

  return (
    <>
      <Card
        title={asset}
        style={{ width: '300px', margin: '0 auto' }}
        actions={[
          <Button
            type="primary"
            style={{ width: '100%' }}
            onClick={() => showTransferModal(address, asset)}
          >
            Transfer
          </Button>,
        ]}
      >
        <Typography.Title style={{ margin: '0 auto' }}>
          <Amount value={balance} />
        </Typography.Title>
      </Card>
      <TransferModal
        visible={shown}
        assetId={assetId}
        onCancel={closeTransferModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
