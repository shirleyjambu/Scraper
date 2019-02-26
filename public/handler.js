const displayArticles = () =>{
  $.ajax({
    method : 'GET',
    url : '/all'
  }).then((dbArticles) =>{
    if(dbArticles.length > 0){
      $("#articles").empty();
      $("#commentDiv").show();
      $("#commentForm :input").prop("disabled", true);
    }else{
      $("#commentDiv").hide();
    }
    
    dbArticles.forEach(article => {
      $('<li>')
      .addClass('list-group-item article')
      .append(article.title)
      .attr('data_id', article._id)
      .appendTo($('#articles')); 
    });
  });
}

const displayComment = (comment) =>{
  console.log(comment.comment);
  $("#comments").append(`<li comment-id='${comment._id}'> ${comment.comment}  - By :  ${comment.by} <i class='fa fa-times deleteC'></i></li>`);
}

const getComments = (id) =>{
  $("#comments").empty();
  $.ajax({
    url : '/getArticle/'+id,
    method : 'GET'
  }).then((dbComments)=>{
    let commentArr = dbComments[0].comments;
    commentArr.forEach(comment =>{
      displayComment(comment);    
    });
  });
};


const deleteComment = (id) =>{
  let article_id = $("article_id").val();
  $.ajax({
    url : '/comment/'+id,
    method : 'DELETE'
  }).then((dbComments)=>{
    console.log('Deleted ');
    //loadArticle(article_id, 'title');
    getComments(article_id);
  });
};


const loadArticle = (id, title) =>{  
  $("#commentDiv").show();
  $("#commentForm :input").prop("disabled", false);
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
    let title = $(this).text();
    //$(this).attr("style","1px solid red");
    $("#comments").empty();
    loadArticle(id , title);
  });

  //OnDelete of every Comment
  $(document).on("click",".deleteC",function(){
    let idC = $(this).closest("li").attr("comment-id");
    console.log("comment id : " + idC);
    deleteComment(idC);
  });

});  