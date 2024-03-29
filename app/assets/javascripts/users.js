$(document).on('turbolinks:load', function() {
  const appendUser = (user)=> {
    const html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-id="${user.id}" data-name="${user.name}">追加</a>
                </div>`;
    userList.append(html);
  }

  const appendMessage = (message)=> {
    const html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${message}</p>
                </div>`;
    userList.append(html);
  }

  const addUser = (name, id)=> {
    const html = `<div class='chat-group-user clearfix js-chat-member' data-id='${id}'>
                  <input name='group[user_ids][]' type='hidden' value='${id}'>
                  <p class='chat-group-user__name'>${name}</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`;
  }

  const userList = $('#user-search-result');

  $('#user-search-field').on('input', (e)=> {
    userList.empty();
    let userIds = [];
    $('.js-chat-member').each((index, el)=> userIds.push(el.dataset.id));
    if (input = $('#user-search-field').val()) {
      $.ajax({
        type: 'GET',
        url: '/users',
        dataType: 'json',
        data: { keyword: input,
                user_ids: userIds },
      })
      .done((users)=> {
        if (users.length !== 0) {
          users.forEach((user)=> appendUser(user));
        } else {
          appendMessage('一致するユーザーが見つかりません');
        }
      })
      .fail(()=> {
        alert("ユーザー検索に失敗しました");
      })
    };
  });

  userList.on('click', '.chat-group-user__btn--add', function() {
    const html = addUser($(this).data('name'), $(this).data('id'));
    $('.js-add-user').append(html);
    $(this).parent().remove();
  })

  $('.js-add-user').on('click', '.js-remove-btn', function() {
    $(this).parent().remove();
  })
});
