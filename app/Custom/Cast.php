<?php

namespace App\Custom;

use Carbon\Carbon;
use Carbon\CarbonInterface;

class Cast
{
    const int POSTGRES_INT_MAX = 2147483647;
    const int POSTGRES_INT_MIN = -2147483648;

    public static function integer(?string $value, bool $shouldCast = true): string|int|null {
        // O número pode ser um bigint e o php não tem suporte pra isso, por isso não usa o cast sempre
        if (blank($value)) return null;
        $number = static::stripNonNumber($value);
        if (blank($number)) return null;
        if ($shouldCast) {
            return $number >= static::POSTGRES_INT_MIN && $number <= static::POSTGRES_INT_MAX ? (int) $number : $number;
        }
        return $value;
    }

    /**
     * Apenas salva quanto for true como 1
     */
    public static function boolTrueOnly(?string $value, bool $shouldCast = true): string|bool|null {
        return $value === '1' ? ($shouldCast ? true : '1') : null;
    }

    public static function textLine(?string $value, ?int $maxLength = null): ?string {
        if (blank($value)) return null;
        return Helper::cleanUpText($value, $maxLength);
    }

    /**
     * Limpa caracteres "estranhos" de um texto
     */
    public static function text(?string $value): ?string {
        if (blank($value)) return null;
        $value = str_replace(["\r\n", "\r", "\n"], ['_EOL_', '_EOL_', '_EOL_'], $value); // para o cleanUpText não substituir as quebras por espaço
        $value = Helper::cleanUpText($value);
        $value = str_replace('_EOL_', PHP_EOL, $value); // devolve as quebras após a limpeza do texto
        return trim($value);
    }

    public static function stripNonNumber(?string $value): ?string {
        if (blank($value)) return null;
        return preg_replace('/[^0-9]/', '', $value);
    }

    private static function resolveCarbon(string|CarbonInterface $value, ?string $format = null): CarbonInterface {
        if ($format) return Carbon::createFromFormat($format, $value);
        if ($value instanceof CarbonInterface) return $value;
        return Carbon::parse($value);
    }

    public static function fromPtBrDate(?string $value): ?string {
        if (blank($value)) return null;
        $carbon = static::resolveCarbon($value, 'd/m/Y');
        return $carbon->format('Y-m-d');
    }

    public static function fromPtBrTimestamp(?string $value, $tz = true): ?string {
        if (blank($value)) return null;
        $carbon = static::resolveCarbon($value, 'd/m/Y H:i');
        return $tz ? $carbon->format('Y-m-d H:i:sT') : $carbon->format('Y-m-d H:i:s');
    }

    public static function timestamp(?string $value, $tz = true): ?string {
        if (blank($value)) return null;
        $carbon = static::resolveCarbon($value);
        return $tz ? $carbon->format('Y-m-d H:i:sT') : $carbon->format('Y-m-d H:i:s');
    }

    public static function nowTimestamp($tz = true): string {
        $carbon = static::resolveCarbon(now());
        return $tz ? $carbon->format('Y-m-d H:i:sT') : $carbon->format('Y-m-d H:i:s');
    }
}
