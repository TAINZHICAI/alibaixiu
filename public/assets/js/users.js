// 主要是用于操作用户的 
var userArr = new Array();
// 将用户列表展示出来 
$.ajax({
    type:'get',
    url:'/users',
    success:function(res){
        userArr = res;
        render(userArr);
    }
})

// 用于调用template方法 
function render(arr){   
   var str =  template('userTpl',{
        list:arr
    });
    // console.log(str);
    $('tbody').html(str);
}

// 添加用户功能 
$('#userAdd').on('click',function(){
    console.log($('#userForm').serialize());
    // return;
    $.ajax({
        url:'/users',
        type:'post',
        data:$('#userForm').serialize(),
        success:function(res){
            userArr.push(res);
            render(userArr);
            // $('tbody').html('');
        }
    });
});

// 当用户选择文件的时候
$('#avatar').on('change', function () {
	// 用户选择到的文件
	// this.files[0]
	var formData = new FormData();
	formData.append('avatar', this.files[0]);

	$.ajax({
		type: 'post',
		url: '/upload',
		data: formData,
		// 告诉$.ajax方法不要解析请求参数
		processData: false,
		// 告诉$.ajax方法不要设置请求参数的类型
		contentType: false,
		success: function (response) {
			// 实现头像预览功能
            $('#preview').attr('src', response[0].avatar);
            // 将图片的地址添加到表单里面的隐藏域
			$('#hiddenAvatar').val(response[0].avatar)
		}
	})
});


// 编辑用户功能 
$('tbody').on('click','.edit',function(){
userId=$(this).parent().attr('data-id');
    $('#userForm > h2').text('修改用户');

   // 先获取 当前被点击这个元素的祖先 叫tr 
    var trObj = $(this).parents('tr');

    // 获取图片的地址
    var imgSrc = trObj.children(1).children('img').attr('src');
    // 将图片的地址写入到隐藏域 
    $('#hiddenAvatar').val(imgSrc);
    // 如果imgSrc有值 我们
    if(imgSrc){
        $('#preview').attr('src',imgSrc);
    }else{
        $('#preview').attr('src',"../assets/img/default.png");
    }

    // 将对应的内容写入到左边的输入框里面
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());

    var status = trObj.children().eq(4).text();
    if(status == '激活'){
        $('#jh').prop('checked',true);
    }else{
        $('#wjh').prop('checked',true);
    }

    var role = trObj.children().eq(5).text();

    if(role == '超级管理员'){
        $('#admin').prop('checked',true);
    }else{
        $('#normal').prop('checked',true);
    }
    // 当我们点击按钮时,添加功能按钮隐藏,修改功能按钮显现
   $('#userAdd').hide();
   $('#userEdit').show();

});
// 完成修改用户功能
$('#userEdit').on('click',function(){
    //console.log($('#userForm').serialize());
    // 我们需要发送ajax给服务器时需要传递Id 
        $.ajax({
            type:'put',
            url:'/users/'+userId,
            data:$('#userForm').serialize(),
    success:function(res){
    // 我们只是将数据库里面的数据给修改但是我们将userArr这个数组里面的元素给修改
// 我们要从userArr这个数组中将要修改这个数组元素找出来
var index = userArr.findIndex(item=>item._id == userId);
// 根据这个index找到数组的这个元素将它的数据更新
            userArr[index] = res;
// 调用render方法重新渲染页面
render(userArr);
        }
    });
});

$('tbody').on('click','.del',function(){
    if(confirm('你确定要删除吗?')){
        var id=$(this).parent().attr('data-id');
        $.ajax({
            type:'delete',
            url:'/users/'+id,
            success:function(res){
             var index=userArr.findIndex(item=>item._id=res._id)
             userArr.splice(index,1);
             render(userArr);
            }
        })
    }
})
// 实现全选功能   // 全选功能 
$('thead input').on('click', function () {
    // 它的选中状态就直接决定下面的复选框的选中状态
    // prop('参数')   获取某个元素的指定属性的值
    // prop('key',value)   向某个元素设置属性 
    // 先获取上面这个复选框的checked属性值 
    let flag = $(this).prop('checked');
    // 设置下面的复选框  下面的复选框的checked属性值  就是由flag变量的值来决定的
    $('tbody input').prop('checked', flag);
    // 如果上面的全选按钮打勾 我们就显示批量删除按钮
    if (flag) {
      $('.btn-sm').show();
    } else {
      $('.btn-sm').hide();
    }
  });
  // 给下面的复选框注册点击事件 
  $('tbody').on('click', 'input', function () {
    // 如果下面的复选框选中的个数 等于它下面复选框的个数 就表示所有的都选中了 上面那个复选框 就要打勾 反之只要有一个没有选中 那么上面的那个复选框 就不打勾
    if ($('tbody input').length == $('tbody input:checked').length) {
      $('thead input').prop('checked', true);
    } else {
      $('thead input').prop('checked', false);
    }

    // 如果下面的复选框 选中的个数大于1 让它批量删除按钮显示 否则就隐藏 
    if ($('tbody input:checked').length > 1) {
      $('.btn-sm').show();
    } else {
      $('.btn-sm').hide();
    }

  });

  // 给批量删除按钮注册点击事件 
  $('.btn-sm').on('click', function () {
    var ids = [];
    // 想要获取被选中的元素的id属性值 
    var checkUser = $('tbody input:checked');
    // 对checkUser对象进行遍历
    checkUser.each(function (k, v) {
      var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
      ids.push(id);
    });

    // 发送ajax
    $.ajax({
      type: 'delete',
      url: '/users/' + ids.join('-'),
      success: function (res) {
        // res是这一个数组 数组里面放的被删除的元素 元素是一个对象 
        // res.forEach(e => {
        //   var index = userArr.findIndex(item => item._id == e._id);
        //   // 调用splice()
        //   userArr.splice(index, 1);
        //   render(userArr);
        // })

        location.reload();

      }
    })
})
