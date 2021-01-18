import time
from datetime import datetime, timedelta

import pytz


def ts2dt(timestamp):
    return datetime.fromtimestamp(timestamp, pytz.timezone('UTC'))


def datetime_string_to_ts(datetime_string, pattern='%Y-%m-%d %H:%M:%S'):
    # NOTE: datetime_string视为utc时区，在函数外处理时间的offset
    utc = pytz.timezone('UTC')
    dt = datetime.strptime(datetime_string, pattern)
    utc_dt = dt.replace(tzinfo=utc)
    return int(utc_dt.timestamp())


def get_local_day_str(days=0, tz_offset=None):
    # Note: 默认返回北京时间当天的日期
    tz_offset = tz_offset or 3600 * 8
    now_ts = int(time.time())
    now = ts2dt(now_ts + tz_offset + 86400 * days)
    return now.strftime('%Y-%m-%d')

def date_string_to_ts(date_str):
    utc = pytz.timezone('UTC')
    dt = datetime.strptime(date_str, '%Y-%m-%d')
    utc_dt = dt.replace(tzinfo=utc)
    return (utc_dt - datetime(1970, 1, 1, tzinfo=utc)).total_seconds()


def get_hour_timestamp():
    # NOTE: 获取每个小时的时间戳
    now = int(time.time())
    redundant = now % 3600
    return now - redundant


if __name__ == '__main__':
    print(ts2dt(1590582276 + 3600 * 8).strftime('%Y年%m月%d天 %H:%M'))
    print(datetime_string_to_ts('2020-05-27 15:11:44'))
    print(date_string_to_ts('2020-05-27'))
    print(get_hour_timestamp())
    print(get_hour_timestamp() - 27 * 21600)
