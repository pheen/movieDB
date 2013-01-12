class Upload < ActiveRecord::Base
  include PgSearch

  attr_accessible :director, :genre, :imdbid, :length, :plot, :rating, :releasedate, :title, :url, :year, :cast

  scope :in_genre, lambda { |genre, order, dir|
  	where("genre LIKE ?", "%#{genre}%").order("#{order} #{dir}")
  }

  pg_search_scope :search_by_keywords, :against => [ :title,
                                                     :director,
                                                     :genre,
                                                     :plot,
                                                     :releasedate,
                                                     :cast ],
                                       :using => {
                                         :tsearch => {:prefix => true}
                                       }
end