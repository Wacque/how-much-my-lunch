<?php
/**
 * Created by PhpStorm.
 * User: davdian-032
 * Date: 2018/10/27
 * Time: 下午1:39
 */

namespace app\index\helper;
use think\Db;

class friendHelper
{
    /**
     * @param $userid
     * @param $friend_name
     * @param $friend_avatar
     * @return mixed
     */
    public static function addFriend($userid, $friend_name, $friend_avatar) {
        $friendData = [
            'refer_to' => $userid,
            'friend_name' => $friend_name,
            'friend_avatar' => $friend_avatar
        ];

        $res = Db::name('friends')->insert($friendData);

        return $res;
    }
}