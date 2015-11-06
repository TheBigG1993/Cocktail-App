<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Recipe;

class RecipeController extends Controller
{
  public function show($id)
  {
    $result = Recipe::find($id);

    if (!$result) return response("Not found", 404);

    return $result;
  }

  public function search(Request $request)
  {
    $name = $request->input('name');

    if (!$name) return response("Please specify a search field", 400);

    $results = Recipe::where('name', 'ILIKE', '%'.$name.'%')->get();

    return $results;
  }
}
