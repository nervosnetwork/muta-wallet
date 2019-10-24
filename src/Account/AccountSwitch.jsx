import React, { useState } from 'react';
import { Dropdown, Menu, Row, Col, Icon } from 'antd';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { copy } from './index';
import styled from 'styled-components';
import ExtraAccount from './ExtraAccount';

const SwitchWrapper = styled.div`
  display: inline-block;
  max-width: 120px;
  padding: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    background: #eee;
    border-radius: 3px;
  }
`;

function Operation() {
  const [shown, setShown] = useState(false);

  function showModal() {
    setShown(true);
  }

  function closeModal() {
    setShown(false);
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={showModal}>
        <span>
          <Icon type="import" /> Import private key
        </span>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <ExtraAccount visible={shown} onCancel={closeModal} onOk={closeModal} />
      <Dropdown overlay={menu} trigger={['click']}>
        <Icon type="ellipsis" style={{ fontSize: '25px', cursor: 'pointer' }} />
      </Dropdown>
    </>
  );
}

export default function AccountSwitch() {
  const { accounts, selectedAccount } = useStoreState(store => store.account);
  const { selectAccount } = useStoreActions(store => store.account);

  const menu = (
    <Menu>
      {accounts.map((account, i) => (
        <Menu.Item key={i} onClick={() => selectAccount(i)}>
          {account.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Row>
      <Col span={3} />
      <Col span={18}>
        <SwitchWrapper>
          <Dropdown overlay={menu}>
            <div>
              <strong>{selectedAccount.name}</strong>
              <br />
              <small
                style={{ width: '100%' }}
                className="copyable"
                onClick={() => copy(selectedAccount.address)}
              >
                {selectedAccount.address}
              </small>
            </div>
          </Dropdown>
        </SwitchWrapper>
      </Col>
      <Col span={3}>
        <Operation />
      </Col>
    </Row>
  );
}
