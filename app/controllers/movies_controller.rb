class MoviesController < ApplicationController

  def index
    @movies = Upload.order("updated_at DESC").limit(8)
  end

  def update_genre
    @movies = Upload.in_genre(params[:genre], params[:order], params[:dir])

    render :partial => 'movies', :content_type => 'text/html'
  end

  def search
    @movies = Upload.search_by_keywords(params[:key]).order("#{params[:order]} #{params[:dir]}")

    render :partial => 'movies', :content_type => 'text/html'
  end

end