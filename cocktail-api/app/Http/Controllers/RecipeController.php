<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

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
