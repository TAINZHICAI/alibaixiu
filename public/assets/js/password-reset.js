$('#modifyForm').on('submit', function () {
	// 获取用户在表单中输入的内容,serialize()将表单内容序列化成一个字符串。
	var formData = $(this).serialize();
	// 调用接口 实现密码修改功能
	$.ajax({
		url: '/users/password',
		type: 'put',
		data: formData,
		success: function () {
			location.href = "/admin/login.html"
		}
	})
	// 阻止表单默认提交的行为
	return false;
});