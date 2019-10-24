import React from 'react';
import { message } from 'antd';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { useStoreActions } from 'easy-peasy';
import { validateRequired } from '../validate';

const Password = Input.Password;
const FormItem = Form.Item;

export default function Unlock() {
  const unlockWallet = useStoreActions(store => store.wallet.unlockWallet);
  function handleSubmit({ password }, { setSubmitting }) {
    const unlocked = unlockWallet(password);
    if (!unlocked) {
      message.error('wrong password');
    }
    setSubmitting(false);
  }

  return (
    <Formik
      initialValues={{ password: '' }}
      onSubmit={handleSubmit}
      render={() => (
        <Form>
          <FormItem name="password" label="password" required validate={validateRequired}>
            <Password name="password" placeholder="keystore password" />
          </FormItem>
          <SubmitButton>Unlock</SubmitButton>
        </Form>
      )}
    />
  );
}
