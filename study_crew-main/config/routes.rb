Rails.application.routes.draw do
  # ActiveStorage must be first
  mount ActiveStorage::Engine => "/rails/active_storage"

  get "up" => "rails/health#show", as: :rails_health_check

  resources :users
  resources :connections
  resources :courses
  resources :assistant_courses
  resources :assistant_reviews

  # Custom routes for assistant_reviews
  get '/assistants/:assistant_id/reviews', to: 'assistant_reviews#by_assistant'
  get '/users/:user_id/reviews', to: 'assistant_reviews#by_user'

  # Custom routes for assistant_courses
  get "/assistant_courses/by_assistant/:assistant_id", to: "assistant_courses#by_assistant"
  get "/assistant_courses/by_course/:course_id", to: "assistant_courses#by_course"
  get "/assistant_courses/assignment_details/:assistant_id/:course_id", to: "assistant_courses#assignment_details"
  get "/assistant_courses/special", to: "assistant_courses#special"
  post "/assistant_courses/bulk_update_with_availability", to: "assistant_courses#bulk_update_with_availability"
  post "/assistant_courses/request_help", to: "assistant_courses#request_help"

  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"

  # Catch-all, but exclude ActiveStorage paths
  match "*unmatched", to: "application#route_not_found", via: :all, constraints: lambda { |req|
    !req.path.starts_with?("/rails/active_storage")
  }
end
