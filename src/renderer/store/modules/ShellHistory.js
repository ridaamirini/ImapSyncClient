// import app from '../../../../package.json';
import revision from '../../../../revision.json';

const WelcomeLine = {
    html: 'Welcome to imapsync <i class="fa fa-heart-o" style="color: red;"></i>',
    color: null
};
const VersionLine = {
    html: 'Version ' + revision.version,
    color: null
};

const state = {
    output: [
        WelcomeLine,
        VersionLine
    ]
};

const mutations = {
    resetOutput (state, output) {
        state.output = [];
        state.output = state.output.concat(output);
        state.output.unshift(WelcomeLine, VersionLine);
    },
    addLine (state, line) {
        state.output.push({
            html: line,
            color: null
        });
    },
    addWarning (state, line) {
        state.output.push({
            html: line,
            color: 'yellow'
        });
    },
    addError (state, line) {
        state.output.push({
            html: line,
            color: 'red'
        });
    }
};

const actions = {
    resetOutput ({ commit }, payload) {
        commit('resetOutput', payload);
    },
    addLine ({ commit }, payload) {
        commit('addLine', payload);
    },
    addWarning ({ commit }, payload) {
        commit('addWarning', payload);
    },
    addError ({ commit }, payload) {
        commit('addError', payload);
    }
};

export default {
    state,
    mutations,
    actions
};
