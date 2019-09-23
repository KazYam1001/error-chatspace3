class MessagesController < ApplicationController
  before_action :set_group

  def index
    @messages = @group.messages.includes(:user).order('id ASC')
    @message  = Message.new
  end

  def create
    @message = @group.messages.new(message_params)
    if @message.save
      respond_to do |format|
        format.html { redirect_to group_messages_path, notice: "メッセージが送信されました" }
        format.json
      end
    end
  end

  private

  def message_params
    params[:message].permit(:content, :image).merge(user_id: current_user.id)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end
