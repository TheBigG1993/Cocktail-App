<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return "OK";
});

Route::get('/auth/login', function () {
  $auth0Config = config('laravel-auth0');
  return view('login')->with('auth0Config',$auth0Config);
});

Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

Route::get('/auth0/callback', '\Auth0\Login\Auth0Controller@callback');

Route::group(['prefix' => 'recipe'], function () {
  Route::get('/', function () {
    return response("Requests for all data not allowed", 403);
  });

  Route::get('search', 'RecipeController@search');

  Route::get('{id}', 'RecipeController@show');
});
