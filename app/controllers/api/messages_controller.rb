class Api::MessagesController < ApplicationController
  def index
    # latest_idより大きいidのメッセージを取得
    @new_messages = Message.where("id > ? and group_id = ?", params[:latest_id], params[:group_id]).order('id ASC')
  end
end
