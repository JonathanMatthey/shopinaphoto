class Product < ActiveRecord::Base
  belongs_to :images
  validates_presence_of :name, :url, :image_url, :price
end
