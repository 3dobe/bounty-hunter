$(document).ready(function() {
  function alertmsg(){
    if($.cookie("msg")) {
      var msg = $.cookie("msg");
      alertify.log(msg);
      //alert(msg);
      $.removeCookie('msg');
    }
  }
  alertmsg();
});