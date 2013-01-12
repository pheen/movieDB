module MoviesHelper

	def movieUrl(title)
		"/movies/#{title}/#{title}.xspf"
	end

end
