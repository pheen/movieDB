class UploadController < ApplicationController

  #require_relative('../../lib/upload')
  require 'open-uri'

  def index
    @counter = 0.0

  	@folders = Pathname.new('public/upload/').children.select! { |c|
  		c.directory?
  	}.map { |path|
  		path.basename
  	}
  end

  def lookup
    @insert = {}
    
    def join_array(name)
      name_list = []

      name.each { |n|
        name_list << n.content
      }

      name_list.join(' / ')
    end

    folders = Pathname.new('public/upload/').children.select! { |c|
      c.directory?
    }.map { |path|
      path.basename.to_s
    }

    # loop through each movie folder in public/upload
    params.each { |folder, i_id|
      if folders.include? folder

        if Upload.where('title LIKE ?', folder).empty?
          # read IMDB page to string
          doc = Nokogiri::HTML(open("http://www.imdb.com/title/#{i_id}"))
          # query db
          insert = Upload.new(
            imdbid:      i_id,
            title:       folder,
            director:    doc.at_css('a[itemprop="director"]').content,
            genre:       join_array(doc.css('.infobar a[href*="/genre/"]')),
            length:      doc.css('.infobar')[0].content[/\d{1,3}\smin/],
            plot:        doc.css('p[itemprop="description"]')[0].content.strip,
            rating:      doc.css('.star-box-giga-star')[0].content.strip,
            releasedate: doc.css('a[title="See all release dates"]')[0].content.strip,
            year:        doc.css('a[href*="/year/"]')[0].content,
            cast:        join_array(doc.css('.cast_list tr .name a'))
          )

          # preview insert
          #@insert << insert

          if insert.save
            # copy folder to /movies
            FileUtils.cp_r 'public/upload/'+ folder, 'public/movies/'+ folder
            @insert[folder] = :success
          else
            @insert[folder] = :failed
          end
        else
          @insert[folder] = :duplicate
        end

        # remove folder from /upload
        @insert.each do |f, a|
          if @insert[f] == :success
            if File.directory? 'public/upload/'+ f
              FileUtils.rm_r 'public/upload/'+ f
            end
          end
        end

        @insert
      end
    }

  	render :template => "upload/lookup"
  end

end