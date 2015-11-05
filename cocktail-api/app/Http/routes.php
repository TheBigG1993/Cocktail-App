<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
use Illuminate\Http\Response;
use App\Models\Recipe;

$app->get('/', function () use ($app) {
  return "OK";
});

$app->group(['prefix' => 'recipe'], function ($app) {

    $app->get('/', function () {
      return response("Requests for all data not allowed", 403);
    });

    // Upgrade to a ts_vector for search later on
    $app->get('search', 'App\Http\Controllers\RecipeController@search');
    
    $app->get('{id}', 'App\Http\Controllers\RecipeController@show');

});
