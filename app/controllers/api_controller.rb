class ApiController < ApplicationController
   #respond_to :json

   def get_items 
      # for each image sent, return all its items   
      # @client = params[:_json]
      return if params[:images].blank?
      @images = params[:images]

      # return if Client.find_by_url(@client['url'])
      # send back 
      @stores = []

      @images.each_with_index do |image,index|
        if Image.find_by_url(image[:url]).nil?
          img = Image.new(:url => image[:url])
          img.save
          @stores << nil
        else
          @stores << {:seq =>index,:products =>Image.find_by_url(image[:url]).products}
        end
      end
      #respond_with(Image.all)
      
      respond_to do |format|
        format.js { render :json => @stores.to_json }

      end

   end
  
end
# {"stores": {
#   "seq": "1",
#   "products": [
#       {"value": "New", "onclick": "CreateNewDoc()"},
#       {"value": "Open", "onclick": "OpenDoc()"},
#       {"value": "Close", "onclick": "CloseDoc()"}
#     ]
#   },
#   {
#    "seq": "2",
#    "products": [
#        {"value": "New", "onclick": "CreateNewDoc()"},
#        {"value": "Open", "onclick": "OpenDoc()"},
#        {"value": "Close", "onclick": "CloseDoc()"}
#      ]
#    }
# }