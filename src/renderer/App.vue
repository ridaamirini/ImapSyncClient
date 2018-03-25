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
  /* CSS */
  :not(input):not(textarea),
  :not(input):not(textarea)::after,
  :not(input):not(textarea)::before {
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
  }
  input, button, textarea, :focus {
    outline: none;
  }
</style>
