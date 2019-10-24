import React from 'react';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { useStoreActions } from 'easy-peasy';
import { validateRequired } from '../validate';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Password = Input.Password;

export default function MnemonicImporter() {
  const { importMnemonic } = useStoreActions(store => store.wallet);

  function handleSubmit({ mnemonic, password }, { setSubmitting }) {
    importMnemonic({ mnemonic, password });
    setSubmitting(false);
  }

  return (
    <Formik
      initialValues={{ mnemonic: '', password: '' }}
      onSubmit={handleSubmit}
      render={() => (
        <Form>
          <FormItem name="mnemonic" label="Mnemonic" validate={validateRequired}>
            <TextArea name="mnemonic" />
          </FormItem>
          <FormItem name="password" label="Password" validate={validateRequired}>
            <Password name="password" />
          </FormItem>
          <SubmitButton>Import</SubmitButton>
        </Form>
      )}
    />
  );
}
