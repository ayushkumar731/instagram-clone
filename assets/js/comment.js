class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.commentContainer = $(`#comment-container-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comment-form`);

    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    $(' .delete-comment-button', this.commentContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    this.newCommentForm.submit(async function (e) {
      e.preventDefault();
      let self = this;
      const { commentId } = e.target.dataset;

      document.getElementById(`comment-btn-${commentId}`).textContent =
        'Pro...';
      const content = document.getElementById(`comment-${commentId}`).value;

      await comment(content, commentId);
      document.getElementById(`comment-${commentId}`).value = '';
      document.getElementById(`comment-btn-${commentId}`).textContent = 'Post';
    });

    const comment = async (content, commentId) => {
      try {
        let pSelf = this;
        const res = await axios({
          method: 'POST',
          url: `/api/v1/comment/${commentId}`,
          data: {
            content,
          },
        });
        let newComment = newCommentDom(res.data.data);
        $(`#comment-container-${commentId}`).prepend(newComment);
        pSelf.deleteComment($(' .delete-comment-button', newComment));
        new ToggleLike($(' .toggle-like-button', newComment));
      } catch (err) {
        alert(err);
      }
    };

    let newCommentDom = function (comments) {
      return $(`   <div id="comment-${comments.id}">
        <div class="name">
          <a href="/${comments.user._id}">${comments.user.name}</a>
          
          <button class="dlt-btn">
            <img
              src=" https://www.flaticon.com/svg/static/icons/svg/1828/1828843.svg"
              data-dlt-comment-id="${comments.id}"
              class="delete-comment-button"
            />
          </button>
        
        </div>
        <p>${comments.content}</p>

        <div class="comment-activity">
        <div class="likes" id="Comment-like-${comments.id}">
          ${comments.likes.length} likes
        </div>
        <button class="like-unlike">
          <img
            src="https://www.flaticon.com/svg/static/icons/svg/3507/3507627.svg"
            data-like-id="${comments.id}"
            data-like-model="Comment"
            class="toggle-like-button"
            data-likes="${comments.likes.length}"
            alt="like-icon"
          />
        </button>
      </div>
        <hr />
      </div>
    `);
    };
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(async function (e) {
      e.preventDefault();
      const { dltCommentId } = e.target.dataset;

      if (dltCommentId) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `/api/v1/comment/${dltCommentId}`,
          });
          if (res.data.status === 'success') {
            $(`#comment-${res.data.data.id}`).remove();
          }
        } catch (err) {
          alert(err.response.data.message);
        }
      }
    });
  }
}
