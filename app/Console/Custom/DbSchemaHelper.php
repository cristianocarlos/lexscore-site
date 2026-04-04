<?php

namespace App\Console\Custom;

use App\Custom\Cast;
use App\Custom\Helper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DbSchemaHelper
{
    private static function getColumnSchemaSize(array $columnSchemaData): ?int {
        // metaDataSize = 5; // esse tipo aceita 5 digitos, mas só até o numero 32767, entao pra nao precisar
        // validar o valor em si, a gente usa com um dígito a menos que nunca vai dar ruim
        if (in_array($columnSchemaData['type_name'], ['int2', 'float2'])) {
            return 4;
        }
        // metaDataSize = 10; // esse tipo aceita 10 digitos, mas só até o numero 2147483647, entao pra nao precisar
        // validar o valor em si, a gente usa com um dígito a menos que nunca vai dar ruim
        if (in_array($columnSchemaData['type_name'], ['int2', 'float4'])) {
            return 9;
        }
        // metaDataSize = 19; // esse tipo aceita 19 digitos, mas só até o numero 9223372036854775807, entao pra
        // nao precisar validar o valor em si, a gente usa com um dígito a menos que nunca vai dar ruim
        if (in_array($columnSchemaData['type_name'], ['int8', 'float8'])) {
            return 18;
        }
        // character varying(1)
        if (in_array($columnSchemaData['type_name'], ['bpchar', 'varchar'])) {
            return (int) Cast::stripNonNumber($columnSchemaData['type']);
        }
        return null;
    }

    private static function getInformationSchemaData(string $connectionName): array {
        $sql = <<<SQL
          SELECT table_schema, table_name
            FROM information_schema.tables
           WHERE table_schema NOT IN ('information_schema'
                  , 'pg_catalog'
                  , 'public'
                 )
             AND table_type NOT IN ('VIEW')
          ORDER BY table_schema, table_name
        SQL;
        $connection = DB::connection($connectionName);
        $rows = $connection->select($sql);
        $allTableTsProps = [];
        $allColumnSizes = [];
        foreach ($rows as $reg) {
            $tableSchema = Helper::snakeCaseToCamelCase($reg->table_schema);
            $tableName = Helper::snakeCaseToCamelCase($reg->table_name);
            $columnSchemaRows = Schema::getColumns($reg->table_schema . '.' . $reg->table_name);
            usort($columnSchemaRows, fn ($a, $b) => $a['name'] <=> $b['name']);
            $tableTsProps = [];
            foreach ($columnSchemaRows as $columnSchemaData) {
                $tsType = match ($columnSchemaData['type_name']) {
                    'bool', 'boolean' => 'boolean',
                    'float2', 'float4', 'float8', 'int2', 'int4', 'int8', 'numeric' => 'number',
                    'bpchar', 'text', 'varchar' => 'string',
                    'date' => 'TDBDateString',
                    'time', 'timetz' => 'TDBHourString',
                    'timestamp', 'timestamptz' => 'TDBTimestampString',
                    'bytea' => 'TDBBinaryString',
                    'jsonb' => 'TDBJsonString',
                    default => 'unknown',
                };
                $size = static::getColumnSchemaSize($columnSchemaData);
                if ($size) {
                    $allColumnSizes[$tableName . '.' . $columnSchemaData['name']] = $size;
                }
                $tableTsProps[] = $columnSchemaData['name'] . ': ' . $tsType . ($columnSchemaData['nullable'] ? ' | null' : '');
            }
            $allTableTsProps[$tableSchema . $tableName] = $tableTsProps;
        }
        return [
            'allColumnSizes' => $allColumnSizes,
            'allTableTsProps' => $allTableTsProps,
        ];
    }

    public static function getTypeScriptDbTableDeclarations(string $connectionName): string {
        $code = '';
        $data = static::getInformationSchemaData($connectionName);
        foreach ($data['allTableTsProps'] as $tableSchemaTableName => $tsProps) {
            $typeDeclarationName = 'TDBTable' . $tableSchemaTableName;
            $code .= 'export type ' . $typeDeclarationName . ' = {' . implode('; ', $tsProps) . '};' . PHP_EOL;
        }
        return trim($code);
    }

    public static function getModelColumnSizes(string $connectionName): array {
        $dbData = static::getInformationSchemaData($connectionName);
        return $dbData['allColumnSizes'];
    }
}
