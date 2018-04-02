// import app from '../../../../package.json';
import revision from '../../../../revision.json';

// let version = app.version + '.' + revision.rev;
let version = revision.version;

const state = {
    output: ['Welcome to imapsync <i class="fa fa-heart-o" style="color: red;"></i>', 'Version ' + version]
};

const mutations = {
    resetOutput (state, output) {
        state.output = [];
        state.output = state.output.concat(output);
        state.output.unshift('Welcome to imapsync <i class="fa fa-heart-o" style="color: red;"></i>', 'Version ' + version);
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
