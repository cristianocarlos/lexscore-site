<?php

namespace App\Console\Commands;

use App\Console\Custom\DbSchemaHelper;
use App\Console\Custom\EnumHelper;
use App\Console\Custom\LangHelper;
use App\Console\Custom\ModelHelper;
use App\Custom\Helper;
use App\Enums\RouteEnum;
use App\Models\misc\Country;
use Illuminate\Console\Command;

const EN = 'en';
const PT_BR = 'pt_BR';
const LANGUAGE_ITEMS = [
    PT_BR => 'type_name',
];

class YiiGen extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'yii:gen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate helpers to front end (models, lang, enums, const)';

    /**
     * Execute the console command.
     */
    public function handle(): void {
        $genDir = base_path() . '/resources/phpgen';
        is_dir($genDir) or mkdir($genDir);
        $this->phpYiiEnum(base_path() . '/app/Enums/YiiEnum.php'); // PRECISA que rodar primeiro
        $this->jsConst($genDir . '/yii-const.ts');
        $this->jsEnums($genDir . '/yii-enums.ts');
        $this->jsLang($genDir . '/yii-lang.ts');
        $this->jsModel($genDir . '/yii-model.ts');
        $this->jsSvgMap($genDir . '/yii-svg-map.ts');
    }

    private function jsSvgMap(string $jsFileName): void {
        $file = base_path() . '/public/img/icon-sprite-map.svg';
        if (!file_exists($file)) return;
        $svgNames = [];
        $svg = new \SimpleXMLElement(file_get_contents($file));
        foreach ($svg->defs->symbol as $symbol) {
            $svgNames[] = str_replace('icon-', '', (string) $symbol->attributes()->id);
        }
        $implodedSvgMapNames = implode("'|'", $svgNames);
        $implodedSvgMapValues = "['" . implode("', '", $svgNames) . "']";
        $svgMapHash = hash('sha256', $implodedSvgMapNames);
        $code = "export const SVG_MAP_NAMES_HASH = '{$svgMapHash}';" . PHP_EOL;
        $code .= "export const SVG_MAP_VALUES: Array<TSvgMapNames> = {$implodedSvgMapValues};" . PHP_EOL;
        $code .= "export type TSvgMapNames = '{$implodedSvgMapNames}';";
        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }

    private function jsConst(string $jsFileName): void {
        $typeConstants = EnumHelper::getDbConstants();
        $customConstants = [
            'Country' => Helper::getClassConstants(Country::class),
            'RouteWithoutParams' => RouteEnum::getRouteWithoutParamsConstants(),
        ];
        $enumConstants = EnumHelper::getAppConstants();
        $encodedCustomConstants = json_encode($customConstants);
        $encodedEnumConstants = json_encode($enumConstants);
        $encodedTypeConstants = json_encode($typeConstants);
        $code = '/* eslint-disable */' . PHP_EOL;
        $code .= "const customConstants = {$encodedCustomConstants} as const;" . PHP_EOL;
        $code .= "const enumConstants = {$encodedEnumConstants} as const;" . PHP_EOL;
        $code .= "const typeConstants = {$encodedTypeConstants} as const;" . PHP_EOL;
        $code .= 'export default {...customConstants, ...enumConstants, ...typeConstants};' . PHP_EOL;
        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }

    private function jsEnums(string $jsFileName): void {
        $enumsData = EnumHelper::getDbNamesAndOptions(LANGUAGE_ITEMS);
        foreach (LANGUAGE_ITEMS as $lang => $columnName) {
            if (!empty($enumsData['names'])) {
                $enumsData['names'][$lang] = array_merge(
                    $enumsData['names'][$lang],
                );
            }
            if (!empty($enumsData['options'])) {
                $enumsData['options'][$lang] = array_merge(
                    $enumsData['options'][$lang],
                );
            }
        }
        $locale = app()->getLocale();
        $encodedNames = json_encode($enumsData['names']);
        $encodedOptions = json_encode($enumsData['options']);
        $code = "import {getLanguage} from '@/utils/globals';" . PHP_EOL;
        $code .= 'const language = getLanguage();' . PHP_EOL;
        $code .= 'type TYiiEnumsNameValues = {[flag: string]: {[id: number | string]: string}}' . PHP_EOL;
        $code .= 'type TYiiEnumsLang = keyof typeof names' . PHP_EOL;
        $code .= 'export type TYiiEnumsFlag = keyof typeof names.' . $locale . PHP_EOL;
        $code .= PHP_EOL;
        $code .= "const names = {$encodedNames};" . PHP_EOL;
        $code .= 'const namesLang: TYiiEnumsNameValues = names[language as TYiiEnumsLang] || names.' . PT_BR . ';' . PHP_EOL;
        $code .= 'const getName = (flag: TYiiEnumsFlag, id: number | string) => namesLang[flag][id];' . PHP_EOL;
        $code .= PHP_EOL;
        $code .= "const options = {$encodedOptions};" . PHP_EOL;
        $code .= 'const optionsLang = options[language as TYiiEnumsLang];' . PHP_EOL;
        $code .= 'const getOptions = (flag: TYiiEnumsFlag): Array<{id: number | string, label: string}> => optionsLang?.[flag] || [];' . PHP_EOL;
        $code .= PHP_EOL;
        $code .= 'export default {getName, getOptions};' . PHP_EOL;

        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }

    private function jsLang(string $jsFileName): void {
        $allMessages = LangHelper::getMessages();
        $locale = app()->getLocale();

        $langIds = ['formigo', 'misc', 'page'];
        $exportIds = implode(',', $langIds);
        $languageKeys = "'" . implode("'|'", array_keys(LANGUAGE_ITEMS)) . "'";

        $code = "import {getLanguage} from '@/utils/globals';" . PHP_EOL;
        $code .= 'const language = getLanguage();' . PHP_EOL;
        $code .= "type TYiiLangKeys = {$languageKeys};" . PHP_EOL;
        foreach ($langIds as $langId) {
            $ucLangId = mb_ucfirst($langId);
            $vLang = "lang{$ucLangId}";
            $vMessageType = "TYiiLang{$ucLangId}MessageKey";
            $vMessages = json_encode($allMessages[$langId]);
            $code .= PHP_EOL;
            $code .= "const {$vLang} = {$vMessages};" . PHP_EOL;
            $code .= "type {$vMessageType} = keyof typeof {$vLang}.{$locale};" . PHP_EOL;
            $code .= "const {$langId} = (messageKey: {$vMessageType}) => {$vLang}[language as TYiiLangKeys]?.[messageKey] || '';" . PHP_EOL;
        }
        $code .= PHP_EOL;
        $code .= "export default {{$exportIds}};" . PHP_EOL;

        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }

    /**
     * Tipagem auxiliar para declarar atributos de formulário:
     * <TextInput attribute = {YiiModel.attr('Person.pers_code')}/>;
     *
     * O que esse tipo NÃO faz:
     * - Não valida atributos disponíveis em tela Ex. se usar YiiModel.attr('Appointment.appo_indh') no cadastro de usuário, não vai acusar erro
     * - Não valida atributos de campos json Ex. modelAttr('Person.pers_addr_data.line1') é inválido, tem que ser: YiiModel.attr('Person.pers_code').concat(['line1'])
     */
    private function jsModel(string $jsFileName): void {
        $modelNamesData = ModelHelper::getNamesData();
        $modelColumnSizes = DbSchemaHelper::getModelColumnSizes(Helper::DB_CONNECTION);
        $encodedModelNames = json_encode($modelNamesData['modelNames']);
        $encodedModelAllNames = json_encode($modelNamesData['modelAllNames']);
        $encodedModelColumnSizes = json_encode($modelColumnSizes);
        $code = "const yiiModelNames = {$encodedModelNames} as const;" . PHP_EOL;
        $code .= "const yiiModelAttributeNames = {$encodedModelAllNames} as const;" . PHP_EOL; // Só o nome do model pode ser um atributo também nos casos de rootAttribute, por isso não usa o modelAttributeNames
        $code .= 'export type TYiiModelNames = typeof yiiModelNames[number];' . PHP_EOL;
        $code .= 'export type TYiiModelAttributeNames = typeof yiiModelAttributeNames[number];' . PHP_EOL;
        $code .= "function attr(name: TYiiModelAttributeNames) { return name.split('.'); }" . PHP_EOL;
        $code .= 'function name<GName extends TYiiModelNames>(name: GName): GName { return name; }' . PHP_EOL;
        //
        $code .= "const yiiModelColumnSizes = {$encodedModelColumnSizes} as const;" . PHP_EOL;
        $code .= 'export type TYiiModelColumnSize = keyof typeof yiiModelColumnSizes;' . PHP_EOL;
        $code .= 'function columnSize(name: TYiiModelColumnSize) { return yiiModelColumnSizes[name]; }' . PHP_EOL;
        //
        $code .= 'export default {attr, columnSize, name}' . PHP_EOL;

        $frontEndFile = fopen($jsFileName, 'w');
        fwrite($frontEndFile, $code);
        fclose($frontEndFile);
    }

    private function phpYiiEnum(string $phpFileName): void {
        $constants = EnumHelper::getDbConstants();
        $code = PHP_EOL . PHP_EOL;
        foreach ($constants as $flag => $values) {
            foreach ($values as $constName => $consId) {
                $code .= '    case ' . strtoupper(Helper::camelCaseToSnakeCase($flag)) . '_' . $constName . ' = ' . $consId . ';' . PHP_EOL;
            }
        }
        $code .= PHP_EOL . '    // ';

        $currentContent = file_get_contents($phpFileName);
        $newContent = preg_replace('/(PHPGEN)(.*?)(PHPGEN)/si', '$1' . $code . '$3', $currentContent);
        file_put_contents($phpFileName, $newContent);
    }
}
