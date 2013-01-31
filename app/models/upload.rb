class Upload < ActiveRecord::Base
  include PgSearch

  attr_accessible :director, :genre, :imdbid, :length, :plot, :rating, :releasedate, :title, :url, :year, :cast

  ## Search
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


  ## Upload
  # folders to upload array
  def self.folders
    folders = Pathname.new('public/upload/').children.select! { |c| c.directory? }
    folders.map { |path| path.basename.to_s }
  end

  # expects Nokogiri::XML::NodeSet
  def self.join_content(nodeset)
    nodeset.map {|n| n.content}.join(' / ')
  end

  # commit to db
  def self.move_to_db(post_params = {})
    insert_flag_for = {}

    post_params.each_pair do |folder, i_id|
      if folders.include?(folder) && where('title LIKE ?', folder).empty?
        doc = Nokogiri::HTML(open("http://www.imdb.com/title/#{i_id}"))

        insert = new( imdbid:      i_id,
                      title:       folder,
                      director:    doc.at_css('[itemprop="director"] a').content,
                      genre:       join_content(doc.css('.infobar a[href*="/genre/"]')),
                      length:      doc.css('.infobar')[0].content[/\d{1,3}\smin/],
                      plot:        doc.css('p[itemprop="description"]')[0].content.strip,
                      rating:      doc.css('.star-box-giga-star')[0].content.strip,
                      releasedate: doc.css('a[title="See all release dates"]')[0].content.strip,
                      year:        doc.css('a[href*="/year/"]')[0].content,
                      cast:        join_content(doc.css('.cast_list tr .name a'))
        )

        if insert.save
          # move folder
          if FileUtils.mv 'public/upload/'+ folder, 'public/movies/'+ folder
            insert_flag_for[folder] = :success
          end
        else
          insert_flag_for[folder] = :failed
        end
      
      else
        insert_flag_for[folder] = :no_match  
      end
    end

    # return status
    insert_flag_for
  end

end