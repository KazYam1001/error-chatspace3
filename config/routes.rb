Rails.application.routes.draw do
  devise_for :users
  root 'groups#index'
  resources :users, only: [:index, :edit, :update]
  resources :groups, only: [:new, :create, :edit, :update] do
    resources :messages, only: [:index, :create]
    namespace :api do
      resources :messages, only: :index, default: { format: 'json' }
    end
  end

  resources :customers do
    member do
      get 'mem'
    end
    collection do
      get 'col'
    end
    namespace :api do
      get 'hello'
    end
    resource :cart
  end
end
