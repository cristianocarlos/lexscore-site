<?php

namespace App\Custom;

use Illuminate\Support\Str;

class Helper
{
    const string DB_CONNECTION = 'pgsql';
    const string BOM_CHAR = "\xEF\xBB\xBF"; // Byte-order mark char. Precisa ser com aspas duplas

    public static function camelCaseToSnakeCase(string $camelCase): string {
        $result = '';
        for ($i = 0; $i < strlen($camelCase); $i++) {
            $char = $camelCase[$i];
            if (ctype_upper($char)) {
                $result .= '_' . strtolower($char);
            } else {
                $result .= $char;
            }
        }
        return ltrim($result, '_');
    }

    public static function cleanUpText(string $value, ?int $maxLength = null): string {
        // A princípio, não previsa tratar os apóstrofes
        // ´ %B4 // essa porra buga no utf8, é um caracter usado pra representar o circunflexo, por enquanto não vou usar
        // ’ %92
        // \xC2\xA0  
        $value = str_replace(['“', '”', '–', "\xC2\xA0"], ['"', '"', '-', ' '], $value);
        $value = preg_replace('/\s+/', ' ', $value); // tira espaços duplos e tabs e quebras de linha
        $value = $maxLength === null ? $value : mb_substr($value, 0, $maxLength);
        return trim($value);
    }

    public static function getClassConstants($class): array {
        $constants = new \ReflectionClass($class)->getConstants();
        return array_filter($constants, function ($key) {
            return !($key === 'CREATED_AT'
              or $key === 'UPDATED_AT'
            ); // Desconsidera as constantes do Laravel
        }, ARRAY_FILTER_USE_KEY);
    }

    public static function removeAccents(string $value): string {
        return Str::ascii($value);
    }

    /**
     * keyword arrayStripNulls; array_strip_nulls; arrayFilter
     * Resolve também os valores de cada item do array, tudo null é considerado vazio
     */
    public static function resolveArrayValue(?array $value): ?array {
        if (blank($value)) return null;
        $filteredValues = is_array($value) ? array_filter($value, function ($itemValue) {
            return !blank($itemValue);
        }) : $value;
        return empty($filteredValues) ? null : $filteredValues;
    }

    public static function snakeCaseToCamelCase(string $value): string {
        return ucfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $value))));
    }

    public static function zeroFill(int $value, int $length): string {
        return str_pad((string) $value, $length, '0', STR_PAD_LEFT);
    }
}
