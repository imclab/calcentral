require "spec_helper"

describe RoutesListController do

  before do
    @user_id = rand(999999).to_s
  end

  before :each do
    request.env["HTTP_ACCEPT"] = 'application/json'
  end

  it "should not list any routes for not logged in users" do
    get :smoke_test_routes
    expect(response.status).to eq(403)
    expect(response.body.blank?).to be_true
  end

  it "should not list any routes for non-superusers" do
    User::Auth.stub(:where).and_return([User::Auth.new(uid: @user_id, is_superuser: false, active: true)])
    session[:user_id] = @user_id
    get :smoke_test_routes
    expect(response.status).to eq(403)
    expect(response.body.blank?).to be_true
  end

  it "should list some /api/ routes for superusers" do
    User::Auth.stub(:where).and_return([User::Auth.new(uid: @user_id, is_superuser: true, active: true)])
    session[:user_id] = @user_id
    get :smoke_test_routes
    assert_response :success
    json_response = JSON.parse(response.body)
    json_response['routes'].present?.should be_true
    bad_entries = json_response['routes'].select {|route| !route.start_with? '/api/' }
    expect(bad_entries.empty?).to be_true
  end

end
