<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
  public function getIngredientsAttribute($value)
  {
      return json_decode($value);
  }
}
