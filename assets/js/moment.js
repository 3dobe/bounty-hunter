$(document).ready(function() {
  $('.last_active_time').each(function(i, el){
    var $el = $(el);
    var date = $el.attr('data-date');
    //myMoment = moment(date).format('YYYY-MM-DD HH:mm:ss');
    var myMoment = moment(date).fromNow();
    $el.text(myMoment);
  });
});