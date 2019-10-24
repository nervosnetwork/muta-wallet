import React from 'react';
import { Icon, Menu, Dropdown } from 'antd';
import { useStoreActions } from 'easy-peasy';

export default function AccountAvatar() {
  const resetAll = useStoreActions(store => store.resetAll);

  const menu = (
    <Menu>
      <Menu.Item onClick={resetAll}>reset all</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Icon type="setting" style={{ marginLeft: '20px' }} />
    </Dropdown>
  );
}
