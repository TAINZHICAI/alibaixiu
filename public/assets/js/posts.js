$.ajax({
    url:'/posts',
    type:'get',
    success:function(res){
        // console.log(res);
        var html=template('postsTpl',res);
        $('#postsBox').html(html);
        
    }
})
function formateDate(data){
    data= new Date(data);
    return data.getFullYear()+'-'+(data.getMonth()+1).toString().padStart(2,0)+'-'+data.getDate().toString().padStart(2,0)
}