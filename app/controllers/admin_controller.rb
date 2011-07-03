class AdminController < ApplicationController
  def index
    @images = Image.all
    @product = Product.new
    @celebs = Person.all
  end

end
