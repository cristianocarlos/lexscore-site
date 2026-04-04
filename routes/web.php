<?php

use App\Http\Controllers\DefaultController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DefaultController::class, 'home']);
Route::get('/rd-mentira', [DefaultController::class, 'rdMentiraForm']);
Route::get('/nps/{model}', [DefaultController::class, 'npsForm']);
