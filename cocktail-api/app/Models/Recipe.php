<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
  public function getIngredientsAttribute($value)
  {
      return json_decode($value);
  }
}
