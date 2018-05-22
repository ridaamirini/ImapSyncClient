<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'imapsyncclient'
  };
</script>

<style>
  body {
    -ms-overflow-style: scrollbar;
    -webkit-app-region: drag;
  }

  input[type="submit"],
  input[type="reset"],
  input[type="button"],
  input[type="text"],
  button,
  textarea {
    -webkit-app-region: no-drag;
  }

  .container {
    -webkit-app-region: no-drag;
  }

  :not(input):not(textarea),
  :not(input):not(textarea)::after,
  :not(input):not(textarea)::before {
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
  }

  h1, h2, h3, h4, h5, h6 {
    -webkit-user-select: none;
  }

  input, button, textarea, :focus {
    outline: none;
  }
</style>
