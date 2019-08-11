// 向服务器发送请求,获取文章分类数据
$.ajax({
    url:'/categories',
    type:'get',
    success:function(res){
        var html=template('categoryTpl',{data:res});
        $('#category').html(html);
    }
})
// 当管理员选择文件的时候,触发事件
$('#feature').on('change',function(){
    // 获取管理员选中的文件
    var files=this.files[0];
    // 创建FormData对象,实现二进制文件上传
    var formdata= new FormData();
    formdata.append('cover',files);
    console.log(formdata);
    
    $.ajax({
        type:'post',
        url:'/upload',
        data:formdata,
        // 告诉ajax方法不要处理data属性对应的参数
        processData:false,
        // 告诉ajax方法不要设置参数类型
        contentType:false,
        success:function(res){
            // console.log(res);
            $('#thumbnail').val(res[0].cover);
            // $('#feature').val(res[0].cover)
            
        }
    })
})
$('#addForm').on('submit',function(){
    // 获取管理员在表单输入的内容
    var formdata=$(this).serialize();
    $.ajax({
        type:'post',
        url:'/posts',
        data:formdata,
        success:function(){
        location.href='/admin/posts.html'
        }
    })
    return false;
})