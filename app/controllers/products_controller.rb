class ProductsController < ApplicationController
  inherit_resources
  
  def new
    @product = Product.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @post }
    end
  end
  
  def create
    @product = Product.new(params[:product])
    respond_to do |format|
      if @product.save
        format.html { redirect_to('/',
                      :notice => 'Product was successfully created.') }
      else
        flash[:error] = @product.errors.full_messages
        format.html { redirect_to '/'}
      end
    end
  end
  
  def show
    @product = Product.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @post }
    end
  end
  
  # 
  # def create
  #   @post = Post.new(params[:post])
  # 
  #   respond_to do |format|
  #     if @post.save
  #       format.html { redirect_to(@post,
  #                     :notice => 'Post was successfully created.') }
  #       format.xml  { render :xml => @post,
  #                     :status => :created, :location => @post }
  #     else
  #       format.html { render :action => "new" }
  #       format.xml  { render :xml => @post.errors,
  #                     :status => :unprocessable_entity }
  #     end
  #   end
  # end
  
  
end
