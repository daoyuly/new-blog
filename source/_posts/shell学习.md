---
title: shell 学习笔记
tags: shell 语言学习
abbrlink: 55110
date: 2020-01-30 12:14:26
---

关于shell使用的一些基本知识和实践，持续更新。


- #! 是一种约定的写法，指示使用何种解释器；
- 为什么使用./xx.sh的方式执行shell文件？
./xx.sh 指定目录会让系统从指定的目录寻找可以执行的文件。如果是xx.sh，系统会从PATH中寻找可执行文件；
```shell
文件查找在很多系统中有存在，可以对比理解：
    1 npm的路径寻找过程
    2 java中class loader的依赖查找
```
- 反引号 和 $() 可以表示命令替换
```shell
NPM_LOC_1=`which npm`
NPM_LOC_2=$(which npm)

if [ $NPM_LOC_1 = $NPM_LOC_1 ]; then
    echo "相同"
fi
```

- = 之后有空格，可以表示命令替换
```shell
a= ls ./
echo "$a"
```
- 运算符和操作数之间要有空格
- 一般性输出使用echo，需要一定格式的可以使用printf
- 特殊符号
    - $#
    - $@
    - $*
- 注释
    - 单行注释 
    ```shell
     # 这是注释
    ```
    - 多行注释
    ```shell
    # 这是注释
    # 这是注释
    # 这是注释

    :<<EOF
    这是注释
    这是注释
    这是注释
    EOF

    ```
- 变量
    - 合法的变量名，数字，字母，下划线，不能以数字开头;
    - 变量名和=之间不能有空格;
    ```shell
    name=`123`
    echo ${name}
    ```
    - 类型：字符串, 数字, 数组
    ```shell
    name='test'
    echo ${name}
    name=1
    echo ${name}
    ```
    - 变量使用，使用${变量名}，花括号可以省略，最佳实践是不要去掉花花括号；
    - 使用readonly可以定义只读变量
    - 删除变量
    - 变量作用域
        - 局部变量
        - 环境变量
        - shell 变量

    - 字符串
        - 单引号和双引号的区别：单引号内都是字符串，双引号内可以包括变量的引用和转义字符
        - 拼接
        ```
        name1='I love '
        name2='shell'
        echo ${name1} ${name2} 
        ```
        - 长度
        ```
        name='I love shell!'
        echo ${#name}
        ```
        - 子串
        ```
        name='I love shell!'
        echo ${name:1:2}
        ```
        - 查找（有问题）
        ```
        name='I love shell!'
        echo `expr index "${name}" love`
        ```
    - 数字

    - 数组
        - 定义，使用圆括号包括，元素之间使用空格分隔
         ```shell
        list=('java' 'c' 'javascript' 'c#')
        ```
        - 赋值
        ```shell
        list=('java' 'c' 'javascript' 'c#')
        list[5]='c++'
        ```
        - 使用
         ```shell
        list=('java' 'c' 'javascript' 'c#')
        echo ${list[1]}
        ```
        - 获取所有元素， 使用@或者*获取
         ```shell
        list=('java' 'c' 'javascript' 'c#')
        echo ${list[@]}
        ```
        - 获取长度
         ```shell
        list=('java' 'c' 'javascript' 'c#')
        echo ${#list[@]}
        ```

- 参数传递
    - 使用$n获取传入的第n个参数
    
    ```shell
    echo "执行的文件名：$0";
    echo "参数个数 $#";
    echo "所有参数 $*";
    echo "所有参数 $@"
    echo "第一个参数为：$1";
    echo "第二个参数为：$2";
    echo "第三个参数为：$3"; 
    echo "脚本运行的当前进程ID号 $$"
    echo "后台运行的最后一个进程的ID号 $!"
    echo "显示Shell使用的当前选项 $-"      
    ```
- 基本运算符
    - 数学运算一般使用其他命令，如expr
    - 数学运算也可以使用如下符号
        - $(())
        - $[]
        ```shell
        a=1
        b=2
        c=$[$a+$b]
        d=$(($a+$b))
        echo "$c"
        echo "$d"
        ```
    - 算术运算， 加，减，乘，除，赋值，取余，相等，不等
        - 条件表达式需要使用方括号，并且需要空格, [ $a == $b ]
        - 算术运算符两边需要加空格
        - 乘号(*)前边必须加反斜杠(\)才能实现乘法运算；
    ```shell
    a=1
    b=2

    val=`expr $a + $b`
    echo " a + b: ${val}"

    val=`expr $a / $b`
    echo " a / b: ${val}"

    val=`expr $a - $b`
    echo " a - b: ${val}"

    val=`expr $a \* $b`
    echo " a * b: ${val}"

    val=`expr $a % $b`
    echo " a % b: ${val}"

    if [ $a == $b ]; then
        echo "a ==  b"
    else
        echo "a !=  b"
    fi
    ```
    - 关系运算
        - 只支持数字，不支持字符串
        - -eq
        - -ne
        - -gt
        - -lt
        - -ge
        - -le

        ```shell
        a=1
        b=2

        if [ $a -eq $b ]; then
            echo "a -eq b: 相等"
        else 
            echo "a -eq b: 不相等"
        fi

        if [ $a -ne $b ]; then
            echo "a -ne b: 不相等"
        else 
            echo "a -ne b: 相等"
        fi

        if [ $a -gt $b ]; then
            echo "a -gt b: 大于"
        else 
            echo "a -gt b: 小于等于"
        fi

        if [ $a -lt $b ]; then
            echo "a -lt b: 小于"
        else 
            echo "a -lt b: 大于等于"
        fi
        ```
    - 布尔运算
        - !
        - -o
        - -a
        ```shell
        a=1
        b=2

        if [ $a -eq 1 -a $b -ne 2 ]; then
            echo "true"
        else 
            echo "false"
        fi  
        ```
    - 逻辑运算符，使用双中括号
        - &&
        - ||
         ```shell
        a=1
        b=2

        if [[ $a -eq 1 && $b -ne 2 ]]; then
            echo "true"
        else 
            echo "false"
        fi  
        ```
    - 字符串运算
        - = 两个字符串是否相等
        - != 两个字符串是否不相等
        - -z 字符串长度是否是0
        - -n 字符串长度是否不为0
        - $ 字符串是否为空
        - 字符串比较可以使用双中括号，双中括号提供了针对字符串比较的高级特性，使用双中括号 [[ ]] 进行字符串比较时，可以把右边的项看做一个模式，故而可以在 [[ ]] 中使用正则表达式：

        ```shell
        [[ "$script_location" != /* ]]
        ```

        ```shell
        a="1"
        b="2"

        if [ -n $a ]; then
            echo "true"
        else 
            echo "false"
        fi 
        ```
         ```shell
        a="1"
        b="2"

        if [[ -n $a ]]; then
            echo "true"
        else 
            echo "false"
        fi 
        ```

    - 文件测试运算
        - -f file 判断文件是否是普通文件
        - -r file 是否是可读文件
        - -w file 是否是可写文件
        - -x file 是否是可执行文件
        ```shell
        file="./test.sh"
        if [ -f $file ]; then
            echo "$file 是普通文件"
        fi
        ```
- 控制流
    - if else fi
    - if elif else fi
    - for
        - in列表可以包含替换、字符串和文件名。
        - command1 指任何有效的命令和语句
    ```shell
    for var in item1 item2 item3 ... itmeN; do
        command1
    done
    for num in `ls .`; do
        echo ${num}
    done
    ```
    - while
    ```shell
        while condition; do
            command1
        done
    ```
    - case
    ```shell
    case 值 in
    模式1)
        command1
        command2
        ;;
    模式2)
        command1
        command2
        ;;
    *)
        ;;
    esac
    ```
    ```shell
    name="apple"
    case $name in
    "apple")
        echo "apple"
    ;;
    "bear")
        echo "bear"
    ;;
    esac    
    ```
- 函数
    - 函数定义
    ```shell
    demofun() {
        echo "demo"
    }

    demofun
    ```
    - 返回值 $?
    - 函数参数 $n
    - 调用 函数名
    ```shell
    add() {
        return `expr $1 + $2`
    }

    add 1 2
    echo "add 1 2: $?"
    ```
- 输入输出重定向


