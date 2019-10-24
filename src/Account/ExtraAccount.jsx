import React from 'react';
import { Modal } from 'antd';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { useStoreActions } from 'easy-peasy';
import { validateRequired, validateUint256 } from '../validate';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

export default function ExtraAccountModal({ onOk, ...modalProps }) {
  const addExtraAccount = useStoreActions(store => store.account.addExtraAccount);

  function handleSubmit({ name, privateKey }, { setSubmitting }) {
    addExtraAccount({ name, privateKey });
    if (onOk) {
      setSubmitting(false);
      onOk();
    }
  }

  return (
    <Modal footer={null} {...modalProps}>
      <Formik
        initialValues={{ name: 'Genesis', privateKey: '' }}
        onSubmit={handleSubmit}
        render={() => (
          <Form>
            <FormItem label="name" name="name" required validate={validateRequired}>
              <Input name="name" placeholder="account name" />
            </FormItem>
            <FormItem label="Private key" name="privateKey" required validate={validateUint256}>
              <TextArea name="privateKey" placeholder="private key" />
            </FormItem>
            <SubmitButton>Import</SubmitButton>
          </Form>
        )}
      />
    </Modal>
  );
}
