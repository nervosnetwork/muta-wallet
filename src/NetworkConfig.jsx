import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Alert, Button, Modal } from 'antd';
import { validateRequired } from './validate';

function Config({ onSubmit }) {
  const { name, endpoint, chainId } = useStoreState(store => store.config);
  const { saveConfig } = useStoreActions(store => store.config);

  function handleSubmit(config, { setSubmitting }) {
    saveConfig(config);
    setSubmitting(false);
    if (onSubmit) onSubmit();
  }

  return (
    <Formik
      initialValues={{ name, endpoint, chainId }}
      onSubmit={handleSubmit}
      render={() => (
        <Form>
          <Form.Item name="name" label="Name" required validate={validateRequired}>
            <Input name="name" placeholder="network name" />
          </Form.Item>
          <Form.Item name="endpoint" label="Endpoint" required validate={validateRequired}>
            <Input name="endpoint" placeholder="graphql API endpoint" />
          </Form.Item>
          <Form.Item name="chainId" label="ChainID" required validate={validateRequired}>
            <Input name="chainId" placeholder="chainID" />
          </Form.Item>

          <SubmitButton disabled={false}>Save</SubmitButton>
        </Form>
      )}
    />
  );
}

export default function NetworkConfig() {
  const loadConfig = useStoreActions(store => store.config.loadConfig);
  const networkName = useStoreState(store => store.config.name);
  useEffect(() => {
    loadConfig();
  }, []);

  const [open, setOpen] = useState(false);

  function openConfigModal() {
    setOpen(true);
  }

  function closeConfigModal() {
    setOpen(false);
  }

  return (
    <>
      <Button onClick={openConfigModal}>{networkName}</Button>
      <Modal visible={open} onCancel={closeConfigModal} footer={null}>
        <Alert
          message={
            <div>
              Since Muta not supports CORS this moment, we should install the
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"
              >
                &nbsp;CORS&nbsp;
              </a>
              plugin at first. Remember to disable the plugin after used
            </div>
          }
          type="info"
        />

        <Config onSubmit={closeConfigModal} />
      </Modal>
    </>
  );
}
