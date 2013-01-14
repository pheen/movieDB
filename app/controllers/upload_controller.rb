class UploadController < ApplicationController

  require 'open-uri'

  def index
    @counter = 0.0
  end

  def lookup
    @upload_status = Upload.move_to_db(params)

  	render :template => "upload/lookup"
  end

end