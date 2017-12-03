const state = {
    output: ['Welcome to imapsync <i class="fa fa-heart-o" style="color: red;"></i>']
};

const mutations = {
    resetOutput (state, output) {
        state.output = [];
        state.output = state.output.concat(output);
        state.output.unshift('Welcome to imapsync <i class="fa fa-heart-o" style="color: red;"></i>');
    },
    addLine (state, line) {
        state.output.push(line);
    }
};

const actions = {
    resetOutput ({ commit }, payload) {
        commit('resetOutput', payload);
    },
    addLine ({ commit }, payload) {
        commit('addLine', payload);
    }
};

export default {
    state,
    mutations,
    actions
};
