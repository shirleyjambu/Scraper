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
      $('#articles').append(createArticleDiv(article));
    });
  });
}

const createArticleDiv = (article) => {
  let $div = `<div class='row py-2'>
  <div class='col-10'><a href='${article.link}' target='new'>${article.title}</a></div>
  <div class='col-2'><i class='fa fa-edit article' data_id='${article._id}'></i></div>
  </div>`;

  let $li = $('<li>')
      .addClass('list-group-item ')
      .append($div);
    
  return  $li;   
      
}

const displayComment = (comment) =>{
  console.log(comment.comment);
  $("#comments").append(`<li comment-id='${comment._id}'>
   <div class='row py-2'>
    <div class='col-6'>
      ${comment.comment}  - By :  ${comment.by} 
    </div>
    <div class='col-6'>  
      <button class='btn btn-info'><i class='fa fa-times deleteC'></i></button>
   </div>
   </li>`);
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
    $("#title").text(dbComments[0].title);
    $("#article_id").val(dbComments[0]._id);
  });
};


const deleteComment = (id) =>{
  let article_id = $("#article_id").val();
  $.ajax({
    url : '/comment/'+id,
    method : 'DELETE',
    data : {article_id:article_id}
  }).then((dbComments)=>{
    console.log('Deleted ');
    
    getComments(article_id);
  });
};


const loadArticle = (id) =>{  
  $("#commentDiv").show();
  $("#commentForm :input").prop("disabled", false);
  getComments(id);
};

$(document).ready(function() {
  
  displayArticles();

  //Event Listeners
  //On click of every list item
  $(document).on("click",".article",function(){
    let id = $(this).attr('data_id');
    
    //$(this).attr("style","1px solid red");
    $("#comments").empty();
    loadArticle(id);
  });

  //OnDelete of every Comment
  $(document).on("click",".deleteC",function(){
    let idC = $(this).closest("li").attr("comment-id");
    console.log("comment id : " + idC);
    deleteComment(idC);
  });

  $(document).on("click","#saveComment",function(event){
    
    event.preventDefault();

    let articleId = $("#article_id").val();

    let commentData = {
      comment : $("#userComment").val().trim(),
      by: $("#by").val().trim(),
      article_id : articleId
    };

    $.ajax({
      url : '/comment',
      method : 'POST',
      data : commentData
    }).then((dbComment)=>{

      //Clear form
      $("#userComment").val("");
      $("#by").val("");

      getComments(articleId);
    });
    
  })

});  