<?php

namespace App\Http\Controllers;

use App\Http\Resources\JsonFeedbackResource;
use App\Http\Resources\MetaDataResource;
use App\Models\main\RespondentMailingList;
use App\Services\EmailService;
use Illuminate\Http\JsonResponse;
use Inertia\Response;

class DefaultController
{
    public function home(): Response {
        return inertia('Home', [
            'metaData' => new MetaDataResource(null),
        ]);
    }

    public function npsForm(RespondentMailingList $model): Response {
        return inertia('nps/Reply', [
            'formFeatures' => $model->with('respondentRelation')->first()->formFeaturesLoad(),
            'metaData' => new MetaDataResource($model),
        ]);
    }

    public function npsSend(): JsonResponse {
        request()->validate([
            'RespondentMailingList.reml_pers_name' => 'required',
        ]);
        return response()->json(new JsonFeedbackResource('ok'));
    }

    public function rdMentiraForm(): Response {
        return inertia('RdMentira', [
            'metaData' => new MetaDataResource(null),
            'rows' => RespondentMailingList::with('respondentRelation')->limit(10)->get(),
        ]);
    }

    public function rdMentiraSend(EmailService $emailService): JsonResponse {
        foreach (request('rows') as $data) {
            $emailService->rdMentiraSend($data['id'], $data['email']);
        }
        return response()->json(new JsonFeedbackResource('ok'));
    }
}
