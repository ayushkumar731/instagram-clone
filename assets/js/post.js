{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $('#post-form');

    newPostForm.submit(async function (e) {
      e.preventDefault();
      document.getElementById('post-form-btn').textContent = 'Processing...';
      const form = new FormData();
      form.append('content', document.getElementById('post-content').value);
      form.append('photo', document.getElementById('post-photo').files[0]);

      await post(form);
      document.getElementById('post-content').value = '';
      document.getElementById('post-photo').value = '';
      document.getElementById('post-form-btn').textContent = 'Post';
    });
  };

  const post = async (data) => {
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/post',
        data,
      });

      let newPost = newPostDom(res.data.data);
      $('#home-post-content').prepend(newPost);
      deletePost($(' .delete-post-button', newPost));
      new ToggleLike($(' .toggle-like-button', newPost));

      new PostComments(res.data.data.id);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  let newPostDom = function (post) {
    return $(`<div class="post-comment-conatiner" id="post-comment-${post.id}">
    <div class="post-container" id="post-${post.id}">
      <div class="user" id="add">
        <div class="user-info">
          <div class="user-photo">
            <img src="/img/users/${post.user.photo}" alt="user-photo" />
          </div>
          <div class="user-name">
            <p><a href="/${post.user._id}">${post.user.name}</a></p>
          </div>
        </div>
       
        <div class="dlt">
          <button class="dlt-btn" data-dlt-id="${post.id}">
            <img src="https://www.flaticon.com/svg/static/icons/svg/1828/1828843.svg" data-dlt-id="${post.id}"  class="delete-post-button"/>
          </button>
        </div>
      </div>
      <div class="post">
        <div class="post-img">
          <img src="/img/posts/${post.photo}" />
        </div>
        <div class="post-activity">
          <button class="like-unlike" >
            <img
              src="https://www.flaticon.com/svg/static/icons/svg/3507/3507627.svg"
              alt='like-icon'
              data-like-model="Post"
              class="toggle-like-button"
              data-likes="${post.likes.length}"
              data-like-id="${post.id}"
            />
          </button>
          <button class="comment-pop-btn">
            <img
              src=" https://www.flaticon.com/svg/static/icons/svg/2462/2462719.svg"
              alt="comment-icon"
            />
          </button>
        </div>
        <div class="likes" id="Post-like-${post.id}">${post.likes.length} likes</div>
        <div class="post-content">
          <p>${post.content}</p>
        </div>
      </div>
      <div  class="comment-form" >
        <form class="form-comment" data-comment-id="${post.id}" id="post-${post.id}-comment-form">
          <input  type="text"
          class="comment"
          placeholder="Add a comment..."
          id="comment-${post.id}"
          name="content"
          required />
          <button class="comment-btn"  id="comment-btn-${post.id}">Post</button>
        </form>
      </div>
    </div>
    <div class="comments-container" id="comment-container-${post.id}"></div>
    </div>
    `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(async function (e) {
      e.preventDefault();
      const { dltId } = e.target.dataset;
      if (dltId) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/post/${dltId}`,
          });
          if (res.data.status === 'success') {
            $(`#post-comment-${res.data.data.id}`).remove();
          }
        } catch (err) {
          alert(err.response.data.message);
        }
      }
    });
  };

  let convertPostsToAjax = function () {
    $('#home-post-content>div').each(function () {
      let self = $(this);
      let deleteButton = $(' .delete-post-button', self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop('id').split('-')[2];
      new PostComments(postId);
    });
  };

  convertPostsToAjax();
  createPost();
}
