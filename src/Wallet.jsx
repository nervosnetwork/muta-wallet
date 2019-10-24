import React, { useEffect } from 'react';
import { Col, Layout, Row } from 'antd';
import styled from 'styled-components';
import Guide from './Guide';
import NetworkConfig from './NetworkConfig';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Accounts from './Account';
import AccountAvatar from './Account/Avatar';

const { Content } = Layout;

const Header = styled(Layout.Header)`
  background-color: #ccc;
`;

const AppWrapper = styled.div`
  max-width: 960px;
  min-height: 480px;
  margin: 20px auto 0;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.08);
`;

function AppHeader() {
  return (
    <Row type="flex">
      <Col span={12}>
        <strong>
          MUWA&nbsp;
          <small>
            (<code>Mu</code>ta <code>Wa</code>llet)
          </small>
        </strong>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <NetworkConfig />
        <AccountAvatar />
      </Col>
    </Row>
  );
}

export default function Wallet() {
  const initialWallet = useStoreActions(store => store.wallet.initialWallet);
  const walletImported = useStoreState(store => store.wallet.imported);

  useEffect(() => {
    initialWallet();
  }, []);

  if (walletImported === null) return null;

  return (
    <AppWrapper>
      <Layout className="main">
        <Header theme="dark">
          <AppHeader />
        </Header>
        <Content style={{ padding: '20px' }}>{walletImported ? <Accounts /> : <Guide />}</Content>
      </Layout>
    </AppWrapper>
  );
}
