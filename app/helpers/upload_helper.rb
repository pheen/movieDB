module UploadHelper

  # return top 3 resulsts from IMDB
  # as hash 'title' => 'imdb id'
  def search_imdb_for(folder)
    hash = {}
    doc = Nokogiri::HTML(open("http://www.imdb.com/find?q=#{ERB::Util.url_encode(folder)}&s=tt"))

    doc.css('h3:contains("Titles") + table td:last-child')[0..2].map do |m|
      hash[m.content] = m.css('a')[0]['href'][/tt\d*/]
    end

    hash
  end

end