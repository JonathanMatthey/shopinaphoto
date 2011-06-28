class HomeController < ApplicationController
  def index
    @images = Image.all
    @product = Product.new
    
  end

end
