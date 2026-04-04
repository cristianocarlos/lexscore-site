<?php

namespace App\Console\Commands;

use App\Console\Custom\DbSchemaHelper;
use App\Console\Custom\DtoHelper;
use App\Custom\Helper;
use Illuminate\Console\Command;

class TypesGen extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'types:gen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate types to front end (php files, image assets, database, ...)';

    /**
     * Execute the console command.
     */
    public function handle(): void {
        $genDir = base_path() . '/resources/phpgen';
        is_dir($genDir) or mkdir($genDir);
        $this->fromDbSchema($genDir . '/types-db-schema.ts');
        $this->fromDtos($genDir . '/types-dto.ts');
    }

    private function fromDtos(string $jsFileName): void {
        $rawTypes = DtoHelper::getRawTypes();
        $code = "import {type TSvgMapNames} from '~/phpgen/yii-svg-map';" . PHP_EOL . PHP_EOL;
        foreach ($rawTypes as $dtoTypeName => $dtoProperties) {
            $stringProperties = implode('; ', $dtoProperties);
            $code .= "export type {$dtoTypeName} = {{$stringProperties}}" . PHP_EOL;
        }
        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }

    private function fromDbSchema(string $jsFileName): void {
        $code = 'export type TDBBinaryString = string;' . PHP_EOL;
        $code .= 'export type TDBDateString = string;' . PHP_EOL;
        $code .= 'export type TDBDateHourString = string;' . PHP_EOL;
        $code .= 'export type TDBHourString = string;' . PHP_EOL;
        $code .= 'export type TDBJsonString = string;' . PHP_EOL;
        $code .= 'export type TDBTimestampString = string;' . PHP_EOL;
        $code .= 'export type TDBValue = boolean | number | string | TDBBinaryString | TDBJsonString | TDBTimestampString;' . PHP_EOL;
        $code .= DbSchemaHelper::getTypeScriptDbTableDeclarations(Helper::DB_CONNECTION) . PHP_EOL;
        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }
}
