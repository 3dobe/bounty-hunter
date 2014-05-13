//获取接受的任务列表
function getuserinfo1 (value) {
	$.ajax({
		url:'get /myTasksAccept?publisherId='+publisherId,
		type:'get',
		dataType:'json',
		success:function(data){
			
		}
		});
}
//查找所有任务或根据ID查找任务
function getuserinfo2 (value) {
	$.ajax({
		url:'get /task/:id??id='+$("#").val(),
		type:'post',
		dataType:'json',
		success:function(data){
			
		}
		});
}
//添加任务
function getuserinfo3 (value) {
	$.ajax({
		url:'post /task',
		data:'id='+id,
		type:'post',
		dataType:'json',
		success:function(data){
			
		}
		});
}
//更新任务
function getuserinfo4 (value) {
	$.ajax({
		url:'put /task/:id',
		data:'id='+id,
		type:'put',
		dataType:'json',
		success:function(data){
			
		}
		});
}
//删除任务
function getuserinfo5 (value) {
	$.ajax({
		url:'delete /user/:id',
		data:'id='+id,
		type:'delete',
		dataType:'json',
		success:function(data){
			
		}
		});
}
 //获取用户'我'所发布的任务列表
 function getuserinfo6 (value) {
	$.ajax({
		url:'get /myTasksPublish?publisherId='+publisherId,
		type:'get',
		dataType:'json',
		success:function(data){
			
		}
		});
}
 //接受任务
  function getuserinfo7 (value) {
	$.ajax({
		url:'put /acceptTask',
		data:'accepterId'+accepterId,
		type:'put',
		dataType:'json',
		success:function(data){
			
		}
		});
}
 //完成任务
   function getuserinfo8 (value) {
	$.ajax({
		url:'put /fulfilTask',
		data:'accepterId'+accepterId,
		type:'put',
		dataType:'json',
		success:function(data){
			
		}
		});
}