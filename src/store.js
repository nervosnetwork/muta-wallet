import { action, computed, createStore, thunk } from 'easy-peasy';
import SecureLS from 'secure-ls';
import _ from 'lodash';
import { Muta, utils } from 'muta-sdk';

const ls = new SecureLS();

const defaultConfig = {
  name: 'Cryptape',
  endpoint: 'http://dex.cryptape.com:18000/graphql',
  chainId: '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
};

function getConfig() {
  return _.merge({}, defaultConfig, ls.get('config'));
}

const store = createStore(
  {
    config: {
      name: '',
      endpoint: '',
      chainId: '',
      loaded: false,

      isUnset: computed(config => {
        const { loaded, name, endpoint, chainId } = config;
        return loaded && (!name || !endpoint || !chainId);
      }),

      setConfig: action((state, config) => {
        _.merge(state, defaultConfig, config);
      }),

      loadConfig: thunk((actions, payload, { injections }) => {
        const config = getConfig();
        actions.setConfig(config);
        injections.muta = new Muta({ chainId: config.chainId, endpoint: config.endpoint });
      }),
      saveConfig: thunk((actions, config) => {
        ls.set('config', config);
        document.location.reload();
      }),
    },
    wallet: {
      unlocked: false,
      imported: null,

      setUnlock: action((state, unlocked) => {
        state.unlocked = unlocked;
      }),

      setImported: action((state, imported) => {
        state.imported = imported;
      }),

      initialWallet: thunk((actions) => {
        const imported = ls.getAllKeys().includes('mnemonic');
        actions.setImported(imported);
      }),

      // save the encrypted mnemonic, call only once for an user until mnemonic is cleared
      importMnemonic: thunk((actions, { mnemonic, password }, { getStoreActions, injections }) => {
        const sls = (injections.sls = new SecureLS({
          encodingType: 'aes',
          encryptionSecret: password,
        }));
        sls.set('mnemonic', mnemonic);

        // create 5 accounts by default
        const addHDAccount = getStoreActions().account.addHDAccount;
        _.times(5).forEach(index =>
          addHDAccount({ accountIndex: index, name: `Account ${index + 1}` }),
        );
        actions.setImported(true);
      }),

      // call unlock every time after page is loaded
      unlockWallet: thunk((actions, password, { getStoreActions, injections }) => {
        const sls = (injections.sls = new SecureLS({
          encodingType: 'aes',
          encryptionSecret: password,
        }));
        try {
          const mnemonic = sls.get('mnemonic');

          if (_.isEmpty(sls.get('accounts'))) {
            actions.initialWallet({ password, mnemonic });
          }

          const accountActions = getStoreActions().account;
          accountActions.initialAccount();

          actions.setUnlock(true);
          return true;
        } catch (e) {
          return false;
        }
      }),
    },
    account: {
      accounts: [],
      index: 0,

      initialAccount: thunk((actions) => {
        actions.syncWithStorage();
      }),

      selectedAccount: computed(state => {
        return state.accounts[state.index];
      }),

      addHDAccount: thunk((actions, payload, { injections }) => {
        const { accountIndex, name } = payload;
        const { muta, sls } = injections;
        const mnemonic = sls.get('mnemonic');

        const wallet = muta.hdWalletFromMnemonic(mnemonic);
        const privateKey = wallet.getPrivateKey(accountIndex);
        const account = muta.accountFromPrivateKey(utils.toHex(privateKey));

        const accounts = sls.get('accounts') || [];
        sls.set(
          'accounts',
          accounts.concat({
            name,
            hdAccount: accountIndex,
            privateKey: utils.toHex(privateKey),
            address: utils.toHex(account.address),
          }),
        );
      }),

      addExtraAccount: thunk((actions, payload, { injections }) => {
        const { name, privateKey } = payload;
        const { muta, sls } = injections;
        let account;
        try {
          account = muta.accountFromPrivateKey(privateKey);
        } catch (e) {
          alert(e.message);
          return;
        }

        const accounts = sls.get('accounts') || [];
        sls.set(
          'accounts',
          accounts.concat({
            name,
            privateKey: utils.toHex(privateKey),
            address: utils.toHex(account.address),
          }),
        );
        actions.selectLatestAccount();
      }),

      syncWithStorage: thunk((actions, payload, { injections }) => {
        const { sls } = injections;
        const accounts = sls.get('accounts');
        // TODO remove private key
        actions.setAccounts(accounts);
      }),

      selectLatestAccount: thunk((actions, payload, { getState }) => {
        actions.syncWithStorage();
        const state = getState();
        actions.selectAccount(state.accounts.length - 1);
      }),

      selectAccount: action((state, index) => {
        state.index = index;
      }),

      setAccounts: action((state, accounts) => {
        state.accounts = accounts;
      }),
    },

    asset: {
      assets: ['0xfee0decb4f6a76d402f200b5642a9236ba455c22aa80ef82d69fc70ea5ba20b5'],
    },

    resetAll: thunk(() => {
      ls.removeAll();
      document.location.reload();
    }),
  },
  {
    injections: {
      muta: new Muta(getConfig()),
      sls: null,
    },
  },
);

export default store;
