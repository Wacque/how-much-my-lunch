<?php
/**
 * Created by PhpStorm.
 * User: davdian-032
 * Date: 2018/10/25
 * Time: 下午5:30
 */

class WX
{
    public static function login($code) {
//        `https://api.weixin.qq.com/sns/jscode2session?appid=${config.app_id}&secret=${config.session}&js_code=${JSCODE}&grant_type=authorization_code`
        if(!$code) {
            defaultData(1, 'login缺少code参数', [], 0);
        }

        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' . config('wx.app_id') .'&secret=' . config('WX.app_session') . '&js_code=' . $code . '&grant_type=authorization_code';

        $res = doCurl($url);
        return $res;
    }
}