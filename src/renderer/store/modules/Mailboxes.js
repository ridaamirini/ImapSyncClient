/**
 * Created by ridaam on 26.11.17.
 */

const state = {
    list: []
};

if (process.env.NODE_ENV !== 'production') {
    state.list = [
        {
            mailbox_from: 'test1',
            password_from: 'secret1',
            imap_from: 'test1.lamiral.info',
            mailbox_to: 'test2',
            password_to: 'secret2',
            imap_to: 'test2.lamiral.info'
        }
    ];
}

const mutations = {
    resetList (state, list) {
        state.list = [];
        state.list = state.list.concat(list);
    },
    addMailbox (state, mailbox) {
        state.list.push(mailbox);
    },
    removeMailbox (state, index) {
        state.list.splice(index, 1);
    }
};

const actions = {
    resetList ({ commit }, payload) {
        commit('resetList', payload);
    },
    addMailbox ({ commit }, payload) {
        commit('addMailbox', payload);
    },
    removeMailbox ({ commit }, payload) {
        commit('removeMailbox', payload);
    }
};

export default {
    state,
    mutations,
    actions
};
