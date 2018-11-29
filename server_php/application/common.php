<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
/**
 * @param int $resultcode
 * @param string $msg
 * @param array $results
 * @param int $total
 */
function defaultData($resultcode=0, $msg='', $results=[], $total = 0)
{

    $data = [
        'resultcode' => $resultcode,
        'msg' => $msg,
        'data' => [
            'results' => $results
        ],
        'total' => $total
    ];

    return json($data);
}

/**
 * 请求
 * @param $url
 * @param int $type 0 get,1 post
 * @param $data
 */
function doCurl($url, $type = 0, $data = []) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    if($type === 1) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }

    // 执行并获取内容
    $output = curl_exec($ch);

    // 释放curl
    curl_close($ch);

    return $output;
}

/**
 * 判断请求是否合法
 * @param $openid
 * @return \think\response\Json
 * @throws \think\db\exception\DataNotFoundException
 * @throws \think\db\exception\ModelNotFoundException
 * @throws \think\exception\DbException
 */
function tokenCheck($openid) {
    $res = \think\Db::name('user')
        ->field('id')
        ->where('openid', $openid)
        ->find();

//    echo \think\Db::getLastSql();
    if(!$res) {
        return defaultData(1, '非法请求', [], 0);
        exit();
    }

    return $res['id'];
}