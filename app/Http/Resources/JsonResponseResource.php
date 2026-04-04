<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JsonResponseResource extends JsonResource
{
    public JsonFeedbackResource $feedbackResource;

    public function __construct(array|object $resource, ?JsonFeedbackResource $feedbackResource = null) {
        parent::__construct($resource);
        $this->feedbackResource = $feedbackResource ?: new JsonFeedbackResource;
    }

    public function toArray(Request $request): array {
        return array_merge($this->feedbackResource->toArray($request), [
            'content' => $this->resource,
        ]);
    }
}
