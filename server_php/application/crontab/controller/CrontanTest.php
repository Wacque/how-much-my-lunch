<?php
/**
 * Created by PhpStorm.
 * User: davdian-032
 * Date: 2018/12/5
 * Time: 下午4:40
 */

namespace app\crontab\controller;
use think\Db;

class CrontanTest
{
    public function index() {
       Db::name('form_id')
        ->insert([
            'form_id' => 'form_id' . time(),
            'user_id' => 1,
            'openid' => 'open_id' . time()
        ]);
    }
}