const displayArticles = () =>{
  $("#spinner").show();
  $.ajax({
    method : 'GET',
    url : '/all'
  }).then((dbArticles) =>{
    dbArticles.forEach(article => {
      $('<li>')
      .addClass('list-group-item article')
      .append(article.title)
      .attr('data_id', article._id)
      .appendTo($('#articles')); 
    });
  });
}

const getComments = (id) =>{
  $.ajax({
    url : '/getArticle/'+id,
    method : 'GET'
  }).then((dbComments)=>{
    console.log('Got Article');
    console.log(dbComments[0]);
    console.log(dbComments[0].link);

    let commentArr = dbComments[0].comments;
    console.log(commentArr.length);
  
    commentArr.forEach(comment =>{
      console.log(comment.comment);
      $("#comments").append(comment.comment + " - By :" + comment.by);
    });

  //   return commentArr;
  });
};

const loadComments = (id, title) =>{  
  getComments(id);
  $("#title").text(title);
  $("#article_id").val(id);
};

$(document).ready(function() {
  
  displayArticles();

  //Event Listeners
  //On click of every list item
  $(document).on("click",".article",function(){
    let id = $(this).attr('data_id');
    let title = $(this).text()
    $("#comments").empty();
    loadComments(id , title);
  });

});  