class ImagesController < ApplicationController
  inherit_resources
  
  def new
    @image = Image.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @image }
    end
  end
  
  def create
    @image = Image.new(params[:image])
    respond_to do |format|
      if @image.save
        format.html { redirect_to('/',
                      :notice => 'Image was successfully created.') }
      else
        flash[:error] = @image.errors.full_messages
        format.html { redirect_to '/'}
      end
    end
  end

end
