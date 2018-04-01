import app from '../../../../package.json';

const state = {
    version: app.version,
    latest: app.version
};

const mutations = {
    setLatestVersion (state, version) {
        state.latest = version;
    }
};

const actions = {};

export default {
    state,
    mutations,
    actions
};
