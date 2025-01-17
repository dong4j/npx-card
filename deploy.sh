#!/bin/bash

# 获取当前脚本的所在目录
SCRIPT_DIR=$(dirname "$(realpath "$0")")
# 切换到 Makefile 所在的工作目录 (即脚本所在目录的父目录)
cd "$SCRIPT_DIR" || exit 1

# 发布脚本
# 功能: 自动检查、更新版本号并发布 npm 包

# 检查是否在 npm 登录状态
function check_npm_login {
    echo "检查 npm 登录状态..."
    npm whoami > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "未登录 npm，请先登录！"
        npm login
        if [ $? -ne 0 ]; then
            echo "npm 登录失败，请检查账号信息。"
            exit 1
        fi
    else
        echo "已登录 npm。"
    fi
}

# 检查 package.json 是否存在
function check_package_json {
    if [ ! -f "package.json" ]; then
        echo "未找到 package.json 文件，请确认当前目录是 npm 包的根目录。"
        exit 1
    fi
}

# 更新版本号
# • patch：只增加最后一位。例如：1.2.3 -> 1.2.4
# • minor：增加中间一位，后面的数字归零。例如：1.2.3 -> 1.3.0
# • major：增加第一位，后面的数字归零。例如：1.2.3 -> 2.0.0
function update_version {
    echo "请输入要发布的版本类型 (patch, minor, major) [默认: patch]:"
    read -r VERSION_TYPE

    # 如果用户直接按回车，使用默认值 "patch"
    VERSION_TYPE=${VERSION_TYPE:-patch}

    case "$VERSION_TYPE" in
        patch|minor|major)
            npm version "$VERSION_TYPE" --no-git-tag-version
            ;;
        *)
            echo "无效的版本类型，请输入 patch, minor 或 major。"
            exit 1
            ;;
    esac
}

# 发布到 npm
function publish_package {
    echo "发布 npm 包..."
    npm publish
    if [ $? -ne 0 ]; then
        echo "发布失败，请检查 npm 配置和网络连接。"
        exit 1
    fi
    echo "发布成功！"
}

# 主程序
function main {
    echo "===== 开始发布 npm 包 ====="
    check_package_json
    check_npm_login
    update_version
    publish_package
    echo "===== 发布完成 ====="
}

# 执行主程序
main