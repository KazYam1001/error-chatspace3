class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :members
  has_many :groups, through: :members
  has_many :messages

  def self.search_for_group(params)
    where("name LIKE(?)", "#{params[:keyword]}%").where.not(id: params[:user_ids])
  end
end
