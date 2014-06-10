$(document).ready(function() {
  function alertmsg(){
    if($.cookie('msg')) {
      var msg = $.cookie('msg');
      alertify.log(msg);
      $.removeCookie('msg', { path: '/' });
      console.log($.cookie('msg'));
    }
  }
  alertmsg();
});