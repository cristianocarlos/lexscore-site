<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JsonFeedbackResource extends JsonResource
{
    private bool $success;
    private array $errors;

    public function __construct(string $message = '=^.^=', $success = true, $errors = []) {
        parent::__construct($message);
        $this->success = empty($errors) ? $success : false;
        $this->errors = $errors;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'errors' => $this->whenNotNull($this->errors ?: null),
            'message' => $this->getMessage(),
            'success' => $this->success,
        ];
    }

    public function getMessage(): string {
        $message = $this->resource;
        return match ($message) {
            'delete' => 'Registro excluído com sucesso!',
            'save' => 'Registro salvo com sucesso!',
            default => $message,
        };
    }
}
