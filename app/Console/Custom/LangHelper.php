<?php

namespace App\Console\Custom;

class LangHelper
{
    public static function getMessages(): array {
        $messagesPath = base_path() . '/lang';
        $messages = [];
        if (is_dir($messagesPath)) {
            $messagesDir = opendir($messagesPath);
            while (($langDirName = readdir($messagesDir))) {
                if ($langDirName == '.' or $langDirName == '..') {
                    continue;
                }
                $langPath = $messagesPath . '/' . $langDirName;
                if (is_dir($langPath)) {
                    $localeDir = opendir($langPath);
                    while (($fileName = readdir($localeDir))) {
                        if ($fileName == '.' or $fileName == '..' or $fileName == '.DS_Store') {
                            continue;
                        }
                        $name = str_replace('.php', '', $fileName);
                        $stringContents = file_get_contents($langPath . '/' . $fileName);
                        $messages[$name][$langDirName] = eval(mb_strstr($stringContents, 'return '));
                    }
                    closedir($localeDir);
                }
            }
        }
        return $messages;
    }
}
