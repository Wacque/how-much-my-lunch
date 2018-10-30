<?php

namespace app\Index\controller;
use app\index\helper\friendHelper;
use think\Controller;
use think\Db;
use think\Request;

class Auth extends Controller
{
    /**
     * 小程序登陆
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function login() {
        $code = input('code');

        if(!$code) {
            return defaultData(1, 'login缺少code参数', [], 0);
        }
        $res = json_decode(\WX::login($code));

        // 判断返回的openid是否正确
        if(isset($res->openid) && $res->openid !== '') {
            // 检查是否存在当前用户
            $userQuery = Db::name('user')
                ->field('openid')
                ->where('openid', $res->openid)
                ->find();

            if($userQuery) {
                return defaultData(0, 'exist success', array(['openid' => $userQuery['openid']]) , 0);
            }else {
                // 不存在则写入
                $userid = Db::name('user')->insertGetId(get_object_vars($res));

                // 将自己写入friend；
                return defaultData(0, 'new success',array(['openid' => $res->openid]), 0);
            }
        }else {
           return defaultData(1, '登陆出错', [], 0);
        }
    }

    public function getUserMes() {
        $userid = tokenCheck(input('openid'));
        $res = Db::name('user')
            ->field('nickname,gender,avatar,openid')
            ->where('id', $userid)
            ->find();

        return defaultData(0, 'success', array($res), 0);
    }

    /**
     * 在饭友页面点击获取用户信息时对user信息进行补全
     */
    public function updateUser() {
        $userid = tokenCheck(input('openid'));
        $avatar = input('avatar');
        $nickname = htmlentities(input('nickname'));
        $gender = input('gender');

        $res = Db::name('user')
            ->where('id', $userid)
            ->update(['avatar' => $avatar, 'nickname' => $nickname, 'gender' => $gender]);
        echo $res;
        return defaultData(0, 'success', [], 0);

    }
}
