/**
 * Created by ridaam on 26.11.17.
 */

const state = {
    list: []
};

const mutations = {
    resetList (state, list) {
        state.list = [];
        state.list = state.list.concat(list);
    },
    addMailbox (state, mailbox) {
        state.list.unshift(mailbox);
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
