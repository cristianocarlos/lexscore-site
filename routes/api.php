<?php

use App\Http\Controllers\DefaultController;

Route::post('/error-boundary-log', function () {
    return response()->json(['todo' => true]);
});
Route::put('/nps/send', [DefaultController::class, 'npsSend']);
Route::post('/rd-mentira', [DefaultController::class, 'rdMentiraSend']);
