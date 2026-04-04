<?php

namespace App\DTOs;

use App\Custom\Cast;
use App\Custom\Mask;

final class PhoneDTO
{
    public function __construct(
        public ?CountryDTO $country_data,
        public ?string $extension,
        public int $id,
        public ?bool $is_main,
        public ?bool $is_restrict,
        public string $number,
        public ?int $type,
        public ?string $type_desc,
    ) {}

    public static function fromArray(array $data): self {
        return new self(
            country_data: CountryDTO::fromArray($data['country_data'] ?? null),
            extension: $data['extension'] ?? null,
            id: $data['id'] ?? now()->timestamp,
            is_main: $data['is_main'] ?? null,
            is_restrict: $data['is_restrict'] ?? null,
            number: $data['number'] ?? null,
            type: $data['type'] ?? null,
            type_desc: $data['type_desc'] ?? null,
        );
    }

    public function toForm(): ?array {
        return array_filter(array_merge((array) $this, [
            'number' => Mask::phoneNumber($this->number),
        ])) ?: null;
    }

    public function toDb(): ?array {
        return array_filter([
            'country_data' => $this->country_data?->toDb(),
            'extension' => Cast::textLine($this->extension),
            'id' => Cast::integer($this->id),
            'is_main' => Cast::boolTrueOnly($this->is_main),
            'is_restrict' => Cast::boolTrueOnly($this->is_restrict),
            'number' => Cast::stripNonNumber($this->number),
            'type' => Cast::integer($this->type),
            'type_desc' => Cast::textLine($this->type_desc),
        ]) ?: null;
    }

    /**
     * @return array<PhoneDTO>|null
     */
    public static function collectionFromArray(?array $rows): ?array {
        if (empty($rows)) return null;
        return array_map(fn ($data) => self::fromArray($data), $rows);
    }

    /**
     * @param  array<PhoneDTO>|null  $rows
     */
    public static function collectionToForm(?array $rows): ?array {
        if (empty($rows)) return null;
        return array_map(fn ($data) => $data?->toForm(), $rows);
    }

    /**
     * @param  array<PhoneDTO>|null  $rows
     */
    public static function collectionToDb(?array $rows): ?array {
        if (empty($rows)) return null;
        return array_map(fn ($data) => $data?->toDb(), $rows);
    }
}
