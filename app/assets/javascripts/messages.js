$(document).on('turbolinks:load', function() {
  const buildHTML = function (message) {
    const image = message.image ? `<img src="${message.image}">` : "" ;
    const html = `<div class="message" data-message_id="${message.id}">
                    <div class="upper-info">
                      <p class="upper-info__user">${message.user_name}</p>
                      <p class="upper-info__date">${message.created_at}</p>
                    </div>
                    <p class="message__text">${message.content}</p>
                    ${image}
                  </div>`
    return html;
  }

  // 自動更新用の関数
  const reloadMessages = () =>{
    const latestId = $('.message:last').data('message_id') || 0;
    $.ajax({
      url: `/groups/${groupId}/api/messages`,
      data: {
        latest_id: latestId,
        group_id:  groupId
      },
      dataType: 'json'
    })
    .done(function(newMessages) {
      if (newMessages.length != 0) {
        $.each(newMessages, function(i, message) {
          $('.messages').append(buildHTML(message));
        });
        $('.messages').animate({
          scrollTop: $('.messages')[0].scrollHeight
        }, 200);
      }
    })
    .fail(function() {
      alert('自動更新に失敗しました')
    });
  }

  let timerId
  const groupId  = $('.current-group').data('group_id');
  // turbolinks:visitイベントでclearIntervalを発火させる
  document.addEventListener("turbolinks:visit", function(){
    clearInterval(timerId);
  });

  // メッセージ送信
  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message) {
      if (message.id == null) {
        alert('メッセージを入力して下さい');
      } else {
        $('#new_message')[0].reset();
        $('.messages').append(buildHTML(message));
        $('.messages').animate({
          scrollTop: $('.messages')[0].scrollHeight
        }, 200);

      }
    })
    .fail(function() {
      alert("通信に失敗しました");
    })
    .always(function() {
      $(".new-message__submit-btn").prop('disabled', false);
    });
  });

  // 自動更新
  if (location.pathname == `/groups/${groupId}/messages`) {
    timerId = setInterval(reloadMessages, 5000);
  }
});
