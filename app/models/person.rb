class Person < ActiveRecord::Base
  has_many :images
  
  def to_s
    name
  end
end
