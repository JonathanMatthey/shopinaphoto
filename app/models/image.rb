class Image < ActiveRecord::Base
  has_many :products
  belongs_to :person
end
