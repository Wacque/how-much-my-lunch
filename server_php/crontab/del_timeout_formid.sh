#!/bin/bash

# Variables
PHP_CMD="/usr/bin/php"
CRON_CMD="/var/www/meat_server/server_php/public/index.php"
CONTROLLER="crontab"
MODULE="CrontanTest"
ACTION="index"
TEE_CMD="/usr/bin/tee"
LOG_DIR="/var/log"
LOG_FILE="shell_test.log"
#LOCK_FILE="/tmp/.del_timeout_form_id.log"

# Begin
if [ ! -f $CRON_CMD ]; then
        echo "Error: Script \"$CRON_CMD\" not found."
        exit 1;
fi

if [ ! -f $TEE_CMD ]; then
        echo "Error: Command \"$TEE_CMD\" not found."
exit 1;
fi

if [ ! -f $PHP_CMD ]; then
        echo "Error: Interpreter \"$PHP_CMD\" not found."
        exit 1;
fi

if [ ! -d $LOG_DIR ]; then
        echo "Error: Directory \"$LOG_DIR\" not found."
        exit 1;
fi

if [ ! -f $LOG_DIR/$LOG_FILE ]; then
        touch $LOG_DIR/$LOG_FILE
fi

LOG="$LOG_DIR/$LOG_FILE"

#(set -C; : > $LOCK_FILE) 2> /dev/null
#if [ $? != "0" ]; then
 #       echo "Error: Script \"$0\" already running"
 #       exit 1
#fi

echo ""                                                                                         | $TEE_CMD -a $LOG
echo " **** shop Server:: Posting Timer Process ****"                                            | $TEE_CMD -a $LOG
echo ""                                                                                         | $TEE_CMD -a $LOG
TIME_INIT=`date +%r`
DATE_INIT=`date +%x`
echo " -- Start Time : $TIME_INIT - $DATE_INIT"                                                 | $TEE_CMD -a $LOG
echo ""                                                                                         | $TEE_CMD -a $LOG
TIMER_INIT=$(date "+%s")
echo "   +  Script :: \"$CRON_CMD\""                                                            | $TEE_CMD -a $LOG
echo "   ----------"                                                                            | $TEE_CMD -a $LOG
$PHP_CMD $CRON_CMD $CONTROLLER/$MODULE/$ACTION                                                              | $TEE_CMD -a $LOG
TIMER_END=$(date "+%s")
let TIMER=TIMER_END-TIMER_INIT
echo "   ----------"                                                                            | $TEE_CMD -a $LOG
echo ""                                                                                         | $TEE_CMD -a $LOG
echo "   +  Execution Time --> $TIMER seconds"                                                  | $TEE_CMD -a $LOG
echo ""                                                                                         | $TEE_CMD -a $LOG
TIME_END=`date +%r`
DATE_END=`date +%x`
echo " -- End Time   : $TIME_END - $DATE_END"                                                   | $TEE_CMD -a $LOG
echo ""                                                                                         | $TEE_CMD -a $LOG
echo "--------------------------------------------------------------------------------"         | $TEE_CMD -a $LOG
echo ""                                                                                         | $TEE_CMD -a $LOG


#trap 'rm -f $LOCK_FILE' EXIT

exit 0
