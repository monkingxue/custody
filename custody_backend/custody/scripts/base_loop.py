#!/usr/bin/env python
# encoding: utf-8
import threading
import time

from custody.sys.log import logger


class BaseLoop(threading.Thread):
    def __init__(self, name, interval=60, log_sleep=False):
        threading.Thread.__init__(self, name=name)
        self.name = name
        self.interval = interval
        self.log_sleep = log_sleep

    def run_once(self):
        raise Exception("need implemented")

    def run(self):
        while True:
            start = time.time()
            try:
                self.run_once()
            except:
                logger.exception("run fail: %s" % self.name)
            end = time.time()
            spend = end - start
            sleep = (self.interval - spend) if spend < self.interval else 1
            if self.log_sleep:
                logger.info('%s finish and sleep %.2fs', self.name, sleep)
            time.sleep(sleep)
